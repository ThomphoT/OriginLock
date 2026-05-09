package com.nexus.origin.lock.dto;

import com.nexus.origin.lock.models.Idea;

import java.time.LocalDateTime;

public record IdeaResponse(
        Long id,
        String title,
        String description,
        String contentHash,
        String txHash,
        Boolean blockchainVerified,
        LocalDateTime createdAt,
        UserSummary user
) {
    public static IdeaResponse from(Idea idea) {
        return new IdeaResponse(
                idea.getId(),
                idea.getTitle(),
                idea.getDescription(),
                idea.getContentHash(),
                idea.getTxHash(),
                idea.getBlockchainVerified(),
                idea.getCreatedAt(),
                idea.getUser() == null ? null : UserSummary.from(idea.getUser())
        );
    }
}
