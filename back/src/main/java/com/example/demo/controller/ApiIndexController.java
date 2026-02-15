package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ApiIndexController {

    @GetMapping({"/api", "/api/"})
    public Map<String, Object> apiIndex() {
        return Map.of(
                "message", "API Gestion Chantiers",
                "endpoints", Map.of(
                        "clients", "/api/clients",
                        "techniciens", "/api/techniciens",
                        "chantiers", "/api/chantiers",
                        "verifications", "/api/verifications"
                )
        );
    }
}
