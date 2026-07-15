import { redirect } from "next/navigation";
import Link from "next/link";
import { criarClienteServidor } from "@/lib/supabase/server";
import { formatarPercent } from "@/lib/cmv/calculos";

/** 09. Painel do dia — tela principal (shell da Fase 0; widgets vêm nas próximas fases). */
export default async function PainelPage() {
  const supabase = criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: restaurante } = await supabase
    .from("restaurantes")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!restaurante) redirect("/cadastro");
  if (!restaurante.onboarding_completo) redirect("/onboarding");

  const modulos = [
    { href: "/ingredientes", titulo: "Ingredientes", desc: "Base de insumos" },
    { href: "/fichas-tecnicas", titulo: "Fichas técnicas", desc: "CMV por prato" },
    { href: "/dashboard-cmv", titulo: "Dashboard CMV", desc: "Semáforo dos pratos" },
    { href: "/canais", titulo: "Canais de venda", desc: "iFood, Salão, Delivery" },
    { href: "/simulador", titulo: "Simulador", desc: "Promoções" },
    { href: "/contas-fixas", titulo: "Contas fixas", desc: "Ponto de equilíbrio" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-tinta">
            {restaurante.nome}
          </h1>
          <p className="text-tinta-3">
            Meta de CMV: {formatarPercent(restaurante.meta_margem, 0)}
          </p>
        </div>
        <span className="chip-semaforo chip-verde">Painel do dia</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m) => (
          <Link key={m.href} href={m.href} className="card transition hover:shadow-md">
            <h2 className="font-semibold text-tinta">{m.titulo}</h2>
            <p className="text-sm text-tinta-3">{m.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
