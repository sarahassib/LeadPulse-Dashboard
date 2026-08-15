import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { visuals: true },
    });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json(campaign);
  } catch (err) {
    console.error("GET /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

function buildUpdateData(body: Record<string, unknown>) {
  const { visuals, ...data } = body;
  const updateData: Record<string, unknown> = {
    ...(data.campaignId !== undefined && { campaignId: data.campaignId }),
    ...(data.name !== undefined && { name: data.name }),
    ...(data.platform !== undefined && { platform: data.platform }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.startDate !== undefined && { startDate: new Date(data.startDate as string) }),
    ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate as string) : null }),
    ...(data.angle !== undefined && { angle: data.angle }),
    ...(data.cible !== undefined && { cible: data.cible || null }),
    ...(data.objectif !== undefined && { objectif: data.objectif || null }),
    ...(data.region !== undefined && { region: data.region || null }),
    ...(data.countries !== undefined && { countries: data.countries || null }),
    ...(data.message !== undefined && { message: data.message }),
    ...(data.headline !== undefined && { headline: data.headline || null }),
    ...(data.description !== undefined && { description: data.description || null }),
    ...(data.visualType !== undefined && { visualType: data.visualType || null }),
    ...(data.callToAction !== undefined && { callToAction: data.callToAction || null }),
    ...(data.destinationType !== undefined && { destinationType: data.destinationType || null }),
    ...(data.destinationUrl !== undefined && { destinationUrl: data.destinationUrl || null }),
    ...(data.objective !== undefined && { objective: data.objective || null }),
    ...(data.targetAudience !== undefined && { targetAudience: data.targetAudience || null }),
    ...(data.leads !== undefined && { leads: data.leads }),
    ...(data.mql !== undefined && { mql: data.mql }),
    ...(data.sql !== undefined && { sql: data.sql }),
    ...(data.nq !== undefined && { nq: data.nq }),
    ...(data.spend !== undefined && { spend: data.spend }),
    ...(data.notes !== undefined && { notes: data.notes || null }),
  };

  if (Array.isArray(visuals) && visuals.length > 0) {
    updateData.visuals = {
      create: visuals.map((v: { imageUrl: string; fileName: string; altText?: string; isPrimary?: boolean }) => ({
        imageUrl: v.imageUrl,
        fileName: v.fileName,
        altText: v.altText || null,
        isPrimary: v.isPrimary ?? false,
      })),
    };
  }

  return { updateData, hasVisuals: Array.isArray(visuals) };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { updateData, hasVisuals } = buildUpdateData(body);

    if (hasVisuals) {
      await prisma.campaignVisual.deleteMany({ where: { campaignId: id } });
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: { visuals: true },
    });

    return NextResponse.json(campaign);
  } catch (err) {
    console.error("PUT /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { updateData } = buildUpdateData(body);

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: { visuals: true },
    });

    return NextResponse.json(campaign);
  } catch (err) {
    console.error("PATCH /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
