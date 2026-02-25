package com.smartfinder.critere;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CritereRepository extends JpaRepository<Critere, Long> {
    Optional<Critere> findByNom(String nom);
    List<Critere> findByActifTrue();
    List<Critere> findByCategorie(String categorie);
}
