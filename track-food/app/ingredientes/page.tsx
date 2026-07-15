import AppShell from "@/components/AppShell";
import { Icone } from "@/components/Icones";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 06. Cadastro de ingredientes (preco_por_unidade = preco_pago / quantidade). */
export default async function IngredientesPage() {
  const { restaurante } = await restauranteAtual();
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Ingredientes</h1>
        <p>Sua base de insumos. O preço por unidade é calculado sozinho: <b>preço pago ÷ quantidade</b>.</p>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary"><Icone name="plus" className="ic" /> Cadastrar ingrediente</button>
        <button className="btn btn-ghost"><Icone name="camera" className="ic" /> Ler nota fiscal com IA</button>
      </div>
      <EstadoVazio
        icone="ingredientes"
        titulo="Nenhum ingrediente cadastrado"
        desc="Cadastre seus insumos manualmente ou envie uma foto da nota fiscal para a IA preencher a base automaticamente."
      />
    </AppShell>
  );
}
