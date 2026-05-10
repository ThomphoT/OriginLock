package com.nexus.origin.lock.services;

import com.nexus.origin.lock.exceptions.BlockchainVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class BlockchainVerificationService {

    private final HttpClient httpClient;
    private final String rpcUrl;
    private final boolean verificationEnabled;

    public BlockchainVerificationService(
            @Value("${blockchain.rpc-url}") String rpcUrl,
            @Value("${blockchain.verification.enabled}") boolean verificationEnabled
    ) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.rpcUrl = rpcUrl;
        this.verificationEnabled = verificationEnabled;
    }

    public boolean verifyTransaction(String txHash) {
        if (!verificationEnabled) {
            return false;
        }

        if (!StringUtils.hasText(txHash)) {
            throw new BlockchainVerificationException("Transaction hash is required when blockchain verification is enabled");
        }

        String body = """
                {"jsonrpc":"2.0","id":1,"method":"getSignatureStatuses","params":[["%s"],{"searchTransactionHistory":true}]}
                """.formatted(txHash);

        HttpRequest request = HttpRequest.newBuilder(URI.create(rpcUrl))
                .timeout(Duration.ofSeconds(20))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() > 299) {
                throw new BlockchainVerificationException("Blockchain RPC returned status " + response.statusCode());
            }

            String responseBody = response.body();
            if (responseBody == null || responseBody.contains("\"value\":[null]")) {
                throw new BlockchainVerificationException("Transaction was not found on Solana");
            }

            if (responseBody.contains("\"err\":null")) {
                return true;
            }

            throw new BlockchainVerificationException("Blockchain transaction did not succeed");
        } catch (IOException ex) {
            throw new BlockchainVerificationException("Could not reach blockchain RPC");
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new BlockchainVerificationException("Blockchain verification was interrupted");
        }
    }
}
