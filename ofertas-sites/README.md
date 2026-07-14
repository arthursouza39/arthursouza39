# Ofertas Sites — Ensaladas en Frasco

Landing page de vendas em espanhol para o produto **"Ensaladas en Frasco + Aderezos"**
(60 receitas de saladas em pote). Réplica fiel do site de referência, com as
**cores originais**, os **textos** e a **estrutura**, feita para você personalizar.

> As imagens e vídeos foram substituídos por **placeholders com texto** — troque
> pelos seus arquivos. Os espaços de vídeo já estão prontos para incorporar.

## 🎨 Paleta (do site original)

| Cor | Uso | Hex |
|-----|-----|-----|
| Verde-sálvia | Seções verdes / hero | `#c9cfa8` |
| Creme | Seções alternadas | `#faf4e2` |
| Verde | Botões | `#5d9030` |
| Verde-oliva | Títulos / logo | `#4b5a2a` |
| Vermelho | Preços tachados / X | `#c53929` |
| Laranja | Fita "GRATIS" | `#e8871e` |

## 🧩 Estrutura da página

1. **Barra flutuante** (marca + botão "¡Quiero ahora!")
2. **Hero** — selo "+5.000 personas", logo *ensaladas en frasco*, headline "60 RECETAS…", imagem e CTA
3. **Lo que vas a encontrar** — checklist de 7 itens + imagem + CTA
4. **Ensaladas de la semana** — cards (nome, conservação 7 días, calorias)
5. **Frescura y aderezos irresistibles** — imagens
6. **Adelanto de la clase 1** — 🎥 **espaço de vídeo**
7. **+ 3 bonos exclusivos** — Smoothies Detox, Shots Matutinos, Aguas Saborizadas (R$29,90 → ¡Gratis!)
8. **Mensajes / testimonios** — 🎥 **espaço de vídeo** + 3 depoimentos estilo WhatsApp
9. **¿Esto te pasa a ti?** — lista de dores
10. **Oferta** — mockup do produto + preço + CTA
11. **Rodapé**

## 🖼️ Placeholders de imagem

Onde havia foto, há uma caixa tracejada com ícone e texto descrevendo o que vai
ali. Para trocar, substitua o bloco `<div class="img-ph">…</div>` pela sua imagem:

```html
<img src="assets/img/minha-foto.jpg" alt="Ensalada en frasco" />
```

## 🎥 Espaços de vídeo

Há 2 espaços de vídeo (`<div class="video-ph">…</div>`). Para incorporar,
substitua o bloco pelo embed, por exemplo:

```html
<div style="max-width:320px;margin:0 auto;aspect-ratio:9/16;">
  <iframe src="https://www.youtube.com/embed/SEU_ID" style="width:100%;height:100%;border:0;border-radius:18px;" allowfullscreen></iframe>
</div>
```

## ✏️ Personalizar

- **Textos:** `index.html`
- **Preço:** seção `id="oferta"` (⚠️ o preço principal **não aparecia** nas
  capturas — coloquei `R$29,90` como placeholder; ajuste para o seu valor real).
  Os bônus estão com `R$29,90` como no print.
- **Cores:** variáveis no topo de `assets/css/style.css` (`:root`)
- **Link de compra:** troque o `href="#"` do botão da oferta pelo seu checkout.
- **Fontes:** carregadas do Google Fonts (Yellowtail, Anton, Poppins) no `<head>`.

## ▶️ Visualizar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

---

> ⚠️ Depoimentos, números e preços são de exemplo/baseados na referência.
> Use apenas informações reais antes de publicar, para não infringir leis de
> defesa do consumidor nem políticas de plataformas de anúncios.
