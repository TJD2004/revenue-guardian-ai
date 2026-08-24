package com.revenueguardian.security.controller;

import com.revenueguardian.security.service.CryptoService;
import com.revenueguardian.security.service.RbiPolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
public class SecurityController {

    private final CryptoService cryptoService;
    private final RbiPolicyService rbiPolicyService;

    public SecurityController(CryptoService cryptoService, RbiPolicyService rbiPolicyService) {
        this.cryptoService = cryptoService;
        this.rbiPolicyService = rbiPolicyService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("framework", "Spring Boot 3.2.3 (Java 17)");
        health.put("service", "RevenueGuardian AI — Enterprise Security Microservice");
        health.put("cryptographyEngine", "javax.crypto HmacSHA256 & MessageDigest SHA-256");
        health.put("rbiPolicyCompliance", "RBI 2026 E-Mandate Compliant");
        health.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(health);
    }

    @PostMapping("/verify-signature")
    public ResponseEntity<Map<String, Object>> verifySignature(@RequestBody Map<String, String> request) {
        String payload = request.getOrDefault("payload", "");
        String signature = request.getOrDefault("signature", "");
        String secret = request.getOrDefault("secret", "razorpay_secret_default");

        boolean isValid = cryptoService.verifyWebhookSignature(payload, signature, secret);

        Map<String, Object> response = new HashMap<>();
        response.put("verified", isValid);
        response.put("algorithm", "HmacSHA256");
        response.put("engine", "Java 17 javax.crypto.Mac");
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate-policy")
    public ResponseEntity<Map<String, Object>> validatePolicy(@RequestBody Map<String, Object> request) {
        Map<String, Object> evaluation = rbiPolicyService.evaluatePolicy(request);
        evaluation.put("evaluatedBy", "Java 17 Spring Boot RbiPolicyService");
        evaluation.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(evaluation);
    }

    @PostMapping("/hash-ledger")
    public ResponseEntity<Map<String, Object>> hashLedger(@RequestBody Map<String, Object> request) {
        String previousHash = (String) request.getOrDefault("previousHash", "GENESIS_BLOCK");
        String timestamp = (String) request.getOrDefault("timestamp", Instant.now().toString());
        String eventId = (String) request.getOrDefault("eventId", "REV-000");
        String action = (String) request.getOrDefault("action", "RECOVERY_ATTEMPT");
        double amount = ((Number) request.getOrDefault("amount", 0.0)).doubleValue();

        String hash = cryptoService.calculateLedgerHash(previousHash, timestamp, eventId, action, amount);

        Map<String, Object> response = new HashMap<>();
        response.put("ledgerHash", hash);
        response.put("previousHash", previousHash);
        response.put("algorithm", "SHA-256");
        response.put("immutable", true);
        response.put("engine", "Java 17 MessageDigest");
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}
