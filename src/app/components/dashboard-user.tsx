"use client";

import { IPonto } from "@/models/ponto";
import { useEffect, useState } from "react";

export default function DashboardTecnico(){
    // aramazenar as tarefas em um vetor
    const [pontos, setPontos] = useState<IPonto[]>([]);

    useEffect(()=>{
        fetchPontos();
    }, []);

    const fetchPontos = async () =>{
        try {
            const resposta = await fetch("/api/ponto"); //http request -> 
            const data = await resposta.json();
            if(data.success){
                setPontos(data.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div>
            <h3>Meu histórico</h3>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {pontos.map((ponto)=>(
                        <tr key = {ponto._id}>
                            <td>{ponto.clockTime.toDateString()}</td>
                            <td>{ponto.clockTime.toTimeString()}</td>
                            <td>{ponto.type.toString()}</td>
                            <td><button>Finalizar Serviço</button></td>
                            

                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
}