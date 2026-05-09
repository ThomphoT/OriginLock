package com.nexus.origin.lock.services;

import com.nexus.origin.lock.dto.CreateIdeaRequest;
import com.nexus.origin.lock.exceptions.DuplicateResourceException;
import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.models.User;
import com.nexus.origin.lock.repositories.IdeaRepository;
import com.nexus.origin.lock.repositories.UserRepository;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class IdeaServiceTest {

    @Test
    void createIdeaRejectsDuplicateContentHash() {
        String contentHash = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        AtomicBoolean duplicateChecked = new AtomicBoolean(false);
        IdeaService ideaService = new IdeaService(
                ideaRepository(contentHash, true, duplicateChecked),
                new BlockchainVerificationService("http://localhost", false),
                authenticatedUserService()
        );

        CreateIdeaRequest request = new CreateIdeaRequest(
                "Demo idea",
                "A protected idea",
                contentHash,
                "",
                null
        );

        assertThrows(DuplicateResourceException.class, () -> ideaService.createIdea(request));
        assertTrue(duplicateChecked.get());
    }

    @Test
    void createIdeaUsesAuthenticatedUserAsOwner() {
        String contentHash = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
        AtomicBoolean duplicateChecked = new AtomicBoolean(false);
        IdeaService ideaService = new IdeaService(
                ideaRepository(contentHash, false, duplicateChecked),
                new BlockchainVerificationService("http://localhost", false),
                authenticatedUserService()
        );

        CreateIdeaRequest request = new CreateIdeaRequest(
                "Demo idea",
                "A protected idea",
                contentHash,
                "",
                null
        );

        Idea idea = ideaService.createIdea(request);

        assertEquals("demo@originlock.local", idea.getUser().getEmail());
        assertEquals(contentHash, idea.getContentHash());
    }

    private IdeaRepository ideaRepository(String expectedHash, boolean duplicate, AtomicBoolean duplicateChecked) {
        return (IdeaRepository) Proxy.newProxyInstance(
                IdeaRepository.class.getClassLoader(),
                new Class<?>[]{IdeaRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("existsByContentHash")) {
                        duplicateChecked.set(true);
                        assertEquals(expectedHash, args[0]);
                        return duplicate;
                    }
                    if (method.getName().equals("save")) {
                        return args[0];
                    }
                    throw new UnsupportedOperationException(method.getName());
                }
        );
    }

    private AuthenticatedUserService authenticatedUserService() {
        User user = User.builder()
                .id(1L)
                .username("demo")
                .email("demo@originlock.local")
                .password("hashed")
                .build();

        UserRepository userRepository = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findByEmail")) {
                        return Optional.of(user);
                    }
                    throw new UnsupportedOperationException(method.getName());
                }
        );

        return new AuthenticatedUserService(userRepository) {
            @Override
            public User currentUser() {
                return user;
            }
        };
    }
}
