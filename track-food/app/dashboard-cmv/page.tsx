import Link from "next/link";
import AppShell from "@/components/AppShell";
import { SemaforoChip } from "@/components/SemaforoChip";
import { EstadoVazio } from "@/components/EstadoVazio";
import { restauranteAtual } from "@/lib/supabase/dados";
import { criarClienteServidor } from "@/lib/supabase/server";
import { analisarPratoDB, type FichaItemComIngrediente } from "@/lib/cmv/dbCalculos";
import { formatarReal, formatarPercent, type Semaforo } from "@/lib/cmv/calculos";

const SELECT_PRATO =
  "id, nome, preco_venda, ficha_itens(id, qtd, ingrediente:ingredientes(id, nome, unidade, preco_pago, quantidade))";

/** 08. Dashboard CMV com semáforo (Verde/Amarelo/Vermelho). */
export default async function DashboardCmvPage() {
  const { restaurante } = await restauranteAtual();
  const meta = restaurante.meta_margem;
  const supabase = criarClienteServidor();
  const { data } = await supabase
    .from("pratos")
    .select(SELECT_PRATO)
    .eq("restaurante_id", restaurante.id)
    .order("nome");

  const pratos = (data ?? []) as unknown as {
    id: string; nome: string; preco_venda: number; ficha_itens: FichaItemComIngrediente[];
  }[];

  const analisados = pratos
    .map((p) => ({ p, r: analisarPratoDB(p.ficha_itens ?? [], p.preco_venda, meta) }))
    .filter((x) => x.p.preco_venda > 0 && (x.p.ficha_itens?.length ?? 0) > 0);

  const contagem: Record<Semaforo, number> = { verde: 0, amarelo: 0, vermelho: 0 };
  analisados.forEach((x) => (contagem[x.r.semaforo] += 1));

  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Dashboard de CMV</h1>
        <p>O semáforo de cada prato num relance. Meta do restaurante: <b>{formatarPercent(meta, 0)}</b>.</p>
      </div>

      {analisados.length === 0 ? (
        <EstadoVazio
          icone="cmv"
          titulo="Sem pratos para exibir"
          desc="Monte suas fichas técnicas (com preço e ingredientes) para ver aqui o CMV de cada prato com o semáforo de saúde financeira."
        />
      ) : (
        <>
          <div className="grid kpis" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 18 }}>
            <div className="card kpi"><div className="lbl">Saudáveis (verde)</div><div className="val tnum" style={{ color: "var(--verde-ink)" }}>{contagem.verde}</div></div>
            <div className="card kpi"><div className="lbl">Em atenção (amarelo)</div><div className="val tnum" style={{ color: "var(--amarelo-ink)" }}>{contagem.amarelo}</div></div>
            <div className="card kpi"><div className="lbl">Críticos (vermelho)</div><div className="val tnum" style={{ color: "var(--vermelho-ink)" }}>{contagem.vermelho}</div></div>
          </div>

          <div className="row" style={{ marginBottom: 18 }}>
            <span className="sem verde"><span className="led" /> Verde ≤ {formatarPercent(meta, 0)}</span>
            <span className="sem amarelo"><span className="led" /> Amarelo ≤ {formatarPercent(meta * 1.1, 0)}</span>
            <span className="sem vermelho"><span className="led" /> Vermelho &gt; {formatarPercent(meta * 1.1, 0)}</span>
          </div>

          <div className="grid dishes">
            {analisados.map(({ p, r }) => {
              const cor = r.semaforo === "verde" ? "var(--verde)" : r.semaforo === "amarelo" ? "var(--amarelo)" : "var(--vermelho)";
              const largura = Math.min(100, (r.cmvPercent / 0.45) * 100);
              const metaPos = (meta / 0.45) * 100;
              return (
                <Link key={p.id} href={`/fichas-tecnicas/${p.id}`} className="card dish">
                  <div className="dish-top">
                    <div>
                      <div className="dish-name">{p.nome}</div>
                      <div className="dish-price">Preço {formatarReal(p.preco_venda)}</div>
                    </div>
                    <SemaforoChip nivel={r.semaforo} />
                  </div>
                  <div className="cmv-big">{formatarPercent(r.cmvPercent)} <small>CMV</small></div>
                  <div className="bar">
                    <i style={{ width: `${largura}%`, background: cor }} />
                    <span className="meta-tick" style={{ left: `${metaPos}%` }} />
                  </div>
                  <div className="dish-foot">
                    <span>CMV <b>{formatarReal(r.cmv)}</b></span>
                    <span>Margem <b>{formatarReal(r.margemBruta)}</b></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
