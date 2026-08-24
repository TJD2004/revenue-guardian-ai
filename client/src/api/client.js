/**
 * Pure Localhost API Client for RevenueGuardian AI
 * Connects directly to local backend: http://localhost:5000/api
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJson(url, options = {}) {
  const fetchOptions = { ...options };
  
  if (fetchOptions.body) {
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers || {})
    };
  }

  try {
    const baseUrl = API_BASE.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}${url}`, fetchOptions);
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
  getBlockchainChain: () => fetchJson('/blockchain/chain'),
  verifyBlockchain: () => fetchJson('/blockchain/verify'),
  mineBlockchainBlock: (data) => fetchJson('/blockchain/mine', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  runBatchSimulation: (batchSize = 15) => fetchJson('/simulations/run', {
    method: 'POST',
    body: JSON.stringify({ batchSize })
  }),
  resetSimulation: () => fetchJson('/simulations/reset', { method: 'POST' }),
  getMcpTools: () => fetchJson('/mcp/tools')
};
