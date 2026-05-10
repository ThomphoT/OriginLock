package com.nexus.origin.lock.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateIdeaRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be 255 characters or fewer")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 5000, message = "Description must be 5000 characters or fewer")
        String description,

        @Pattern(regexp = "^$|^[a-fA-F0-9]{64}$", message = "Content hash must be exactly 64 hex characters")
        String contentHash,

        @Pattern(
                regexp = "^$|^0x[a-fA-F0-9]{64}$|^[1-9A-HJ-NP-Za-km-z]{64,100}$",
                message = "Transaction hash must be a valid Solana signature or 0x-prefixed EVM hash"
        )
        String txHash,

        Long userId
) {
}
