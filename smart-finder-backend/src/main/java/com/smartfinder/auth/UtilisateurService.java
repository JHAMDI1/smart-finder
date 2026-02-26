package com.smartfinder.auth;

import com.smartfinder.auth.dto.UtilisateurDTO;
import com.smartfinder.shared.exception.ResourceNotFoundException;
import com.smartfinder.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurDTO create(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new BusinessException("Email déjà utilisé");
        }
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public UtilisateurDTO findById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        return mapToDTO(utilisateur);
    }

    @Transactional(readOnly = true)
    public Optional<Utilisateur> findByEmailForAuth(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public UtilisateurDTO findByEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return mapToDTO(utilisateur);
    }

    @Transactional(readOnly = true)
    public List<UtilisateurDTO> findAll() {
        return utilisateurRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UtilisateurDTO update(Long id, Utilisateur utilisateurDetails) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateur.setNom(utilisateurDetails.getNom());
        utilisateur.setPrenom(utilisateurDetails.getPrenom());

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        return mapToDTO(updated);
    }

    public void delete(Long id) {
        utilisateurRepository.deleteById(id);
    }

    private UtilisateurDTO mapToDTO(Utilisateur utilisateur) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setEmail(utilisateur.getEmail());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setRole(utilisateur.getRole().name());
        return dto;
    }
}
