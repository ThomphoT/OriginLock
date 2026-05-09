package com.nexus.origin.lock.controllers;

import com.nexus.origin.lock.dto.CreateIdeaRequest;
import com.nexus.origin.lock.dto.IdeaResponse;
import com.nexus.origin.lock.services.IdeaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
public class IdeaController {

    private final IdeaService ideaService;

    public IdeaController(IdeaService ideaService) {
        this.ideaService = ideaService;
    }

    @GetMapping
    public List<IdeaResponse> getIdeas(@RequestParam(required = false) Long userId) {
        return ideaService.getIdeas(userId).stream()
                .map(IdeaResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public IdeaResponse getIdea(@PathVariable Long id) {
        return IdeaResponse.from(ideaService.getIdea(id));
    }

    @GetMapping("/hash/{contentHash}")
    public IdeaResponse getIdeaByContentHash(@PathVariable String contentHash) {
        return IdeaResponse.from(ideaService.getIdeaByContentHash(contentHash));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdeaResponse createIdea(@Valid @RequestBody CreateIdeaRequest request) {
        return IdeaResponse.from(ideaService.createIdea(request));
    }
}
