package com.nexus.origin.lock.services;

import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.models.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertTrue;

class CertificateServiceTest {

    @Test
    void generateReturnsPdfBytes() {
        User user = User.builder()
                .username("Demo User")
                .email("demo@originlock.local")
                .build();
        Idea idea = Idea.builder()
                .title("Demo idea")
                .contentHash("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                .txHash("0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
                .blockchainVerified(true)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        byte[] pdf = new CertificateService().generate(idea);

        assertTrue(pdf.length > 4);
        assertTrue(pdf[0] == '%' && pdf[1] == 'P' && pdf[2] == 'D' && pdf[3] == 'F');
    }
}
