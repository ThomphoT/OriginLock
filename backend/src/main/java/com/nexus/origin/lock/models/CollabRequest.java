package com.nexus.origin.lock.models;

import com.nexus.origin.lock.enums.CollabRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "collab_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idea_id")
    private Idea idea;

    @Column(length = 2000)
    private String message;

    @Enumerated(EnumType.STRING)
    private CollabRequestStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
