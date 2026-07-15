import { redirect } from "next/navigation";
import { criarClienteServidor } from "./server";
import type { Restaurante } from "@/types/database";

/**
 * Carrega o restaurante do usuário logado (para páginas do app).
 * Redireciona para /login se não houver sessão e /cadastro se não houver
 * restaurante. Use no topo de cada Server Component protegido.
 */
export async function restauranteAtual(): Promise<{
  restaurante: Restaurante;
  userId: string;
}> {
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

  if (restaurante) return { restaurante: restaurante as Restaurante, userId: user.id };

  // Primeiro acesso: cria o restaurante a partir do nome informado no cadastro
  // (guardado nos metadados do usuário). Robusto ao fluxo de confirmação de
  // e-mail, em que a sessão só existe depois do clique no link.
  const nome = (user.user_metadata?.nome_restaurante as string)?.trim() || "Meu Restaurante";
  const { data: novo } = await supabase
    .from("restaurantes")
    .insert({ user_id: user.id, nome })
    .select("*")
    .single();

  if (!novo) redirect("/login");
  return { restaurante: novo as Restaurante, userId: user.id };
}
