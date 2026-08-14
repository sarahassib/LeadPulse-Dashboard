# LeadPulse Analytics

Tableau de bord interne pour suivre les performances des campagnes marketing de LeadPulse.

## Stack technique

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes
- **React Hook Form** + **Zod** pour les formulaires
- **Prisma** + **SQLite** pour la base de données

## Installation

```bash
cd leadpulse-analytics
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

L'application sera disponible sur http://localhost:3000/dashboard

## Fonctionnalités

- **Dashboard principal** : KPIs globaux, graphiques comparatifs, tableau des campagnes
- **Création de campagne** : Formulaire complet avec validation Zod
- **Détail d'une campagne** : Métriques, diagnostic automatique, comparaison
- **Modification** : Édition complète de toutes les données
- **Suppression** : Avec confirmation
- **Duplication** : Copie rapide d'une campagne
- **Filtres** : Par plateforme, statut, période, recherche
- **Tri** : Par leads, MQL, SQL, taux de conversion
- **Graphiques** : Volumes, taux, funnel, répartition par plateforme

## Indicateurs calculés

- Taux MQL = MQL / Leads × 100
- Taux SQL global = SQL / Leads × 100
- Taux SQL depuis MQL = SQL / MQL × 100
- Taux NQ = NQ / Leads × 100
- Leads non classés = Leads - MQL - NQ

## Migration vers PostgreSQL

Pour migrer vers PostgreSQL :

1. Installer PostgreSQL et créer une base de données
2. Modifier `.env` :
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/leadpulse_analytics"
   ```
3. Modifier `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Exécuter :
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
