"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";

export default function CadastroPage() {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [nomeRestaurante, setNomeRestaurante] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });
    if (error || !data.user) {
      setCarregando(false);
      setErro(error?.message ?? "Não foi possível criar a conta.");
      return;
    }

    // Cria o restaurante com meta_margem padrão (30%)
    const { error: erroRest } = await supabase.from("restaurantes").insert({
      user_id: data.user.id,
      nome: nomeRestaurante,
    });
    setCarregando(false);
    if (erroRest) {
      setErro("Conta criada, mas falhou ao cadastrar o restaurante.");
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-marca">Track Food</h1>
          <p className="mt-1 text-tinta-3">Passo 1 de 5 — crie sua conta</p>
        </div>
        <form onSubmit={cadastrar} className="card space-y-4">
          <div>
            <label className="rotulo">Nome do restaurante</label>
            <input
              className="campo"
              value={nomeRestaurante}
              onChange={(e) => setNomeRestaurante(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
              required
            />
          </div>
          {erro && <p className="text-sm text-semaforo-vermelho">{erro}</p>}
          <button type="submit" className="btn-marca w-full" disabled={carregando}>
            {carregando ? "Criando..." : "Criar conta e começar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-tinta-3">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-marca">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
