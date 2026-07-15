"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";

/**
 * 01. Onboarding em 5 passos.
 * Fase 0: esqueleto navegável que conclui o onboarding. As telas de foto de
 * cardápio/nota (passos 3 e 4) serão plugadas na Fase 2 (IA).
 */
const PASSOS = [
  { titulo: "Cadastro", desc: "Sua conta e restaurante estão criados. Vamos configurar o essencial." },
  { titulo: "Canais de venda", desc: "Cadastre onde você vende (iFood, Salão, Delivery) e as taxas de cada um." },
  { titulo: "Foto do cardápio", desc: "Envie uma foto do cardápio e a IA extrai seus pratos (em breve, na Fase 2)." },
  { titulo: "Foto da nota fiscal", desc: "Envie uma nota de compra e a IA atualiza seus ingredientes (Fase 2)." },
  { titulo: "Painel", desc: "Tudo pronto! Você será levado ao painel do dia." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [passo, setPasso] = useState(0);
  const [salvando, setSalvando] = useState(false);

  async function concluir() {
    setSalvando(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("restaurantes")
        .update({ onboarding_completo: true })
        .eq("user_id", user.id);
    }
    router.push("/painel");
    router.refresh();
  }

  const atual = PASSOS[passo];
  const ultimo = passo === PASSOS.length - 1;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="mb-4 flex gap-1.5">
        {PASSOS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= passo ? "bg-marca" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="card">
        <p className="text-sm font-semibold text-marca">
          Passo {passo + 1} de {PASSOS.length}
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-tinta">{atual.titulo}</h1>
        <p className="mt-2 text-tinta-3">{atual.desc}</p>

        <div className="mt-6 flex justify-between">
          <button
            className="btn-secundario"
            onClick={() => setPasso((p) => Math.max(0, p - 1))}
            disabled={passo === 0}
          >
            Voltar
          </button>
          {ultimo ? (
            <button className="btn-marca" onClick={concluir} disabled={salvando}>
              {salvando ? "Finalizando..." : "Ir para o painel"}
            </button>
          ) : (
            <button className="btn-marca" onClick={() => setPasso((p) => p + 1)}>
              Continuar
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
