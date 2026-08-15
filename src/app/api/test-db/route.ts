import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL || "NOT SET";
  const masked = url.replace(/:([^@]+)@/, ":***@");

  const results: Record<string, unknown> = {
    DATABASE_URL_masked: masked,
    has_pooler: url.includes("pooler"),
    has_port_6543: url.includes("6543"),
    has_sslmode: url.includes("sslmode"),
    username_part: url.split("//")[1]?.split(":")[0] || "unknown",
  };

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const start = Date.now();
    const rows = await prisma.$queryRaw`SELECT 1 as test`;
    const ms = Date.now() - start;
    results.connection = "SUCCESS";
    results.latency_ms = ms;
    results.rows = rows;
    await prisma.$disconnect();
  } catch (e: unknown) {
    results.connection = "FAILED";
    results.error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
