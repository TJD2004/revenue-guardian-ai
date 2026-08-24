package com.revenueguardian.security.model;

public class Block {
    private int index;
    private String timestamp;
    private String eventId;
    private String customerName;
    private String action;
    private String policyDecision;
    private double recoveredAmount;
    private String previousHash;
    private String hash;
    private int nonce;

    public Block() {}

    public Block(int index, String timestamp, String eventId, String customerName, String action, String policyDecision, double recoveredAmount, String previousHash, String hash, int nonce) {
        this.index = index;
        this.timestamp = timestamp;
        this.eventId = eventId;
        this.customerName = customerName;
        this.action = action;
        this.policyDecision = policyDecision;
        this.recoveredAmount = recoveredAmount;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = nonce;
    }

    public int getIndex() { return index; }
    public void setIndex(int index) { this.index = index; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPolicyDecision() { return policyDecision; }
    public void setPolicyDecision(String policyDecision) { this.policyDecision = policyDecision; }

    public double getRecoveredAmount() { return recoveredAmount; }
    public void setRecoveredAmount(double recoveredAmount) { this.recoveredAmount = recoveredAmount; }

    public String getPreviousHash() { return previousHash; }
    public void setPreviousHash(String previousHash) { this.previousHash = previousHash; }

    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }

    public int getNonce() { return nonce; }
    public void setNonce(int nonce) { this.nonce = nonce; }
}
