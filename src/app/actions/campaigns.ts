"use server";

import { prisma } from "@/lib/database";
import { CampaignFormData, DashboardFilters } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function createCampaign(data: CampaignFormData) {
  const campaign = await prisma.campaign.create({
    data: {
      campaignId: data.campaignId,
      name: data.name,
      platform: data.platform,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      angle: data.angle,
      cible: data.cible || null,
      objectif: data.objectif || null,
      region: data.region || null,
      countries: data.countries || null,
      message: data.message,
      headline: data.headline || null,
      description: data.description || null,
      visualType: data.visualType || null,
      callToAction: data.callToAction || null,
      destinationType: data.destinationType || null,
      destinationUrl: data.destinationUrl || null,
      objective: data.objective || null,
      targetAudience: data.targetAudience || null,
      leads: data.leads ?? 0,
      mql: data.mql ?? 0,
      sql: data.sql ?? 0,
      nq: data.nq ?? 0,
      spend: data.spend ?? 0,
      notes: data.notes || null,
    },
    include: { visuals: true },
  });

  return campaign;
}

export async function updateCampaign(id: string, data: CampaignFormData) {
  const campaign = await prisma.campaign.update({
    where: { id },
    data: {
      campaignId: data.campaignId,
      name: data.name,
      platform: data.platform,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      angle: data.angle,
      cible: data.cible || null,
      objectif: data.objectif || null,
      region: data.region || null,
      countries: data.countries || null,
      message: data.message,
      headline: data.headline || null,
      description: data.description || null,
      visualType: data.visualType || null,
      callToAction: data.callToAction || null,
      destinationType: data.destinationType || null,
      destinationUrl: data.destinationUrl || null,
      objective: data.objective || null,
      targetAudience: data.targetAudience || null,
      leads: data.leads ?? 0,
      mql: data.mql ?? 0,
      sql: data.sql ?? 0,
      nq: data.nq ?? 0,
      spend: data.spend ?? 0,
      notes: data.notes || null,
    },
    include: { visuals: true },
  });

  return campaign;
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({ where: { id } });
  return { success: true };
}

export async function duplicateCampaign(id: string) {
  const original = await prisma.campaign.findUnique({
    where: { id },
    include: { visuals: true },
  });

  if (!original) {
    throw new Error("Campaign not found");
  }

  const newCampaignId = `CMP-${uuidv4().slice(0, 8).toUpperCase()}`;

  const duplicated = await prisma.campaign.create({
    data: {
      campaignId: newCampaignId,
      name: `${original.name} (Copy)`,
      platform: original.platform,
      status: "DRAFT",
      startDate: original.startDate,
      endDate: original.endDate,
      angle: original.angle,
      cible: original.cible,
      objectif: original.objectif,
      region: original.region,
      countries: original.countries,
      message: original.message,
      headline: original.headline,
      description: original.description,
      visualType: original.visualType,
      callToAction: original.callToAction,
      destinationType: original.destinationType,
      destinationUrl: original.destinationUrl,
      objective: original.objective,
      targetAudience: original.targetAudience,
      leads: original.leads,
      mql: original.mql,
      sql: original.sql,
      nq: original.nq,
      spend: original.spend,
      notes: original.notes,
      visuals: {
        create: original.visuals.map((v: { imageUrl: string; fileName: string; altText: string | null; isPrimary: boolean }) => ({
          imageUrl: v.imageUrl,
          fileName: v.fileName,
          altText: v.altText,
          isPrimary: v.isPrimary,
        })),
      },
    },
    include: { visuals: true },
  });

  return duplicated;
}

export async function getCampaigns(filters?: DashboardFilters) {
  const where: Record<string, unknown> = {};

  if (filters) {
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { campaignId: { contains: filters.search } },
        { angle: { contains: filters.search } },
        { message: { contains: filters.search } },
      ];
    }

    if (filters.platform && filters.platform !== "ALL") {
      where.platform = filters.platform;
    }

    if (filters.status && filters.status !== "ALL") {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.startDate = {};
      const startField = where.startDate as Record<string, Date>;
      if (filters.dateFrom) {
        startField.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        startField.lte = new Date(filters.dateTo);
      }
    }
  }

  const sortBy = filters?.sortBy || "createdAt";
  const sortOrder = filters?.sortOrder || "desc";

  const validSortFields = [
    "name", "platform", "status", "startDate",
    "leads", "mql", "sql", "nq", "spend",
    "createdAt", "updatedAt",
  ];
  const orderByField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  const campaigns = await prisma.campaign.findMany({
    where,
    include: { visuals: true },
    orderBy: { [orderByField]: sortOrder },
  });

  return campaigns;
}

export async function getCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { visuals: true },
  });

  return campaign;
}
