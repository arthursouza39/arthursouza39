-- ============================================================================
-- Track Food — Schema inicial
-- Banco relacional (Postgres/Supabase) com RLS por restaurante.
-- Cada usuário (auth.users) é dono de um ou mais restaurantes; todos os dados
-- são isolados pelo restaurante_id via Row Level Security.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 02. Restaurante (com meta_margem padrão 30%)
-- ---------------------------------------------------------------------------
create table if not exists public.restaurantes (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  nome                text not null,
  meta_margem         numeric(5,4) not null default 0.30,  -- 30%
  onboarding_completo boolean not null default false,
  assinatura_status   text not null default 'trial',        -- trial | ativa | cancelada
  stripe_customer_id  text,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 03. Canais de venda (iFood/Rappi/Salão/Delivery) com taxa configurável
-- ---------------------------------------------------------------------------
create table if not exists public.canais_venda (
  id             uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references public.restaurantes(id) on delete cascade,
  nome           text not null,
  taxa           numeric(5,4) not null default 0,  -- fração: 0.27 = 27%
  ativo          boolean not null default true,
  criado_em      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 06. Ingredientes (preco_por_unidade = preco_pago / quantidade)
--     preco_por_unidade é coluna GERADA para nunca sair de sincronia.
-- ---------------------------------------------------------------------------
create table if not exists public.ingredientes (
  id                uuid primary key default gen_random_uuid(),
  restaurante_id    uuid not null references public.restaurantes(id) on delete cascade,
  nome              text not null,
  unidade           text not null default 'g' check (unidade in ('g','un')),
  preco_pago        numeric(12,2) not null default 0,
  quantidade        numeric(12,4) not null default 1 check (quantidade > 0),
  preco_por_unidade numeric(12,6)
    generated always as (preco_pago / nullif(quantidade, 0)) stored,
  origem            text not null default 'manual',  -- manual | nota_fiscal
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 04. Pratos (extraídos do cardápio ou cadastrados)
-- ---------------------------------------------------------------------------
create table if not exists public.pratos (
  id             uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references public.restaurantes(id) on delete cascade,
  nome           text not null,
  preco_venda    numeric(12,2) not null default 0,
  confirmado     boolean not null default false,  -- dono confirma extração da IA
  origem         text not null default 'manual',  -- manual | cardapio_ia
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 07. Ficha técnica (itens que compõem o CMV de cada prato)
-- ---------------------------------------------------------------------------
create table if not exists public.ficha_itens (
  id             uuid primary key default gen_random_uuid(),
  prato_id       uuid not null references public.pratos(id) on delete cascade,
  ingrediente_id uuid not null references public.ingredientes(id) on delete restrict,
  qtd            numeric(12,4) not null default 0,  -- em gramas ou unidades
  criado_em      timestamptz not null default now(),
  unique (prato_id, ingrediente_id)
);

-- ---------------------------------------------------------------------------
-- 11. Contas fixas (para ponto de equilíbrio)
-- ---------------------------------------------------------------------------
create table if not exists public.contas_fixas (
  id             uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references public.restaurantes(id) on delete cascade,
  descricao      text not null,
  valor_mensal   numeric(12,2) not null default 0,
  criado_em      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 04/05. Uploads (fotos de cardápio e nota fiscal + resultado bruto da IA)
-- ---------------------------------------------------------------------------
create table if not exists public.uploads (
  id             uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references public.restaurantes(id) on delete cascade,
  tipo           text not null check (tipo in ('cardapio','nota_fiscal')),
  storage_path   text not null,
  status         text not null default 'pendente', -- pendente | processado | erro
  resultado_ia   jsonb,
  criado_em      timestamptz not null default now()
);

-- Índices para consultas por restaurante
create index if not exists idx_canais_restaurante on public.canais_venda(restaurante_id);
create index if not exists idx_ingredientes_restaurante on public.ingredientes(restaurante_id);
create index if not exists idx_pratos_restaurante on public.pratos(restaurante_id);
create index if not exists idx_ficha_prato on public.ficha_itens(prato_id);
create index if not exists idx_contas_restaurante on public.contas_fixas(restaurante_id);
create index if not exists idx_uploads_restaurante on public.uploads(restaurante_id);

-- ============================================================================
-- Row Level Security: cada usuário só enxerga dados dos SEUS restaurantes.
-- ============================================================================
alter table public.restaurantes enable row level security;
alter table public.canais_venda enable row level security;
alter table public.ingredientes enable row level security;
alter table public.pratos       enable row level security;
alter table public.ficha_itens  enable row level security;
alter table public.contas_fixas enable row level security;
alter table public.uploads      enable row level security;

-- Restaurantes: dono direto (user_id = auth.uid())
create policy "restaurantes_do_dono" on public.restaurantes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Helper: um restaurante_id pertence ao usuário logado?
create or replace function public.eh_dono_do_restaurante(rid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.restaurantes r
    where r.id = rid and r.user_id = auth.uid()
  );
$$;

-- Tabelas filhas: acesso via restaurante_id do dono
create policy "canais_do_dono" on public.canais_venda
  for all using (public.eh_dono_do_restaurante(restaurante_id))
  with check (public.eh_dono_do_restaurante(restaurante_id));

create policy "ingredientes_do_dono" on public.ingredientes
  for all using (public.eh_dono_do_restaurante(restaurante_id))
  with check (public.eh_dono_do_restaurante(restaurante_id));

create policy "pratos_do_dono" on public.pratos
  for all using (public.eh_dono_do_restaurante(restaurante_id))
  with check (public.eh_dono_do_restaurante(restaurante_id));

create policy "contas_do_dono" on public.contas_fixas
  for all using (public.eh_dono_do_restaurante(restaurante_id))
  with check (public.eh_dono_do_restaurante(restaurante_id));

create policy "uploads_do_dono" on public.uploads
  for all using (public.eh_dono_do_restaurante(restaurante_id))
  with check (public.eh_dono_do_restaurante(restaurante_id));

-- Ficha técnica: acesso via prato -> restaurante
create policy "ficha_do_dono" on public.ficha_itens
  for all using (
    exists (
      select 1 from public.pratos p
      where p.id = prato_id and public.eh_dono_do_restaurante(p.restaurante_id)
    )
  )
  with check (
    exists (
      select 1 from public.pratos p
      where p.id = prato_id and public.eh_dono_do_restaurante(p.restaurante_id)
    )
  );
