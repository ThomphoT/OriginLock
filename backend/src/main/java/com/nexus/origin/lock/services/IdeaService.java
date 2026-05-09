package com.nexus.origin.lock.services;

import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.repositories.IdeaRepository;
import com.nexus.origin.lock.utils.HashUtil;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service

public class IdeaService {

    private final IdeaRepository ideaRepository;

    public IdeaService(IdeaRepository ideaRepository) {
        this.ideaRepository = ideaRepository;
    }

    public Idea createIdea(Idea idea) {

        String hash = HashUtil.sha256(
                idea.getTitle() + idea.getDescription()
        );

        idea.setContentHash(hash);

        idea.setCreatedAt(LocalDateTime.now());

        return ideaRepository.save(idea);
    }
}