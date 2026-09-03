/**
 * Seed Service for RevenueGuardian AI
 */

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Aarav', 'Ananya', 'Vikram', 'Neha', 'Siddharth', 'Riya', 
  'Amit', 'Pooja', 'Karan', 'Sneha', 'Rohan', 'Kavya', 'Aditya', 'Ishita',
  'Deepak', 'Meera', 'Rajesh', 'Divya', 'Suresh', 'Swati', 'Manish', 'Tanya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Reddy', 'Kumar', 'Joshi',
  'Mehta', 'Nair', 'Rao', 'Chopra', 'Malhotra', 'Deshmukh', 'Iyer', 'Bhasin'
];

const COMPANIES = [
  'TechNova Solutions', 'Acme India Pvt Ltd', 'Nexus Digital', 'Apex Logistics',
  'Zenith Cloud Labs', 'CloudScale Technologies', 'Starlight Media', 'Vanguard Retail'
];

const FAILURE_REASONS = {
  payment: ['insufficient_funds', 'upi_timeout', 'bank_server_down', 'card_expired', 'authentication_failed', 'invalid_account'],
  checkout: ['checkout_abandonment', 'payment_page_dropped', 'session_expired', 'otp_not_received'],
  subscription: ['insufficient_funds', 'card_expired', 'bank_decline_auto_debit', 'mandate_expired'],
  invoice: ['due_date_passed', 'invoice_under_review', 'payment_delayed_approval', 'awaiting_po'],
  mandate: ['mandate_execution_failed', 'account_frozen', 'insufficient_funds'],
  promise_to_pay: ['promise_date_missed', 'customer_unreachable']
};

const TYPES = ['Failed Payment', 'Checkout Abandonment', 'Failed Subscription', 'Overdue Invoice', 'Mandate Failure', 'Promise-to-Pay Missed'];

let store = {
  customers: [],
  events: []
};

export class SeedService {
  seedInitialData(count = 500) {
    const customers = [];
    const events = [];

    for (let i = 1; i <= 100; i++) {
      const fn = FIRST_NAMES[i % FIRST_NAMES.length];
      const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
      const name = `${fn} ${ln}`;
      const customerId = `CUS-${1000 + i}`;
      const company = i % 4 === 0 ? COMPANIES[i % COMPANIES.length] : null;

      customers.push({
        id: customerId,
        name,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company ? 'company.com' : 'gmail.com'}`,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        company,
        isVIP: i % 7 === 0,
        successfulPaymentsCount: Math.floor(Math.random() * 12) + 1,
        creditScore: Math.floor(650 + Math.random() * 200),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 86400000).toISOString()
      });
    }

    for (let i = 1; i <= count; i++) {
      const cust = customers[i % customers.length];
      const type = TYPES[i % TYPES.length];
      
      let failureCategory = 'payment';
      if (type === 'Checkout Abandonment') failureCategory = 'checkout';
      else if (type === 'Failed Subscription') failureCategory = 'subscription';
      else if (type === 'Overdue Invoice') failureCategory = 'invoice';
      else if (type === 'Mandate Failure') failureCategory = 'mandate';
      else if (type === 'Promise-to-Pay Missed') failureCategory = 'promise_to_pay';

      const reasons = FAILURE_REASONS[failureCategory];
      const failureReason = reasons[i % reasons.length];

      let amount = 1500;
      if (type === 'Overdue Invoice') amount = Math.floor(15000 + Math.random() * 85000);
      else if (type === 'Failed Subscription') amount = Math.floor(1999 + Math.random() * 8000);
      else if (type === 'Checkout Abandonment') amount = Math.floor(899 + Math.random() * 4000);
      else amount = Math.floor(1200 + Math.random() * 25000);

      const daysOverdue = Math.floor(Math.random() * 25) + 1;
      // 384 out of 500 initially recovered = 76.8% Recovery Rate
      const isInitiallyRecovered = i <= 384;

      events.push({
        id: `REV-${202600 + i}`,
        customerId: cust.id,
        customerName: cust.name,
        customerEmail: cust.email,
        customerPhone: cust.phone,
        amount,
        type,
        failureReason,
        daysOverdue,
        status: isInitiallyRecovered ? 'Recovered' : 'Open',
        riskScore: Math.floor(25 + Math.random() * 65),
        recoveryProbability: Math.round((0.55 + Math.random() * 0.4) * 100) / 100,
        expectedRecoveryValue: Math.round(amount * (0.55 + Math.random() * 0.4)),
        priority: amount > 25000 ? 'High' : amount > 8000 ? 'Medium' : 'Low',
        retryCount: isInitiallyRecovered ? 1 : 0,
        reminderCount: isInitiallyRecovered ? 1 : 0,
        escalationCount: 0,
        recoveredAmount: isInitiallyRecovered ? amount : 0,
        recoveredAt: isInitiallyRecovered ? new Date(Date.now() - Math.random() * 86400000 * 5).toISOString() : null,
        createdAt: new Date(Date.now() - daysOverdue * 86400000).toISOString()
      });
    }

    store = { customers, events };
    return store;
  }

  getEvents({ type, status, search, sortBy }) {
    let result = [...store.events];

    if (type && type !== 'All') {
      result = result.filter(e => e.type === type);
    }

    if (status && status !== 'All') {
      if (status === 'Recovered') result = result.filter(e => e.status === 'Recovered');
      if (status === 'Open') result = result.filter(e => e.status === 'Open');
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.customerName.toLowerCase().includes(q) ||
        e.customerEmail.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'expectedValue') {
      result.sort((a, b) => b.expectedRecoveryValue - a.expectedRecoveryValue);
    } else if (sortBy === 'amount') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'probability') {
      result.sort((a, b) => b.recoveryProbability - a.recoveryProbability);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => b.daysOverdue - a.daysOverdue);
    }

    return result;
  }

  getEventById(id) {
    return store.events.find(e => e.id === id);
  }

  getCustomerHistory(customerId) {
    const cust = store.customers.find(c => c.id === customerId);
    const pastEvents = store.events.filter(e => e.customerId === customerId);

    return {
      profile: cust,
      pastEvents,
      totalSpent: pastEvents.reduce((acc, curr) => acc + curr.recoveredAmount, 15000),
      churnRisk: cust?.creditScore < 700 ? 'High' : 'Low'
    };
  }

  markEventRecovered(id, recoveredAmount) {
    const evt = store.events.find(e => e.id === id);
    if (evt) {
      evt.status = 'Recovered';
      evt.recoveredAmount = Number(recoveredAmount) || evt.amount;
      evt.recoveredAt = new Date().toISOString();
      evt.isClosed = true;
    }
  }

  ingestWebhookEvent(payload) {
    const id = `REV-LIVE-${Date.now().toString().slice(-6)}`;
    const newEvent = {
      id,
      customerId: payload.customerId || 'CUS-1001',
      customerName: payload.customerName || 'Rahul Sharma',
      customerEmail: payload.customerEmail || 'rahul.sharma@gmail.com',
      customerPhone: payload.customerPhone || '+91 9876543210',
      amount: Number(payload.amount) || 5000,
      type: payload.type || 'Failed Payment',
      failureReason: payload.failureReason || 'insufficient_funds',
      daysOverdue: 1,
      status: 'Open',
      riskScore: 65,
      recoveryProbability: 0.82,
      expectedRecoveryValue: Math.round((Number(payload.amount) || 5000) * 0.82),
      priority: 'High',
      retryCount: 0,
      reminderCount: 0,
      escalationCount: 0,
      recoveredAmount: 0,
      recoveredAt: null,
      createdAt: new Date().toISOString()
    };

    store.events.unshift(newEvent);
    return newEvent;
  }

  getStats() {
    const totalAtRisk = store.events.reduce((acc, e) => acc + (e.status === 'Open' ? e.amount : 0), 0);
    const totalRecovered = store.events.reduce((acc, e) => acc + e.recoveredAmount, 0);
    const totalExpected = store.events.reduce((acc, e) => acc + (e.status === 'Open' ? e.expectedRecoveryValue : 0), 0);

    const totalCases = store.events.length;
    const recoveredCases = store.events.filter(e => e.status === 'Recovered').length;
    const recoveryRate = totalCases > 0 ? Math.round((recoveredCases / totalCases) * 1000) / 10 : 76.8;

    return {
      totalAtRisk,
      totalExpected,
      totalRecovered,
      recoveryRate,
      totalCases,
      openCases: totalCases - recoveredCases,
      recoveredCases,
      attemptsCount: recoveredCases + 18,
      avgRecoveryDays: 3.8
    };
  }

  getCustomers() {
    return store.customers;
  }

  resetData() {
    this.seedInitialData(500);
  }
}

export const seedService = new SeedService();
