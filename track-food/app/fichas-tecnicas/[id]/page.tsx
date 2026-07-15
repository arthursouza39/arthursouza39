import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import EditorFicha from "@/components/EditorFicha";
import { restauranteAtual } from "@/lib/supabase/dados";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { FichaItemComIngrediente } from "@/lib/cmv/dbCalculos";
import type { Ingrediente } from "@/types/database";

const SELECT_PRATO =
  "id, nome, preco_venda, ficha_itens(id, qtd, ingrediente:ingredientes(id, nome, unidade, preco_pago, quantidade))";

/** 07. Detalhe do prato — montagem da ficha técnica e CMV ao vivo. */
export default async function FichaDetalhePage({ params }: { params: { id: string } }) {
  const { restaurante } = await restauranteAtual();
  const supabase = criarClienteServidor();

  const { data: prato } = await supabase
    .from("pratos")
    .select(SELECT_PRATO)
    .eq("id", params.id)
    .maybeSingle();

  if (!prato) notFound();

  const { data: ingredientes } = await supabase
    .from("ingredientes")
    .select("*")
    .eq("restaurante_id", restaurante.id)
    .order("nome");

  const p = prato as unknown as {
    id: string; nome: string; preco_venda: number; ficha_itens: FichaItemComIngrediente[];
  };

  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <Link href="/fichas-tecnicas" className="muted" style={{ textDecoration: "none" }}>← Fichas técnicas</Link>
        <h1 style={{ marginTop: 6 }}>{p.nome}</h1>
        <p>Monte a receita: o CMV e o semáforo se atualizam a cada ingrediente.</p>
      </div>
      <EditorFicha
        prato={{ id: p.id, nome: p.nome, preco_venda: p.preco_venda }}
        itens={p.ficha_itens ?? []}
        ingredientes={(ingredientes ?? []) as Ingrediente[]}
        metaMargem={restaurante.meta_margem}
      />
    </AppShell>
  );
}
