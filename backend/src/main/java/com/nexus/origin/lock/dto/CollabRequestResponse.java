package com.nexus.origin.lock.dto;

import com.nexus.origin.lock.enums.CollabRequestStatus;
import com.nexus.origin.lock.models.CollabRequest;

import java.time.LocalDateTime;

public record CollabRequestResponse(
        Long id,
        Long ideaId,
        String ideaTitle,
        UserSummary requester,
        UserSummary creator,
        String message,
        CollabRequestStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CollabRequestResponse from(CollabRequest request) {
        return new CollabRequestResponse(
                request.getId(),
                request.getIdea().getId(),
                request.getIdea().getTitle(),
                UserSummary.from(request.getRequester()),
                UserSummary.from(request.getCreator()),
                request.getMessage(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
