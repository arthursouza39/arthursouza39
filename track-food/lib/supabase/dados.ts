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

  if (!restaurante) redirect("/cadastro");
  return { restaurante: restaurante as Restaurante, userId: user.id };
}
