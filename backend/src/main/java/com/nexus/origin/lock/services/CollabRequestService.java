package com.nexus.origin.lock.services;

import com.nexus.origin.lock.dto.CreateCollabRequest;
import com.nexus.origin.lock.enums.CollabRequestStatus;
import com.nexus.origin.lock.exceptions.DuplicateResourceException;
import com.nexus.origin.lock.exceptions.ResourceNotFoundException;
import com.nexus.origin.lock.models.CollabRequest;
import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.models.User;
import com.nexus.origin.lock.repositories.CollabRequestRepository;
import com.nexus.origin.lock.repositories.IdeaRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CollabRequestService {

    private final CollabRequestRepository collabRequestRepository;
    private final IdeaRepository ideaRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CollabRequestService(
            CollabRequestRepository collabRequestRepository,
            IdeaRepository ideaRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.collabRequestRepository = collabRequestRepository;
        this.ideaRepository = ideaRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    public CollabRequest requestCollaboration(CreateCollabRequest request) {
        User requester = authenticatedUserService.currentUser();
        Idea idea = ideaRepository.findById(request.ideaId())
                .orElseThrow(() -> new ResourceNotFoundException("Idea not found"));

        if (idea.getUser() == null) {
            throw new ResourceNotFoundException("Idea owner not found");
        }

        if (idea.getUser().getId().equals(requester.getId())) {
            throw new DuplicateResourceException("You cannot request collaboration on your own idea");
        }

        if (collabRequestRepository.existsByRequesterIdAndIdeaIdAndStatus(
                requester.getId(),
                idea.getId(),
                CollabRequestStatus.PENDING
        )) {
            throw new DuplicateResourceException("A pending collaboration request already exists");
        }

        LocalDateTime now = LocalDateTime.now();
        CollabRequest collabRequest = CollabRequest.builder()
                .requester(requester)
                .creator(idea.getUser())
                .idea(idea)
                .message(request.message())
                .status(CollabRequestStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return collabRequestRepository.save(collabRequest);
    }

    public CollabRequest approve(Long id) {
        return updateStatus(id, CollabRequestStatus.APPROVED);
    }

    public CollabRequest reject(Long id) {
        return updateStatus(id, CollabRequestStatus.REJECTED);
    }

    @Transactional(readOnly = true)
    public List<CollabRequest> incoming() {
        return collabRequestRepository.findByCreatorIdOrderByCreatedAtDesc(authenticatedUserService.currentUser().getId());
    }

    @Transactional(readOnly = true)
    public List<CollabRequest> sent() {
        return collabRequestRepository.findByRequesterIdOrderByCreatedAtDesc(authenticatedUserService.currentUser().getId());
    }

    private CollabRequest updateStatus(Long id, CollabRequestStatus status) {
        User creator = authenticatedUserService.currentUser();
        CollabRequest request = collabRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collaboration request not found"));

        if (!request.getCreator().getId().equals(creator.getId())) {
            throw new AccessDeniedException("Only the idea owner can update this collaboration request");
        }

        request.setStatus(status);
        request.setUpdatedAt(LocalDateTime.now());
        return collabRequestRepository.save(request);
    }
}
