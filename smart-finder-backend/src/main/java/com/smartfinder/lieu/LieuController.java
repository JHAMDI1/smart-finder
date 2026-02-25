package com.smartfinder.lieu;

import com.smartfinder.lieu.dto.LieuDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lieux")
@RequiredArgsConstructor
public class LieuController {

    private final LieuService lieuService;

    @GetMapping
    public ResponseEntity<List<LieuDTO>> findAll() {
        return ResponseEntity.ok(lieuService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LieuDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(lieuService.findById(id));
    }

    @PostMapping
    public ResponseEntity<LieuDTO> create(@RequestBody LieuCreateRequest request) {
        Lieu lieu = new Lieu();
        lieu.setNom(request.getNom());
        lieu.setAdresse(request.getAdresse());
        lieu.setDescription(request.getDescription());
        lieu.setLatitude(request.getLatitude());
        lieu.setLongitude(request.getLongitude());
        lieu.setHoraires(request.getHoraires());
        
        LieuDTO created = lieuService.create(lieu, request.getCritereIds());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LieuDTO> update(@PathVariable Long id, @RequestBody LieuCreateRequest request) {
        Lieu lieu = new Lieu();
        lieu.setNom(request.getNom());
        lieu.setAdresse(request.getAdresse());
        lieu.setDescription(request.getDescription());
        lieu.setLatitude(request.getLatitude());
        lieu.setLongitude(request.getLongitude());
        lieu.setHoraires(request.getHoraires());
        
        LieuDTO updated = lieuService.update(id, lieu, request.getCritereIds());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lieuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
