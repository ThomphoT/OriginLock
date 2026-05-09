package com.nexus.origin.lock.services;

import com.nexus.origin.lock.dto.CreateIdeaRequest;
import com.nexus.origin.lock.exceptions.DuplicateResourceException;
import com.nexus.origin.lock.exceptions.ResourceNotFoundException;
import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.models.User;
import com.nexus.origin.lock.repositories.IdeaRepository;
import com.nexus.origin.lock.repositories.UserRepository;
import com.nexus.origin.lock.utils.HashUtil;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    public IdeaService(IdeaRepository ideaRepository, UserRepository userRepository) {
        this.ideaRepository = ideaRepository;
        this.userRepository = userRepository;
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
        String hash = HashUtil.sha256(request.title() + "\n" + request.description());

        if (ideaRepository.existsByContentHash(hash)) {
            throw new DuplicateResourceException("This idea has already been registered");
        }

        User user = null;
        if (request.userId() != null) {
            user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }

        Idea idea = Idea.builder()
                .title(request.title())
                .description(request.description())
                .contentHash(hash)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return ideaRepository.save(idea);
    }
}
