// rotas que não precisam de ID (GET / POST)

import {
  createPonto,
  getPontos,
} from "@/controllers/ponto-controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getPontos(); //busca todos as ordens
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newPonto = await createPonto(data);
    return NextResponse.json({ success: true, data: newPonto });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}