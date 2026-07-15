import AppShell from "@/components/AppShell";
import { Icone } from "@/components/Icones";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 07. Fichas técnicas (CMV = soma dos ingredientes por prato). */
export default async function FichasPage() {
  const { restaurante } = await restauranteAtual();
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Fichas técnicas</h1>
        <p>O CMV de cada prato é a soma do custo dos seus ingredientes.</p>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary"><Icone name="plus" className="ic" /> Novo prato</button>
        <button className="btn btn-ghost"><Icone name="camera" className="ic" /> Ler cardápio com IA</button>
      </div>
      <EstadoVazio
        icone="ficha"
        titulo="Nenhuma ficha técnica ainda"
        desc="Crie um prato, defina o preço de venda e monte a receita com os ingredientes. O CMV e o semáforo aparecem na hora."
      />
    </AppShell>
  );
}
