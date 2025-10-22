import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/services/mongodb";
import User from "@/models/user";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role } = await req.json();
        if (!name || !email || !password || !role) {
            return NextResponse.json({ success: false, error: "Todos os campos são obrigatórios" });
        }

        await connectMongo();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "Usuário já existe" });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        return NextResponse.json({ success: true, data: newUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectMongo();

        const users = await User.find().select("-password");
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return NextResponse.json({ success: false, error: "Erro ao buscar usuários" });
    }
}

