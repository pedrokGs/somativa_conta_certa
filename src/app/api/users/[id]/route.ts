import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/services/mongodb";
import User from "@/models/user";

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID não fornecido" }, { status: 400 });
    }

    await connectMongo();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ success: false, error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
