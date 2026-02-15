package com.example.demo.controller;

import com.example.demo.entity.VerificationChantier;
import com.example.demo.repository.ChantierRepository;
import com.example.demo.repository.VerificationChantierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/verifications", "/verifications"})
public class VerificationChantierController {

    private final VerificationChantierRepository verificationRepository;
    private final ChantierRepository chantierRepository;

    public VerificationChantierController(
            VerificationChantierRepository verificationRepository,
            ChantierRepository chantierRepository
    ) {
        this.verificationRepository = verificationRepository;
        this.chantierRepository = chantierRepository;
    }

    @GetMapping
    public List<VerificationChantier> getAllVerifications() {
        return verificationRepository.findAll();
    }

    @GetMapping("/chantier/{chantierId}")
    public List<VerificationChantier> getVerificationsByChantier(@PathVariable Long chantierId) {
        return verificationRepository.findByChantierId(chantierId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VerificationChantier> getVerificationById(@PathVariable Long id) {
        return verificationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/chantier/{chantierId}")
    public ResponseEntity<VerificationChantier> createForChantier(@PathVariable Long chantierId) {
        var chantier = chantierRepository.findById(chantierId).orElse(null);
        if (chantier == null) {
            return ResponseEntity.notFound().build();
        }

        VerificationChantier verification = new VerificationChantier();
        verification.setChantier(chantier);
        return ResponseEntity.ok(verificationRepository.save(verification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVerification(@PathVariable Long id) {
        if (!verificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        verificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

