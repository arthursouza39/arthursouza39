import Anthropic from "@anthropic-ai/sdk";

/**
 * Cliente Claude (Anthropic) para leitura de imagens.
 * Usado para extrair pratos de fotos de cardápio (04) e ingredientes de
 * fotos de nota fiscal (05), além da análise de prato (12).
 */
export const MODELO_VISAO = "claude-opus-4-8";

let _cliente: Anthropic | null = null;

export function clienteIA(): Anthropic {
  if (!_cliente) {
    _cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _cliente;
}

export type MimeImagem = "image/jpeg" | "image/png" | "image/webp";

/**
 * Envia uma imagem (base64) + prompt e retorna o texto da resposta.
 * O chamador é responsável por pedir e validar JSON no prompt.
 */
export async function lerImagem(
  base64: string,
  mime: MimeImagem,
  prompt: string,
): Promise<string> {
  const resp = await clienteIA().messages.create({
    model: MODELO_VISAO,
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mime, data: base64 },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
  });

  const bloco = resp.content.find((c) => c.type === "text");
  return bloco && bloco.type === "text" ? bloco.text : "";
}

/** Extrai o primeiro objeto/array JSON de um texto (a IA às vezes envolve em prosa). */
export function extrairJSON<T>(texto: string): T {
  const match = texto.match(/```json\s*([\s\S]*?)```/) ?? texto.match(/([\[{][\s\S]*[\]}])/);
  const bruto = match ? match[1] : texto;
  return JSON.parse(bruto.trim()) as T;
}
