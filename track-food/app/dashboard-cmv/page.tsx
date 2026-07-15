import AppShell from "@/components/AppShell";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";
import { formatarPercent } from "@/lib/cmv/calculos";

/** 08. Dashboard CMV com semáforo (Verde/Amarelo/Vermelho). */
export default async function DashboardCmvPage() {
  const { restaurante } = await restauranteAtual();
  const meta = restaurante.meta_margem;
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Dashboard de CMV</h1>
        <p>O semáforo de cada prato num relance. Meta do restaurante: <b>{formatarPercent(meta, 0)}</b>.</p>
      </div>
      <div className="row" style={{ marginBottom: 18 }}>
        <span className="sem verde"><span className="led" /> Verde ≤ {formatarPercent(meta, 0)}</span>
        <span className="sem amarelo"><span className="led" /> Amarelo ≤ {formatarPercent(meta * 1.1, 0)}</span>
        <span className="sem vermelho"><span className="led" /> Vermelho &gt; {formatarPercent(meta * 1.1, 0)}</span>
      </div>
      <EstadoVazio
        icone="cmv"
        titulo="Sem pratos para exibir"
        desc="Monte suas fichas técnicas para ver aqui o CMV de cada prato com o semáforo de saúde financeira."
      />
    </AppShell>
  );
}
