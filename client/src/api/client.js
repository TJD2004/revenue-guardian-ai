/**
 * API Client for RevenueGuardian AI (Client App)
 * Connects to Railway Backend API URL via VITE_API_URL
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://revenue-guardian-ai-production-f410.up.railway.app/api';

async function fetchJson(url, options = {}) {
  try {
    const baseUrl = API_BASE.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'API Request failed');
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error [${url}]:`, err.message);
    throw err;
  }
}

export const api = {
  getStats: () => fetchJson('/stats'),
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/events${query ? `?${query}` : ''}`);
  },
  getEventDetail: (id) => fetchJson(`/events/${id}`),
  processEvent: (id, simulateOutcome = true) => fetchJson(`/events/${id}/process`, {
    method: 'POST',
    body: JSON.stringify({ simulateOutcome })
  }),
  triggerWebhook: (payload) => fetchJson('/webhooks/razorpay', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getCustomers: () => fetchJson('/customers'),
  getCustomerDetail: (id) => fetchJson(`/customers/${id}`),
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/audit${query ? `?${query}` : ''}`);
  },
  runBatchSimulation: (batchSize = 15) => fetchJson('/simulations/run', {
    method: 'POST',
    body: JSON.stringify({ batchSize })
  }),
  resetSimulation: () => fetchJson('/simulations/reset', { method: 'POST' }),
  getMcpTools: () => fetchJson('/mcp/tools')
};
