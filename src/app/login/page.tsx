"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './page.module.css';

export default function LoginPage() {
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  
  const route = useRouter();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch(
        "/api/users/login", //rota da api
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (data.success) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.usuario.role);
        route.push("/dashboard");
      } else {
        const dataErro = data.error;
        setErro(dataErro.message || "Falha de Login");
      }
    } catch (error) {
      console.error("Erro de Login: ", error);
      setErro("Erro de Servidor: " + error);
    }
  };
  
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.titulo}>Login</h2>
        {erro && <p className={styles.erro}>{erro}</p>}
        <div className={styles.campo}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email" // Use type email
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="senha" className={styles.label}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.botao}>Entrar</button>
      </form>
    </div>
  );
}