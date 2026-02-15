package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chantiers")
public class Chantier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reference;

    @Column(nullable = false)
    private String adresse;

    private String typeInstallation;

    private LocalDate dateIntervention;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChantierStatut statut = ChantierStatut.BROUILLON;

    private String signatureClient;

    private LocalDateTime dateSignature;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "technicien_id", nullable = false)
    private Technicien technicien;

    @JsonIgnore
    @OneToMany(mappedBy = "chantier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VerificationChantier> verifications = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void ajouterVerification(VerificationChantier verification) {
        verifications.add(verification);
        verification.setChantier(this);
    }

    public void cloturer() {
        this.statut = ChantierStatut.TERMINE;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTypeInstallation() {
        return typeInstallation;
    }

    public void setTypeInstallation(String typeInstallation) {
        this.typeInstallation = typeInstallation;
    }

    public LocalDate getDateIntervention() {
        return dateIntervention;
    }

    public void setDateIntervention(LocalDate dateIntervention) {
        this.dateIntervention = dateIntervention;
    }

    public ChantierStatut getStatut() {
        return statut;
    }

    public void setStatut(ChantierStatut statut) {
        this.statut = statut;
    }

    public String getSignatureClient() {
        return signatureClient;
    }

    public void setSignatureClient(String signatureClient) {
        this.signatureClient = signatureClient;
    }

    public LocalDateTime getDateSignature() {
        return dateSignature;
    }

    public void setDateSignature(LocalDateTime dateSignature) {
        this.dateSignature = dateSignature;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Technicien getTechnicien() {
        return technicien;
    }

    public void setTechnicien(Technicien technicien) {
        this.technicien = technicien;
    }

    public List<VerificationChantier> getVerifications() {
        return verifications;
    }

    public void setVerifications(List<VerificationChantier> verifications) {
        this.verifications = verifications;
    }
}