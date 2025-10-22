import { getPontos } from "@/controllers/ponto-controller";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectMongo from "@/services/mongodb";

// Rota para relatório de horas trabalhadas por período (apenas ADMIN)
export async function GET(req: NextRequest) {
  try {
    // Conectar ao banco
    await connectMongo();

    // Obter parâmetros de query (ex: ?start=2023-01-01&end=2023-01-31)
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Parâmetros 'start' e 'end' são obrigatórios (formato YYYY-MM-DD)." }, { status: 400 });
    }

    // Buscar todos os usuários
    const users = await User.find({});

    // Calcular relatório para cada usuário
    const report = [];
    for (const u of users) {
      // Buscar pontos do usuário no período
      const pontos = await getPontos(u._id.toString());
      if (pontos && typeof pontos === 'object' && 'dias' in pontos) {
        // Filtrar dias dentro do período
        const diasFiltrados = pontos.dias.filter((dia: any) => {
          return dia.data >= startDate && dia.data <= endDate;
        });

        // Somar horas dos dias filtrados
        const totalHorasPeriodo = diasFiltrados.reduce((sum: number, dia: any) => sum + dia.horasTrabalhadas, 0);

        report.push({
          userId: u._id,
          userName: u.name,
          userEmail: u.email,
          totalHoras: totalHorasPeriodo,
          dias: diasFiltrados
        });
      }
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json({ success: false, error: error });
  }
}
