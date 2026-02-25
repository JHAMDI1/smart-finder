package com.smartfinder.avis;

import com.smartfinder.auth.Utilisateur;
import com.smartfinder.avis.dto.AvisDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lieux/{lieuId}/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisService avisService;

    @GetMapping
    public ResponseEntity<List<AvisDTO>> findByLieuId(@PathVariable Long lieuId) {
        return ResponseEntity.ok(avisService.findByLieuId(lieuId));
    }

    @PostMapping
    public ResponseEntity<AvisDTO> create(
            @PathVariable Long lieuId,
            @RequestBody Avis avis,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        AvisDTO created = avisService.create(lieuId, avis, utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal Utilisateur utilisateur) {
        avisService.delete(id, utilisateur);
        return ResponseEntity.noContent().build();
    }
}
