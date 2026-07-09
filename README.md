# Handoff: Site Farol da Foz Ecoturismo + Painel Admin

## Visão geral
Reconstrução completa do site institucional da **Farol da Foz Ecoturismo** (passeios de ecoturismo na foz do Rio São Francisco, Piaçabuçu/AL) com uma nova identidade visual profissional, **mais um Painel Admin** para o dono (sem conhecimento técnico) gerir todo o conteúdo.

O site é simples: os botões principais levam para o **WhatsApp**. Não há checkout nem back-office além do painel de conteúdo.

## Sobre os arquivos deste pacote
Os arquivos `.dc.html` são **referências de design feitas em HTML** — protótipos que mostram o visual e o comportamento pretendidos, **não são código de produção para copiar diretamente**. A tarefa é **recriar esses designs no ambiente do codebase existente** usando seus padrões e bibliotecas.

O site atual do cliente já existe e foi feito em **React + Vite + TypeScript + Tailwind (projeto Lovable)**. O ideal é reconstruir dentro dessa stack, reaproveitando a estrutura de rotas/componentes já existente. Se preferir recomeçar, React + Tailwind é a escolha recomendada.

> Os arquivos abrem no navegador e usam um runtime interno de componentes ("DCLogic"/`support.js`) que **NÃO deve ser portado** — é apenas o motor do protótipo. Leia o markup/estilos inline e a lógica da classe `Component` para extrair valores, textos e comportamento.

## Fidelidade
**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamentos, raios, sombras e interações são finais. Recrie pixel-a-pixel usando as bibliotecas do codebase. Onde houver fotos "amadoras" de placeholder, o cliente substituirá pelo Painel Admin.

---

## Design tokens

**Cores**
- Marinho (texto/escuro): `#1a2b3d`; variação profunda (rodapé/CTA): `#12212f`; azul-aço (gradiente frota): `#22384f`
- Dourado (acento principal): `#f2a900`; dourado suave (destaques sobre escuro): `#f0c257`; dourado texto sobre claro: `#a06d00` / `#b8862f`
- Verde WhatsApp: `#25d366`; verde ecoturismo (secundário): `#0c7b6e` / `#2f8f6b`
- Fundos: `#faf8f3` (creme claro), `#fdf6e6` (creme quente), `#ffffff`; painel admin usa `#eef1f5`
- Texto secundário: `#5c6b7e` / `#6b7787` / `#8592a3`; bordas: `#f0e6cc`, `#e3e7ee`, `#dfe3ea`

**Tipografia**
- Títulos/UI: **Poppins** (500/600/700/800). H1 hero: clamp(40px, 8vw, 88px), weight 700, letter-spacing -.025em.
- Corpo: **Montserrat** (400–700).
- Rótulos de seção: Poppins 600/700, 12px, uppercase, letter-spacing .14–.16em, cor dourada.

**Layout**
- Raio padrão: **16px** (cards), 999px (botões/pílulas), 10–14px (inputs/ícones).
- Sombra padrão: `0 16px 38px -30px rgba(26,43,61,.4)`.
- Largura máx. de conteúdo: 1080–1200px. Espaçamento de seção: clamp(56px, 9vw, 110px).
- Breakpoint mobile: 900–920px (menu vira gaveta/hambúrguer).

**Ícones:** SVG stroke, width 1.6–2. Sem biblioteca externa (todos inline no protótipo).

---

## Telas / Seções

### SITE (`Farol da Foz.dc.html`) — página única com âncoras
Ordem das seções: **Header fixo → Hero → Passeios → Sobre → Diferenciais → Frota → Avaliações → Galeria (resumo) → Nossa Base → CTA final → Rodapé.** Overlays (páginas que abrem por cima): **Detalhe do passeio**, **Galeria completa**, **Nossa estrutura (base)**.

1. **Header** — fixo, transparente sobre o hero (logo branca) e vira branco sólido + logo escura ao rolar (>60px). Menu (6 itens): Passeios, Sobre, Frota, Galeria, Avaliações, Nossa Base. Botão dourado "Reservar". Mobile: hambúrguer → gaveta lateral. Logo topo 62px / rolado 46px.
2. **Hero** — full-screen, foto de fundo (`assets/hero-buggy.png`) + overlay gradiente marinho. Etiqueta de localização (vidro fosco), H1 em 2 linhas ("Viva a Foz do" + "São Francisco" dourado), subtítulo, 2 botões (verde "Reservar pelo WhatsApp" + outline "Ver os passeios"), seta "Explore".
3. **Passeios** — grid de **3 colunas** (1 no mobile), 3 cards: Rota Dourada, Rota Dourada Plus (destaque "MAIS COMPLETO"), Passeio de Barco. Cada card: foto, etiqueta, preço "a partir de R$", nome, descrição curta, duração, grupos, botões "Reservar agora" (WhatsApp) + "Ver detalhes e preços" (abre overlay de detalhe).
4. **Detalhe do passeio (overlay)** — foto grande + título, "Sobre o passeio", chips "O que você vai viver", lista "O que está incluso", card lateral com preço (à vista/cartão), duração, saídas, saída mínima e botão WhatsApp.
5. **Sobre** — imagem + texto ("Nossa História"), com botão "Ver mais" que expande parágrafos.
6. **Diferenciais** — 6 cards compactos em **1 linha no desktop / 2 colunas no mobile** (ícone + título + texto): Pioneiros na Foz, ABETA & SEBRAE, Experientes em Dunas, Ecoturismo Responsável, Grupos Pequenos, Piaçabuçu·Alagoas.
7. **Frota** — fundo marinho, 3 veículos (Carcará Superbuggy, Cabrita L-200, Capivara Ranger) com foto, nome, capacidade, texto.
8. **Avaliações** — vinculada ao **TripAdvisor** (link: https://www.tripadvisor.com.br/Attraction_Review-g2529360-d2333778-Reviews-Farol_da_Foz_Ecoturismo-Piacabucu_State_of_Alagoas.html). Cartão de nota (4,9 · Excelente · 1.164 avaliações · selo Tripadvisor) + carrossel horizontal de depoimentos + botão "Deixe sua avaliação".
9. **Galeria (resumo)** — faixa horizontal com scroll lateral + botão "Ver galeria completa" → abre **Galeria completa (overlay)** com filtros (Todos/Dunas/Rio&Barco/Frota/Nossa Base), grid e **lightbox** (setas, contador, legenda).
10. **Nossa Base** — estrutura (tópicos) + segurança (tópicos) + fotos + botão "Conheça nossa estrutura" → abre **overlay "Nossa estrutura"** (texto, grid de comodidades, bloco de segurança, bloco "Quem cuida da sua experiência" = Quem Somos + card do diretor **Robério Góes** com foto/bio/contatos, e CTA).
11. **CTA final** — bloco marinho "Pronto para sua aventura?" + botão WhatsApp.
12. **Rodapé** — logo, descrição, redes (Instagram/Facebook), contato (WhatsApp/e-mail/endereço), navegação, selos **ABETA + Aventura Segura + Caminho das Águas**, e crédito **"Desenvolvido por Camaleão Digital"** (link https://wa.me/5582998439385).

### PAINEL ADMIN (`Painel Admin.dc.html`) — CMS para o dono
Layout: sidebar escura (11 seções) + topbar (título + "Publicar") + área de formulários. Salva automaticamente. Seções e campos editáveis:
- **Topo (Hero):** etiqueta, título linha 1, título linha 2, subtítulo, foto de fundo.
- **Passeios:** por passeio — nome, etiqueta, preço, preço no cartão, duração, saída mínima, descrição curta, descrição completa, foto, marcar destaque; adicionar/remover.
- **Sobre:** rótulo, título, parágrafos, foto.
- **Diferenciais:** 6× (título + descrição).
- **Frota:** por veículo — nome, capacidade, descrição, foto.
- **Avaliações:** nota, total, e depoimentos (nome, tipo de viagem, data, texto); adicionar/remover.
- **Galeria:** adicionar/remover fotos + categoria de cada.
- **Nossa Base:** texto, itens de estrutura (add/remove), itens de segurança (add/remove), direção (nome, cargo, bio, foto).
- **Contato & Rodapé:** WhatsApp, e-mail, endereço, Instagram, Facebook.
- **Configurações:** logo, WhatsApp global (usado em todos os botões), e-mail.

---

## Comportamento & interações
- **Todos os CTAs primários abrem o WhatsApp** `https://wa.me/5582999751975` com mensagem pré-preenchida (ex.: "Olá! Tenho interesse no passeio {nome}..."). O número deve vir de uma **config única** (ver Admin › Configurações).
- Header muda de estilo no scroll (>60px): fundo, sombra, cor do logo/links.
- Overlays: detalhe do passeio, galeria completa e estrutura da base abrem sobre a página (fixed, scroll próprio) com botão "Voltar".
- Galeria: filtros por categoria + lightbox com navegação ‹ › e contador.
- Depoimentos e galeria-resumo: scroll horizontal (setas no desktop, arrastar no mobile).
- "Ver mais" no Sobre expande/colapsa parágrafos.
- Transições suaves em hover (translateY -2/-3px, sombra), 150–250ms.
- Animações de entrada no hero (fade+translate, ~0.6s escalonado).

## Gestão de conteúdo (Admin → Site)
O Painel Admin é o **modelo dos campos** que o dono edita. Ao implementar de verdade, conecte esses campos a uma fonte de dados (JSON versionado, CMS headless, ou banco) e faça o site ler de lá. No protótipo, os textos persistem em `localStorage` (chave `ffAdminData`) e as fotos em componentes `image-slot` — isso é só demonstração; a produção precisa de persistência real e upload de imagens.

Estrutura de dados sugerida (já modelada na classe `Component` do painel): `settings, hero, about, tours[], features[], fleet[], reviews{score,total,items[]}, gallery[], base{intro,structure[],safety[],director{}}, contact{}`.

## Dados de contato reais
- WhatsApp (reservas): **(82) 99975-1975** → `https://wa.me/5582999751975`
- E-mail: **faroldafoztur@hotmail.com**
- Local: **Piaçabuçu · Alagoas** (a ~140 km de Maceió)
- Crédito rodapé: Camaleão Digital → `https://wa.me/5582998439385`
- Certificações/parceiros: ABETA, SEBRAE, Aventura Segura, Caminho das Águas

## Assets
As imagens estão na pasta `assets/` (fotos de dunas, rio, frota, base, hero) e os selos. As fotos da base são placeholders — o cliente enviará melhores pelo Admin. Recrie os ícones como SVG inline ou use a biblioteca de ícones do codebase (equivalentes a Lucide/Feather).

## Arquivos neste pacote
- `Farol da Foz.dc.html` — site completo (referência de design).
- `Painel Admin.dc.html` — painel de gestão (referência de design).
- `assets/` — imagens e selos usados.
- `image-slot.js`, `support.js` — runtime do protótipo (NÃO portar; apenas para abrir os arquivos no navegador).
