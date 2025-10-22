"use client";

import { useState } from "react";
import { PontoType } from "@/common/enums/ponto-type";

interface RegisterPointModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: () => void;
}

export default function RegisterPointModal({ isOpen, onClose, onRegister }: RegisterPointModalProps) {
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuário não autenticado");

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;

            const response = await fetch("/api/pontos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }) // não enviamos o type
            });

            const data = await response.json();
            if (data.success) {
                onRegister();
                onClose();
            } else {
                console.error("Erro ao registrar ponto:", data.error);
            }
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        }}>
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                maxWidth: "400px",
                width: "90%",
            }}>
                <h3>Registrar Ponto</h3>
                <p>O tipo será decidido automaticamente (Entrada/Saída)</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Registrando..." : "Confirmar"}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
