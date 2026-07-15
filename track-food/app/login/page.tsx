"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-marca">Track Food</h1>
          <p className="mt-1 text-tinta-3">Entre na sua conta</p>
        </div>
        <form onSubmit={entrar} className="card space-y-4">
          <div>
            <label className="rotulo">E-mail</label>
            <input
              type="email"
              className="campo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="rotulo">Senha</label>
            <input
              type="password"
              className="campo"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {erro && <p className="text-sm text-semaforo-vermelho">{erro}</p>}
          <button type="submit" className="btn-marca w-full" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-tinta-3">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-marca">
            Cadastre seu restaurante
          </Link>
        </p>
      </div>
    </main>
  );
}
