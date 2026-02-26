package com.smartfinder.auth;

import com.smartfinder.auth.dto.LoginRequest;
import com.smartfinder.auth.dto.LoginResponse;
import com.smartfinder.auth.dto.UtilisateurDTO;
import com.smartfinder.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateurService utilisateurService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<UtilisateurDTO> register(@RequestBody Utilisateur utilisateur) {
        UtilisateurDTO created = utilisateurService.create(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Utilisateur utilisateur = utilisateurService.findByEmailForAuth(request.email())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.password(), utilisateur.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(utilisateur.getEmail(), utilisateur.getRole().name());

        LoginResponse response = new LoginResponse(
                token,
                utilisateur.getId(),
                utilisateur.getEmail(),
                utilisateur.getPrenom(),
                utilisateur.getNom(),
                utilisateur.getRole().name());

        return ResponseEntity.ok(response);
    }
}
