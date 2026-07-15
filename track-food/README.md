# Track Food

Organizador financeiro (CMV) para donos de restaurante. Controle de custo de
mercadoria vendida, fichas técnicas, canais de venda, ponto de equilíbrio e
leitura de cardápio/nota fiscal por IA.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (tema herdado de trackfood.site)
- **Supabase** — Auth + Postgres + Storage (RLS por restaurante)
- **Claude (Anthropic) Vision** — leitura de cardápio e nota fiscal
- **Stripe** — assinatura recorrente
- **Vercel** — deploy

## Rodando localmente

```bash
cp .env.example .env.local   # preencha as chaves
npm install
npm run dev                  # http://localhost:3000
```

### Banco de dados

Aplique as migrations em `supabase/migrations/` no seu projeto Supabase
(via SQL Editor ou `supabase db push`). Elas criam as tabelas, o RLS e o
bucket de Storage `fotos`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes do motor de CMV (Vitest) |
| `npm run typecheck` | Checagem de tipos |

## Estrutura

```
app/          # rotas (login, cadastro, onboarding, painel, features)
lib/cmv/      # motor de cálculo de CMV (núcleo, testado)
lib/supabase/ # clients de auth (browser, servidor, middleware)
lib/ia/       # cliente Claude Vision + prompts
supabase/     # migrations SQL (schema + RLS + storage)
types/        # tipos das tabelas
```

## Roadmap (12 funcionalidades do MVP)

- [x] **Fase 0** — Fundação: auth, schema+RLS, motor de CMV testado, shell do app
- [ ] **Fase 1** — CMV manual: restaurante (02), canais (03), ingredientes (06),
      fichas técnicas (07), dashboard semáforo (08)
- [ ] **Fase 2** — IA: foto do cardápio (04), foto da nota (05), análise de prato (12)
- [ ] **Fase 3** — Painel do dia (09), simulador (10), contas fixas (11)
- [ ] **Fase 4** — Onboarding completo (01) + Stripe (assinatura)
```
