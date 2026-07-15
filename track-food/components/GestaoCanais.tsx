"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { Icone } from "./Icones";
import { EstadoVazio } from "./EstadoVazio";
import { formatarPercent } from "@/lib/cmv/calculos";
import type { CanalVenda } from "@/types/database";

const SUGESTOES = [
  { nome: "Salão", taxa: 0 },
  { nome: "iFood", taxa: 0.27 },
  { nome: "Rappi", taxa: 0.23 },
  { nome: "Delivery próprio", taxa: 0.05 },
];

export default function GestaoCanais({
  restauranteId,
  inicial,
}: {
  restauranteId: string;
  inicial: CanalVenda[];
}) {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [nome, setNome] = useState("");
  const [taxa, setTaxa] = useState("");
  const [salvando, setSalvando] = useState(false);

  const existentes = new Set(inicial.map((c) => c.nome.toLowerCase()));

  async function adicionar(nomeCanal: string, taxaFracao: number) {
    if (!nomeCanal.trim()) return;
    setSalvando(true);
    await supabase.from("canais_venda").insert({
      restaurante_id: restauranteId,
      nome: nomeCanal.trim(),
      taxa: taxaFracao,
    });
    setSalvando(false);
    setNome("");
    setTaxa("");
    router.refresh();
  }

  async function excluir(id: string) {
    await supabase.from("canais_venda").delete().eq("id", id);
    router.refresh();
  }

  function enviarForm(e: React.FormEvent) {
    e.preventDefault();
    const t = parseFloat(taxa.replace(",", ".")) / 100;
    adicionar(nome, isNaN(t) ? 0 : t);
  }

  return (
    <>
      <div className="card card-p" style={{ marginBottom: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Adicionar rápido</div>
        <div className="row">
          {SUGESTOES.map((s) => (
            <button
              key={s.nome}
              className="chip-canal"
              style={{ cursor: existentes.has(s.nome.toLowerCase()) ? "default" : "pointer", opacity: existentes.has(s.nome.toLowerCase()) ? 0.45 : 1 }}
              disabled={existentes.has(s.nome.toLowerCase()) || salvando}
              onClick={() => adicionar(s.nome, s.taxa)}
            >
              <Icone name="plus" className="ic-sm" /> {s.nome}
              <span className="taxa">{s.taxa === 0 ? "sem taxa" : formatarPercent(s.taxa, 0)}</span>
            </button>
          ))}
        </div>

        <form onSubmit={enviarForm} className="grid" style={{ gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "end", marginTop: 18 }}>
          <div className="field">
            <label className="rot">Nome do canal</label>
            <input className="inp" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Uber Eats" />
          </div>
          <div className="field">
            <label className="rot">Taxa (%)</label>
            <input className="inp" inputMode="decimal" value={taxa} onChange={(e) => setTaxa(e.target.value)} placeholder="27" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={salvando || !nome.trim()}>
            <Icone name="plus" className="ic" /> Adicionar
          </button>
        </form>
      </div>

      {inicial.length === 0 ? (
        <EstadoVazio
          icone="canais"
          titulo="Nenhum canal cadastrado"
          desc="Use os atalhos acima ou cadastre um canal com a taxa dele. O simulador e o lucro por prato usam esses valores."
        />
      ) : (
        <div className="card">
          <div className="tbl-wrap">
            <table className="data">
              <thead>
                <tr><th>Canal</th><th className="num">Taxa</th><th></th></tr>
              </thead>
              <tbody>
                {inicial.map((c) => (
                  <tr key={c.id}>
                    <td className="nome">{c.nome}</td>
                    <td className="num">{c.taxa === 0 ? "sem taxa" : formatarPercent(c.taxa, 1)}</td>
                    <td className="num">
                      <button className="btn btn-ghost" style={{ padding: "5px 9px" }} onClick={() => excluir(c.id)} title="Excluir">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
