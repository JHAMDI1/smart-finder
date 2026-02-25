package com.smartfinder.lieu;

import com.smartfinder.critere.Critere;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class LieuSpecifications {

    public static Specification<Lieu> hasCritere(String critereNom) {
        return (root, query, criteriaBuilder) -> {
            Join<Lieu, LieuCritere> lieuCritereJoin = root.join("lieuCriteres", JoinType.INNER);
            Join<LieuCritere, Critere> critereJoin = lieuCritereJoin.join("critere", JoinType.INNER);
            return criteriaBuilder.equal(critereJoin.get("nom"), critereNom);
        };
    }

    public static Specification<Lieu> hasCriteres(List<String> critereNoms) {
        return (root, query, criteriaBuilder) -> {
            Join<Lieu, LieuCritere> lieuCritereJoin = root.join("lieuCriteres", JoinType.INNER);
            Join<LieuCritere, Critere> critereJoin = lieuCritereJoin.join("critere", JoinType.INNER);
            return critereJoin.get("nom").in(critereNoms);
        };
    }

    public static Specification<Lieu> hasCritereIds(List<Long> critereIds) {
        return (root, query, criteriaBuilder) -> {
            Join<Lieu, LieuCritere> lieuCritereJoin = root.join("lieuCriteres", JoinType.INNER);
            return lieuCritereJoin.get("critere").get("id").in(critereIds);
        };
    }

    public static Specification<Lieu> noteGreaterThan(Double minNote) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.greaterThanOrEqualTo(root.get("noteMoyenne"), minNote);
    }

    public static Specification<Lieu> nomContains(String search) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.like(
                criteriaBuilder.lower(root.get("nom")), 
                "%" + search.toLowerCase() + "%"
            );
    }

    public static Specification<Lieu> buildSearchSpecification(List<Long> critereIds, Double minNote, String search) {
        Specification<Lieu> spec = Specification.where(null);
        
        if (critereIds != null && !critereIds.isEmpty()) {
            spec = spec.and(hasCritereIds(critereIds));
        }
        
        if (minNote != null) {
            spec = spec.and(noteGreaterThan(minNote));
        }
        
        if (search != null && !search.isEmpty()) {
            spec = spec.and(nomContains(search));
        }
        
        return spec;
    }
}
