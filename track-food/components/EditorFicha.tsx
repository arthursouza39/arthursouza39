"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { Icone } from "./Icones";
import { SemaforoChip } from "./SemaforoChip";
import {
  custoItem, cmvPrato, cmvPercentual, semaforo,
  formatarReal, formatarPercent,
} from "@/lib/cmv/calculos";
import { itensParaFicha, type FichaItemComIngrediente } from "@/lib/cmv/dbCalculos";
import type { Ingrediente } from "@/types/database";

export default function EditorFicha({
  prato,
  itens,
  ingredientes,
  metaMargem,
}: {
  prato: { id: string; nome: string; preco_venda: number };
  itens: FichaItemComIngrediente[];
  ingredientes: Ingrediente[];
  metaMargem: number;
}) {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [ingId, setIngId] = useState("");
  const [qtd, setQtd] = useState("");
  const [preco, setPreco] = useState(String(prato.preco_venda).replace(".", ","));
  const [salvando, setSalvando] = useState(false);

  const ficha = itensParaFicha(itens);
  const cmv = cmvPrato(ficha);
  const cmvPct = cmvPercentual(cmv, prato.preco_venda);
  const nivel = semaforo(cmvPct, metaMargem);

  const jaUsados = new Set(itens.map((i) => i.ingrediente?.id));
  const disponiveis = ingredientes.filter((i) => !jaUsados.has(i.id));
  const ingSelecionado = ingredientes.find((i) => i.id === ingId);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    const q = parseFloat(qtd.replace(",", "."));
    if (!ingId || !(q > 0)) return;
    setSalvando(true);
    await supabase.from("ficha_itens").insert({ prato_id: prato.id, ingrediente_id: ingId, qtd: q });
    setSalvando(false);
    setIngId("");
    setQtd("");
    router.refresh();
  }

  async function remover(id: string) {
    await supabase.from("ficha_itens").delete().eq("id", id);
    router.refresh();
  }

  async function salvarPreco() {
    const p = parseFloat(preco.replace(",", "."));
    if (isNaN(p) || p === prato.preco_venda) return;
    await supabase.from("pratos").update({ preco_venda: p }).eq("id", prato.id);
    router.refresh();
  }

  return (
    <div className="grid split">
      <div className="card card-p">
        <div className="eyebrow" style={{ marginBottom: 6 }}>Ingredientes da receita</div>

        {itens.length === 0 && <p className="muted" style={{ padding: "8px 0" }}>Adicione o primeiro ingrediente abaixo.</p>}

        {itens.map((i) => {
          const custo = i.ingrediente ? custoItem({ ingrediente: i.ingrediente, qtd: i.qtd }) : 0;
          const share = cmv > 0 ? custo / cmv : 0;
          return (
            <div key={i.id} className="ing-row">
              <div>
                <div className="nome" style={{ fontWeight: 600 }}>{i.ingrediente?.nome ?? "—"}</div>
                <div className="q">{i.qtd} {i.ingrediente?.unidade === "g" ? "g" : "un"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="ing-cost">{formatarReal(custo)}<span className="pct">{formatarPercent(share, 0)}</span></span>
                <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => remover(i.id)} title="Remover">✕</button>
              </div>
            </div>
          );
        })}

        <form onSubmit={adicionar} className="grid" style={{ gridTemplateColumns: "2fr 1fr auto", gap: 10, alignItems: "end", marginTop: 16 }}>
          <div className="field">
            <label className="rot">Ingrediente</label>
            <select className="inp" value={ingId} onChange={(e) => setIngId(e.target.value)}>
              <option value="">Selecione…</option>
              {disponiveis.map((i) => (
                <option key={i.id} value={i.id}>{i.nome} ({formatarReal(i.preco_por_unidade)}/{i.unidade === "g" ? "kg" : "un"})</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="rot">Qtd. {ingSelecionado ? (ingSelecionado.unidade === "g" ? "(g)" : "(un)") : ""}</label>
            <input className="inp" inputMode="decimal" value={qtd} onChange={(e) => setQtd(e.target.value)} placeholder={ingSelecionado?.unidade === "un" ? "3" : "200"} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={salvando || !ingId}><Icone name="plus" className="ic" /></button>
        </form>
        {disponiveis.length === 0 && ingredientes.length > 0 && (
          <p className="muted" style={{ marginTop: 10 }}>Todos os ingredientes já estão nesta ficha.</p>
        )}
        {ingredientes.length === 0 && (
          <p className="muted" style={{ marginTop: 10 }}>Cadastre ingredientes primeiro na aba <b>Ingredientes</b>.</p>
        )}

        <div className="total-row">
          <div><div style={{ fontWeight: 650 }}>CMV do prato</div><div className="muted">{itens.length} ingrediente(s)</div></div>
          <div style={{ fontSize: 22, fontWeight: 700 }} className="tnum">{formatarReal(cmv)}</div>
        </div>
      </div>

      <div className="card card-p">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Resultado</div>
        <div className="field" style={{ marginBottom: 12 }}>
          <label className="rot">Preço de venda (R$)</label>
          <input className="inp" inputMode="decimal" value={preco}
            onChange={(e) => setPreco(e.target.value)} onBlur={salvarPreco} />
        </div>
        <div className="summary-line"><span className="muted">CMV</span><b className="tnum">{formatarReal(cmv)}</b></div>
        <div className="summary-line big">
          <span>CMV %</span>
          <span className="tnum" style={{ color: nivel === "verde" ? "var(--verde-ink)" : nivel === "amarelo" ? "var(--amarelo-ink)" : "var(--vermelho-ink)" }}>
            {prato.preco_venda > 0 ? formatarPercent(cmvPct) : "—"}
          </span>
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SemaforoChip nivel={nivel} />
          <span className="muted">meta {formatarPercent(metaMargem, 0)}</span>
        </div>
      </div>
    </div>
  );
}
