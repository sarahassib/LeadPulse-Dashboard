import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed settings
  const settings = [
    { category: "ANGLE", value: "Promotion spéciale" },
    { category: "ANGLE", value: "Nouveauté produit" },
    { category: "ANGLE", value: "Témoignage client" },
    { category: "ANGLE", value: "Comparatif concurrent" },
    { category: "ANGLE", value: "Offre limitée" },
    { category: "ANGLE", value: "Sensibilisation marque" },
    { category: "CIBLE", value: "PME BTP" },
    { category: "CIBLE", value: "Sociétés de construction" },
    { category: "CIBLE", value: "Entreprises industrielles" },
    { category: "CIBLE", value: "Directeurs d'achat" },
    { category: "CIBLE", value: "Chefs de projet" },
    { category: "CIBLE", value: "Artisans du BTP" },
    { category: "OBJECTIF", value: "Génération de leads" },
    { category: "OBJECTIF", value: "Nurturing" },
    { category: "OBJECTIF", value: "Notoriété de marque" },
    { category: "OBJECTIF", value: "Conversion directe" },
    { category: "OBJECTIF", value: "Réactivation" },
    { category: "OBJECTIF", value: "Relance commerciale" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { category_value: s },
      update: s,
      create: s,
    });
  }

  // Seed campaigns
  const campaigns = [
    {
      campaignId: "CMP-2026-0001",
      name: "Centrale à béton - Promo Q1",
      platform: "META",
      status: "COMPLETED",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2025-12-31"),
      angle: "Promotion spéciale",
      cible: "PME BTP",
      objectif: "Génération de leads",
      region: "MAROC",
      countries: "",
      headline: "Offre exclusive sur nos centrales à béton",
      description: "Profitez de -15% sur toute la gamme",
      visualType: "CAROUSEL",
      callToAction: "Demander un devis",
      destinationType: "LANDING_PAGE",
      destinationUrl: "https://leadpulse.example.com/centrale-beton",
      message:
        "Profitez de -15% sur toute la gamme de centrales à béton JS-series. Capacité de production de 25 à 120 m³/h. Installation clé en main incluse. Offre valable jusqu'au 31 décembre.",
      objective: "Génération de leads qualifiés pour centrales à béton",
      targetAudience: "Entreprises BTP, Bétonnières, Génie civil, Travaux publics",
      leads: 1250,
      mql: 340,
      sql: 85,
      nq: 410,
      spend: 8500,
      notes: "Meilleure campagne Q4. Taux de conversion MQL/SQL de 25%.",
    },
    {
      campaignId: "CMP-2026-0002",
      name: "LeadPulse-B2B-GoogleAds",
      platform: "GOOGLE_SEARCH",
      status: "ACTIVE",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      angle: "Nouveauté produit",
      cible: "Chefs de projet",
      objectif: "Génération de leads",
      region: "AFRIQUE",
      countries: "Maroc,Sénégal,Côte d'Ivoire",
      headline: "Centrales mobiles prêtes à l'emploi",
      description: "Installation en 48h sur votre chantier",
      visualType: "SINGLE_IMAGE",
      callToAction: "Obtenir un devis rapide",
      destinationType: "WHATSAPP",
      destinationUrl: "https://wa.me/1234567890",
      message:
        "Centrales mobiles prêtes à l'emploi en 48h. Idéal pour chantiers de courte durée et zones reculées. Autonomie complète avec groupe électrogène intégré. Devis en 24h.",
      objective: "Captation de intentions de recherche sur centrales mobiles",
      targetAudience: "Entreprises BTP, sous-traitants, chantiers ruraux",
      leads: 890,
      mql: 210,
      sql: 62,
      nq: 280,
      spend: 6200,
      notes: "Campagne en cours. CPC moyen 4.20€.",
    },
    {
      campaignId: "CMP-2026-0003",
      name: "LeadPulse-Betonniere-Meta",
      platform: "META",
      status: "ACTIVE",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-05-31"),
      angle: "Témoignage client",
      cible: "Artisans du BTP",
      objectif: "Notoriété de marque",
      region: "MAROC",
      countries: "",
      headline: "Bétonnières industrielles haute performance",
      description: "De 350L à 750L - Livraison gratuite",
      visualType: "REEL",
      callToAction: "Réserver une démonstration",
      destinationType: "META_INSTANT_FORM",
      destinationUrl: "",
      message:
        "Découvrez nos bétonnières industrielles de 350L à 750L. Mélange parfait garanti, robustesse extrême, maintenance réduite. Livraison gratuite en France. Testez avant d'acheter.",
      objective: "Notoriété de marque et leads pour bétonnières industrielles",
      targetAudience: "Artisans du BTP, PME construction, entreprises de travaux publics",
      leads: 670,
      mql: 180,
      sql: 48,
      nq: 195,
      spend: 4800,
      notes: "Bon engagement sur les visuels vidéo.",
    },
    {
      campaignId: "CMP-2026-0004",
      name: "LeadPulse-Reactivate-Leads",
      platform: "WHATSAPP",
      status: "COMPLETED",
      startDate: new Date("2025-11-10"),
      endDate: new Date("2026-01-10"),
      angle: "Offre limitée",
      cible: "Directeurs d'achat",
      objectif: "Réactivation",
      region: "MAROC",
      countries: "",
      headline: "Offre exclusive pour nos clients fidèles",
      description: "Conditions préférentielles - Répondez maintenant",
      visualType: "SINGLE_IMAGE",
      callToAction: "Contacter nous",
      destinationType: "WHATSAPP",
      destinationUrl: "https://wa.me/1234567890",
      message:
        "Bonjour {prénom}, nous avons des nouvelles offres exclusives sur nos équipements de malaxage. En tant que client privilégié, bénéficiez de conditions préférentielles. Répondez pour en savoir plus.",
      objective: "Réactivation des leads qualifiés non convertis",
      targetAudience: "Anciens leads MQL/SQL, prospects chauds des 6 derniers mois",
      leads: 420,
      mql: 150,
      sql: 55,
      nq: 85,
      spend: 350,
      notes: "Excellent taux de réponse 35.7%.",
    },
    {
      campaignId: "CMP-2026-0005",
      name: "LeadPulse-LinkedIn-B2B",
      platform: "LINKEDIN",
      status: "ACTIVE",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-09-30"),
      angle: "Sensibilisation marque",
      cible: "Directeurs d'achat",
      objectif: "Conversion directe",
      region: "AFRIQUE",
      countries: "Cameroun,Gabon,Congo",
      headline: "Solutions complètes pour l'industrie du béton",
      description: "Expertise depuis 15 ans - Certifié ISO 9001",
      visualType: "SINGLE_IMAGE",
      callToAction: "Échanger avec un expert",
      destinationType: "WEBSITE",
      destinationUrl: "https://leadpulse.example.com/contact",
      message:
        "LeadPulse accompagne les industriels du béton avec une gamme complète de centrales, bétonnières et systèmes de malaxage. Expertise depuis 15 ans. Certifié ISO 9001. Contactez nos ingénieurs.",
      objective: "Génération de leads B2B de haut niveau via LinkedIn",
      targetAudience: "Directeurs d'achat, chefs de projet, ingénieurs BTP",
      leads: 310,
      mql: 95,
      sql: 38,
      nq: 62,
      spend: 7200,
      notes: "Campagne LinkedIn Ads ciblée. CPM élevé mais lead de qualité.",
    },
    {
      campaignId: "CMP-2026-0006",
      name: "LeadPulse-Email-Proposition",
      platform: "EMAIL",
      status: "PAUSED",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-07-31"),
      angle: "Comparatif concurrent",
      cible: "Directeurs d'achat",
      objectif: "Relance commerciale",
      region: "MAROC",
      countries: "",
      headline: "Votre prochain chantier mérite le meilleur",
      description: "Offre sur-mesure pour vos équipements",
      visualType: "SINGLE_IMAGE",
      callToAction: "Prendre rendez-vous",
      destinationType: "WEBSITE",
      destinationUrl: "https://leadpulse.example.com/devis",
      message:
        "Objet : Votre prochain chantier mérite une centrale à la hauteur de vos ambitions. Suite à votre récent besoin identifié, nous vous proposons une offre sur-mesure. Catalogue + tarif dégressif en pièce jointe.",
      objective: "Conversion directe via email de proposition commerciale",
      targetAudience: "Décideurs acheteurs, directeurs de production, chefs de projet BTP",
      leads: 180,
      mql: 72,
      sql: 30,
      nq: 28,
      spend: 950,
      notes: "Campagne en pause. Taux d'ouverture 42%.",
    },
  ];

  for (const data of campaigns) {
    const campaign = await prisma.campaign.upsert({
      where: { campaignId: data.campaignId },
      update: data,
      create: data,
    });

    await prisma.campaignVisual.deleteMany({ where: { campaignId: campaign.id } });
    await prisma.campaignVisual.createMany({
      data: [
        {
          campaignId: campaign.id,
          imageUrl: "/demo-visuals/placeholder-1.jpg",
          fileName: "placeholder-1.jpg",
          altText: `${data.name} - Visual principal`,
          isPrimary: true,
        },
        {
          campaignId: campaign.id,
          imageUrl: "/demo-visuals/placeholder-2.jpg",
          fileName: "placeholder-2.jpg",
          altText: `${data.name} - Visual secondaire`,
          isPrimary: false,
        },
      ],
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
