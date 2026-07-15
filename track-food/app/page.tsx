import { redirect } from "next/navigation";
import { restauranteAtual } from "@/lib/supabase/dados";

/**
 * Raiz do app: garante que o restaurante exista e encaminha o usuário.
 * - Sem sessão -> /login (via restauranteAtual)
 * - Onboarding incompleto -> /onboarding
 * - Tudo pronto -> /painel
 */
export default async function Home() {
  const { restaurante } = await restauranteAtual();
  redirect(restaurante.onboarding_completo ? "/painel" : "/onboarding");
}
