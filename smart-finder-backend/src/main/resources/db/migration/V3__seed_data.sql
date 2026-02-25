-- =================================================================
-- SMART FINDER - SEED DATA (V3)
-- =================================================================
-- Données de test pour le développement
-- =================================================================

-- Insertion des critères (tags de recherche)
INSERT INTO critere (nom, description, categorie, icon, actif) VALUES
('wifi', 'Wi-Fi gratuit et stable', 'CONNECTIVITE', 'wifi', TRUE),
('wifi-rapide', 'Wi-Fi haut débit (>50 Mbps)', 'CONNECTIVITE', 'wifi', TRUE),
('prises', 'Prises électriques disponibles', 'CONNECTIVITE', 'plug', TRUE),
('calme', 'Ambiance calme et tranquille', 'AMBIANCE', 'volume-mute', TRUE),
('animé', 'Ambiance animée', 'AMBIANCE', 'users', TRUE),
('musique', 'Musique d ambiance', 'AMBIANCE', 'music', TRUE),
('lumiere-naturelle', 'Belle luminosité naturelle', 'AMBIANCE', 'sun', TRUE),
('climatisation', 'Climatisation', 'CONFORT', 'wind', TRUE),
('terrasse', 'Terrasse ou espace extérieur', 'CONFORT', 'cloud', TRUE),
('vue-panoramique', 'Vue panoramique', 'CONFORT', 'mountain', TRUE),
('accessibilite', 'Accessible PMR', 'SERVICES', 'wheelchair', TRUE),
(' parking', 'Parking à proximité', 'SERVICES', 'car', TRUE),
('vegan', 'Options vegan-friendly', 'SERVICES', 'leaf', TRUE),
('biologique', 'Produits bio', 'SERVICES', 'seedling', TRUE),
('ouvert-dimanche', 'Ouvert le dimanche', 'HORAIRES', 'calendar', TRUE),
('ouvert-tard', 'Ouvert tard le soir', 'HORAIRES', 'moon', TRUE),
('petit-dejeuner', 'Petit-déjeuner servi', 'RESTAURATION', 'coffee', TRUE),
('dejeuner', 'Menu déjeuner', 'RESTAURATION', 'utensils', TRUE),
('brunch', 'Brunch le weekend', 'RESTAURATION', 'glass-cheers', TRUE),
('snacks', 'Snacks disponibles', 'RESTAURATION', 'cookie', TRUE);

-- Insertion d'un utilisateur admin (password: admin123 - hashed in real app)
INSERT INTO utilisateur (email, password, nom, prenom, role) VALUES
('admin@smartfinder.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mqr', 'Admin', 'SmartFinder', 'ADMIN');

-- Insertion d'un utilisateur propriétaire
INSERT INTO utilisateur (email, password, nom, prenom, role) VALUES
('owner@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mqr', 'Dupont', 'Marie', 'OWNER');

-- Insertion d'un utilisateur normal
INSERT INTO utilisateur (email, password, nom, prenom, role) VALUES
('user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mqr', 'Martin', 'Jean', 'USER');

-- Insertion de lieux de coworking (Tunisie)
INSERT INTO lieu (nom, description, adresse, latitude, longitude, horaires_ouverture, site_web, telephone, proprietaire_id) VALUES
('Cogite', 'Espace de coworking convivial au cœur de Tunis. Ambiance créative et dynamique avec fibre optique.', 'Rue du Lac Biwa, Les Berges du Lac, Tunis', 36.8319, 10.2333, 'Lun-Ven: 8h-20h, Sam: 9h-18h', 'https://cogite.tn', '+216 71 000 001', 2),
('La Station', 'Ancienne station-service transformée en espace de coworking unique. Décor industriel et original.', 'Avenue de la Liberté, Mutuelleville, Tunis', 36.8189, 10.1797, 'Lun-Sam: 7h-22h, Dim: 9h-18h', 'https://lastation.tn', '+216 71 000 002', 2),
('Work Zone', 'Espace professionnel avec salles de réunion équipées. Idéal pour les réunions d affaires.', 'Centre Urbain Nord, Tunis', 36.8456, 10.1963, 'Lun-Ven: 8h30-19h', 'https://workzone.tn', '+216 71 000 003', 2),
('The Dot', 'Communauté créative dans un cadre inspirant. Ateliers et événements réguliers.', 'Sidi Bou Saïd, Tunis', 36.8709, 10.3414, 'Lun-Sam: 9h-21h', 'https://thedot.tn', '+216 71 000 004', 2),
('Kowork', 'Espace éco-responsable avec matériaux recyclés. Terrasse et jardin disponibles.', 'La Marsa, Tunis', 36.8896, 10.3219, 'Lun-Dim: 7h-23h', 'https://kowork.tn', '+216 71 000 005', 2);

-- Association des critères aux lieux
-- Cogite: wifi, wifi-rapide, prises, calme, climatisation, terrasse, petit-dejeuner, dejeuner
INSERT INTO lieu_critere (lieu_id, critere_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 9), (1, 10), (1, 16), (1, 17);

-- La Station: wifi, prises, animé, musique, lumiere-naturelle, terrasse, parking, brunch
INSERT INTO lieu_critere (lieu_id, critere_id) VALUES
(2, 1), (2, 3), (2, 5), (2, 6), (2, 7), (2, 10), (2, 12), (2, 18);

-- Work Zone: wifi-rapide, prises, calme, climatisation, parking, petit-dejeuner, dejeuner
INSERT INTO lieu_critere (lieu_id, critere_id) VALUES
(3, 2), (3, 3), (3, 4), (3, 9), (3, 12), (3, 16), (3, 17);

-- The Dot: wifi, prises, animé, lumiere-naturelle, terrasse, vue-panoramique, biologique, brunch
INSERT INTO lieu_critere (lieu_id, critere_id) VALUES
(4, 1), (4, 3), (4, 5), (4, 7), (4, 10), (4, 11), (4, 15), (4, 18);

-- Kowork: wifi, wifi-rapide, prises, calme, climatisation, terrasse, vegan, biologique, ouvert-dimanche, ouvert-tard
INSERT INTO lieu_critere (lieu_id, critere_id) VALUES
(5, 1), (5, 2), (5, 3), (5, 4), (5, 9), (5, 10), (5, 14), (5, 15), (5, 13), (5, 20);

-- Insertion d'avis
INSERT INTO avis (note, commentaire, utilisateur_id, lieu_id, created_at) VALUES
(5, 'Excellent espace, très professionnel et bien équipé. La fibre est super rapide !', 3, 1, NOW()),
(4, 'Ambiance sympa, j adore le concept de l ancienne station-service. Un peu bruyant parfois.', 3, 2, NOW()),
(5, 'Parfait pour les réunions d affaires. Salles bien équipées et service impeccable.', 3, 3, NOW()),
(4, 'Vue magnifique sur Sidi Bou Saïd. Très inspirant pour travailler.', 3, 4, NOW()),
(5, 'Espace éco-responsable très bien pensé. J adore la terrasse !', 3, 5, NOW());

