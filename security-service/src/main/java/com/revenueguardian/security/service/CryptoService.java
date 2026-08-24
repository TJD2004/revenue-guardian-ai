package com.revenueguardian.security.service;

import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Service
public class CryptoService {

    private static final String HMAC_SHA256_ALGORITHM = "HmacSHA256";
    private static final String SHA256_ALGORITHM = "SHA-256";

    /**
     * Cryptographically verifies incoming Razorpay webhook signature
     */
    public boolean verifyWebhookSignature(String payload, String expectedSignature, String secret) {
        if (payload == null || expectedSignature == null || secret == null) {
            return false;
        }
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String calculatedSignature = HexFormat.of().formatHex(rawHmac);
            return MessageDigest.isEqual(
                calculatedSignature.toLowerCase().getBytes(StandardCharsets.UTF_8),
                expectedSignature.toLowerCase().getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Computes immutable SHA-256 cryptographic ledger hash for Audit Logs
     */
    public String calculateLedgerHash(String previousHash, String timestamp, String eventId, String action, double amount) {
        try {
            String rawData = String.format("%s|%s|%s|%s|%.2f", 
                previousHash != null ? previousHash : "GENESIS_BLOCK",
                timestamp,
                eventId,
                action,
                amount
            );
            MessageDigest digest = MessageDigest.getInstance(SHA256_ALGORITHM);
            byte[] encodedHash = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedHash);
        } catch (Exception e) {
            return "HASH_COMPUTATION_FAILED";
        }
    }
}
