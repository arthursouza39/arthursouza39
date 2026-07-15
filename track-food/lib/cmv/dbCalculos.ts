import { analisarPrato, type ItemFicha, type ResultadoPrato, type Unidade } from "./calculos";

/** Item da ficha com o ingrediente embutido (vindo do select do Supabase). */
export interface FichaItemComIngrediente {
  id: string;
  qtd: number;
  ingrediente: {
    id: string;
    nome: string;
    unidade: Unidade;
    preco_pago: number;
    quantidade: number;
  } | null;
}

/** Converte itens do banco no formato esperado pelo motor de CMV. */
export function itensParaFicha(itens: FichaItemComIngrediente[]): ItemFicha[] {
  return itens
    .filter((i) => i.ingrediente)
    .map((i) => ({ ingrediente: i.ingrediente!, qtd: i.qtd }));
}

/** Analisa um prato diretamente a partir dos itens do banco. */
export function analisarPratoDB(
  itens: FichaItemComIngrediente[],
  precoVenda: number,
  metaMargem: number,
): ResultadoPrato {
  return analisarPrato(itensParaFicha(itens), precoVenda, metaMargem);
}
