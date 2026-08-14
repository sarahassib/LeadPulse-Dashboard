import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";

  const where = category ? { category } : {};

  const settings = await prisma.setting.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.category || !body.value) {
    return NextResponse.json(
      { error: "category and value are required" },
      { status: 400 }
    );
  }

  try {
    const setting = await prisma.setting.create({
      data: {
        category: body.category,
        value: body.value,
      },
    });
    return NextResponse.json(setting, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Cette option existe déjà" },
        { status: 409 }
      );
    }
    throw e;
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await prisma.setting.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
