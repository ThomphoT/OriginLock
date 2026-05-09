package com.nexus.origin.lock.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateIdeaRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be 255 characters or fewer")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 5000, message = "Description must be 5000 characters or fewer")
        String description,

        Long userId
) {
}
