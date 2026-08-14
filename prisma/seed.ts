import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const campaigns = [
    {
      campaignId: "CMP-2026-0001",
      name: "Centrale à béton - Promo Q1",
      platform: "META",
      status: "COMPLETED",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2025-12-31"),
      angle: "Promotion spéciale fin d'année sur nos centrales à béton fixes et modulaires",
      message:
        "Profitez de -15% sur toute la gamme de centrales à béton JS-series. Capacité de production de 25 à 120 m³/h. Installation clé en main incluse. Offre valable jusqu'au 31 décembre.",
      objective: "Génération de leads qualifiés pour centrales à béton",
      targetAudience: "Entreprises BTP, Bétonnières, Génie civil, Travaux publics",
      callToAction: "Demander un devis gratuit",
      leads: 1250,
      mql: 340,
      sql: 85,
      nq: 410,
      spend: 8500,
      notes: "Meilleure campagne Q4. Taux de conversion MQL/SQL de 25%. Marché cible : France métropolitaine et Maghreb.",
    },
    {
      campaignId: "CMP-2026-0002",
      name: "Centrale mobile - Google Ads",
      platform: "GOOGLE_SEARCH",
      status: "ACTIVE",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      angle: "Solutions de centrales mobiles pour chantiers temporaires",
      message:
        "Centrales mobiles prêtes à l'emploi en 48h. Idéal pour chantiers de courte durée et zones reculées. Autonomie complète avec groupe électrogène intégré. Devis en 24h.",
      objective: "Captation de intentions de recherche sur centrales mobiles",
      targetAudience: "Entreprises BTP, sous-traitants, chantiers ruraux",
      callToAction: "Obtenir un devis rapide",
      leads: 890,
      mql: 210,
      sql: 62,
      nq: 280,
      spend: 6200,
      notes: "Campagne en cours. CPC moyen 4.20€. Taux de clic 3.8%. À optimiser les mots-clés négatifs.",
    },
    {
      campaignId: "CMP-2026-0003",
      name: "Bétonnière industrielle - Meta",
      platform: "META",
      status: "ACTIVE",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-05-31"),
      angle: "Bétonnières industrielles haute performance pour chantiers exigeants",
      message:
        "Découvrez nos bétonnières industrielles de 350L à 750L. Mélange parfait garanti, robustesse extrême, maintenance réduite. Livraison gratuite en France. Testez avant d'acheter.",
      objective: "Notoriété de marque et leads pour bétonnières industrielles",
      targetAudience: "Artisans du BTP, PME construction, entreprises de travaux publics",
      callToAction: "Réserver une démonstration",
      leads: 670,
      mql: 180,
      sql: 48,
      nq: 195,
      spend: 4800,
      notes: "Bon engagement sur les visuels vidéo. Taux de rebond élevé sur la landing page - à corriger.",
    },
    {
      campaignId: "CMP-2026-0004",
      name: "Réactivation anciens leads",
      platform: "WHATSAPP",
      status: "COMPLETED",
      startDate: new Date("2025-11-10"),
      endDate: new Date("2026-01-10"),
      angle: "Relance personnalisée des contacts dormants avec offre exclusive",
      message:
        "Bonjour {prénom}, nous avons des nouvelles offres exclusives sur nos équipements de malaxage. En tant que client privilégié, bénéficiez de conditions préférentielles. Répondez pour en savoir plus.",
      objective: "Réactivation des leads qualifiés non convertis",
      targetAudience: "Anciens leads MQL/SQL, prospects chauds des 6 derniers mois",
      callToAction: "Répondre pour discuter",
      leads: 420,
      mql: 150,
      sql: 55,
      nq: 85,
      spend: 350,
      notes: "Excellent taux de réponse 35.7%. WhatsApp Business très efficace pour ce segment. Coût d'acquisition quasi nul.",
    },
    {
      campaignId: "CMP-2026-0005",
      name: "Équipements industriels - B2B",
      platform: "LINKEDIN",
      status: "ACTIVE",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-09-30"),
      angle: "Solutions complètes d'équipements pour l'industrie du béton",
      message:
        "LeadPulse Équipements accompagne les industriels du béton avec une gamme complète de centrales, bétonnières et systèmes de malaxage. Expertise depuis 15 ans. Certifié ISO 9001. Contactez nos ingénieurs.",
      objective: "Génération de leads B2B de haut niveau via LinkedIn",
      targetAudience: "Directeurs d'achat, chefs de projet, ingénieurs BTP, responsables production",
      callToAction: "Échanger avec un expert",
      leads: 310,
      mql: 95,
      sql: 38,
      nq: 62,
      spend: 7200,
      notes: "Campagne LinkedIn Ads ciblée. CPM élevé mais lead de qualité. Prioriser les connexions directes.",
    },
    {
      campaignId: "CMP-2026-0006",
      name: "Demande de proposition - Email",
      platform: "EMAIL",
      status: "PAUSED",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-07-31"),
      angle: "Envoi de propositions commerciales ciblées aux décideurs",
      message:
        "Objet : Votre prochain chantier mérite une centrale à la hauteur de vos ambitions. Madame, Monsieur, suite à votre récent besoin identifié, nous vous proposons une offre sur-mesure pour nos équipements de production de béton. Pièce jointe : catalogue + tarif dégressif.",
      objective: "Conversion directe via email de proposition commerciale",
      targetAudience: "Décideurs acheteurs, directeurs de production, chefs de projet BTP",
      callToAction: "Prendre rendez-vous",
      leads: 180,
      mql: 72,
      sql: 30,
      nq: 28,
      spend: 950,
      notes: "Campagne en pause pour rédaction des propositions personnalisées. Taux d'ouverture 42%. Reprendre en mai.",
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
