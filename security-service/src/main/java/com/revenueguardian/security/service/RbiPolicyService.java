package com.revenueguardian.security.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class RbiPolicyService {

    private static final double DUAL_FACTOR_OTP_THRESHOLD = 50000.0;
    private static final int MAX_RETRY_CAP = 2;

    public Map<String, Object> evaluatePolicy(Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        String action = (String) request.getOrDefault("action", "schedule_payment_retry");
        double amount = ((Number) request.getOrDefault("amount", 0.0)).doubleValue();
        int retryCount = ((Number) request.getOrDefault("retryCount", 0)).intValue();
        boolean preDebitNotificationSent = (boolean) request.getOrDefault("preDebitNotificationSent", true);

        // 1. RBI 2026 24-Hour Pre-Debit Mandate Notification Check
        if ("schedule_payment_retry".equalsIgnoreCase(action) && !preDebitNotificationSent) {
            response.put("allowed", false);
            response.put("policyDecision", "BLOCKED");
            response.put("reason", "RBI 2026 E-Mandate Rule Violated: 24-hour pre-debit SMS/email notification must be dispatched before automated mandate debit retry.");
            return response;
        }

        // 2. RBI Cycle Retry Cap Check
        if (retryCount >= MAX_RETRY_CAP) {
            response.put("allowed", false);
            response.put("policyDecision", "BLOCKED");
            response.put("reason", String.format("RBI Regulatory Cap Reached: Maximum %d automated payment retries per billing cycle allowed.", MAX_RETRY_CAP));
            return response;
        }

        // 3. High-Value Dual-Factor OTP Approval Threshold Check (> ₹50,000)
        if (amount > DUAL_FACTOR_OTP_THRESHOLD) {
            boolean otpAuthorized = (boolean) request.getOrDefault("otpAuthorized", false);
            if (!otpAuthorized) {
                response.put("allowed", false);
                response.put("policyDecision", "REQUIRES_APPROVAL");
                response.put("reason", String.format("RBI High-Value Security Policy: Transactions exceeding ₹%.2f require explicit dual-factor OTP customer authorization.", DUAL_FACTOR_OTP_THRESHOLD));
                return response;
            }
        }

        response.put("allowed", true);
        response.put("policyDecision", "PASSED");
        response.put("reason", "Fully compliant with RBI 2026 E-Mandate security policies & regulatory guardrails.");
        return response;
    }
}
