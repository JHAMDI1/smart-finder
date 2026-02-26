package com.smartfinder.lieu;

import com.smartfinder.auth.Utilisateur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lieu")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, length = 500)
    private String adresse;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 8)
    private java.math.BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private java.math.BigDecimal longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;

    private String horaires;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "note_moyenne", precision = 3, scale = 2)
    private java.math.BigDecimal noteMoyenne;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    @Builder.Default
    private Set<LieuCritere> lieuCriteres = new HashSet<>();

    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    @Builder.Default
    private Set<com.smartfinder.avis.Avis> avis = new HashSet<>();
}
