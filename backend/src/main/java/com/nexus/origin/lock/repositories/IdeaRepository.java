package com.nexus.origin.lock.repositories;

import com.nexus.origin.lock.models.Idea;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IdeaRepository extends JpaRepository<Idea, Long> {

    Optional<Idea> findByContentHash(String contentHash);

    boolean existsByContentHash(String contentHash);

    List<Idea> findByUserId(Long userId);
}
