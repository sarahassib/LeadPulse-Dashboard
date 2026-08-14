-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "angle" TEXT NOT NULL,
    "cible" TEXT,
    "objectif" TEXT,
    "region" TEXT,
    "countries" TEXT,
    "message" TEXT NOT NULL,
    "headline" TEXT,
    "description" TEXT,
    "visualType" TEXT,
    "callToAction" TEXT,
    "destinationType" TEXT,
    "destinationUrl" TEXT,
    "objective" TEXT,
    "targetAudience" TEXT,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "mql" INTEGER NOT NULL DEFAULT 0,
    "sql" INTEGER NOT NULL DEFAULT 0,
    "nq" INTEGER NOT NULL DEFAULT 0,
    "spend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignVisual" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignVisual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignMetricEntry" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "mql" INTEGER NOT NULL DEFAULT 0,
    "sql" INTEGER NOT NULL DEFAULT 0,
    "nq" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignMetricEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignId_key" ON "Campaign"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMetricEntry_campaignId_date_key" ON "CampaignMetricEntry"("campaignId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_category_value_key" ON "Setting"("category", "value");

-- AddForeignKey
ALTER TABLE "CampaignVisual" ADD CONSTRAINT "CampaignVisual_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMetricEntry" ADD CONSTRAINT "CampaignMetricEntry_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
