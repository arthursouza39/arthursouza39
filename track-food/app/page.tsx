import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";

/**
 * Raiz do app: decide para onde mandar o usuário.
 * - Sem sessão -> /login
 * - Com sessão e onboarding incompleto -> /onboarding
 * - Com sessão e onboarding completo -> /painel
 */
export default async function Home() {
  const supabase = criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: restaurante } = await supabase
    .from("restaurantes")
    .select("onboarding_completo")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!restaurante?.onboarding_completo) redirect("/onboarding");
  redirect("/painel");
}
