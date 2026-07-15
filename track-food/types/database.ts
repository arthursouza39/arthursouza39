import type { Unidade } from "@/lib/cmv/calculos";

/** Tipos das tabelas do banco (espelham supabase/migrations). */

export interface Restaurante {
  id: string;
  user_id: string;
  nome: string;
  meta_margem: number;
  onboarding_completo: boolean;
  assinatura_status: "trial" | "ativa" | "cancelada";
  stripe_customer_id: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CanalVenda {
  id: string;
  restaurante_id: string;
  nome: string;
  taxa: number;
  ativo: boolean;
  criado_em: string;
}

export interface Ingrediente {
  id: string;
  restaurante_id: string;
  nome: string;
  unidade: Unidade;
  preco_pago: number;
  quantidade: number;
  preco_por_unidade: number;
  origem: "manual" | "nota_fiscal";
  criado_em: string;
  atualizado_em: string;
}

export interface Prato {
  id: string;
  restaurante_id: string;
  nome: string;
  preco_venda: number;
  confirmado: boolean;
  origem: "manual" | "cardapio_ia";
  criado_em: string;
  atualizado_em: string;
}

export interface FichaItem {
  id: string;
  prato_id: string;
  ingrediente_id: string;
  qtd: number;
  criado_em: string;
}

export interface ContaFixa {
  id: string;
  restaurante_id: string;
  descricao: string;
  valor_mensal: number;
  criado_em: string;
}

export interface Upload {
  id: string;
  restaurante_id: string;
  tipo: "cardapio" | "nota_fiscal";
  storage_path: string;
  status: "pendente" | "processado" | "erro";
  resultado_ia: unknown | null;
  criado_em: string;
}
