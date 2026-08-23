# RevenueGuardian AI — Autonomous Revenue Recovery Platform

> **Razorpay Buildathon 2026 — Track 03: AI Revenue Recovery**  
> *"Don't just detect lost revenue. Recover it."*  
> **🏛️ RBI 2026 E-Mandate Compliant**

---

## Executive Summary

Revenue loss in modern fintech rarely happens in one clean step—payments degrade, checkouts are abandoned, recurring subscription mandates fail, or B2B invoices go overdue. Traditional platforms present static graphs. **RevenueGuardian AI** closes the loop by operating an autonomous AI agent workflow in full compliance with **RBI 2026 E-Mandate Regulations**:

$$\text{DETECT} \longrightarrow \text{DIAGNOSE} \longrightarrow \text{DECIDE} \longrightarrow \text{ACT} \longrightarrow \text{RECOVER} \longrightarrow \text{VERIFY} \longrightarrow \text{AUDIT}$$

---

## Core System Architecture

```
                                  +------------------------------------+
                                  |   Incoming Lost Revenue Event      |
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |       Risk Intelligence Engine     |
                                  | Calculates Risk Score & Probability|
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |    AI Agent Planner (Groq Llama)   |
                                  |  Selects Bounded Recovery Tools    |
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |  RBI 2026 Policy & Guardrails      |
                                  |  24h Pre-Debit & Max 2 Retry Rules |
                                  +--------+-----------------+---------+
                                           |                 |
                                    PASSED |                 | BLOCKED
                                           v                 v
                       +-------------------+---+   +---------+---------------+
                       | Tool Execution Engine |   | Immutable Audit Logger  |
                       | Razorpay Link / Retry |   | Logged (BLOCKED BY POL) |
                       +-------------------+---+   +-------------------------+
                                           |
                                           v
                       +-------------------+---+
                       | Measured Money Won    |
                       | Attributable ROI      |
                       +-----------------------+
```

---

## Key Features & Regulatory Compliance

1. **🏛️ RBI 2026 E-Mandate Compliance Framework**:
   - Enforces 24-hour pre-debit notification rules prior to auto-debit retries.
   - Caps mandate retries to a maximum of 2 attempts per billing cycle.
   - Halts auto-debit retries on customer-revoked or bank-cancelled mandates.
2. **Groq Llama 3.3 70B AI Agent**: Analyzes failure root causes and plans bounded tool execution sequences. Includes deterministic rule engine fallback for offline execution.
3. **14 Standard Agent Tools**:
   - `get_customer_profile`, `get_customer_payment_history`, `get_revenue_event`
   - `calculate_recovery_probability`, `calculate_expected_recovery_value`
   - `generate_payment_link`, `schedule_payment_retry`, `generate_email`, `generate_sms`
   - `generate_hinglish_message`, `create_followup`, `mark_payment_recovered`, `escalate_case`, `close_case`
4. **5 Specialized Recovery Engines (`/engines`)**:
   - 🛒 Checkout Drop-Off Recovery Engine
   - 🔄 Mandate Retry Sequencer & Dunning Engine
   - 💼 B2B Receivables Escalating Chaser
   - 🎙️ Hinglish Voice Recovery Studio
   - 🤝 Promise-To-Pay (P2P) Commitment Tracker
5. **Multi-Channel & Hinglish Voice Sandbox (`/voice`)**: Multi-lingual call script generator with interactive browser Web Speech audio playback.
6. **Agentic MCP (Model Context Protocol) API Inspector (`/mcp`)**: 14 standardized JSON tool schemas ready for Razorpay's future Agentic Payment APIs.
7. **Measured Money Recovered & ROI Ledger (`/attribution`)**: Rupee-for-rupee recovery attribution table and platform ROI multiplier card (*18.4x ROI*).

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/your-username/RevenueGuardian-AI.git
cd RevenueGuardian-AI

# 2. Install dependencies
npm install

# 3. Start unified application (Frontend + Express API)
npm run dev
```

Open **`http://localhost:5000`** in your browser!

---

## Environment Variables (`.env`)

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
MONGO_URI=mongodb://localhost:27017/revenue_guardian
RAZORPAY_KEY_ID=rzp_test_demo
RAZORPAY_KEY_SECRET=demo_secret
JWT_SECRET=super_secret_key
```

---

## Hackathon Judge Evaluation Matrix (Track 03)

| Judging Criteria | Implementation | Verification |
| :--- | :--- | :--- |
| **Detection & Diagnosis** | `riskEngine.js` & `agentPlanner.js` | Diagnoses root cause & calculates Expected Recovery Value ($\text{Amount} \times \text{Probability}$) |
| **Autonomous Action** | `agentController.js` & `toolRegistry.js` | Executes 14 backend tools autonomously |
| **RBI 2026 Compliance** | `policyEngine.js` | Enforces 24-hour pre-debit rules, max 2 retries, hard decline blocks |
| **Auditability** | `auditLogger.js` | Every action logged with `PASSED` vs `BLOCKED` policy status |
| **Measured Money Recovered** | `/attribution` & Batch Simulator | Live money recovery attribution with 18.4x ROI calculation |
| **Agentic API Readiness** | `/mcp` | OpenAPI/MCP JSON schemas for Razorpay agentic payment tools |

---

## License
Built for Razorpay Buildathon 2026 — Track 03: AI Revenue Recovery.
