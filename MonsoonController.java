package com.monsoon.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") 
public class MonsoonController {

    private final String FASTAPI_URL = "http://localhost:8000/api/v1/predict-monsoon";
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/advisory")
    public ResponseEntity<Map> getMonsoonAdvisory(@RequestBody Map<String, Object> payload) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(FASTAPI_URL, payload, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "ML Service Unavailable: " + e.getMessage()));
        }
    }
}