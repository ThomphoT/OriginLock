package com.nexus.origin.lock.controllers;

import com.nexus.origin.lock.dto.CreateIdeaRequest;
import com.nexus.origin.lock.dto.IdeaResponse;
import com.nexus.origin.lock.models.Idea;
import com.nexus.origin.lock.services.CertificateService;
import com.nexus.origin.lock.services.IdeaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    private final CertificateService certificateService;

    public IdeaController(IdeaService ideaService, CertificateService certificateService) {
        this.ideaService = ideaService;
        this.certificateService = certificateService;
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

    @GetMapping("/verify/{contentHash}")
    public IdeaResponse verifyIdea(@PathVariable String contentHash) {
        return IdeaResponse.from(ideaService.getIdeaByContentHash(contentHash));
    }

    @GetMapping("/{id}/certificate")
    public ResponseEntity<byte[]> getCertificate(@PathVariable Long id) {
        Idea idea = ideaService.getIdea(id);
        byte[] pdf = certificateService.generate(idea);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=originlock-certificate-" + id + ".pdf")
                .body(pdf);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdeaResponse createIdea(@Valid @RequestBody CreateIdeaRequest request) {
        return IdeaResponse.from(ideaService.createIdea(request));
    }
}
