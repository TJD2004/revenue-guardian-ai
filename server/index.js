import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { agentController } from './agent/agentController.js';
import { auditLogger } from './agent/auditLogger.js';
import { seedService } from './services/seedService.js';
import { razorpayProvider } from './services/razorpayProvider.js';
import { AGENT_TOOLS_DEFINITIONS } from './agent/toolRegistry.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.set('etag', false);

// Disable caching for dynamic API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Initialize Seed Data
seedService.seedInitialData();

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
    const { useAi = true } = req.body;
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
    const { batchSize = 10, useAi = false } = req.body;
    const result = await agentController.runBatchSimulation(batchSize, { useAi });
    res.json(result);
  } catch (err) {
    console.error('Error running batch simulation:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Live Razorpay Webhook Receiver (Real-Time Ingestion)
app.post('/api/webhooks/razorpay', async (req, res) => {
  try {
    const webhookPayload = req.body;
    console.log('⚡ Received Live Razorpay Webhook Event:', webhookPayload.event);

    const createdEvent = seedService.ingestWebhookEvent(webhookPayload);
    const agentResult = await agentController.processRevenueEvent(createdEvent, { useAi: true });

    if (agentResult.recovered) {
      seedService.markEventRecovered(createdEvent.id, agentResult.recoveredAmount);
    }

    res.json({
      success: true,
      message: 'Razorpay Webhook ingested & agent executed live',
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

// 9. Get Tools Definition (MCP)
app.get('/api/mcp/tools', (req, res) => {
  res.json({
    mcpVersion: "1.0",
    protocol: "Model Context Protocol / Agentic Payments API",
    tools: AGENT_TOOLS_DEFINITIONS
  });
});

// 10. Reset Dataset Endpoint
app.post('/api/simulations/reset', (req, res) => {
  seedService.resetData();
  auditLogger.clear();
  agentController.traces = [];
  res.json({ success: true, message: 'Dataset reset to 500 initial benchmark cases' });
});

// Serve Vite SPA in development or static dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      root: path.resolve(__dirname, '..'),
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RevenueGuardian AI Server running on port ${PORT}`);
  });
}

startServer();
