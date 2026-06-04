-- ============================================
-- LogiEco — Schéma Supabase complet
-- AAPISE · 27 établissements
-- ============================================

-- Établissements
CREATE TABLE etablissements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,          -- ex: IME-01
  nom         TEXT NOT NULL,                 -- ex: IME La Colline
  adresse     TEXT,
  responsable TEXT,
  telephone   TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Fournisseurs
CREATE TYPE categorie_fournisseur AS ENUM ('EPI', 'MAINTENANCE', 'ENTRETIEN', 'BUREAUTIQUE');

CREATE TABLE fournisseurs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL,
  categorie       categorie_fournisseur NOT NULL,
  contact_nom     TEXT,
  contact_email   TEXT,
  contact_tel     TEXT,
  delai_livraison INT,                       -- jours ouvrés
  contrat         TEXT,
  statut          TEXT DEFAULT 'actif',      -- actif | inactif | consultation
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Commandes archivées
CREATE TYPE statut_commande AS ENUM ('en_cours', 'livre', 'archive', 'annule');

CREATE TABLE commandes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero            TEXT UNIQUE NOT NULL,    -- CMD-2024-0412
  etablissement_id  UUID REFERENCES etablissements(id),
  fournisseur_id    UUID REFERENCES fournisseurs(id),
  date_commande     DATE NOT NULL,
  date_livraison    DATE,
  montant_ht        DECIMAL(10,2),
  montant_ttc       DECIMAL(10,2),
  statut            statut_commande DEFAULT 'en_cours',
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Factures
CREATE TYPE statut_facture AS ENUM ('en_attente', 'payee', 'litige', 'archive');

CREATE TABLE factures (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero            TEXT UNIQUE NOT NULL,    -- FAC-2024-0892
  commande_id       UUID REFERENCES commandes(id),
  fournisseur_id    UUID REFERENCES fournisseurs(id),
  etablissement_id  UUID REFERENCES etablissements(id),
  date_facture      DATE NOT NULL,
  date_echeance     DATE,
  montant_ht        DECIMAL(10,2),
  montant_ttc       DECIMAL(10,2),
  statut            statut_facture DEFAULT 'en_attente',
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Bons de commande (en cours)
CREATE TYPE statut_bdc AS ENUM ('brouillon', 'a_valider', 'valide', 'envoye', 'cloture');

CREATE TABLE bons_de_commande (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero            TEXT UNIQUE NOT NULL,    -- BDC-2024-0001
  etablissement_id  UUID REFERENCES etablissements(id),
  fournisseur_id    UUID REFERENCES fournisseurs(id),
  date_besoin       DATE,
  montant_estime    DECIMAL(10,2),
  statut            statut_bdc DEFAULT 'brouillon',
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Lignes de BDC
CREATE TABLE lignes_bdc (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bdc_id          UUID REFERENCES bons_de_commande(id) ON DELETE CASCADE,
  reference       TEXT,
  designation     TEXT NOT NULL,
  quantite        INT NOT NULL DEFAULT 1,
  prix_unitaire   DECIMAL(10,2),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Catalogue articles / références
CREATE TYPE categorie_article AS ENUM ('EPI', 'MAINTENANCE', 'ENTRETIEN', 'BUREAUTIQUE', 'AUTRE');

CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference       TEXT UNIQUE NOT NULL,      -- EPI-0041
  designation     TEXT NOT NULL,
  categorie       categorie_article NOT NULL,
  fournisseur_id  UUID REFERENCES fournisseurs(id),
  prix_unitaire   DECIMAL(10,2),
  unite           TEXT DEFAULT 'unité',      -- boîte, litre, ramette…
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Stock logistique (entrepôt central)
CREATE TABLE stock_logistique (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id      UUID REFERENCES articles(id) UNIQUE,
  quantite        INT NOT NULL DEFAULT 0,
  seuil_alerte    INT DEFAULT 10,
  emplacement     TEXT,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Stock établissements
CREATE TABLE stock_etablissements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etablissement_id  UUID REFERENCES etablissements(id),
  article_id        UUID REFERENCES articles(id),
  quantite          INT NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(etablissement_id, article_id)
);

-- Mouvements de stock (traçabilité)
CREATE TYPE type_mouvement AS ENUM ('entree', 'sortie', 'transfert', 'inventaire');

CREATE TABLE mouvements_stock (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id            UUID REFERENCES articles(id),
  type_mouvement        type_mouvement NOT NULL,
  quantite              INT NOT NULL,
  etablissement_id      UUID REFERENCES etablissements(id),   -- null = entrepôt central
  commande_id           UUID REFERENCES commandes(id),
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Index utiles
-- ============================================
CREATE INDEX idx_commandes_etablissement ON commandes(etablissement_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_bdc_statut ON bons_de_commande(statut);
CREATE INDEX idx_stock_logi_article ON stock_logistique(article_id);
CREATE INDEX idx_stock_etab_etablissement ON stock_etablissements(etablissement_id);
CREATE INDEX idx_mouvements_article ON mouvements_stock(article_id);
CREATE INDEX idx_mouvements_date ON mouvements_stock(created_at);

-- ============================================
-- Vue : alertes stock logistique
-- ============================================
CREATE VIEW v_alertes_stock AS
SELECT
  a.reference,
  a.designation,
  a.categorie,
  sl.quantite,
  sl.seuil_alerte,
  sl.emplacement,
  (sl.quantite <= sl.seuil_alerte) AS en_alerte
FROM stock_logistique sl
JOIN articles a ON a.id = sl.article_id
ORDER BY en_alerte DESC, sl.quantite ASC;

-- ============================================
-- Données initiales : 27 établissements AAPISE
-- ============================================
INSERT INTO etablissements (code, nom) VALUES
  ('IME-01', 'IME La Colline'),
  ('IME-02', 'IME Les Acacias'),
  ('ESAT-01', 'ESAT Horizon'),
  ('ESAT-02', 'ESAT Le Verger'),
  ('MAS-01', 'MAS Les Pins'),
  ('MAS-02', 'MAS Saint-Joseph'),
  ('FAM-01', 'FAM Esperanza'),
  ('FAM-02', 'FAM Les Oliviers'),
  ('SESSAD-01', 'SESSAD Nord'),
  ('SESSAD-02', 'SESSAD Sud'),
  ('SESSAD-03', 'SESSAD Est'),
  ('ITEP-01', 'ITEP La Garrigue'),
  ('ITEP-02', 'ITEP Les Chênes'),
  ('CAMSP-01', 'CAMSP Centre'),
  ('CMPP-01', 'CMPP Ville'),
  ('FH-01', 'Foyer d''Hébergement Albert'),
  ('FH-02', 'Foyer d''Hébergement Bernard'),
  ('FH-03', 'Foyer d''Hébergement Claudine'),
  ('FAS-01', 'FAS Autonomie'),
  ('SAVS-01', 'SAVS Proximité'),
  ('UEMA-01', 'UEMA École Pasteur'),
  ('PEAD-01', 'PEAD Famille'),
  ('MECS-01', 'MECS Jeunesse'),
  ('MECS-02', 'MECS Avenir'),
  ('EAM-01', 'EAM Les Rives'),
  ('SIÈGE-01', 'Siège AAPISE'),
  ('LOG-01', 'Entrepôt Logistique');
