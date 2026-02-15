package com.example.demo.controller;

import com.example.demo.entity.Chantier;
import com.example.demo.entity.ChantierStatut;
import com.example.demo.repository.ChantierRepository;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.TechnicienRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping({"/api/chantiers", "/chantiers"})
public class ChantierController {

    private final ChantierRepository chantierRepository;
    private final ClientRepository clientRepository;
    private final TechnicienRepository technicienRepository;

    public ChantierController(
            ChantierRepository chantierRepository,
            ClientRepository clientRepository,
            TechnicienRepository technicienRepository
    ) {
        this.chantierRepository = chantierRepository;
        this.clientRepository = clientRepository;
        this.technicienRepository = technicienRepository;
    }

    @GetMapping
    public Page<Chantier> getAllChantiers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ChantierStatut statut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateIntervention,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort
    ) {
        String sortBy = sort.length > 0 ? sort[0] : "id";
        String sortDir = sort.length > 1 ? sort[1] : "desc";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return chantierRepository.search(q, statut, dateIntervention, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chantier> getChantierById(@PathVariable Long id) {
        return chantierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Chantier> createChantier(@RequestBody ChantierRequest request) {
        var client = clientRepository.findById(request.clientId()).orElse(null);
        if (client == null) {
            return ResponseEntity.badRequest().build();
        }

        var technicien = technicienRepository.findById(request.technicienId()).orElse(null);
        if (technicien == null) {
            return ResponseEntity.badRequest().build();
        }

        Chantier chantier = new Chantier();
        applyRequest(chantier, request);
        chantier.setClient(client);
        chantier.setTechnicien(technicien);
        return ResponseEntity.ok(chantierRepository.save(chantier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chantier> updateChantier(@PathVariable Long id, @RequestBody ChantierRequest request) {
        var existing = chantierRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        var client = clientRepository.findById(request.clientId()).orElse(null);
        if (client == null) {
            return ResponseEntity.badRequest().build();
        }

        var technicien = technicienRepository.findById(request.technicienId()).orElse(null);
        if (technicien == null) {
            return ResponseEntity.badRequest().build();
        }

        applyRequest(existing, request);
        existing.setClient(client);
        existing.setTechnicien(technicien);
        return ResponseEntity.ok(chantierRepository.save(existing));
    }

    @PostMapping("/{id}/cloturer")
    public ResponseEntity<Chantier> cloturerChantier(@PathVariable Long id) {
        var chantier = chantierRepository.findById(id).orElse(null);
        if (chantier == null) {
            return ResponseEntity.notFound().build();
        }

        chantier.cloturer();
        return ResponseEntity.ok(chantierRepository.save(chantier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChantier(@PathVariable Long id) {
        if (!chantierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        chantierRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Chantier chantier, ChantierRequest request) {
        chantier.setReference(request.reference());
        chantier.setAdresse(request.adresse());
        chantier.setTypeInstallation(request.typeInstallation());
        chantier.setDateIntervention(request.dateIntervention());
        chantier.setStatut(request.statut() == null ? ChantierStatut.BROUILLON : request.statut());
        chantier.setSignatureClient(request.signatureClient());
        chantier.setDateSignature(request.dateSignature());
    }

    public record ChantierRequest(
            String reference,
            String adresse,
            String typeInstallation,
            LocalDate dateIntervention,
            ChantierStatut statut,
            String signatureClient,
            LocalDateTime dateSignature,
            Long clientId,
            Long technicienId
    ) {
    }
}

