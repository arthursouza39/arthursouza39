import AppShell from "@/components/AppShell";
import ConfigRestaurante from "@/components/ConfigRestaurante";
import { restauranteAtual } from "@/lib/supabase/dados";

/** 02. Cadastro/config do restaurante com meta_margem (padrão 30%). */
export default async function RestaurantePage() {
  const { restaurante } = await restauranteAtual();
  return (
    <AppShell restaurante={restaurante}>
      <div className="page-head">
        <h1>Configurações do restaurante</h1>
        <p>Ajuste o nome e a meta de CMV que define o semáforo dos seus pratos.</p>
      </div>
      <ConfigRestaurante restaurante={restaurante} />
    </AppShell>
  );
}
