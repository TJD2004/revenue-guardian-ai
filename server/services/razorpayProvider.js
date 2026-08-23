/**
 * Razorpay Payment Provider Abstraction
 */

export class PaymentProvider {
  async getPaymentStatus(paymentId) { throw new Error('Not implemented'); }
  async createPaymentLink(params) { throw new Error('Not implemented'); }
  async retryPayment(paymentId) { throw new Error('Not implemented'); }
  async getInvoiceStatus(invoiceId) { throw new Error('Not implemented'); }
}

export class RazorpayProvider extends PaymentProvider {
  constructor(keyId, keySecret) {
    super();
    this.keyId = keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_demo';
    this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || 'demo_secret';
  }

  async getPaymentStatus(paymentId) {
    return {
      id: paymentId,
      entity: 'payment',
      amount: 500000,
      currency: 'INR',
      status: 'captured',
      method: 'upi',
      captured: true
    };
  }

  async createPaymentLink({ amount, customer, description, discountPercent = 0 }) {
    const finalAmount = Math.round(amount * (1 - discountPercent / 100));
    const shortId = `pl_${Math.random().toString(36).substr(2, 8)}`;
    
    return {
      id: shortId,
      entity: 'payment_link',
      amount: finalAmount * 100,
      amount_paid: 0,
      currency: 'INR',
      short_url: `https://rzp.io/i/${shortId}`,
      status: 'created',
      customer: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone
      },
      description
    };
  }

  async retryPayment(paymentId) {
    return {
      success: true,
      message: 'Razorpay Auto-Debit Payment Retry Dispatched.',
      transactionId: `pay_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  async getInvoiceStatus(invoiceId) {
    return {
      id: invoiceId,
      status: 'issued',
      paid_amount: 0
    };
  }
}

export const razorpayService = new RazorpayProvider();
export const razorpayProvider = razorpayService;
