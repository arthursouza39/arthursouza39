import Link from "next/link";
import AppShell from "@/components/AppShell";
import NovoPrato from "@/components/NovoPrato";
import { SemaforoChip } from "@/components/SemaforoChip";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";
import { criarClienteServidor } from "@/lib/supabase/server";
import { analisarPratoDB, type FichaItemComIngrediente } from "@/lib/cmv/dbCalculos";
import { formatarReal, formatarPercent } from "@/lib/cmv/calculos";

const SELECT_PRATO =
  "id, nome, preco_venda, ficha_itens(id, qtd, ingrediente:ingredientes(id, nome, unidade, preco_pago, quantidade))";

/** 07. Fichas técnicas (CMV = soma dos ingredientes por prato). */
export default async function FichasPage() {
  const { restaurante } = await restauranteAtual();
  const supabase = criarClienteServidor();
  const { data } = await supabase
    .from("pratos")
    .select(SELECT_PRATO)
    .eq("restaurante_id", restaurante.id)
    .order("nome");

  const pratos = (data ?? []) as unknown as {
    id: string;
    nome: string;
    preco_venda: number;
    ficha_itens: FichaItemComIngrediente[];
  }[];

  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Fichas técnicas</h1>
        <p>O CMV de cada prato é a soma do custo dos seus ingredientes.</p>
      </div>

      <NovoPrato restauranteId={restaurante.id} />

      {pratos.length === 0 ? (
        <EstadoVazio
          icone="ficha"
          titulo="Nenhuma ficha técnica ainda"
          desc="Crie um prato, defina o preço de venda e monte a receita com os ingredientes. O CMV e o semáforo aparecem na hora."
        />
      ) : (
        <div className="grid dishes">
          {pratos.map((p) => {
            const r = analisarPratoDB(p.ficha_itens ?? [], p.preco_venda, restaurante.meta_margem);
            const cor = r.semaforo === "verde" ? "var(--verde)" : r.semaforo === "amarelo" ? "var(--amarelo)" : "var(--vermelho)";
            const largura = Math.min(100, (r.cmvPercent / 0.45) * 100);
            const metaPos = (restaurante.meta_margem / 0.45) * 100;
            return (
              <Link key={p.id} href={`/fichas-tecnicas/${p.id}`} className="card dish">
                <div className="dish-top">
                  <div>
                    <div className="dish-name">{p.nome}</div>
                    <div className="dish-price">Preço {formatarReal(p.preco_venda)}</div>
                  </div>
                  <SemaforoChip nivel={r.semaforo} />
                </div>
                <div className="cmv-big">
                  {p.preco_venda > 0 ? formatarPercent(r.cmvPercent) : "—"} <small>CMV</small>
                </div>
                <div className="bar">
                  <i style={{ width: `${largura}%`, background: cor }} />
                  <span className="meta-tick" style={{ left: `${metaPos}%` }} />
                </div>
                <div className="dish-foot">
                  <span>CMV <b>{formatarReal(r.cmv)}</b></span>
                  <span>{(p.ficha_itens?.length ?? 0)} ingrediente(s)</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
