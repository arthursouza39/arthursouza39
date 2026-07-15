"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";

/**
 * 01. Onboarding em 5 passos.
 * As telas de foto de cardápio/nota (passos 3 e 4) serão plugadas na Fase 2 (IA).
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
      await supabase.from("restaurantes").update({ onboarding_completo: true }).eq("user_id", user.id);
    }
    router.push("/painel");
    router.refresh();
  }

  const atual = PASSOS[passo];
  const ultimo = passo === PASSOS.length - 1;

  return (
    <main className="auth-view">
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="steps-bar">
          {PASSOS.map((_, i) => (
            <i key={i} className={i <= passo ? "on" : ""} />
          ))}
        </div>
        <div className="card card-p">
          <div className="eyebrow" style={{ color: "var(--brand)" }}>
            Passo {passo + 1} de {PASSOS.length}
          </div>
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{atual.titulo}</h1>
          <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>{atual.desc}</p>

          <div className="row" style={{ justifyContent: "space-between", marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setPasso((p) => Math.max(0, p - 1))} disabled={passo === 0}>
              Voltar
            </button>
            {ultimo ? (
              <button className="btn btn-primary" onClick={concluir} disabled={salvando}>
                {salvando ? "Finalizando..." : "Ir para o painel"}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setPasso((p) => p + 1)}>
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
