import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const platform = searchParams.get("platform") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const where: Prisma.CampaignWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { campaignId: { contains: search } },
        { angle: { contains: search } },
        { message: { contains: search } },
      ];
    }

    if (platform && platform !== "ALL") {
      where.platform = platform;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.startDate = {};
      if (dateFrom) {
        where.startDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.startDate.lte = new Date(dateTo);
      }
    }

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

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("GET /api/campaigns error:", err);
    return NextResponse.json({ error: "Erreur lors du chargement des campagnes", campaigns: [] }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.campaignVisual.deleteMany();
    await prisma.campaignMetricEntry.deleteMany();
    await prisma.campaign.deleteMany();
    return NextResponse.json({ success: true, message: "Toutes les campagnes supprimées" });
  } catch (err) {
    console.error("DELETE /api/campaigns error:", err);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.campaignId || !body.platform || !body.startDate) {
      return NextResponse.json(
        { error: "Champs requis manquants: name, campaignId, platform, startDate" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        campaignId: body.campaignId,
        name: body.name,
        platform: body.platform,
        status: body.status || "DRAFT",
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        angle: body.angle,
        cible: body.cible || null,
        objectif: body.objectif || null,
        region: body.region || null,
        countries: body.countries || null,
        message: body.message,
        headline: body.headline || null,
        description: body.description || null,
        visualType: body.visualType || null,
        callToAction: body.callToAction || null,
        destinationType: body.destinationType || null,
        destinationUrl: body.destinationUrl || null,
        objective: body.objective || null,
        targetAudience: body.targetAudience || null,
        leads: body.leads ?? 0,
        mql: body.mql ?? 0,
        sql: body.sql ?? 0,
        nq: body.nq ?? 0,
        spend: body.spend ?? 0,
        notes: body.notes || null,
        visuals: body.visuals
          ? {
              create: body.visuals.map((v: { imageUrl: string; fileName: string; altText?: string; isPrimary?: boolean }) => ({
                imageUrl: v.imageUrl,
                fileName: v.fileName,
                altText: v.altText || null,
                isPrimary: v.isPrimary ?? false,
              })),
            }
          : undefined,
      },
      include: { visuals: true },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (err) {
    console.error("POST /api/campaigns error:", err);
    const message = err instanceof Error ? err.message : "Erreur interne du serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
