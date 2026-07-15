/** Prompts em português para a extração via Claude Vision. */

/** 04. Foto do cardápio -> lista de pratos. */
export const PROMPT_CARDAPIO = `
Você está lendo a foto do CARDÁPIO de um restaurante brasileiro.
Extraia TODOS os pratos visíveis com nome e preço de venda.
Responda APENAS com JSON válido, sem comentários, no formato:
[{ "nome": "string", "preco_venda": number }]
Regras:
- preco_venda em reais como número (ex.: 39.90). Se não houver preço, use 0.
- Ignore bebidas e itens sem nome claro.
`.trim();

/** 05. Foto da nota fiscal -> ingredientes comprados. */
export const PROMPT_NOTA_FISCAL = `
Você está lendo a foto de uma NOTA FISCAL / CUPOM de compra de insumos.
Extraia os itens comprados. Responda APENAS com JSON válido no formato:
[{ "nome": "string", "preco_pago": number, "quantidade": number, "unidade": "g" | "un" }]
Regras:
- preco_pago = valor total pago no item, em reais (número).
- unidade "g" para itens vendidos por peso (kg/g); nesse caso quantidade em QUILOS.
- unidade "un" para itens vendidos por unidade/pacote; quantidade em UNIDADES.
- Se a quantidade não estiver clara, use 1.
`.trim();

/** 12. Análise de um prato específico. */
export function promptAnalisePrato(dados: {
  nome: string;
  precoVenda: number;
  cmv: number;
  cmvPercent: number;
  metaMargem: number;
}): string {
  return `
Você é um consultor financeiro de restaurantes. Analise este prato e dê
recomendações práticas e diretas, em português, para o dono.
Dados:
- Prato: ${dados.nome}
- Preço de venda: R$ ${dados.precoVenda.toFixed(2)}
- CMV: R$ ${dados.cmv.toFixed(2)} (${(dados.cmvPercent * 100).toFixed(1)}%)
- Meta de CMV do restaurante: ${(dados.metaMargem * 100).toFixed(1)}%

Responda em no máximo 4 tópicos curtos: diagnóstico, principal alavanca de
custo, sugestão de preço, e um risco a observar.
`.trim();
}
