"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { Icone } from "./Icones";
import { EstadoVazio } from "./EstadoVazio";
import { formatarReal } from "@/lib/cmv/calculos";
import type { Ingrediente } from "@/types/database";

export default function GestaoIngredientes({
  restauranteId,
  inicial,
}: {
  restauranteId: string;
  inicial: Ingrediente[];
}) {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [abrindo, setAbrindo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ nome: "", unidade: "g" as "g" | "un", preco_pago: "", quantidade: "" });

  function fmtPorUnidade(i: Ingrediente) {
    return `${formatarReal(i.preco_por_unidade)} /${i.unidade === "g" ? "kg" : "un"}`;
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const preco = parseFloat(form.preco_pago.replace(",", "."));
    const qtd = parseFloat(form.quantidade.replace(",", "."));
    if (!form.nome.trim() || !(qtd > 0)) {
      setErro("Preencha o nome e uma quantidade maior que zero.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.from("ingredientes").insert({
      restaurante_id: restauranteId,
      nome: form.nome.trim(),
      unidade: form.unidade,
      preco_pago: isNaN(preco) ? 0 : preco,
      quantidade: qtd,
    });
    setSalvando(false);
    if (error) {
      setErro("Não foi possível salvar. Tente novamente.");
      return;
    }
    setForm({ nome: "", unidade: "g", preco_pago: "", quantidade: "" });
    setAbrindo(false);
    router.refresh();
  }

  async function excluir(id: string) {
    await supabase.from("ingredientes").delete().eq("id", id);
    router.refresh();
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setAbrindo((v) => !v)}>
          <Icone name="plus" className="ic" /> Cadastrar ingrediente
        </button>
        <button className="btn btn-ghost" disabled title="Chega na Fase 2">
          <Icone name="camera" className="ic" /> Ler nota fiscal com IA
        </button>
      </div>

      {abrindo && (
        <form className="card card-p" style={{ marginBottom: 16 }} onSubmit={salvar}>
          <div className="grid" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, alignItems: "end" }}>
            <div className="field">
              <label className="rot">Nome</label>
              <input className="inp" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Muçarela" autoFocus />
            </div>
            <div className="field">
              <label className="rot">Unidade</label>
              <select className="inp" value={form.unidade}
                onChange={(e) => setForm({ ...form, unidade: e.target.value as "g" | "un" })}>
                <option value="g">Peso (kg/g)</option>
                <option value="un">Unidade</option>
              </select>
            </div>
            <div className="field">
              <label className="rot">Preço pago (R$)</label>
              <input className="inp" inputMode="decimal" value={form.preco_pago}
                onChange={(e) => setForm({ ...form, preco_pago: e.target.value })} placeholder="190,00" />
            </div>
            <div className="field">
              <label className="rot">{form.unidade === "g" ? "Qtd. (kg)" : "Qtd. (un)"}</label>
              <input className="inp" inputMode="decimal" value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                placeholder={form.unidade === "g" ? "5" : "30"} />
            </div>
          </div>
          {erro && <p className="form-msg" style={{ marginTop: 10 }}>{erro}</p>}
          <div className="row" style={{ marginTop: 14 }}>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setAbrindo(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {inicial.length === 0 ? (
        <EstadoVazio
          icone="ingredientes"
          titulo="Nenhum ingrediente cadastrado"
          desc="Cadastre seus insumos manualmente. Na Fase 2, você poderá enviar a foto da nota fiscal para a IA preencher a base automaticamente."
        />
      ) : (
        <div className="card">
          <div className="tbl-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Ingrediente</th><th>Un.</th>
                  <th className="num">Preço pago</th><th className="num">Qtd.</th>
                  <th className="num">Preço / unidade</th><th></th>
                </tr>
              </thead>
              <tbody>
                {inicial.map((i) => (
                  <tr key={i.id}>
                    <td className="nome">{i.nome}</td>
                    <td>{i.unidade}</td>
                    <td className="num">{formatarReal(i.preco_pago)}</td>
                    <td className="num">{i.quantidade} {i.unidade === "g" ? "kg" : "un"}</td>
                    <td className="num" style={{ fontWeight: 600, color: "var(--ink)" }}>{fmtPorUnidade(i)}</td>
                    <td className="num">
                      <button className="btn btn-ghost" style={{ padding: "5px 9px" }}
                        onClick={() => excluir(i.id)} title="Excluir">✕</button>
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
