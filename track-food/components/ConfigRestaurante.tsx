"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";
import type { Restaurante } from "@/types/database";

export default function ConfigRestaurante({ restaurante }: { restaurante: Restaurante }) {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [nome, setNome] = useState(restaurante.nome);
  const [meta, setMeta] = useState(String(Math.round(restaurante.meta_margem * 100)));
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const metaFracao = parseFloat(meta.replace(",", ".")) / 100;
    if (!nome.trim() || isNaN(metaFracao) || metaFracao <= 0 || metaFracao >= 1) {
      setMsg("Informe um nome e uma meta entre 1% e 99%.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase
      .from("restaurantes")
      .update({ nome: nome.trim(), meta_margem: metaFracao })
      .eq("id", restaurante.id);
    setSalvando(false);
    if (error) return setMsg("Não foi possível salvar.");
    setMsg("Salvo!");
    router.refresh();
  }

  return (
    <form className="card card-p" style={{ maxWidth: 520 }} onSubmit={salvar}>
      <div className="field" style={{ marginBottom: 16 }}>
        <label className="rot">Nome do restaurante</label>
        <input className="inp" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div className="field">
        <label className="rot">Meta de CMV (%)</label>
        <input className="inp" inputMode="decimal" value={meta} onChange={(e) => setMeta(e.target.value)} />
        <p className="muted" style={{ marginTop: 6 }}>
          É o limite que define o semáforo: verde até a meta, amarelo até a meta + 10%, vermelho acima disso.
          A maioria dos restaurantes trabalha entre 28% e 35%.
        </p>
      </div>
      <div className="row" style={{ marginTop: 16, alignItems: "center" }}>
        <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? "Salvando..." : "Salvar alterações"}</button>
        {msg && <span className="muted" style={{ color: msg === "Salvo!" ? "var(--verde-ink)" : "var(--vermelho-ink)" }}>{msg}</span>}
      </div>
    </form>
  );
}
