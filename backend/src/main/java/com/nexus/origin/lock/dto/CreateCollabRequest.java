package com.nexus.origin.lock.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCollabRequest(
        @NotNull(message = "Idea id is required")
        Long ideaId,

        @NotBlank(message = "Message is required")
        @Size(max = 2000, message = "Message must be 2000 characters or fewer")
        String message
) {
}
