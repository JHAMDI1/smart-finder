package com.smartfinder.critere;

import com.smartfinder.critere.dto.CritereDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/criteres")
@RequiredArgsConstructor
public class CritereController {

    private final CritereService critereService;

    @GetMapping
    public ResponseEntity<List<CritereDTO>> findAll() {
        return ResponseEntity.ok(critereService.findByActifTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CritereDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(critereService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CritereDTO> create(@RequestBody Critere critere) {
        CritereDTO created = critereService.create(critere);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CritereDTO> update(@PathVariable Long id, @RequestBody Critere critere) {
        return ResponseEntity.ok(critereService.update(id, critere));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        critereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
