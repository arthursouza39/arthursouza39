import { Icone, type NomeIcone } from "./Icones";

export function EstadoVazio({
  icone,
  titulo,
  desc,
  acao,
}: {
  icone: NomeIcone;
  titulo: string;
  desc: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="card card-p" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "var(--surface-2)",
          color: "var(--ink-3)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 14px",
        }}
      >
        <Icone name={icone} className="ic" />
      </div>
      <div style={{ fontWeight: 650, fontSize: 16 }}>{titulo}</div>
      <p className="muted" style={{ maxWidth: "46ch", margin: "6px auto 0" }}>{desc}</p>
      {acao && <div style={{ marginTop: 18 }}>{acao}</div>}
    </div>
  );
}
