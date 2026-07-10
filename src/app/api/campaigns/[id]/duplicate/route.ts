import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const original = await prisma.campaign.findUnique({
    where: { id },
    include: { visuals: true },
  });

  if (!original) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const newCampaignId = `CAMP-${uuidv4().slice(0, 8).toUpperCase()}`;

  const duplicated = await prisma.campaign.create({
    data: {
      campaignId: newCampaignId,
      name: `${original.name} (Copy)`,
      platform: original.platform,
      status: "DRAFT",
      startDate: original.startDate,
      endDate: original.endDate,
      angle: original.angle,
      message: original.message,
      objective: original.objective,
      targetAudience: original.targetAudience,
      callToAction: original.callToAction,
      leads: original.leads,
      mql: original.mql,
      sql: original.sql,
      nq: original.nq,
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

  return NextResponse.json(duplicated, { status: 201 });
}
