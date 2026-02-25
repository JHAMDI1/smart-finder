# 🖥️ Backend Development Guide

Guide complet pour le développement du backend Smart Finder avec Spring Boot.

---

## 📋 Table des Matières

- [Structure du Projet](#structure-du-projet)
- [Configuration](#configuration)
- [Entités JPA](#entités-jpa)
- [Repositories](#repositories)
- [Services](#services)
- [Controllers](#controllers)
- [DTOs et Mappers](#dtos-et-mappers)
- [Sécurité JWT](#sécurité-jwt)
- [Tests](#tests)

---

## 📁 Structure du Projet

```
smart-finder-backend/
├── src/
│   ├── main/
│   │   ├── java/com/smartfinder/
│   │   │   ├── SmartFinderApplication.java
│   │   │   │
│   │   │   ├── shared/                      # Code partagé
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── WebConfig.java
│   │   │   │   │   └── OpenApiConfig.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   └── util/
│   │   │   │       ├── JwtUtil.java
│   │   │   │       └── MapperUtil.java
│   │   │   │
│   │   │   ├── auth/                      # Feature: Auth
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── dto/
│   │   │   │       ├── LoginRequest.java
│   │   │   │       ├── RegisterRequest.java
│   │   │   │       └── AuthResponse.java
│   │   │   │
│   │   │   ├── lieu/                      # Feature: Lieux
│   │   │   │   ├── LieuController.java
│   │   │   │   ├── LieuService.java
│   │   │   │   ├── LieuRepository.java
│   │   │   │   ├── LieuSpecifications.java
│   │   │   │   ├── Lieu.java (Entity)
│   │   │   │   └── dto/
│   │   │   │       ├── LieuDTO.java
│   │   │   │       ├── LieuCreateRequest.java
│   │   │   │       └── LieuResponse.java
│   │   │   │
│   │   │   ├── critere/                   # Feature: Critères
│   │   │   │   ├── CritereController.java
│   │   │   │   ├── CritereService.java
│   │   │   │   ├── CritereRepository.java
│   │   │   │   ├── Critere.java (Entity)
│   │   │   │   └── dto/
│   │   │   │       └── CritereDTO.java
│   │   │   │
│   │   │   ├── avis/                      # Feature: Avis
│   │   │   │   ├── AvisController.java
│   │   │   │   ├── AvisService.java
│   │   │   │   ├── AvisRepository.java
│   │   │   │   ├── Avis.java (Entity)
│   │   │   │   └── dto/
│   │   │   │       └── AvisDTO.java
│   │   │   │
│   │   │   └── smartsearch/               # Feature: IA
│   │   │       ├── SmartSearchController.java
│   │   │       ├── SmartSearchService.java
│   │   │       ├── LLMService.java
│   │   │       ├── PromptBuilder.java
│   │   │       └── dto/
│   │   │           ├── SmartSearchRequest.java
│   │   │           └── SmartSearchResponse.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       ├── db/
│   │       │   └── migration/
│   │       │       ├── V1__init_schema.sql
│   │       │       └── V2__add_indexes.sql
│   │       └── prompts/
│   │           └── search-extraction.txt
│   │
│   └── test/
│       └── java/com/smartfinder/
│           ├── lieu/
│           │   └── LieuServiceTest.java
│           └── ...
│
├── pom.xml
├── mvnw
└── README.md
```

---

## ⚙️ Configuration

### pom.xml - Dépendances

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.smartfinder</groupId>
    <artifactId>smart-finder-backend</artifactId>
    <version>1.0.0</version>
    <name>Smart Finder Backend</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-mysql</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Utilities -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>
        
        <!-- API Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>1.18.30</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>1.5.5.Final</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 🗃️ Entités JPA

### Utilisateur

```java
package com.smartfinder.auth;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "utilisateur")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    public enum Role {
        USER, OWNER, ADMIN
    }
}
```

### Lieu

```java
package com.smartfinder.lieu;

import com.smartfinder.auth.Utilisateur;
import com.smartfinder.avis.Avis;
import com.smartfinder.critere.Critere;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lieu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    
    private Double latitude;
    
    private Double longitude;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;
    
    private String horaires;
    
    @Formula("(SELECT AVG(a.note) FROM avis a WHERE a.lieu_id = id)")
    private Double noteMoyenne;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "lieu_critere",
        joinColumns = @JoinColumn(name = "lieu_id"),
        inverseJoinColumns = @JoinColumn(name = "critere_id")
    )
    @Builder.Default
    private List<Critere> criteres = new ArrayList<>();
    
    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Avis> avis = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Critere

```java
package com.smartfinder.critere;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "critere")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Critere {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String nom;
    
    private String description;
    
    @Column(nullable = false)
    private String categorie;
    
    private String icon;
    
    @Builder.Default
    private Boolean actif = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Avis

```java
package com.smartfinder.avis;

import com.smartfinder.auth.Utilisateur;
import com.smartfinder.lieu.Lieu;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "avis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lieu_id", nullable = false)
    private Lieu lieu;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;
    
    @Column(nullable = false)
    @Min(1)
    @Max(5)
    private Integer note;
    
    @Column(columnDefinition = "TEXT")
    private String commentaire;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

---

## 💾 Repositories

### LieuRepository avec Specifications

```java
package com.smartfinder.lieu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LieuRepository extends JpaRepository<Lieu, Long>, 
                                         JpaSpecificationExecutor<Lieu> {
    
    List<Lieu> findByProprietaireId(Long proprietaireId);
    
    @Query("SELECT l FROM Lieu l JOIN l.criteres c WHERE c.nom = :critereNom")
    List<Lieu> findByCritereNom(@Param("critereNom") String critereNom);
    
    @Query("SELECT COUNT(a) FROM Avis a WHERE a.lieu.id = :lieuId")
    Long countAvisByLieuId(@Param("lieuId") Long lieuId);
}
```

### LieuSpecifications

```java
package com.smartfinder.lieu;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class LieuSpecifications {
    
    public static Specification<Lieu> hasCritere(String critereNom) {
        return (root, query, cb) -> {
            Join<Lieu, com.smartfinder.critere.Critere> critereJoin = 
                root.join("criteres", JoinType.INNER);
            return cb.equal(critereJoin.get("nom"), critereNom);
        };
    }
    
    public static Specification<Lieu> hasCriteres(List<String> criteresNoms) {
        return (root, query, cb) -> {
            Join<Lieu, com.smartfinder.critere.Critere> critereJoin = 
                root.join("criteres", JoinType.INNER);
            return critereJoin.get("nom").in(criteresNoms);
        };
    }
    
    public static Specification<Lieu> noteGreaterThan(Double minNote) {
        return (root, query, cb) -> 
            cb.greaterThanOrEqualTo(root.get("noteMoyenne"), minNote);
    }
    
    public static Specification<Lieu> nomContains(String search) {
        return (root, query, cb) -> 
            cb.like(cb.lower(root.get("nom")), "%" + search.toLowerCase() + "%");
    }
    
    public static Specification<Lieu> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("actif"));
    }
}
```

---

## 🔧 Services

### LieuService

```java
package com.smartfinder.lieu;

import com.smartfinder.lieu.dto.LieuCreateRequest;
import com.smartfinder.lieu.dto.LieuDTO;
import com.smartfinder.lieu.dto.LieuResponse;
import com.smartfinder.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LieuService {
    
    private final LieuRepository lieuRepository;
    private final CritereRepository critereRepository;
    private final LieuMapper lieuMapper;
    
    public Page<LieuResponse> findAll(Pageable pageable) {
        return lieuRepository.findAll(pageable)
            .map(lieuMapper::toResponse);
    }
    
    public LieuResponse findById(Long id) {
        Lieu lieu = lieuRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", id));
        return lieuMapper.toResponse(lieu);
    }
    
    @Transactional
    public LieuResponse create(LieuCreateRequest request, Long proprietaireId) {
        Lieu lieu = lieuMapper.toEntity(request);
        // Set proprietaire and criteres
        // ...
        Lieu saved = lieuRepository.save(lieu);
        return lieuMapper.toResponse(saved);
    }
    
    @Transactional
    public LieuResponse update(Long id, LieuCreateRequest request) {
        Lieu lieu = lieuRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", id));
        // Update fields
        // ...
        return lieuMapper.toResponse(lieu);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!lieuRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lieu", id);
        }
        lieuRepository.deleteById(id);
    }
    
    public Page<LieuResponse> search(SearchRequest request, Pageable pageable) {
        Specification<Lieu> spec = Specification.where(null);
        
        if (request.getCritereIds() != null && !request.getCritereIds().isEmpty()) {
            // Build specification based on criteria
        }
        
        // Add other filters
        
        return lieuRepository.findAll(spec, pageable)
            .map(lieuMapper::toResponse);
    }
}
```

---

## 🌐 Controllers

### LieuController

```java
package com.smartfinder.lieu;

import com.smartfinder.lieu.dto.LieuCreateRequest;
import com.smartfinder.lieu.dto.LieuResponse;
import com.smartfinder.lieu.dto.SearchRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lieux")
@RequiredArgsConstructor
@Tag(name = "Lieux", description = "API de gestion des lieux")
public class LieuController {
    
    private final LieuService lieuService;
    
    @GetMapping
    @Operation(summary = "Lister tous les lieux")
    public ResponseEntity<Page<LieuResponse>> findAll(Pageable pageable) {
        return ResponseEntity.ok(lieuService.findAll(pageable));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un lieu par ID")
    public ResponseEntity<LieuResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(lieuService.findById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Créer un nouveau lieu")
    public ResponseEntity<LieuResponse> create(
            @Valid @RequestBody LieuCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(lieuService.create(request));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Mettre à jour un lieu")
    public ResponseEntity<LieuResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LieuCreateRequest request) {
        return ResponseEntity.ok(lieuService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Supprimer un lieu")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lieuService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/search")
    @Operation(summary = "Rechercher des lieux avec filtres")
    public ResponseEntity<Page<LieuResponse>> search(
            @RequestBody SearchRequest request,
            Pageable pageable) {
        return ResponseEntity.ok(lieuService.search(request, pageable));
    }
}
```

---

## 📦 DTOs et Mappers

### DTOs

```java
// LieuCreateRequest.java
package com.smartfinder.lieu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class LieuCreateRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;
    
    private String description;
    private Double latitude;
    private Double longitude;
    private String horaires;
    private List<Long> critereIds;
}

// LieuResponse.java
package com.smartfinder.lieu.dto;

import com.smartfinder.critere.dto.CritereDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LieuResponse {
    private Long id;
    private String nom;
    private String adresse;
    private String description;
    private Double latitude;
    private Double longitude;
    private String horaires;
    private Double noteMoyenne;
    private List<CritereDTO> criteres;
    private LocalDateTime createdAt;
}
```

### Mapper (MapStruct)

```java
package com.smartfinder.lieu;

import com.smartfinder.lieu.dto.LieuCreateRequest;
import com.smartfinder.lieu.dto.LieuResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LieuMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "proprietaire", ignore = true)
    @Mapping(target = "criteres", ignore = true)
    @Mapping(target = "avis", ignore = true)
    @Mapping(target = "noteMoyenne", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Lieu toEntity(LieuCreateRequest request);
    
    LieuResponse toResponse(Lieu lieu);
}
```

---

## 🔒 Sécurité JWT

### JwtUtil

```java
package com.smartfinder.shared.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSignKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
            .claims(claims)
            .subject(subject)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSignKey())
            .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### SecurityConfig

```java
package com.smartfinder.shared.config;

import com.smartfinder.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/lieux/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/criteres").permitAll()
                .requestMatchers("/api/v1/criteres/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:4200",
            "https://smart-finder.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 🧪 Tests

### LieuServiceTest

```java
package com.smartfinder.lieu;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class LieuServiceTest {
    
    @Autowired
    private LieuService lieuService;
    
    @MockBean
    private LieuRepository lieuRepository;
    
    @Test
    void shouldFindLieuById() {
        // Given
        Long lieuId = 1L;
        Lieu lieu = Lieu.builder()
            .id(lieuId)
            .nom("Café Test")
            .build();
        
        when(lieuRepository.findById(lieuId)).thenReturn(Optional.of(lieu));
        
        // When
        LieuResponse result = lieuService.findById(lieuId);
        
        // Then
        assertNotNull(result);
        assertEquals("Café Test", result.getNom());
        verify(lieuRepository).findById(lieuId);
    }
    
    @Test
    void shouldThrowWhenLieuNotFound() {
        // Given
        Long lieuId = 999L;
        when(lieuRepository.findById(lieuId)).thenReturn(Optional.empty());
        
        // When/Then
        assertThrows(ResourceNotFoundException.class, () -> {
            lieuService.findById(lieuId);
        });
    }
}
```

---

## 🎯 Best Practices

### 1. **Transaction Management**
- Utiliser `@Transactional(readOnly = true)` sur les services de lecture
- Utiliser `@Transactional` sur les méthodes de modification
- Éviter les transactions longues

### 2. **Error Handling**
- Utiliser `@ControllerAdvice` pour le handling global
- Retourner des réponses cohérentes (Problem Detail RFC 7807)
- Logger les erreurs avec contexte

### 3. **Validation**
- Utiliser Jakarta Validation sur les DTOs
- Valider les inputs au niveau controller
- Valider les règles métier au niveau service

### 4. **Pagination**
- Toujours paginer les listes
- Utiliser `Pageable` et `Page<T>`
- Configurer des tailles de page par défaut

### 5. **Circuit Breaker (Resilience4j)**
- Protéger les appels externes (LLM API)
- Configurer fallback approprié
- Monitorer l'état du circuit breaker

---

## 🛡️ Resilience - Circuit Breaker (Module IA)

### Dépendance

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.1.0</version>
</dependency>
```

### Configuration

```yaml
# application.yml
resilience4j:
  circuitbreaker:
    instances:
      llm:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
  retry:
    instances:
      llm:
        maxAttempts: 3
        waitDuration: 1s
        exponentialBackoffMultiplier: 2
```

### Implémentation

```java
package com.smartfinder.smartsearch;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Slf4j
@Service
public class LLMService {
    
    @CircuitBreaker(name = "llm", fallbackMethod = "fallbackExtraction")
    @Retry(name = "llm")
    public LLMResponse extractCriteria(String userQuery) {
        // Appel API OpenAI/Claude
        return callLLMAPI(userQuery);
    }
    
    private LLMResponse fallbackExtraction(String userQuery, Exception ex) {
        log.warn("LLM API unavailable, using fallback extraction for: {}", userQuery);
        
        // Extraction simple par mots-clés
        List<String> keywords = Arrays.asList(userQuery.toLowerCase().split("\\s+"));
        List<String> matchedTags = availableCriteria.stream()
            .filter(c -> keywords.contains(c.getNom()))
            .map(Critere::getNom)
            .collect(Collectors.toList());
        
        return LLMResponse.builder()
            .tags(matchedTags)
            .confidence(matchedTags.isEmpty() ? 0.0 : 0.6)
            .explanation("Extraction par mots-clés (service IA indisponible)")
            .unknownCriteria(Collections.emptyList())
            .build();
    }
}
```

---

## 📚 Next Steps

- [Frontend Guide](../FRONTEND_GUIDE.md) - Développer l'interface Angular
- [Database Guide](../DATABASE.md) - Configurer MySQL et migrations
- [Smart Search](../SMART_SEARCH.md) - Implémenter le module IA

---

**Version** : 1.0  
**Last Updated** : Février 2026
