package com.nexus.origin.lock.controllers;

import com.nexus.origin.lock.dto.CollabRequestResponse;
import com.nexus.origin.lock.dto.CreateCollabRequest;
import com.nexus.origin.lock.services.CollabRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/collabs")
public class CollabRequestController {

    private final CollabRequestService collabRequestService;

    public CollabRequestController(CollabRequestService collabRequestService) {
        this.collabRequestService = collabRequestService;
    }

    @PostMapping("/request")
    @ResponseStatus(HttpStatus.CREATED)
    public CollabRequestResponse requestCollaboration(@Valid @RequestBody CreateCollabRequest request) {
        return CollabRequestResponse.from(collabRequestService.requestCollaboration(request));
    }

    @PostMapping("/{id}/approve")
    public CollabRequestResponse approve(@PathVariable Long id) {
        return CollabRequestResponse.from(collabRequestService.approve(id));
    }

    @PostMapping("/{id}/reject")
    public CollabRequestResponse reject(@PathVariable Long id) {
        return CollabRequestResponse.from(collabRequestService.reject(id));
    }

    @GetMapping("/incoming")
    public List<CollabRequestResponse> incoming() {
        return collabRequestService.incoming().stream()
                .map(CollabRequestResponse::from)
                .toList();
    }

    @GetMapping("/sent")
    public List<CollabRequestResponse> sent() {
        return collabRequestService.sent().stream()
                .map(CollabRequestResponse::from)
                .toList();
    }
}
