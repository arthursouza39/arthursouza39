"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { Icone } from "./Icones";

export default function AuthForm({ inicial = "entrar" }: { inicial?: "entrar" | "criar" }) {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [modo, setModo] = useState<"entrar" | "criar">(inicial);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setCarregando(false);
      if (error) return setErro("E-mail ou senha inválidos.");
      router.push("/");
      router.refresh();
      return;
    }

    // Criar conta
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error || !data.user) {
      setCarregando(false);
      return setErro(error?.message ?? "Não foi possível criar a conta.");
    }
    const { error: erroRest } = await supabase
      .from("restaurantes")
      .insert({ user_id: data.user.id, nome });
    setCarregando(false);
    if (erroRest) return setErro("Conta criada, mas falhou ao cadastrar o restaurante.");
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="auth-view">
      <div className="auth-card card">
        <div className="auth-head">
          <div className="brand-mark"><Icone name="marca" /></div>
          <h2>Track Food</h2>
          <p>Organize as finanças do seu restaurante</p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab ${modo === "entrar" ? "active" : ""}`}
            onClick={() => { setModo("entrar"); setErro(""); }}
          >
            Entrar
          </button>
          <button
            className={`auth-tab ${modo === "criar" ? "active" : ""}`}
            onClick={() => { setModo("criar"); setErro(""); }}
          >
            Criar conta
          </button>
        </div>

        <form className="form" onSubmit={enviar}>
          {modo === "criar" && (
            <div className="field">
              <label className="rot">Nome do restaurante</label>
              <input className="inp" value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder="Cantina da Nonna" required />
            </div>
          )}
          <div className="field">
            <label className="rot">E-mail</label>
            <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@restaurante.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label className="rot">Senha</label>
            <input className="inp" type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••" minLength={6}
              autoComplete={modo === "entrar" ? "current-password" : "new-password"} required />
          </div>
          {erro && <p className="form-msg">{erro}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} disabled={carregando}>
            {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta e começar"}
          </button>
          <p className="auth-foot">
            {modo === "entrar" ? (
              <>Esqueceu a senha? <a href="#">Recuperar acesso</a></>
            ) : (
              <>Ao continuar você concorda com os termos de uso.</>
            )}
          </p>
        </form>
      </div>
    </main>
  );
}
