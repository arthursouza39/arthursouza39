import AppShell from "@/components/AppShell";
import { Icone } from "@/components/Icones";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 03. Canais de venda com taxa configurável (iFood/Rappi/Salão/Delivery). */
export default async function CanaisPage() {
  const { restaurante } = await restauranteAtual();
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Canais de venda</h1>
        <p>Cada canal tem uma taxa. O simulador e o lucro por prato usam esses valores.</p>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary"><Icone name="plus" className="ic" /> Adicionar canal</button>
      </div>
      <EstadoVazio
        icone="canais"
        titulo="Nenhum canal cadastrado"
        desc="Cadastre iFood, Rappi, Salão ou Delivery próprio com a taxa de cada um para calcular o lucro real por canal."
      />
    </AppShell>
  );
}
