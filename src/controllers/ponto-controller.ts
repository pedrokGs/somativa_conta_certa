//listar todos os Ponto

import Ponto, { IPonto } from "@/models/ponto";
import connectMongo from "@/services/mongodb";

//export arrow function
export const getPontos = async () => {
  //conectar com banco
  await connectMongo();
  //solicitação para o MongoDB
  const pontos = await Ponto.find(); //listar todos os usuário da coleção
  return pontos;
};
//listar um unico Usuário
export async function getPontoById(id: string) {
  await connectMongo();
  const ponto = await Ponto.findById(id);
  return ponto;
}
//criar Usuário
export async function createPonto(data: Partial<IPonto>) {
  await connectMongo();
  const novoPonto = new Ponto(data);
  const novoPontoId = await novoPonto.save();
  return novoPontoId;
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