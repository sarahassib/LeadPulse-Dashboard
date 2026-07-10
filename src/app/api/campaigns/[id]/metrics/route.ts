import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

async function recalculateCampaignTotals(campaignId: string) {
  const entries = await prisma.campaignMetricEntry.findMany({
    where: { campaignId },
  });
  const totals = entries.reduce(
    (acc, e) => ({
      leads: acc.leads + e.leads,
      mql: acc.mql + e.mql,
      sql: acc.sql + e.sql,
      nq: acc.nq + e.nq,
    }),
    { leads: 0, mql: 0, sql: 0, nq: 0 }
  );
  await prisma.campaign.update({
    where: { id: campaignId },
    data: totals,
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const entries = await prisma.campaignMetricEntry.findMany({
    where: { campaignId: id },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const { date, leads, mql, sql, nq, notes } = body;

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const entryDate = new Date(date);

  const entry = await prisma.campaignMetricEntry.upsert({
    where: {
      campaignId_date: { campaignId: id, date: entryDate },
    },
    update: {
      leads: leads ?? 0,
      mql: mql ?? 0,
      sql: sql ?? 0,
      nq: nq ?? 0,
      notes: notes ?? null,
    },
    create: {
      campaignId: id,
      date: entryDate,
      leads: leads ?? 0,
      mql: mql ?? 0,
      sql: sql ?? 0,
      nq: nq ?? 0,
      notes: notes ?? null,
    },
  });

  await recalculateCampaignTotals(id);

  return NextResponse.json(entry);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("entryId");

  if (!entryId) {
    return NextResponse.json({ error: "entryId is required" }, { status: 400 });
  }

  const entry = await prisma.campaignMetricEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry || entry.campaignId !== id) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  await prisma.campaignMetricEntry.delete({ where: { id: entryId } });
  await recalculateCampaignTotals(id);

  return NextResponse.json({ success: true });
}
