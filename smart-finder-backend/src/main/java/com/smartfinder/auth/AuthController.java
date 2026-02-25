package com.smartfinder.auth;

import com.smartfinder.auth.dto.UtilisateurDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateurService utilisateurService;

    @PostMapping("/register")
    public ResponseEntity<UtilisateurDTO> register(@RequestBody Utilisateur utilisateur) {
        UtilisateurDTO created = utilisateurService.create(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        return ResponseEntity.ok(Map.of(
            "token", "dummy-jwt-token",
            "message", "Authentification réussie (JWT à implémenter en Phase 5)"
        ));
    }
}
