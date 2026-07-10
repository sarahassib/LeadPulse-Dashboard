import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { visuals: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const { visuals, ...data } = body;

  const updateData: Record<string, unknown> = {
    ...(data.campaignId !== undefined && { campaignId: data.campaignId }),
    ...(data.name !== undefined && { name: data.name }),
    ...(data.platform !== undefined && { platform: data.platform }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
    ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
    ...(data.angle !== undefined && { angle: data.angle }),
    ...(data.message !== undefined && { message: data.message }),
    ...(data.objective !== undefined && { objective: data.objective || null }),
    ...(data.targetAudience !== undefined && { targetAudience: data.targetAudience || null }),
    ...(data.callToAction !== undefined && { callToAction: data.callToAction || null }),
    ...(data.leads !== undefined && { leads: data.leads }),
    ...(data.mql !== undefined && { mql: data.mql }),
    ...(data.sql !== undefined && { sql: data.sql }),
    ...(data.nq !== undefined && { nq: data.nq }),
    ...(data.notes !== undefined && { notes: data.notes || null }),
  };

  if (Array.isArray(visuals) && visuals.length > 0) {
    await prisma.campaignVisual.deleteMany({ where: { campaignId: id } });
    updateData.visuals = {
      create: visuals.map((v: { imageUrl: string; fileName: string; altText?: string; isPrimary?: boolean }) => ({
        imageUrl: v.imageUrl,
        fileName: v.fileName,
        altText: v.altText || null,
        isPrimary: v.isPrimary ?? false,
      })),
    };
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: updateData,
    include: { visuals: true },
  });

  return NextResponse.json(campaign);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  await prisma.campaign.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
