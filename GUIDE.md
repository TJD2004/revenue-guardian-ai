# 📘 RevenueGuardian AI — Complete Platform User Manual & Technical Guide

Welcome to the official **RevenueGuardian AI User Manual & Feature Guide**. This guide provides an end-to-end walkthrough of how the platform operates, how each page and feature works, and how to utilize the platform for autonomous revenue recovery.

> **Razorpay Buildathon 2026 — Track 03: AI Revenue Recovery**  
> **🏛️ RBI 2026 E-Mandate Compliant | 🛡️ Java 17 Spring Boot Security | 🔗 SHA-256 Blockchain Ledger**

---

## 📐 1. Architecture & System Overview

RevenueGuardian AI is a 3-tier polyglot enterprise platform built to autonomously detect, diagnose, and recover lost digital payment revenue while enforcing strict regulatory guardrails.

```
+-----------------------------------------------------------------------------------+
|                            React 18 Vite Web Application                          |
|                     (Port 3000 — Dashboards, Explorer, Voice, Ledger)             |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+------------------------------------------+----------------------------------------+
|                          Node.js Express Agent Server                             |
|              (Port 5000 — Groq Llama 3.3 70B, Event Loop, Webhook Ingestion)       |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+------------------------------------------+----------------------------------------+
|                 Java 17 Spring Boot 3 Security Microservice                       |
|           (Port 8080 — HmacSHA256 Signatures, RBI Policy, Blockchain Engine)      |
+-----------------------------------------------------------------------------------+
```

### The Autonomous Closed-Loop Recovery Cycle:

$$\text{DETECT} \longrightarrow \text{DIAGNOSE} \longrightarrow \text{DECIDE} \longrightarrow \text{ACT} \longrightarrow \text{RECOVER} \longrightarrow \text{VERIFY} \longrightarrow \text{BLOCKCHAIN AUDIT}$$

---

## 🖥️ 2. Page-by-Page Feature & User Guide

### 1. Overview Pitch & Landing Page (`/`)
- **Purpose**: Executive dashboard providing high-level performance metrics, live status badges, and 1-click autonomous simulation controls.
- **Key Features**:
  - **Live Impact Metric Overlay**: Shows Total Revenue at Risk (₹78.3L), Attributable Recovered Revenue (₹13.2L+), Autonomous Recovery Yield (76.8%), and Avg Collection Speed (3.8 Days).
  - **Run Autonomous Simulation**: Executes batch AI agent recovery across 500 benchmark cases and triggers celebratory confetti rewards upon newly recovered revenue.
  - **Live Badges Bar**: Shows operational status of Java 17 Spring Boot Security, SHA-256 Blockchain Ledger, and RBI 2026 Compliance.

---

### 2. Operations Dashboard (`/dashboard`)
- **Purpose**: Operational command center for finance teams to monitor real-time revenue velocity and recovery queues.
- **Key Features**:
  - **7 KPI Cards Grid**: Revenue At Risk, Expected Recovery Value (weighted by probability %), Recovered Revenue, Recovery Rate %, Open Cases, Recovery Attempts Count, and Avg Recovery Speed.
  - **Recharts Visualizations**:
    - *Bar Chart*: Revenue Recovery Performance by Category (Subscription, Invoice, Checkout, Failed Payment).
    - *Pie Chart*: Failure Reason Breakdown (Insufficient Funds, Card Expired, UPI Timeout, Checkout Abandoned, Hard Failures).
  - **Top Expected Value Priority Queue**: Sorts open cases by Expected Recovery Value ($\text{Amount} \times \text{Probability}$).

---

### 3. Recovery Opportunities Table (`/recovery`)
- **Purpose**: Filterable, searchable table displaying all 500+ revenue recovery cases.
- **Key Features**:
  - **Multi-Category Filter**: Filter cases by *Failed Payment*, *Checkout Abandonment*, *Failed Subscription*, *Overdue Invoice*, *Mandate Failure*, or *Promise-to-Pay Missed*.
  - **Status Filter**: Toggle between *Open* and *Recovered* cases.
  - **Sorting Controls**: Sort by Expected Value, Amount, Recovery Probability %, or Oldest Overdue.
  - **Action Button**: Click **Process Case** to open the single-case deep dive view.

---

### 4. Case Details Deep Dive (`/recovery/:id`)
- **Purpose**: Individual case analysis view presenting full customer context, AI reasoning traces, and manual/automated execution controls.
- **Key Features**:
  - **Customer Risk & Credit Profile**: Displays customer credit score, VIP status, and historical spending.
  - **AI Diagnostics Box**: Powered by Groq Llama 3.3 70B, explaining why the payment failed and recommending bounded actions.
  - **Agent Step-by-Step Trace**: Real-time log showing tools executed and policy evaluations.
  - **Execute Recovery Button**: Triggers real-time agent execution for the specific case.

---

### 5. Specialized Execution Engines (`/engines`)
- **Purpose**: Overview of the 4 domain-tailored AI agent execution engines.
- **Key Features**:
  - **🛒 Checkout Recovery Engine**: Generates dynamic time-sensitive payment links and cart holds for abandoned checkouts (88% yield).
  - **🔄 Subscription Mandate Engine**: Schedules compliant e-mandate retries adhering strictly to RBI 24h notice & 2-retry caps (86% yield).
  - **📞 Voice Recovery Studio**: Multilingual AI phone outreach for high-value accounts.
  - **📄 Invoice Dunning Engine**: Automates formal finance escalation, legal notices, and payment plans for B2B invoices (85% yield).

---

### 6. AI Agent Control Panel (`/agent`)
- **Purpose**: Control room displaying real-time agent decision traces and LLM tool execution logs.
- **Key Features**:
  - **Live Execution Stream**: Displays step-by-step agent reasoning logs for every case processed.
  - **Batch Run Control**: Trigger 15-case batch simulations directly from the panel.
  - **Prompt & Tool Call Inspection**: View raw tool calls (`schedule_payment_retry`, `generate_payment_link`, `execute_voice_outreach`).

---

### 7. Cryptographic Blockchain Ledger (`/blockchain`)
- **Purpose**: Interactive Blockchain Explorer UI displaying cryptographically linked SHA-256 audit blocks.
- **Key Features**:
  - **Live Block Stream**: Displays block height (#0 Genesis, #1, #2...), event ID, action, policy decision, recovered amount, SHA-256 current hash, and `previousHash` link.
  - **Validate Chain Integrity Button**: Calls `/api/blockchain/verify` to verify 100% of blocks mathematically. Returns `PASSED` when all cryptographic pointers match.
  - **Proof-of-Work Nonce Metrics**: Shows zero-leading nonce mining metadata generated by the Java Spring Boot service.

---

### 8. Audit Trail Ledger (`/audit`)
- **Purpose**: Complete searchable audit log recording every system action for compliance auditors.
- **Key Features**:
  - **Search & Filter**: Search logs by Customer Name, Event ID, or Action.
  - **Regulatory Status Badges**: Displays `PASSED` or `BLOCKED` policy evaluation badges for each entry.
  - **Timestamping**: Displays exact ISO-8601 UTC timestamps for non-repudiation.

---

### 9. Voice Recovery Studio (`/voice`)
- **Purpose**: Interactive simulator demonstrating automated AI phone call recovery outreach.
- **Key Features**:
  - **Multilingual Support**: Supports English, Hindi, Hinglish, and regional Indian languages.
  - **Interactive Waveform Visualizer**: Simulates real-time voice call audio streams.
  - **Call Script & Sentiment Analysis**: Displays customer sentiment (Cooperative / Hesitant) and dynamic payment link dispatch over SMS during the call.

---

### 10. ROI & Attribution Ledger (`/attribution`)
- **Purpose**: Financial reporting page isolating revenue recovered directly by AI agents versus organic payments.
- **Key Features**:
  - **Attributable Money Recovered Card**: Shows total money recovered specifically by AI intervention.
  - **ROAS & Efficiency**: Displays cost of AI agent execution versus total revenue saved.

---

### 11. Agentic MCP Tools Registry (`/mcp`)
- **Purpose**: Model Context Protocol (MCP) API registry page exposing standardized AI tool definitions.
- **Key Features**:
  - **Tool Definitions List**: Exposes `/api/mcp/tools` containing JSON schemas for Anthropic Claude, Gemini, and custom AI orchestrators.
  - **Tool Registration**: Describes arguments and execution functions for `get_event_history`, `schedule_payment_retry`, `generate_payment_link`, and `execute_voice_outreach`.

---

### 12. Customer Directory (`/customers`)
- **Purpose**: Directory of all registered merchant customer profiles.
- **Key Features**:
  - **Profile Metrics**: Customer credit score, successful payments count, total spent, and VIP tags.
  - **Churn Risk Indicator**: High/Low churn risk tag based on financial health.

---

### 13. System Settings & Security (`/settings`)
- **Purpose**: System configuration and microservice health status dashboard.
- **Key Features**:
  - **Java 17 Spring Boot Microservice Health**: Displays connection status, port `8080`, and JVM memory metrics.
  - **Razorpay Webhook Configuration**: Shows live webhook endpoint (`/api/webhooks/razorpay`) and HMAC secret settings.
  - **Dataset Reset Button**: Resets dataset to the initial 500 benchmark cases.

---

## 🏛️ 3. RBI 2026 E-Mandate Regulatory Rules

RevenueGuardian AI natively enforcesReserve Bank of India (RBI) circulars on recurring payments:

1. **24-Hour Advance Pre-Debit Notice**:
   - Sends an advance SMS/Email notification 24 hours before any automated mandate retry.
2. **Max 2 Retry Cap per Billing Cycle**:
   - Restricts automated retries to a hard cap of 2 per billing cycle to prevent overdraft fees and customer account depletion.
3. **Dual-Factor OTP Requirement**:
   - Recovery transactions exceeding **₹50,000** require explicit customer 2FA authorization before processing.

---

## 🛡️ 4. Java 17 Spring Boot Security Microservice (`security-service/`)

The platform includes a decoupled **Java 17 Spring Boot 3 Security Microservice** running on port `8080`:

- **HMAC-SHA256 Signature Verification**: Uses `javax.crypto.Mac` to verify Razorpay webhooks (`x-razorpay-signature`) and prevent spoofing.
- **SHA-256 Blockchain Hashing**: Uses `java.security.MessageDigest` to calculate SHA-256 block hashes and perform Proof-of-Work nonce mining.
- **REST Security Endpoints**:
  - `GET /api/security/health` — Health check
  - `POST /api/security/verify-signature` — HMAC check
  - `POST /api/security/validate-policy` — RBI compliance evaluation
  - `GET /api/security/blockchain/chain` — Full blockchain Explorer data
  - `GET /api/security/blockchain/verify` — Real-time chain validation

---

## 💻 5. Localhost & Production Setup Guide

### Localhost Quickstart:
1. **Start Java Security Service** (Port 8080):
   ```bash
   cd security-service
   mvn clean package -DskipTests
   java -jar target/security-service-1.0.0.jar
   ```
2. **Start Express Backend API** (Port 5000):
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. **Start React Frontend Web App** (Port 3000):
   ```bash
   cd client
   npm install
   npm run dev
   ```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### Live Cloud Production Deployments:
- 🌐 **Client App (Vercel)**: [https://revenue-guardian-ai-peach.vercel.app/](https://revenue-guardian-ai-peach.vercel.app/)
- ⚙️ **Express Server API (Render)**: [https://revenue-guardian-ai.onrender.com](https://revenue-guardian-ai.onrender.com)
- 🛡️ **Java Spring Boot Service (Render)**: [https://revenue-guardian-security-service.onrender.com](https://revenue-guardian-security-service.onrender.com)
