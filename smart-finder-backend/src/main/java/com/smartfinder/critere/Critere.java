package com.smartfinder.critere;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "critere")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Critere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    private String description;

    @Column(nullable = false)
    private String categorie;

    private String icon;

    @Builder.Default
    private Boolean actif = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "critere", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    @Builder.Default
    private Set<com.smartfinder.lieu.LieuCritere> lieuCriteres = new HashSet<>();
}
