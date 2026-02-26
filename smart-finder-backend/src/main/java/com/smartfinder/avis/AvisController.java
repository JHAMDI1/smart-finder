package com.smartfinder.avis;

import com.smartfinder.auth.Utilisateur;
import com.smartfinder.auth.UtilisateurRepository;
import com.smartfinder.avis.dto.AvisDTO;
import com.smartfinder.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lieux/{lieuId}/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisService avisService;
    private final UtilisateurRepository utilisateurRepository;

    @GetMapping
    public ResponseEntity<List<AvisDTO>> findByLieuId(@PathVariable("lieuId") Long lieuId) {
        return ResponseEntity.ok(avisService.findByLieuId(lieuId));
    }

    @PostMapping
    public ResponseEntity<AvisDTO> create(
            @PathVariable("lieuId") Long lieuId,
            @RequestBody Avis avis) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        AvisDTO created = avisService.create(lieuId, avis, utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable("lieuId") Long lieuId,
            @PathVariable("id") Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        avisService.delete(id, utilisateur);
        return ResponseEntity.noContent().build();
    }
}
