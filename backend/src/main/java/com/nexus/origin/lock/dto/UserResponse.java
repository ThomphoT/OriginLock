package com.nexus.origin.lock.dto;

import com.nexus.origin.lock.models.User;

public record UserResponse(
        Long id,
        String username,
        String email,
        String walletAddress
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getWalletAddress()
        );
    }
}
