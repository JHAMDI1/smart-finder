package com.smartfinder.avis;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvisRepository extends JpaRepository<Avis, Long> {
    List<Avis> findByLieuId(Long lieuId);
    Optional<Avis> findByLieuIdAndUtilisateurId(Long lieuId, Long utilisateurId);
}
