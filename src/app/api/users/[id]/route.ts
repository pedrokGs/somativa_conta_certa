import {
  deleteUser ,
  getUserById,
  updateUser,
} from "@/controllers/user-controller";
import { NextRequest, NextResponse } from "next/server";

interface Parametro {
  id: string;
}

//GET One
export async function GET({ params }: { params: Parametro }) {
  try {
    const { id } = params; //converte parametro em id
    const data = await getUserById(id); //busca o usuario pelo id
    if (!data) {
      //errro de não encontrado
      return NextResponse.json({ success: false, error: "Not Found" });
    } //se econtrado retorna o usuario
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    //erro de conexão
    return NextResponse.json({ success: false, error: error });
  }
}

// PATCH
export async function PATCH(
  { params }: { params: Parametro },
  req: NextRequest
) {
  try {
    const { id } = params; //converte parametro em id
    const data = await req.json(); //convert para json
    const usuarioAtualizado = await updateUser(id, data); //busca o usuario pelo id
    if (!data) {
      //errro de não encontrado
      return NextResponse.json({ success: false, error: "Not Found" });
    } //se econtrado retorna o usuario
    return NextResponse.json({ success: true, data: usuarioAtualizado });
  } catch (error) {
    //erro de conexão
    return NextResponse.json({ success: false, error: error });
  }
}

//DELETE

export async function DELETE({ params }: { params: Parametro }) {
  try {
    const { id } = params; //converte parametro em id
    await deleteUser(id); //deleta o usuario
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    //erro de conexão
    return NextResponse.json({ success: false, error: error });
  }
}