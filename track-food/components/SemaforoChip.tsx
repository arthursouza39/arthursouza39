import { rotuloSemaforo, type Semaforo } from "@/lib/cmv/calculos";

/** Chip do semáforo do CMV (Verde/Amarelo/Vermelho). */
export function SemaforoChip({ nivel }: { nivel: Semaforo }) {
  return (
    <span className={`sem ${nivel}`}>
      <span className="led" /> {rotuloSemaforo(nivel)}
    </span>
  );
}
