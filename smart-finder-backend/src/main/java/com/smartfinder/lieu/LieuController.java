package com.smartfinder.lieu;

import com.smartfinder.lieu.dto.LieuDTO;
import com.smartfinder.lieu.dto.SearchRequestDTO;
import com.smartfinder.lieu.dto.SearchResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/lieux")
@RequiredArgsConstructor
public class LieuController {

    private final LieuService lieuService;
    private final LieuSearchService lieuSearchService;

    @GetMapping
    public ResponseEntity<List<LieuDTO>> findAll() {
        return ResponseEntity.ok(lieuService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LieuDTO> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(lieuService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<LieuDTO> create(@Valid @RequestBody LieuCreateRequest request) {
        Lieu lieu = new Lieu();
        lieu.setNom(request.getNom());
        lieu.setAdresse(request.getAdresse());
        lieu.setDescription(request.getDescription());
        lieu.setLatitude(request.getLatitude());
        lieu.setLongitude(request.getLongitude());
        lieu.setHoraires(request.getHoraires());
        lieu.setImageUrl(request.getImageUrl());

        LieuDTO created = lieuService.create(lieu, request.getCritereIds());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<LieuDTO> update(@PathVariable("id") Long id, @Valid @RequestBody LieuCreateRequest request) {
        Lieu lieu = new Lieu();
        lieu.setNom(request.getNom());
        lieu.setAdresse(request.getAdresse());
        lieu.setDescription(request.getDescription());
        lieu.setLatitude(request.getLatitude());
        lieu.setLongitude(request.getLongitude());
        lieu.setHoraires(request.getHoraires());
        lieu.setImageUrl(request.getImageUrl());

        LieuDTO updated = lieuService.update(id, lieu, request.getCritereIds());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        lieuService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/search")
    public ResponseEntity<SearchResponseDTO> search(@RequestBody SearchRequestDTO request) {
        return ResponseEntity.ok(lieuSearchService.search(request));
    }
}
