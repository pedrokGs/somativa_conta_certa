"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// página de interação do usuário UI

export default function LoginPage() {
    
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  
  const route = useRouter();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch(
        "/api/usuarios/login", //rota da api
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );
      
      const data = await response.json();
      if (data.success) {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("funcao", data.usuario.funcao);
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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}