package com.nexus.origin.lock.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ideas")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String description;

    @Column(unique = true)
    private String contentHash;

    private String txHash;

    private Boolean blockchainVerified;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
