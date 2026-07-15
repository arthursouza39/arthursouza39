"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { criarClienteBrowser } from "@/lib/supabase/client";
import { Icone, type NomeIcone } from "./Icones";
import { formatarPercent } from "@/lib/cmv/calculos";

const NAV: { href: string; label: string; short: string; icone: NomeIcone; grupo: string; badge?: number }[] = [
  { href: "/painel", label: "Painel do dia", short: "Painel", icone: "painel", grupo: "Operação" },
  { href: "/dashboard-cmv", label: "Dashboard CMV", short: "CMV", icone: "cmv", grupo: "Operação" },
  { href: "/fichas-tecnicas", label: "Fichas técnicas", short: "Fichas", icone: "ficha", grupo: "Operação" },
  { href: "/ingredientes", label: "Ingredientes", short: "Insumos", icone: "ingredientes", grupo: "Operação" },
  { href: "/simulador", label: "Simulador", short: "Simulador", icone: "simulador", grupo: "Decisão" },
  { href: "/contas-fixas", label: "Contas fixas", short: "Contas", icone: "contas", grupo: "Decisão" },
  { href: "/canais", label: "Canais de venda", short: "Canais", icone: "canais", grupo: "Decisão" },
];

function ThemeSeg() {
  const [tema, setTema] = useState<"light" | "dark" | null>(null);
  useEffect(() => {
    const atual =
      document.documentElement.getAttribute("data-theme") ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTema(atual as "light" | "dark");
  }, []);
  function aplicar(t: "light" | "dark") {
    document.documentElement.setAttribute("data-theme", t);
    setTema(t);
  }
  return (
    <div className="theme-seg" role="group" aria-label="Escolher tema">
      <button className={`seg-btn ${tema === "light" ? "active" : ""}`} onClick={() => aplicar("light")}>
        <Icone name="sun" className="ic" /> <span className="lbl-tema">Claro</span>
      </button>
      <button className={`seg-btn ${tema === "dark" ? "active" : ""}`} onClick={() => aplicar("dark")}>
        <Icone name="moon" className="ic" /> <span className="lbl-tema">Escuro</span>
      </button>
    </div>
  );
}

export default function AppShell({
  restaurante,
  children,
}: {
  restaurante: { nome: string; meta_margem: number };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const grupos = Array.from(new Set(NAV.map((n) => n.grupo)));

  async function sair() {
    await criarClienteBrowser().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icone name="marca" /></div>
          <div>
            <div className="brand-name">Track Food</div>
            <div className="brand-sub">Controle de CMV</div>
          </div>
        </div>

        {grupos.map((g) => (
          <div key={g}>
            <div className="nav-label eyebrow">{g}</div>
            {NAV.filter((n) => n.grupo === g).map((n) => (
              <Link key={n.href} href={n.href} className={`nav-item ${pathname === n.href ? "active" : ""}`}>
                <Icone name={n.icone} /> {n.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="sidebar-foot">
          <div className="plan-card">
            <b>Plano Pro</b> · assinatura ativa
            <br />
            <span className="muted">Renova em 12/ago</span>
          </div>
          <button className="nav-item logout-btn" onClick={sair}>
            <Icone name="sair" /> Sair
          </button>
        </div>
      </aside>

      <div className="main">
        <nav className="mobile-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`nav-item ${pathname === n.href ? "active" : ""}`}>
              <Icone name={n.icone} /> {n.short}
            </Link>
          ))}
          <button className="nav-item logout-btn" onClick={sair}>
            <Icone name="sair" /> Sair
          </button>
        </nav>

        <div className="topbar">
          <Link href="/restaurante" className="rest" style={{ textDecoration: "none", color: "inherit" }}>
            <b>{restaurante.nome}</b>
            <small style={{ textTransform: "capitalize" }}>{hoje}</small>
          </Link>
          <span className="meta-pill">
            <span className="dot" /> Meta de CMV: {formatarPercent(restaurante.meta_margem, 0)}
          </span>
          <ThemeSeg />
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}
