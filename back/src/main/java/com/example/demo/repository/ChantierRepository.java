package com.example.demo.repository;

import com.example.demo.entity.Chantier;
import com.example.demo.entity.ChantierStatut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ChantierRepository extends JpaRepository<Chantier, Long> {
    @Query(value = """
            SELECT c.*
            FROM chantiers c
            WHERE (CAST(:q AS text) IS NULL OR
                   LOWER(c.reference) LIKE LOWER(CONCAT('%', CAST(:q AS text), '%')) OR
                   LOWER(c.adresse) LIKE LOWER(CONCAT('%', CAST(:q AS text), '%')))
              AND (CAST(:statut AS text) IS NULL OR c.statut = CAST(:statut AS text))
              AND (CAST(:dateIntervention AS date) IS NULL OR c.date_intervention = CAST(:dateIntervention AS date))
            ORDER BY c.id DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM chantiers c
            WHERE (CAST(:q AS text) IS NULL OR
                   LOWER(c.reference) LIKE LOWER(CONCAT('%', CAST(:q AS text), '%')) OR
                   LOWER(c.adresse) LIKE LOWER(CONCAT('%', CAST(:q AS text), '%')))
              AND (CAST(:statut AS text) IS NULL OR c.statut = CAST(:statut AS text))
              AND (CAST(:dateIntervention AS date) IS NULL OR c.date_intervention = CAST(:dateIntervention AS date))
            """,
            nativeQuery = true)
    Page<Chantier> search(
            @Param("q") String q,
            @Param("statut") ChantierStatut statut,
            @Param("dateIntervention") LocalDate dateIntervention,
            Pageable pageable
    );
}