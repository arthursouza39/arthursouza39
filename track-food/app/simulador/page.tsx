import AppShell from "@/components/AppShell";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 10. Simulador de promoções. */
export default async function SimuladorPage() {
  const { restaurante } = await restauranteAtual();
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Simulador de promoções</h1>
        <p>Antes de anunciar o desconto, veja o que sobra no seu bolso.</p>
      </div>
      <EstadoVazio
        icone="simulador"
        titulo="Nada para simular ainda"
        desc="Cadastre um prato com ficha técnica e seus canais de venda para simular descontos e ver o lucro real de cada promoção."
      />
    </AppShell>
  );
}
