-- Seed Settings
INSERT INTO "Setting" ("id", "category", "value", "createdAt") VALUES
('s1', 'ANGLE', 'Promotion spéciale', NOW()),
('s2', 'ANGLE', 'Nouveauté produit', NOW()),
('s3', 'ANGLE', 'Témoignage client', NOW()),
('s4', 'ANGLE', 'Comparatif concurrent', NOW()),
('s5', 'ANGLE', 'Offre limitée', NOW()),
('s6', 'ANGLE', 'Sensibilisation marque', NOW()),
('s7', 'CIBLE', 'PME BTP', NOW()),
('s8', 'CIBLE', 'Sociétés de construction', NOW()),
('s9', 'CIBLE', 'Entreprises industrielles', NOW()),
('s10', 'CIBLE', 'Directeurs d''achat', NOW()),
('s11', 'CIBLE', 'Chefs de projet', NOW()),
('s12', 'CIBLE', 'Artisans du BTP', NOW()),
('s13', 'OBJECTIF', 'Génération de leads', NOW()),
('s14', 'OBJECTIF', 'Nurturing', NOW()),
('s15', 'OBJECTIF', 'Notoriété de marque', NOW()),
('s16', 'OBJECTIF', 'Conversion directe', NOW()),
('s17', 'OBJECTIF', 'Réactivation', NOW()),
('s18', 'OBJECTIF', 'Relance commerciale', NOW())
ON CONFLICT ("category", "value") DO NOTHING;

-- Seed Campaigns
INSERT INTO "Campaign" ("id", "campaignId", "name", "platform", "status", "startDate", "endDate", "angle", "cible", "objectif", "region", "countries", "message", "headline", "description", "visualType", "callToAction", "destinationType", "destinationUrl", "objective", "targetAudience", "leads", "mql", "sql", "nq", "spend", "notes", "createdAt", "updatedAt") VALUES
('c1', 'CMP-2026-0001', 'Centrale à béton - Promo Q1', 'META', 'COMPLETED', '2025-10-01', '2025-12-31', 'Promotion spéciale', 'PME BTP', 'Génération de leads', 'MAROC', '', 'Profitez de -15% sur toute la gamme de centrales à béton JS-series. Capacité de production de 25 à 120 m³/h. Installation clé en main incluse. Offre valable jusqu''au 31 décembre.', 'Offre exclusive sur nos centrales à béton', 'Profitez de -15% sur toute la gamme', 'CAROUSEL', 'Demander un devis', 'LANDING_PAGE', 'https://leadpulse.example.com/centrale-beton', 'Génération de leads qualifiés pour centrales à béton', 'Entreprises BTP, Bétonnières, Génie civil, Travaux publics', 1250, 340, 85, 410, 8500, 'Meilleure campagne Q4. Taux de conversion MQL/SQL de 25%.', NOW(), NOW()),
('c2', 'CMP-2026-0002', 'LeadPulse-B2B-GoogleAds', 'GOOGLE_SEARCH', 'ACTIVE', '2026-01-15', '2026-06-30', 'Nouveauté produit', 'Chefs de projet', 'Génération de leads', 'AFRIQUE', 'Maroc,Sénégal,Côte d''Ivoire', 'Centrales mobiles prêtes à l''emploi en 48h. Idéal pour chantiers de courte durée et zones reculées. Autonomie complète avec groupe électrogène intégré. Devis en 24h.', 'Centrales mobiles prêtes à l''emploi', 'Installation en 48h sur votre chantier', 'SINGLE_IMAGE', 'Obtenir un devis rapide', 'WHATSAPP', 'https://wa.me/1234567890', 'Captation de intentions de recherche sur centrales mobiles', 'Entreprises BTP, sous-traitants, chantiers ruraux', 890, 210, 62, 280, 6200, 'Campagne en cours. CPC moyen 4.20€.', NOW(), NOW()),
('c3', 'CMP-2026-0003', 'LeadPulse-Betonniere-Meta', 'META', 'ACTIVE', '2026-02-01', '2026-05-31', 'Témoignage client', 'Artisans du BTP', 'Notoriété de marque', 'MAROC', '', 'Découvrez nos bétonnières industrielles de 350L à 750L. Mélange parfait garanti, robustesse extrême, maintenance réduite. Livraison gratuite en France. Testez avant d''acheter.', 'Bétonnières industrielles haute performance', 'De 350L à 750L - Livraison gratuite', 'REEL', 'Réserver une démonstration', 'META_INSTANT_FORM', '', 'Notoriété de marque et leads pour bétonnières industrielles', 'Artisans du BTP, PME construction, entreprises de travaux publics', 670, 180, 48, 195, 4800, 'Bon engagement sur les visuels vidéo.', NOW(), NOW()),
('c4', 'CMP-2026-0004', 'LeadPulse-Reactivate-Leads', 'WHATSAPP', 'COMPLETED', '2025-11-10', '2026-01-10', 'Offre limitée', 'Directeurs d''achat', 'Réactivation', 'MAROC', '', 'Bonjour {prénom}, nous avons des nouvelles offres exclusives sur nos équipements de malaxage. En tant que client privilégié, bénéficiez de conditions préférentielles. Répondez pour en savoir plus.', 'Offre exclusive pour nos clients fidèles', 'Conditions préférentielles - Répondez maintenant', 'SINGLE_IMAGE', 'Contacter nous', 'WHATSAPP', 'https://wa.me/1234567890', 'Réactivation des leads qualifiés non convertis', 'Anciens leads MQL/SQL, prospects chauds des 6 derniers mois', 420, 150, 55, 85, 350, 'Excellent taux de réponse 35.7%.', NOW(), NOW()),
('c5', 'CMP-2026-0005', 'LeadPulse-LinkedIn-B2B', 'LINKEDIN', 'ACTIVE', '2026-03-01', '2026-09-30', 'Sensibilisation marque', 'Directeurs d''achat', 'Conversion directe', 'AFRIQUE', 'Cameroun,Gabon,Congo', 'LeadPulse accompagne les industriels du béton avec une gamme complète de centrales, bétonnières et systèmes de malaxage. Expertise depuis 15 ans. Certifié ISO 9001. Contactez nos ingénieurs.', 'Solutions complètes pour l''industrie du béton', 'Expertise depuis 15 ans - Certifié ISO 9001', 'SINGLE_IMAGE', 'Échanger avec un expert', 'WEBSITE', 'https://leadpulse.example.com/contact', 'Génération de leads B2B de haut niveau via LinkedIn', 'Directeurs d''achat, chefs de projet, ingénieurs BTP', 310, 95, 38, 62, 7200, 'Campagne LinkedIn Ads ciblée. CPM élevé mais lead de qualité.', NOW(), NOW()),
('c6', 'CMP-2026-0006', 'LeadPulse-Email-Proposition', 'EMAIL', 'PAUSED', '2026-04-01', '2026-07-31', 'Comparatif concurrent', 'Directeurs d''achat', 'Relance commerciale', 'MAROC', '', 'Objet : Votre prochain chantier mérite une centrale à la hauteur de vos ambitions. Suite à votre récent besoin identifié, nous vous proposons une offre sur-mesure. Catalogue + tarif dégressif en pièce jointe.', 'Votre prochain chantier mérite le meilleur', 'Offre sur-mesure pour vos équipements', 'SINGLE_IMAGE', 'Prendre rendez-vous', 'WEBSITE', 'https://leadpulse.example.com/devis', 'Conversion directe via email de proposition commerciale', 'Décideurs acheteurs, directeurs de production, chefs de projet BTP', 180, 72, 30, 28, 950, 'Campagne en pause. Taux d''ouverture 42%.', NOW(), NOW())
ON CONFLICT ("campaignId") DO NOTHING;

-- Seed Campaign Visuals
INSERT INTO "CampaignVisual" ("id", "campaignId", "imageUrl", "fileName", "altText", "isPrimary", "createdAt") VALUES
('v1', 'c1', '/demo-visuals/placeholder-1.jpg', 'placeholder-1.jpg', 'Centrale à béton - Promo Q1 - Visual principal', true, NOW()),
('v2', 'c1', '/demo-visuals/placeholder-2.jpg', 'placeholder-2.jpg', 'Centrale à béton - Promo Q1 - Visual secondaire', false, NOW()),
('v3', 'c2', '/demo-visuals/placeholder-1.jpg', 'placeholder-1.jpg', 'LeadPulse-B2B-GoogleAds - Visual principal', true, NOW()),
('v4', 'c2', '/demo-visuals/placeholder-2.jpg', 'placeholder-2.jpg', 'LeadPulse-B2B-GoogleAds - Visual secondaire', false, NOW()),
('v5', 'c3', '/demo-visuals/placeholder-1.jpg', 'placeholder-1.jpg', 'LeadPulse-Betonniere-Meta - Visual principal', true, NOW()),
('v6', 'c3', '/demo-visuals/placeholder-2.jpg', 'placeholder-2.jpg', 'LeadPulse-Betonniere-Meta - Visual secondaire', false, NOW()),
('v7', 'c4', '/demo-visuals/placeholder-1.jpg', 'placeholder-1.jpg', 'LeadPulse-Reactivate-Leads - Visual principal', true, NOW()),
('v8', 'c4', '/demo-visuals/placeholder-2.jpg', 'placeholder-2.jpg', 'LeadPulse-Reactivate-Leads - Visual secondaire', false, NOW()),
('v9', 'c5', '/demo-visuals/placeholder-1.jpg', 'placeholder-1.jpg', 'LeadPulse-LinkedIn-B2B - Visual principal', true, NOW()),
('v10', 'c5', '/demo-visuals/placeholder-2.jpg', 'placeholder-2.jpg', 'LeadPulse-LinkedIn-B2B - Visual secondaire', false, NOW()),
('v11', 'c6', '/demo-visuals/placeholder-1.jpg', 'placeholder-1.jpg', 'LeadPulse-Email-Proposition - Visual principal', true, NOW()),
('v12', 'c6', '/demo-visuals/placeholder-2.jpg', 'placeholder-2.jpg', 'LeadPulse-Email-Proposition - Visual secondaire', false, NOW())
ON CONFLICT DO NOTHING;
