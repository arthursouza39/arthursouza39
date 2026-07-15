import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Icone } from "@/components/Icones";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 09. Painel do dia — hub principal do restaurante. */
export default async function PainelPage() {
  const { restaurante } = await restauranteAtual();
  if (!restaurante.onboarding_completo) redirect("/onboarding");

  const passos = [
    { href: "/canais", titulo: "Configure seus canais", desc: "iFood, Salão, Delivery e suas taxas." },
    { href: "/ingredientes", titulo: "Cadastre os ingredientes", desc: "Sua base de insumos com preço por unidade." },
    { href: "/fichas-tecnicas", titulo: "Monte as fichas técnicas", desc: "O CMV de cada prato é calculado aqui." },
    { href: "/dashboard-cmv", titulo: "Acompanhe o semáforo", desc: "Veja quais pratos estão no vermelho." },
  ];

  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Painel do dia</h1>
        <p>Bem-vindo de volta. Comece configurando os dados do seu restaurante.</p>
      </div>

      <div className="card card-p" style={{ marginBottom: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Comece por aqui</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {passos.map((p, i) => (
            <Link key={p.href} href={p.href} className="card card-p" style={{ display: "block" }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Passo {i + 1}</div>
              <div style={{ fontWeight: 650, marginTop: 6 }}>{p.titulo}</div>
              <div className="muted" style={{ marginTop: 3 }}>{p.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="callout ai">
        <Icone name="ai" className="ic" />
        <div>
          <b>Dica:</b> comece cadastrando seus ingredientes mais usados. Depois, ao montar as
          fichas técnicas, o CMV de cada prato aparece automaticamente com o semáforo.
        </div>
      </div>
    </AppShell>
  );
}
