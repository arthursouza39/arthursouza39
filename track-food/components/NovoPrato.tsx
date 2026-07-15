"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { Icone } from "./Icones";

export default function NovoPrato({ restauranteId }: { restauranteId: string }) {
  const router = useRouter();
  const supabase = criarClienteBrowser();
  const [abrindo, setAbrindo] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!nome.trim()) return setErro("Informe o nome do prato.");
    setSalvando(true);
    const precoNum = parseFloat(preco.replace(",", "."));
    const { data, error } = await supabase
      .from("pratos")
      .insert({ restaurante_id: restauranteId, nome: nome.trim(), preco_venda: isNaN(precoNum) ? 0 : precoNum })
      .select("id")
      .single();
    setSalvando(false);
    if (error || !data) return setErro("Não foi possível criar o prato.");
    router.push(`/fichas-tecnicas/${data.id}`);
  }

  if (!abrindo) {
    return (
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setAbrindo(true)}>
          <Icone name="plus" className="ic" /> Novo prato
        </button>
        <button className="btn btn-ghost" disabled title="Chega na Fase 2">
          <Icone name="camera" className="ic" /> Ler cardápio com IA
        </button>
      </div>
    );
  }

  return (
    <form className="card card-p" style={{ marginBottom: 16 }} onSubmit={salvar}>
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "end" }}>
        <div className="field">
          <label className="rot">Nome do prato</label>
          <input className="inp" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Parmegiana de Frango" autoFocus />
        </div>
        <div className="field">
          <label className="rot">Preço de venda (R$)</label>
          <input className="inp" inputMode="decimal" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="39,90" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? "Criando..." : "Criar e montar ficha"}</button>
      </div>
      {erro && <p className="form-msg" style={{ marginTop: 10 }}>{erro}</p>}
    </form>
  );
}
