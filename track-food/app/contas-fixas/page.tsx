import AppShell from "@/components/AppShell";
import { Icone } from "@/components/Icones";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 11. Contas fixas + ponto de equilíbrio. */
export default async function ContasFixasPage() {
  const { restaurante } = await restauranteAtual();
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Contas fixas e ponto de equilíbrio</h1>
        <p>Quanto você precisa vender por mês só para não sair no prejuízo.</p>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary"><Icone name="plus" className="ic" /> Adicionar conta fixa</button>
      </div>
      <EstadoVazio
        icone="contas"
        titulo="Nenhuma conta fixa cadastrada"
        desc="Cadastre aluguel, folha, energia e demais custos fixos para calcular seu ponto de equilíbrio mensal e diário."
      />
    </AppShell>
  );
}
