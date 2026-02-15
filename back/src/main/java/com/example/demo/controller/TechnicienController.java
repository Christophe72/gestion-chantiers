package com.example.demo.controller;

import com.example.demo.entity.Technicien;
import com.example.demo.repository.TechnicienRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/techniciens", "/techniciens"})
public class TechnicienController {

    private final TechnicienRepository technicienRepository;

    public TechnicienController(TechnicienRepository technicienRepository) {
        this.technicienRepository = technicienRepository;
    }

    @GetMapping
    public Page<Technicien> getAllTechniciens(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort
    ) {
        String sortBy = sort.length > 0 ? sort[0] : "id";
        String sortDir = sort.length > 1 ? sort[1] : "desc";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        if (q != null && !q.isBlank()) {
            return technicienRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    q, q, q, pageable
            );
        }
        return technicienRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Technicien> getTechnicienById(@PathVariable Long id) {
        return technicienRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Technicien createTechnicien(@RequestBody Technicien technicien) {
        return technicienRepository.save(technicien);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Technicien> updateTechnicien(@PathVariable Long id, @RequestBody Technicien technicien) {
        var existing = technicienRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        existing.setNom(technicien.getNom());
        existing.setPrenom(technicien.getPrenom());
        existing.setEmail(technicien.getEmail());
        return ResponseEntity.ok(technicienRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnicien(@PathVariable Long id) {
        if (!technicienRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        technicienRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

