import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";

    const where = category ? { category } : {};

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(settings);
  } catch (e) {
    console.error("Settings GET error:", e);
    return NextResponse.json(
      { error: "Erreur lors du chargement des paramètres" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: { category?: string; value?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    if (!body.category || !body.value) {
      return NextResponse.json(
        { error: "category and value are required" },
        { status: 400 }
      );
    }

    const trimmedValue = body.value.trim();
    if (trimmedValue.length === 0) {
      return NextResponse.json(
        { error: "La valeur ne peut pas être vide" },
        { status: 400 }
      );
    }

    const setting = await prisma.setting.create({
      data: {
        category: body.category,
        value: trimmedValue,
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (e: unknown) {
    console.error("Settings POST error:", e);
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Cette option existe déjà" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.setting.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Settings DELETE error:", e);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
