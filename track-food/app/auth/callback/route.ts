import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";

/**
 * Callback de autenticação: troca o código do link de confirmação de e-mail
 * por uma sessão e leva o usuário para dentro do app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = criarClienteServidor();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/`);
}
