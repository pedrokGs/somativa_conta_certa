"use client";
import { useEffect, useState } from "react";
import { UserRole } from "@/common/enums/user-role";
import styles from './dashboard-admin.module.css';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface ReportData {
    userName: string;
    totalHours: number;
}

export default function DashboardAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [name, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setFuncao] = useState(UserRole.USER);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchReport();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const fetchReport = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/pontos/report", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setReportData(data.data);
            }
        } catch (error) {
            console.error("Erro ao buscar relatório:", error);
        }
    };

    const validarEmail = (e: string) => {
        return /\S+@\S+\.\S+/.test(e);
    }

    const handleCreate = async (ev?: React.FormEvent) => {
        ev?.preventDefault();
        setError(null);
        setLoading(true);

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Nome, email e senha são obrigatórios.");
            setLoading(false);
            return;
        }
        if (!validarEmail(email)) {
            setError("Email inválido.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim(),
                    role: UserRole[role as number]
                }),
            });

            const data = await response.json();
            if (data.success) {
                fetchUsers();
                setNome("");
                setEmail("");
                setPassword("");
                setFuncao(UserRole.USER);
            } else {
                setError(data.error || "Erro ao criar usuário");
            }
        } catch (error) {
            console.error("Erro:", error);
            setError("Erro de servidor");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Confirma excluir este usuário?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchUsers();
            } else {
                console.error("Erro ao excluir usuário");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    }

    return (
        <section className={styles.dashboardContainer}>
            <h1 className={styles.mainTitle}>Gestão de Usuários (Admin)</h1>

            <div className={styles.contentWrapper}>
                <form onSubmit={handleCreate} className={styles.creationForm}>
                    <h2 className={styles.formTitle}>Criar usuário</h2>
                    {error && <div className={styles.errorBox}>{error}</div>}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nome</label>
                        <input value={name} onChange={e => setNome(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} className={styles.input} type="email" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Senha</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Função</label>
                        <select value={role} onChange={e => setFuncao(e.target.value as unknown as UserRole)} className={styles.select}>
                            <option value={UserRole.ADMIN.toString()}>Admin</option>
                            <option value={UserRole.USER.toString()}>Usuario</option>
                        </select>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={loading} className={styles.createButton}>
                            {loading ? "Criando..." : "Criar"}
                        </button>
                        <button type="button" onClick={() => { setNome(""); setEmail(""); setPassword(""); setFuncao(UserRole.USER); setError(null); }} className={styles.clearButton}>
                            Limpar
                        </button>
                    </div>
                </form>

                <div className={styles.tableSection}>
                    <h2 className={styles.sectionTitle}>Lista de usuários</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader}>Nome</th>
                                    <th className={styles.tableHeader}>Email</th>
                                    <th className={styles.tableHeader}>Função</th>
                                    <th className={styles.tableHeaderCenter}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className={styles.tableRow}>
                                        <td className={styles.tableCell}>{u.name}</td>
                                        <td className={styles.tableCell}>{u.email}</td>
                                        <td className={styles.tableCell}>{u.role}</td>
                                        <td className={styles.tableCellCenter}>
                                            <button onClick={() => handleDelete(u._id)} className={styles.deleteButton}>
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className={styles.emptyTable}>Nenhum usuário encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className={styles.reportSection}>
                <h2 className={styles.sectionTitle}>Relatório de Horas Trabalhadas</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>Usuário</th>
                                <th className={styles.tableHeader}>Horas Totais</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((report, index) => (
                                <tr key={index} className={styles.tableRow}>
                                    <td className={styles.tableCell}>{report.userName}</td>
                                    <td className={styles.tableCell}>{report.totalHours.toFixed(2)}h</td>
                                </tr>
                            ))}
                            {reportData.length === 0 && (
                                <tr>
                                    <td colSpan={2} className={styles.emptyTable}>Nenhum relatório disponível.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}