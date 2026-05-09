package com.nexus.origin.lock.repositories;

import com.nexus.origin.lock.enums.CollabRequestStatus;
import com.nexus.origin.lock.models.CollabRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollabRequestRepository extends JpaRepository<CollabRequest, Long> {

    boolean existsByRequesterIdAndIdeaIdAndStatus(Long requesterId, Long ideaId, CollabRequestStatus status);

    List<CollabRequest> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);

    List<CollabRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
}
