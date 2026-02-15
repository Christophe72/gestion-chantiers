package com.example.demo.repository;

import com.example.demo.entity.VerificationChantier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationChantierRepository extends JpaRepository<VerificationChantier, Long> {
    List<VerificationChantier> findByChantierId(Long chantierId);
}
