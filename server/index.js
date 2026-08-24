import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { agentController } from './agent/agentController.js';
import { auditLogger } from './agent/auditLogger.js';
import { seedService } from './services/seedService.js';
import { razorpayProvider } from './services/razorpayProvider.js';
import { AGENT_TOOLS_DEFINITIONS } from './agent/toolRegistry.js';
import { javaSecurityService } from './services/javaSecurityService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Explicit Cross-Origin Access (CORS) & Preflight Handling for Vercel Frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json());
app.set('etag', false);

// Disable caching for dynamic API responses
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Seed Data
seedService.seedInitialData();

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'RevenueGuardian AI — Backend Agent API',
    securityEngine: 'Java 17 Spring Boot Security Microservice',
    endpoints: {
      stats: '/api/stats',
      events: '/api/events',
      customers: '/api/customers',
      audit: '/api/audit',
      security: '/api/security/status',
      mcpTools: '/api/mcp/tools'
    }
  });
});

// API ROUTES

// 1. Get Recovery Events
app.get('/api/events', (req, res) => {
  const { type, status, search, sortBy, limit } = req.query;
  let events = seedService.getEvents({ type, status, search, sortBy });
  if (limit) {
    events = events.slice(0, Number(limit));
  }
  res.json(events);
});

// 2. Get Single Event Details
app.get('/api/events/:id', (req, res) => {
  const event = seedService.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const customerHistory = seedService.getCustomerHistory(event.customerId);
  res.json({
    event,
    customerHistory,
    traces: agentController.getTracesForEvent(event.id)
  });
});

// 3. Process Single Event via Agent Loop
app.post('/api/events/:id/process', async (req, res) => {
  try {
    const { useAi = true } = req.body || {};
    const event = seedService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const result = await agentController.processRevenueEvent(event, { useAi });
    
    // Update seed dataset
    if (result.recovered) {
      seedService.markEventRecovered(event.id, result.recoveredAmount);
    }

    res.json(result);
  } catch (err) {
    console.error('Error processing event:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Batch Simulation Endpoint
app.post('/api/simulations/run', async (req, res) => {
  try {
    const { batchSize = 10, useAi = false } = req.body || {};
    const result = await agentController.runBatchSimulation(batchSize, { useAi });
    res.json(result);
  } catch (err) {
    console.error('Error running batch simulation:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Live Razorpay Webhook Receiver (Real-Time Ingestion with Java Signature Verification)
app.post('/api/webhooks/razorpay', async (req, res) => {
  try {
    const webhookPayload = req.body || {};
    const signature = req.headers['x-razorpay-signature'] || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'razorpay_secret_default';

    // Verify signature using Java 17 Spring Boot CryptoService
    const verification = await javaSecurityService.verifyWebhookSignature(
      JSON.stringify(webhookPayload),
      signature,
      secret
    );

    console.log('⚡ Received Live Razorpay Webhook Event:', webhookPayload.event || 'generic', '| Java Signature Verified:', verification.verified);

    const createdEvent = seedService.ingestWebhookEvent(webhookPayload);
    const agentResult = await agentController.processRevenueEvent(createdEvent, { useAi: true });

    if (agentResult.recovered) {
      seedService.markEventRecovered(createdEvent.id, agentResult.recoveredAmount);
    }

    res.json({
      success: true,
      message: 'Razorpay Webhook ingested & agent executed live',
      signatureVerification: verification,
      createdEvent,
      agentResult
    });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Get Platform Stats & KPI Data
app.get('/api/stats', (req, res) => {
  const stats = seedService.getStats();
  res.json(stats);
});

// 7. Get Customers
app.get('/api/customers', (req, res) => {
  const customers = seedService.getCustomers();
  res.json(customers);
});

// 8. Get Audit Trail Logs
app.get('/api/audit', (req, res) => {
  const { customerId, eventId, policyDecision, action, search } = req.query;
  let logs = auditLogger.getLogs({ customerId, eventId, policyDecision, action });
  
  if (search) {
    const q = search.toLowerCase();
    logs = logs.filter(l => 
      l.customerName.toLowerCase().includes(q) || 
      l.action.toLowerCase().includes(q) ||
      l.eventId.toLowerCase().includes(q)
    );
  }
  
  res.json(logs);
});

// 9. Java Spring Boot Security Microservice Health Status Endpoint
app.get('/api/security/status', async (req, res) => {
  const securityStatus = await javaSecurityService.getHealthStatus();
  res.json(securityStatus);
});

// 10. Get Tools Definition (MCP)
app.get('/api/mcp/tools', (req, res) => {
  res.json({
    mcpVersion: "1.0",
    protocol: "Model Context Protocol / Agentic Payments API",
    tools: AGENT_TOOLS_DEFINITIONS
  });
});

// 11. Reset Dataset Endpoint
app.post('/api/simulations/reset', (req, res) => {
  seedService.resetData();
  auditLogger.clear();
  agentController.traces = [];
  res.json({ success: true, message: 'Dataset reset to 500 initial benchmark cases' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RevenueGuardian AI Backend Server running on port ${PORT}`);
  console.log(`🛡️ Java 17 Spring Boot Security Bridge Initialized`);
});
