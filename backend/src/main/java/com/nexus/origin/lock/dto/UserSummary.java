package com.nexus.origin.lock.dto;

import com.nexus.origin.lock.models.User;

public record UserSummary(
        Long id,
        String username,
        String email,
        String walletAddress
) {
    public static UserSummary from(User user) {
        return new UserSummary(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getWalletAddress()
        );
    }
}
