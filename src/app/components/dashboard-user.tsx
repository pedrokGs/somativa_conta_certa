"use client";

import { IPonto } from "@/models/ponto";
import { useEffect, useState } from "react";
import RegisterPointModal from "./register-point-modal";
import styles from './dashboard-user.module.css';

export default function DashboardUser(){
    const [pontos, setPontos] = useState<IPonto[]>([]);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(()=>{
        fetchPontos();
    }, []);

    const fetchPontos = async () =>{
        try {
            const token = localStorage.getItem("token");
            const resposta = await fetch("/api/pontos", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await resposta.json();
            if(data.success){
                setPontos(data.data);
                setTotalHours(data.totalHours || 0);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleRegisterPoint = () => {
        fetchPontos();
    };

    return(
        <div className={styles.dashboardContainer}>
            <h1 className={styles.mainTitle}>Meu Painel de Ponto</h1>
            
            <div className={styles.headerControls}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.registerButton}
                >
                    Registrar Ponto
                </button>
                <div className={styles.hoursDisplay}>
                    Total de horas trabalhadas: <strong className={styles.totalHours}>{totalHours.toFixed(2)}h</strong>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Histórico de Registros</h2>
            
            <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr className={styles.tableHeaderRow}>
                            <th className={styles.tableHeader}>Data</th>
                            <th className={styles.tableHeader}>Hora</th>
                            <th className={styles.tableHeader}>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pontos.map((ponto)=>(
                            <tr key={ponto._id} className={styles.tableRow}>
                                <td className={styles.tableCell}>
                                    {new Date(ponto.clockTime).toLocaleDateString()}
                                </td>
                                <td className={styles.tableCell}>
                                    {new Date(ponto.clockTime).toLocaleTimeString()}
                                </td>
                                <td className={styles.tableCell}>
                                    <span className={ponto.type === 'IN' ? styles.tagIn : styles.tagOut}>
                                        {ponto.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <RegisterPointModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegisterPoint}
            />
        </div>
    );
}