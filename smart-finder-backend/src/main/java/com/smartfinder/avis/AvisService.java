package com.smartfinder.avis;

import com.smartfinder.avis.dto.AvisDTO;
import com.smartfinder.auth.Utilisateur;
import com.smartfinder.lieu.Lieu;
import com.smartfinder.lieu.LieuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AvisService {

    private final AvisRepository avisRepository;
    private final LieuRepository lieuRepository;

    public AvisDTO create(Long lieuId, Avis avis, Utilisateur utilisateur) {
        Lieu lieu = lieuRepository.findById(lieuId)
                .orElseThrow(() -> new RuntimeException("Lieu non trouvé"));
        
        if (avisRepository.findByLieuIdAndUtilisateurId(lieuId, utilisateur.getId()).isPresent()) {
            throw new RuntimeException("Vous avez déjà donné un avis pour ce lieu");
        }
        
        avis.setLieu(lieu);
        avis.setUtilisateur(utilisateur);
        
        Avis saved = avisRepository.save(avis);
        
        updateNoteMoyenne(lieu);
        
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AvisDTO> findByLieuId(Long lieuId) {
        return avisRepository.findByLieuId(lieuId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id, Utilisateur utilisateur) {
        Avis avis = avisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        if (!avis.getUtilisateur().getId().equals(utilisateur.getId())) {
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres avis");
        }
        
        Lieu lieu = avis.getLieu();
        avisRepository.deleteById(id);
        
        updateNoteMoyenne(lieu);
    }

    private void updateNoteMoyenne(Lieu lieu) {
        List<Avis> avisList = avisRepository.findByLieuId(lieu.getId());
        if (avisList.isEmpty()) {
            lieu.setNoteMoyenne(0.0);
        } else {
            double moyenne = avisList.stream()
                    .mapToInt(Avis::getNote)
                    .average()
                    .orElse(0.0);
            lieu.setNoteMoyenne(moyenne);
        }
        lieuRepository.save(lieu);
    }

    private AvisDTO mapToDTO(Avis avis) {
        AvisDTO dto = new AvisDTO();
        dto.setId(avis.getId());
        dto.setNote(avis.getNote());
        dto.setCommentaire(avis.getCommentaire());
        dto.setAuteurNom(avis.getUtilisateur().getNom());
        dto.setAuteurPrenom(avis.getUtilisateur().getPrenom());
        dto.setCreatedAt(avis.getCreatedAt());
        return dto;
    }
}
