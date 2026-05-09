package com.nexus.origin.lock.services;

import com.nexus.origin.lock.dto.CreateIdeaRequest;
import com.nexus.origin.lock.exceptions.DuplicateResourceException;
import com.nexus.origin.lock.exceptions.ResourceNotFoundException;
import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.models.User;
import com.nexus.origin.lock.repositories.IdeaRepository;
import com.nexus.origin.lock.utils.HashUtil;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final BlockchainVerificationService blockchainVerificationService;
    private final AuthenticatedUserService authenticatedUserService;

    public IdeaService(
            IdeaRepository ideaRepository,
            BlockchainVerificationService blockchainVerificationService,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.ideaRepository = ideaRepository;
        this.blockchainVerificationService = blockchainVerificationService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional(readOnly = true)
    public List<Idea> getIdeas(Long userId) {
        if (userId == null) {
            return ideaRepository.findAll();
        }

        return ideaRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Idea getIdea(Long id) {
        return ideaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Idea not found"));
    }

    @Transactional(readOnly = true)
    public Idea getIdeaByContentHash(String contentHash) {
        return ideaRepository.findByContentHash(contentHash)
                .orElseThrow(() -> new ResourceNotFoundException("Idea not found"));
    }

    public Idea createIdea(CreateIdeaRequest request) {
        String hash = request.contentHash() == null || request.contentHash().isBlank()
                ? HashUtil.sha256(request.title() + "\n" + request.description())
                : request.contentHash().toLowerCase();

        if (ideaRepository.existsByContentHash(hash)) {
            throw new DuplicateResourceException("This idea has already been registered");
        }

        User user = authenticatedUserService.currentUser();
        if (request.userId() != null && !request.userId().equals(user.getId())) {
            throw new AccessDeniedException("Ideas can only be created for the authenticated user");
        }

        boolean blockchainVerified = blockchainVerificationService.verifyTransaction(request.txHash());

        Idea idea = Idea.builder()
                .title(request.title())
                .description(request.description())
                .contentHash(hash)
                .txHash(request.txHash())
                .blockchainVerified(blockchainVerified)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return ideaRepository.save(idea);
    }
}
