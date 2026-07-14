# Ofertas Sites

Coleção de páginas de oferta/vendas (landing pages) prontas para personalizar.

## 📄 `index.html` — Landing de oferta "Producto Premium" (Espanhol)

Página de oferta/vendas genérica, em **espanhol**, no formato clássico de
página de conversão. Feita para ser adaptada a qualquer produto: basta trocar
textos, preços, imagens e o link do botão de compra.

### Resumo da página

É uma landing page de venda de um produto único, com foco em conversão e
senso de urgência. A estrutura, de cima para baixo, é:

1. **Barra superior** com contador regressivo da oferta.
2. **Hero** — título principal, subtítulo, selo de prova social ("+12.000
   clientes"), avaliação em estrelas e botão de chamada para ação (CTA).
3. **Benefícios** — 6 cartões destacando vantagens (resultados rápidos,
   qualidade garantida, fácil de usar, frete grátis, suporte 24/7, melhor preço).
4. **Como funciona** — 3 passos simples (pedir → receber → aproveitar).
5. **Depoimentos** — 3 avaliações de clientes com 5 estrelas.
6. **Oferta / Preço** — caixa de destaque com preço "de/por" (99 € → 49 €,
   -50%), parcelamento, lista de benefícios, **contador regressivo** e botão
   de compra.
7. **FAQ** — perguntas frequentes em blocos expansíveis.
8. **CTA final** + **rodapé** com links e aviso legal.

### Recursos técnicos

- **100% estática** (HTML + CSS + JS puro) — sem dependências externas, roda
  em qualquer hospedagem.
- **Responsiva** (adapta-se a celular, tablet e desktop).
- **Contador regressivo** funcional (`assets/js/script.js`), que mantém o
  tempo durante a sessão.
- **Meta tags** de SEO e Open Graph prontas.

### Estrutura de arquivos

```
ofertas-sites/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── README.md
```

## ✏️ Como personalizar

- **Textos e produto:** edite o `index.html` (título, benefícios, depoimentos, FAQ).
- **Preço e oferta:** procure a seção `id="oferta"` no `index.html`.
- **Link de compra:** troque o `href="#"` do botão "Comprar ahora..." pelo link
  do seu checkout / gateway de pagamento (há um comentário `TODO` no local).
- **Cores:** ajuste as variáveis no topo do `assets/css/style.css` (`:root`).
- **Duração da oferta:** mude `OFFER_MINUTES` no `assets/js/script.js`.

## ▶️ Como visualizar localmente

Abra o `index.html` no navegador, ou rode um servidor local:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

---

> ⚠️ **Aviso:** o conteúdo (produto, preços, depoimentos, avaliações) é
> **fictício/de exemplo**. Substitua por informações reais e verdadeiras antes
> de publicar. Depoimentos e números inventados podem violar leis de defesa do
> consumidor e políticas de plataformas de anúncios.
