package com.smartfinder.critere;

import com.smartfinder.critere.dto.CritereDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CritereService {

    private final CritereRepository critereRepository;

    public CritereDTO create(Critere critere) {
        Critere saved = critereRepository.save(critere);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public CritereDTO findById(Long id) {
        Critere critere = critereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Critère non trouvé"));
        return mapToDTO(critere);
    }

    @Transactional(readOnly = true)
    public List<CritereDTO> findAll() {
        return critereRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CritereDTO> findByActifTrue() {
        return critereRepository.findByActifTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CritereDTO update(Long id, Critere critereDetails) {
        Critere critere = critereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Critère non trouvé"));
        
        critere.setNom(critereDetails.getNom());
        critere.setDescription(critereDetails.getDescription());
        critere.setCategorie(critereDetails.getCategorie());
        critere.setIcon(critereDetails.getIcon());
        critere.setActif(critereDetails.getActif());
        
        Critere updated = critereRepository.save(critere);
        return mapToDTO(updated);
    }

    public void delete(Long id) {
        critereRepository.deleteById(id);
    }

    private CritereDTO mapToDTO(Critere critere) {
        CritereDTO dto = new CritereDTO();
        dto.setId(critere.getId());
        dto.setNom(critere.getNom());
        dto.setDescription(critere.getDescription());
        dto.setCategorie(critere.getCategorie());
        dto.setIcon(critere.getIcon());
        dto.setActif(critere.getActif());
        dto.setCreatedAt(critere.getCreatedAt());
        return dto;
    }
}
