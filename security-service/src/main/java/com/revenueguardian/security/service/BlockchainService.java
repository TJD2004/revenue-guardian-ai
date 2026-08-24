package com.revenueguardian.security.service;

import com.revenueguardian.security.model.Block;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@Service
public class BlockchainService {

    private final List<Block> chain = new ArrayList<>();

    public BlockchainService() {
        // Mint Genesis Block
        mintGenesisBlock();
    }

    private void mintGenesisBlock() {
        String timestamp = Instant.now().toString();
        String previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
        String hash = calculateBlockHash(0, timestamp, "GENESIS", "System Core", "Blockchain Genesis Minted", "PASSED", 0.0, previousHash, 0);
        
        Block genesisBlock = new Block(
            0,
            timestamp,
            "GENESIS",
            "System Core",
            "Blockchain Genesis Minted",
            "PASSED",
            0.0,
            previousHash,
            hash,
            0
        );
        chain.add(genesisBlock);
    }

    public List<Block> getChain() {
        return new ArrayList<>(chain);
    }

    public Block getLatestBlock() {
        return chain.get(chain.size() - 1);
    }

    public synchronized Block mineBlock(Map<String, Object> data) {
        Block latest = getLatestBlock();
        int nextIndex = latest.getIndex() + 1;
        String timestamp = (String) data.getOrDefault("timestamp", Instant.now().toString());
        String eventId = (String) data.getOrDefault("eventId", "REV-" + nextIndex);
        String customerName = (String) data.getOrDefault("customerName", "Anonymous Customer");
        String action = (String) data.getOrDefault("action", "Recovery Action");
        String policyDecision = (String) data.getOrDefault("policyDecision", "PASSED");
        double amount = ((Number) data.getOrDefault("amount", 0.0)).doubleValue();
        String previousHash = latest.getHash();

        int nonce = 0;
        String hash = calculateBlockHash(nextIndex, timestamp, eventId, customerName, action, policyDecision, amount, previousHash, nonce);

        // Simple Proof of Work: find hash starting with "0"
        while (!hash.startsWith("0")) {
            nonce++;
            hash = calculateBlockHash(nextIndex, timestamp, eventId, customerName, action, policyDecision, amount, previousHash, nonce);
        }

        Block newBlock = new Block(
            nextIndex,
            timestamp,
            eventId,
            customerName,
            action,
            policyDecision,
            amount,
            previousHash,
            hash,
            nonce
        );

        chain.add(newBlock);
        return newBlock;
    }

    public boolean validateChain() {
        for (int i = 1; i < chain.size(); i++) {
            Block current = chain.get(i);
            Block previous = chain.get(i - 1);

            // Verify current hash matches data
            String recalculated = calculateBlockHash(
                current.getIndex(),
                current.getTimestamp(),
                current.getEventId(),
                current.getCustomerName(),
                current.getAction(),
                current.getPolicyDecision(),
                current.getRecoveredAmount(),
                current.getPreviousHash(),
                current.getNonce()
            );

            if (!current.getHash().equals(recalculated)) {
                return false;
            }

            // Verify previous hash pointer matches previous block hash
            if (!current.getPreviousHash().equals(previous.getHash())) {
                return false;
            }
        }
        return true;
    }

    private String calculateBlockHash(int index, String timestamp, String eventId, String customerName, String action, String policyDecision, double amount, String previousHash, int nonce) {
        try {
            String raw = String.format("%d|%s|%s|%s|%s|%s|%.2f|%s|%d",
                index, timestamp, eventId, customerName, action, policyDecision, amount, previousHash, nonce
            );
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }
}
