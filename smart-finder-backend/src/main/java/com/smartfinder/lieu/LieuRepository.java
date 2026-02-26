package com.smartfinder.lieu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LieuRepository extends JpaRepository<Lieu, Long>, JpaSpecificationExecutor<Lieu> {
    List<Lieu> findByProprietaireId(Long proprietaireId);

    @Query("SELECT l FROM Lieu l JOIN l.lieuCriteres lc WHERE lc.critere.id IN :critereIds GROUP BY l HAVING COUNT(DISTINCT lc.critere.id) >= :minMatches")
    List<Lieu> findByCriteriaIds(@Param("critereIds") List<Long> critereIds, @Param("minMatches") int minMatches);
}
