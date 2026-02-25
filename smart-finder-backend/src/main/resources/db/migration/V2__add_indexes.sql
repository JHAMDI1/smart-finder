-- =================================================================
-- SMART FINDER - DATABASE INDEXES (Performance Optimization)
-- =================================================================
-- Ces index sont essentiels pour le moteur de recherche JPA Specifications
-- Exécuter après la création des tables
-- =================================================================

-- Index pour la recherche par critère (lieu_critere table)
-- Accélère les requêtes: SELECT ... FROM lieu_critere WHERE lieu_id = ?
CREATE INDEX idx_lieu_critere_lieu_id ON lieu_critere(lieu_id);

-- Index pour la recherche par critère (lieu_critere table)
-- Accélère les requêtes: SELECT ... FROM lieu_critere WHERE critere_id = ?
CREATE INDEX idx_lieu_critere_critere_id ON lieu_critere(critere_id);

-- Index composite unique pour éviter les doublons
-- Un lieu ne peut avoir qu'une fois le même critère
CREATE UNIQUE INDEX idx_lieu_critere_unique ON lieu_critere(lieu_id, critere_id);

-- Index pour la recherche par nom de critère
-- Accélère: SELECT ... FROM critere WHERE nom = ?
CREATE INDEX idx_critere_nom ON critere(nom);

-- Index pour la recherche par catégorie de critère
-- Accélère: SELECT ... FROM critere WHERE categorie = ?
CREATE INDEX idx_critere_categorie ON critere(categorie);

-- Index pour le filtrage par note moyenne (ranking)
-- Accélère: SELECT ... FROM lieu WHERE note_moyenne >= ? ORDER BY note_moyenne DESC
CREATE INDEX idx_lieu_note_moyenne ON lieu(note_moyenne DESC);

-- Index pour la recherche textuelle sur le nom du lieu
-- Accélère: SELECT ... FROM lieu WHERE nom LIKE '%?%'
CREATE INDEX idx_lieu_nom ON lieu(nom);

-- Index pour la recherche par propriétaire
-- Accélère: SELECT ... FROM lieu WHERE proprietaire_id = ?
CREATE INDEX idx_lieu_proprietaire ON lieu(proprietaire_id);

-- Index pour la recherche d'avis par lieu
-- Accélère: SELECT ... FROM avis WHERE lieu_id = ?
CREATE INDEX idx_avis_lieu_id ON avis(lieu_id);

-- Index pour vérifier si un utilisateur a déjà donné un avis
-- Accélère: SELECT ... FROM avis WHERE lieu_id = ? AND utilisateur_id = ?
CREATE INDEX idx_avis_lieu_utilisateur ON avis(lieu_id, utilisateur_id);

-- Index pour la recherche par email (authentification)
-- Accélère: SELECT ... FROM utilisateur WHERE email = ?
CREATE UNIQUE INDEX idx_utilisateur_email ON utilisateur(email);

-- Index pour le filtrage par rôle
-- Accélère: SELECT ... FROM utilisateur WHERE role = ?
CREATE INDEX idx_utilisateur_role ON utilisateur(role);
