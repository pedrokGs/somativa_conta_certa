import {
  deletePonto,
  getPontoById,
  updatePonto,
} from "@/controllers/ponto-controller";
import { NextRequest, NextResponse } from "next/server";

interface Parametro {
  id: string;
}

//PATCH
export async function PATCH(
  req: NextRequest,
  { params }: { params: Parametro }
) {
  try {
    const { id } = params;
    const data = await req.json();
    const OrdemServicoAtualizado = await updatePonto(id, data);
    if (!OrdemServicoAtualizado) {
      return NextResponse.json({ success: false, error: "Not Found" });
    }
    return NextResponse.json({ success: true, data: OrdemServicoAtualizado });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

//GET(one)
export async function GET({ params }: { params: Parametro }) {
  try {
    const { id } = params;
    const data = await getPontoById(id);
    if (!data) {
      return NextResponse.json({ success: false, error: "Not Found" });
    }
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

//DELETE
export async function DELETE({ params }: { params: Parametro }) {
  try {
    const { id } = params;
    await deletePonto(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}