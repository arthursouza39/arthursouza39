import AppShell from "@/components/AppShell";
import GestaoCanais from "@/components/GestaoCanais";
import { restauranteAtual } from "@/lib/supabase/dados";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { CanalVenda } from "@/types/database";

/** 03. Canais de venda com taxa configurável (iFood/Rappi/Salão/Delivery). */
export default async function CanaisPage() {
  const { restaurante } = await restauranteAtual();
  const supabase = criarClienteServidor();
  const { data } = await supabase
    .from("canais_venda")
    .select("*")
    .eq("restaurante_id", restaurante.id)
    .order("criado_em");

  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Canais de venda</h1>
        <p>Cada canal tem uma taxa. O simulador e o lucro por prato usam esses valores.</p>
      </div>
      <GestaoCanais restauranteId={restaurante.id} inicial={(data ?? []) as CanalVenda[]} />
    </AppShell>
  );
}
