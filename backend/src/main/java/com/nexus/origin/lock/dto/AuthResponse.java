package com.nexus.origin.lock.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
