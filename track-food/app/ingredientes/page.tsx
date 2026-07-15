import AppShell from "@/components/AppShell";
import GestaoIngredientes from "@/components/GestaoIngredientes";
import { restauranteAtual } from "@/lib/supabase/dados";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Ingrediente } from "@/types/database";

/** 06. Cadastro de ingredientes (preco_por_unidade = preco_pago / quantidade). */
export default async function IngredientesPage() {
  const { restaurante } = await restauranteAtual();
  const supabase = criarClienteServidor();
  const { data } = await supabase
    .from("ingredientes")
    .select("*")
    .eq("restaurante_id", restaurante.id)
    .order("nome");

  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Ingredientes</h1>
        <p>Sua base de insumos. O preço por unidade é calculado sozinho: <b>preço pago ÷ quantidade</b>.</p>
      </div>
      <GestaoIngredientes restauranteId={restaurante.id} inicial={(data ?? []) as Ingrediente[]} />
    </AppShell>
  );
}
