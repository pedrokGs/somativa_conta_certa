//listar todos os Ponto

import Ponto, { IPonto } from "@/models/ponto";
import connectMongo from "@/services/mongodb";
import { PontoType } from "@/common/enums/ponto-type";

//export arrow function
export const getPontos = async (userId?: string) => {
  //conectar com banco
  await connectMongo();
  //solicitação para o MongoDB
  let query = {};
  if (userId) {
    query = { userId }; // Filtrar por userId se fornecido
  }
  const pontos = await Ponto.find(query).sort({ clockTime: 1 }); // Ordenar por clockTime ascendente

  // Calcular horas trabalhadas se filtrado por userId
  if (userId) {
    return calcularHorasTrabalhadas(pontos);
  }

  return pontos;
};

// Função auxiliar para calcular horas trabalhadas
function calcularHorasTrabalhadas(pontos: IPonto[]) {
  const pontosPorDia: { [key: string]: IPonto[] } = {};

  // Agrupar pontos por dia
  pontos.forEach(ponto => {
    const data = ponto.clockTime.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!pontosPorDia[data]) {
      pontosPorDia[data] = [];
    }
    pontosPorDia[data].push(ponto);
  });

  let totalHoras = 0;
  const dias: any[] = [];

  // Calcular horas por dia
  Object.keys(pontosPorDia).forEach(data => {
    const pontosDia = pontosPorDia[data].sort((a, b) => a.clockTime.getTime() - b.clockTime.getTime());
    let horasDia = 0;
    let entrada: Date | null = null;

    pontosDia.forEach(ponto => {
      if (ponto.type === PontoType.ENTRADA.toString()) {
        entrada = ponto.clockTime;
      } else if (ponto.type === PontoType.SAIDA.toString() && entrada) {
        const diffMs = ponto.clockTime.getTime() - entrada.getTime();
        horasDia += diffMs / (1000 * 60 * 60); // Converter para horas
        entrada = null; // Reset para próxima entrada
      }
    });

    totalHoras += horasDia;
    dias.push({
      data,
      pontos: pontosDia,
      horasTrabalhadas: horasDia
    });
  });

  return {
    pontos,
    totalHoras,
    dias
  };
}

//listar um unico Usuário
export async function getPontoById(id: string) {
  await connectMongo();
  const ponto = await Ponto.findById(id);
  return ponto;
}

//criar Usuário com sugestão de tipo
export async function createPonto(data: Partial<IPonto>) {
  await connectMongo();

  // Validar se userId existe
  if (!data.userId) {
    throw new Error("userId é obrigatório");
  }

  // Buscar último ponto do dia do usuário
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const ultimoPonto = await Ponto.findOne({
    userId: data.userId,
    clockTime: { $gte: hoje, $lt: amanha }
  }).sort({ clockTime: -1 });

  let sugestaoTipo: PontoType = PontoType.ENTRADA;

  if (ultimoPonto) {
    sugestaoTipo = ultimoPonto.type === "ENTRADA" ? PontoType.SAIDA : PontoType.ENTRADA;
  }


  // Se tipo não fornecido, usar sugestão
  if (!data.type) {
    data.type = sugestaoTipo.toString();
  }

  const novoPonto = new Ponto(data);
  const novoPontoId = await novoPonto.save();

  return {
    ponto: novoPontoId,
    sugestaoTipo,
    tipoUsado: data.type
  };
}

// Atualizaar dados Usuário
export const updatePonto = async (id: string, data: Partial<IPonto>) => {
  await connectMongo();
  const pontoAtualizado = await Ponto.findByIdAndUpdate(id, data, {
    new: true,
  });
  return pontoAtualizado;
};

//Deletar Usuário
export const deletePonto = async (id: string) => {
  await connectMongo();
  await Ponto.findByIdAndDelete(id);
};
