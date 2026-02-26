package com.smartfinder.lieu;

import com.smartfinder.critere.Critere;
import com.smartfinder.critere.CritereRepository;
import com.smartfinder.lieu.dto.LieuDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import com.smartfinder.auth.Utilisateur;
import com.smartfinder.auth.UtilisateurRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LieuService {

    private final LieuRepository lieuRepository;
    private final CritereRepository critereRepository;
    private final UtilisateurRepository utilisateurRepository;

    public LieuDTO create(Lieu lieu, List<Long> critereIds) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur currentUtilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        lieu.setProprietaire(currentUtilisateur);
        if (critereIds != null) {
            for (Long critereId : critereIds) {
                Critere critere = critereRepository.findById(critereId)
                        .orElseThrow(() -> new RuntimeException("Critère non trouvé: " + critereId));
                LieuCritere lc = new LieuCritere();
                lc.setLieu(lieu);
                lc.setCritere(critere);
                lieu.getLieuCriteres().add(lc);
            }
        }
        lieu.setNoteMoyenne(java.math.BigDecimal.ZERO);
        Lieu saved = lieuRepository.save(lieu);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public LieuDTO findById(Long id) {
        Lieu lieu = lieuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lieu non trouvé"));
        return mapToDTO(lieu);
    }

    @Transactional(readOnly = true)
    public List<LieuDTO> findAll() {
        return lieuRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public LieuDTO update(Long id, Lieu lieuDetails, List<Long> critereIds) {
        Lieu lieu = lieuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lieu non trouvé"));

        lieu.setNom(lieuDetails.getNom());
        lieu.setAdresse(lieuDetails.getAdresse());
        lieu.setDescription(lieuDetails.getDescription());
        lieu.setLatitude(lieuDetails.getLatitude());
        lieu.setLongitude(lieuDetails.getLongitude());
        lieu.setHoraires(lieuDetails.getHoraires());

        if (critereIds != null) {
            lieu.getLieuCriteres().clear();
            for (Long critereId : critereIds) {
                Critere critere = critereRepository.findById(critereId)
                        .orElseThrow(() -> new RuntimeException("Critère non trouvé: " + critereId));
                LieuCritere lc = new LieuCritere();
                lc.setLieu(lieu);
                lc.setCritere(critere);
                lieu.getLieuCriteres().add(lc);
            }
        }

        Lieu updated = lieuRepository.save(lieu);
        return mapToDTO(updated);
    }

    public void delete(Long id) {
        lieuRepository.deleteById(id);
    }

    private LieuDTO mapToDTO(Lieu lieu) {
        LieuDTO dto = new LieuDTO();
        dto.setId(lieu.getId());
        dto.setNom(lieu.getNom());
        dto.setAdresse(lieu.getAdresse());
        dto.setDescription(lieu.getDescription());
        dto.setLatitude(lieu.getLatitude());
        dto.setLongitude(lieu.getLongitude());
        dto.setHoraires(lieu.getHoraires());
        dto.setNoteMoyenne(lieu.getNoteMoyenne());
        dto.setCreatedAt(lieu.getCreatedAt());

        if (lieu.getLieuCriteres() != null) {
            dto.setCriteres(lieu.getLieuCriteres().stream()
                    .map(lc -> {
                        com.smartfinder.critere.dto.CritereDTO cdto = new com.smartfinder.critere.dto.CritereDTO();
                        cdto.setId(lc.getCritere().getId());
                        cdto.setNom(lc.getCritere().getNom());
                        cdto.setDescription(lc.getCritere().getDescription());
                        cdto.setCategorie(lc.getCritere().getCategorie());
                        cdto.setIcon(lc.getCritere().getIcon());
                        return cdto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
