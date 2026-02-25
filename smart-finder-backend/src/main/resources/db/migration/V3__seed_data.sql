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
