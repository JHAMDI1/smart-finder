package com.smartfinder.config;

import com.smartfinder.auth.Utilisateur;
import com.smartfinder.auth.UtilisateurRepository;
import com.smartfinder.avis.Avis;
import com.smartfinder.avis.AvisRepository;
import com.smartfinder.critere.Critere;
import com.smartfinder.critere.CritereRepository;
import com.smartfinder.lieu.Lieu;
import com.smartfinder.lieu.LieuCritere;
import com.smartfinder.lieu.LieuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final UtilisateurRepository utilisateurRepository;
        private final CritereRepository critereRepository;
        private final LieuRepository lieuRepository;
        private final AvisRepository avisRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) {
                if (utilisateurRepository.count() > 0) {
                        log.info("Base de données déjà initialisée, skip du seeding.");
                        return;
                }

                log.info("=== Initialisation des données de test ===");

                // ── Users ──────────────────────────────────────────
                utilisateurRepository.save(Utilisateur.builder()
                                .nom("Admin").prenom("Super")
                                .email("admin@smartfinder.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(Utilisateur.Role.ADMIN)
                                .build());

                Utilisateur owner = utilisateurRepository.save(Utilisateur.builder()
                                .nom("Bensalem").prenom("Khalil")
                                .email("khalil@smartfinder.com")
                                .password(passwordEncoder.encode("owner123"))
                                .role(Utilisateur.Role.OWNER)
                                .build());

                Utilisateur user1 = utilisateurRepository.save(Utilisateur.builder()
                                .nom("Dupont").prenom("Marie")
                                .email("marie@test.com")
                                .password(passwordEncoder.encode("user1234"))
                                .role(Utilisateur.Role.USER)
                                .build());

                Utilisateur user2 = utilisateurRepository.save(Utilisateur.builder()
                                .nom("Martin").prenom("Thomas")
                                .email("thomas@test.com")
                                .password(passwordEncoder.encode("user1234"))
                                .role(Utilisateur.Role.USER)
                                .build());

                log.info("4 utilisateurs créés (admin / owner / 2 users)");

                // ── Critères ───────────────────────────────────────
                Critere wifi = saveCritere("WiFi Gratuit", "Connexion internet haut débit", "Connectivité", "wifi");
                Critere prises = saveCritere("Prises électriques", "Prises disponibles aux tables", "Connectivité",
                                "plug");
                Critere calme = saveCritere("Ambiance calme", "Espace silencieux pour travailler", "Ambiance",
                                "volume-off");
                Critere terrasse = saveCritere("Terrasse", "Espace extérieur disponible", "Espace", "sun");
                Critere parking = saveCritere("Parking", "Places de stationnement", "Accessibilité", "car");
                Critere climatisation = saveCritere("Climatisation", "Espace climatisé", "Confort", "thermometer");
                Critere cafe = saveCritere("Café de qualité", "Café artisanal et boissons premium", "Restauration",
                                "coffee");
                Critere coworking = saveCritere("Espace coworking", "Tables partagées et salles de réunion", "Espace",
                                "users");

                log.info("8 critères créés");

                // ── Lieux ──────────────────────────────────────────
                Lieu lieu1 = createLieu("Café Central", "12 Rue de la République, Tunis",
                                "Un café moderne avec une ambiance chaleureuse, idéal pour travailler ou se détendre. Le WiFi est rapide et les prises sont nombreuses.",
                                BigDecimal.valueOf(36.8065), BigDecimal.valueOf(10.1815),
                                owner, "Lun-Sam: 08:00-22:00 | Dim: 10:00-18:00",
                                BigDecimal.valueOf(4.5),
                                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, prises, cafe, climatisation));

                Lieu lieu2 = createLieu("WorkSpace+", "45 Avenue Habib Bourguiba, Tunis",
                                "Espace de coworking premium au cœur de la ville. Équipé de salles de réunion, d'un coin détente et d'un café intégré.",
                                BigDecimal.valueOf(36.7992), BigDecimal.valueOf(10.1802),
                                owner, "Lun-Ven: 07:00-21:00 | Sam: 09:00-17:00",
                                BigDecimal.valueOf(4.8),
                                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, prises, coworking, climatisation, calme));

                Lieu lieu3 = createLieu("Le Jardin Vert", "8 Rue des Fleurs, La Marsa",
                                "Café-restaurant avec un magnifique jardin extérieur. Parfait pour un brunch ou une après-midi de travail en plein air.",
                                BigDecimal.valueOf(36.8782), BigDecimal.valueOf(10.3247),
                                owner, "Tous les jours: 09:00-23:00",
                                BigDecimal.valueOf(4.2),
                                "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, terrasse, cafe, parking));

                Lieu lieu4 = createLieu("BiblioTech Hub", "22 Avenue de Paris, Tunis",
                                "Bibliothèque modernisée offrant des espaces de travail silencieux avec connexion internet. Idéal pour les étudiants et freelancers.",
                                BigDecimal.valueOf(36.8008), BigDecimal.valueOf(10.1865),
                                owner, "Lun-Sam: 08:00-20:00",
                                BigDecimal.valueOf(4.6),
                                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, prises, calme, climatisation, coworking));

                Lieu lieu5 = createLieu("Sunset Lounge", "15 Boulevard de l'Environnement, Lac 2",
                                "Lounge moderne avec vue sur le lac. Ambiance décontractée le jour, animée le soir. Idéal pour les meetups.",
                                BigDecimal.valueOf(36.8325), BigDecimal.valueOf(10.2330),
                                owner, "Tous les jours: 10:00-00:00",
                                BigDecimal.valueOf(3.9),
                                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, terrasse, parking, cafe));

                Lieu lieu6 = createLieu("Oasis Coworking", "Route de la Marsa, Tunis",
                                "Espace collaboratif très lumineux avec de grandes plantes d'intérieur et un wifi stable. Parfait pour les équipes créatives.",
                                BigDecimal.valueOf(36.8521), BigDecimal.valueOf(10.2730),
                                owner, "Lun-Ven: 08:00-19:00",
                                BigDecimal.valueOf(4.7),
                                "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, prises, coworking, climatisation));

                Lieu lieu7 = createLieu("CinéCafé", "Avenue de Carthage, Tunis",
                                "Un concept unique mêlant projections de films indépendants et café de spécialité. Ambiance tamisée très cosy.",
                                BigDecimal.valueOf(36.7975), BigDecimal.valueOf(10.1820),
                                owner, "Mar-Dim: 14:00-00:00",
                                BigDecimal.valueOf(4.3),
                                "https://images.unsplash.com/photo-1445116572660-236099cecd88?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, cafe, calme));

                Lieu lieu8 = createLieu("La Villa Blanche", "Sidi Bou Said",
                                "Villa traditionnelle transformée en espace d'étude et de lecture. Vue panoramique sur la mer Méditerranée.",
                                BigDecimal.valueOf(36.8705), BigDecimal.valueOf(10.3421),
                                owner, "Tous les jours: 09:00-20:00",
                                BigDecimal.valueOf(4.9),
                                "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
                                List.of(wifi, terrasse, calme, cafe));

                log.info("8 lieux créés avec critères et images");

                // ── Avis ───────────────────────────────────────────
                createAvis(lieu1, user1, 5,
                                "Excellent café ! WiFi rapide, ambiance au top. J'y travaille tous les jours.");
                createAvis(lieu1, user2, 4, "Très bon café, un peu bruyant le weekend mais sinon parfait pour bosser.");
                createAvis(lieu2, user1, 5, "Le meilleur coworking de Tunis. Les salles de réunion sont impeccables.");
                createAvis(lieu2, user2, 5, "Ambiance professionnelle, café gratuit et WiFi ultra rapide. Top !");
                createAvis(lieu3, user1, 4, "Le jardin est magnifique. Parfait pour travailler au calme en extérieur.");
                createAvis(lieu3, user2, 4,
                                "Super brunch ! Le WiFi est un peu instable mais l'endroit vaut le détour.");
                createAvis(lieu4, user1, 5, "Silence garanti, prises partout. Le paradis du freelancer.");
                createAvis(lieu4, user2, 4, "Très bon espace de travail. Manque juste un coin café.");
                createAvis(lieu5, user1, 4, "Belle vue, bonne ambiance. Un peu cher pour un café simple.");
                createAvis(lieu5, user2, 3, "Sympa pour un verre mais pas idéal pour travailler : trop de bruit.");
                createAvis(lieu6, user1, 5, "Un espace très apaisant. J'adore les plantes et la lumière naturelle !");
                createAvis(lieu7, user2, 4, "Concept génial, café excellent. Idéal pour une pause ciné.");
                createAvis(lieu8, user1, 5,
                                "La vue est incroyable. C'est l'endroit parfait pour trouver l'inspiration.");

                log.info("13 avis créés");
                log.info("=== Données de test initialisées avec succès ===");
                log.info("Comptes de test :");
                log.info("  Admin  → admin@smartfinder.com / admin123");
                log.info("  Owner  → khalil@smartfinder.com / owner123");
                log.info("  User 1 → marie@test.com / user1234");
                log.info("  User 2 → thomas@test.com / user1234");
        }

        private Critere saveCritere(String nom, String description, String categorie, String icon) {
                return critereRepository.save(Critere.builder()
                                .nom(nom)
                                .description(description)
                                .categorie(categorie)
                                .icon(icon)
                                .actif(true)
                                .build());
        }

        private Lieu createLieu(String nom, String adresse, String description,
                        BigDecimal lat, BigDecimal lng,
                        Utilisateur proprietaire, String horaires,
                        BigDecimal noteMoyenne, String imageUrl, List<Critere> criteres) {
                Lieu lieu = Lieu.builder()
                                .nom(nom)
                                .adresse(adresse)
                                .description(description)
                                .latitude(lat)
                                .longitude(lng)
                                .proprietaire(proprietaire)
                                .horaires(horaires)
                                .noteMoyenne(noteMoyenne)
                                .imageUrl(imageUrl)
                                .lieuCriteres(new HashSet<>())
                                .avis(new HashSet<>())
                                .build();

                lieu = lieuRepository.save(lieu);

                for (Critere c : criteres) {
                        LieuCritere lc = LieuCritere.builder()
                                        .lieu(lieu)
                                        .critere(c)
                                        .build();
                        lieu.getLieuCriteres().add(lc);
                }

                return lieuRepository.save(lieu);
        }

        private void createAvis(Lieu lieu, Utilisateur user, int note, String commentaire) {
                avisRepository.save(Avis.builder()
                                .lieu(lieu)
                                .utilisateur(user)
                                .note(note)
                                .commentaire(commentaire)
                                .build());
        }
}
