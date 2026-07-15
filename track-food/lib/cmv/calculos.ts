/**
 * Motor de cálculo de CMV (Custo da Mercadoria Vendida) do Track Food.
 *
 * Este módulo é o CORAÇÃO do produto: toda a lógica financeira passa por aqui.
 * É puro (sem I/O) para poder ser testado de forma isolada e reutilizado tanto
 * no servidor (API routes) quanto no cliente (simulador em tempo real).
 */

export type Unidade = "g" | "un";

export type Semaforo = "verde" | "amarelo" | "vermelho";

/** Ingrediente cadastrado na base de insumos do restaurante. */
export interface Ingrediente {
  id: string;
  nome: string;
  unidade: Unidade;
  /** Valor pago na compra (ex.: R$ 50,00 no pacote). */
  preco_pago: number;
  /**
   * Quantidade comprada, na base da unidade:
   * - "g": quantidade em QUILOS (ex.: pacote de 5kg -> 5)
   * - "un": quantidade em UNIDADES (ex.: cartela de 30 ovos -> 30)
   */
  quantidade: number;
}

/** Um item da ficha técnica: quanto de um ingrediente entra no prato. */
export interface ItemFicha {
  ingrediente: Pick<Ingrediente, "unidade" | "preco_pago" | "quantidade"> & {
    nome?: string;
  };
  /**
   * Quantidade usada no prato:
   * - "g": em GRAMAS (ex.: 200g de carne)
   * - "un": em UNIDADES (ex.: 3 ovos)
   */
  qtd: number;
}

/**
 * Preço por unidade base do ingrediente.
 * Regra do brief: preco_por_unidade = preco_pago / quantidade.
 *
 * - "g": resultado é o preço por QUILO (por isso o custo do item divide por 1000).
 * - "un": resultado é o preço por UNIDADE.
 */
export function precoPorUnidade(precoPago: number, quantidade: number): number {
  if (quantidade <= 0) return 0;
  return precoPago / quantidade;
}

/**
 * Custo de um item da ficha técnica.
 * Regra do brief:
 * - gramas:  custo = (qtd / 1000) * preco_por_unidade
 * - unidade: custo = qtd * preco_por_unidade
 */
export function custoItem(item: ItemFicha): number {
  const ppu = precoPorUnidade(
    item.ingrediente.preco_pago,
    item.ingrediente.quantidade,
  );
  if (item.ingrediente.unidade === "g") {
    return (item.qtd / 1000) * ppu;
  }
  return item.qtd * ppu;
}

/** CMV do prato = soma do custo de todos os ingredientes da ficha técnica. */
export function cmvPrato(itens: ItemFicha[]): number {
  return itens.reduce((total, item) => total + custoItem(item), 0);
}

/**
 * CMV percentual do prato em relação ao preço de venda.
 * Retorna uma fração (0.30 = 30%). Retorna 0 se o preço de venda for inválido.
 */
export function cmvPercentual(cmv: number, precoVenda: number): number {
  if (precoVenda <= 0) return 0;
  return cmv / precoVenda;
}

/**
 * Semáforo do CMV comparado à meta do restaurante (meta_margem).
 * Regra do brief:
 * - Verde:    cmv% <= meta
 * - Amarelo:  cmv% <= meta * 1.10
 * - Vermelho: cmv% >  meta * 1.10
 */
export function semaforo(cmvPercent: number, metaMargem: number): Semaforo {
  if (cmvPercent <= metaMargem) return "verde";
  if (cmvPercent <= metaMargem * 1.1) return "amarelo";
  return "vermelho";
}

/** Rótulo amigável do semáforo para exibição. */
export function rotuloSemaforo(s: Semaforo): string {
  return { verde: "Saudável", amarelo: "Atenção", vermelho: "Crítico" }[s];
}

export interface ResultadoPrato {
  cmv: number;
  cmvPercent: number;
  semaforo: Semaforo;
  /** Margem de contribuição bruta antes de taxas de canal (preço - cmv). */
  margemBruta: number;
}

/** Analisa um prato completo a partir da ficha técnica e do preço de venda. */
export function analisarPrato(
  itens: ItemFicha[],
  precoVenda: number,
  metaMargem: number,
): ResultadoPrato {
  const cmv = cmvPrato(itens);
  const cmvPercent = cmvPercentual(cmv, precoVenda);
  return {
    cmv,
    cmvPercent,
    semaforo: semaforo(cmvPercent, metaMargem),
    margemBruta: precoVenda - cmv,
  };
}

/**
 * Lucro líquido de uma venda em um canal específico, descontando a taxa do canal.
 * taxaCanal é uma fração (0.27 = 27% do iFood).
 */
export function lucroPorCanal(
  precoVenda: number,
  cmv: number,
  taxaCanal: number,
): number {
  const taxa = precoVenda * taxaCanal;
  return precoVenda - cmv - taxa;
}

/**
 * Ponto de equilíbrio (faturamento mensal necessário para cobrir contas fixas).
 * margemContribuicaoMedia é uma fração (ex.: 0.60 = 60% de margem média).
 * Retorna Infinity se a margem for <= 0 (nunca cobre os custos fixos).
 */
export function pontoEquilibrio(
  contasFixasMensais: number,
  margemContribuicaoMedia: number,
): number {
  if (margemContribuicaoMedia <= 0) return Infinity;
  return contasFixasMensais / margemContribuicaoMedia;
}

/** Formata um número como moeda brasileira (R$). */
export function formatarReal(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/** Formata uma fração como percentual brasileiro (0.305 -> "30,5%"). */
export function formatarPercent(fracao: number, casas = 1): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(fracao);
}
