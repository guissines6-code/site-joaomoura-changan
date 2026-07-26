---
name: run-site-joao-moura
description: Sobe o site (index.html), navega e tira screenshots de todas as seções em mobile e desktop, testa o menu hamburguer e o accordion do FAQ, e reporta erros de console/página. Use quando pedirem para rodar, testar, abrir, screenshotar ou verificar visualmente o site do João Moura (index.html) — inclui checar se uma mudança de CSS/HTML/JS quebrou algo antes de reportar como concluída.
---

Site estático (HTML puro + Tailwind compilado localmente via CLI, sem CDN). É
servido por um file server local e dirigido por `driver.mjs` (Playwright-core
controlando o Chrome já instalado no sistema — não há `chromium-cli` nem `xvfb`
neste ambiente Windows). Todos os caminhos abaixo são relativos à raiz do
repositório (`<repo>/`).

O arquivo alvo é sempre **`index.html`** (na raiz) — é a versão oficial, em produção
na Vercel. O antigo v1 foi arquivado como `index-v1-legado.html` e não deve ser
testado a menos que peçam explicitamente. Se mexer em classes Tailwind, rode
`npm run build:css` na raiz do repo antes de testar (gera `assets/css/tailwind.css`
a partir de `assets/css/tailwind-input.css` + `tailwind.config.js`).

## Prerequisites

Node.js (qualquer versão recente) e o Google Chrome instalado no caminho padrão do
Windows (`C:/Program Files/Google/Chrome/Application/chrome.exe`) — o driver detecta
esse caminho automaticamente.

## Setup

A dependência (`playwright-core`) fica isolada dentro do próprio diretório do skill,
sem afetar o site (que continua sem npm/build step):

```bash
cd .claude/skills/run-site-joao-moura
npm install
```

## Run (agent path)

1. Suba o servidor estático na raiz do repo, se ainda não estiver rodando (checagem
   por polling, não por sleep fixo):

```bash
npx serve -l 8080 . &
timeout 15 bash -c 'until curl -sf -o /dev/null http://localhost:8080/index.html; do sleep 0.5; done'
```

2. Rode o driver:

```bash
cd .claude/skills/run-site-joao-moura
node driver.mjs
```

Isso abre o Chrome duas vezes (mobile 390×844, depois desktop 1440×900), navega até
`http://localhost:8080/index.html`, rola até cada seção (`#destaque-unit`,
`#modelos`, `#diferenciais`, `#depoimentos`, `#faq`, `#contato`, e o footer),
screenshota cada uma, testa o menu hamburguer no mobile e o accordion do FAQ, e ao
final imprime qualquer erro de console/página capturado (ou "nenhum erro encontrado").

Screenshots → `.claude/skills/run-site-joao-moura/.tmp-shots/<viewport>-<seção>.png`
(pasta recriada a cada execução; não é versionada).

Para testar outra URL ou outra pasta de saída:

```bash
node driver.mjs http://localhost:8080/index.html /caminho/customizado
```

**Depois de rodar, olhe as screenshots** (Read tool) — o driver só garante que a
página carregou e não jogou erro no console; não garante que o layout está correto
visualmente.

## Run (human path)

```bash
npx serve -l 8080 .
```

Abrir `http://localhost:8080/index.html` no navegador manualmente. `Ctrl+C` para
parar o servidor.

---

## Gotchas

- **Contadores animados (`.stat-counter`/`.unit-counter`) aparecem com valor parcial
  no screenshot.** A animação dura 3s (`data-duration="3000"`) e dispara quando a
  seção entra na viewport; o driver espera só ~1s antes do primeiro screenshot do
  hero, então números como "+8"/"1000+"/"4.98★" podem aparecer como "+6"/"772+"/
  "3.84★" na imagem. Isso **não é bug** — é só o timing do teste. Se precisar do
  valor final na screenshot, aumente o `waitForTimeout` correspondente para 3500ms+.
- **Nomes de ícone Iconify podem ser inválidos silenciosamente.** `<iconify-icon>`
  não lança erro de console quando o nome não existe — ele renderiza vazio. Já
  aconteceu com `solar:car-linear` (nunca existiu no set `solar`; a API do Iconify
  só retorna resultados de "card"/cartão de crédito para essa busca). Se um ícone
  não aparecer numa screenshot mas também não houver erro no console, suspeite do
  nome do ícone — confirme em `https://api.iconify.design/search?query=...&prefix=...`
  antes de usar um nome novo.
- **Overlap do Hero com a navbar fixa só aparece em viewport desktop (~1440×900),
  não em mobile.** Se o `h1` do Hero quebrar em mais linhas do que o esperado (ex.
  `md:text-7xl` quebrando em 4 linhas), o bloco de conteúdo — que é
  `md:absolute md:bottom-0` dentro do card do Hero — pode ultrapassar a altura do
  card e subir por trás/sob a navbar fixa. Sempre tire o screenshot desktop do hero
  e olhe se o texto não está cortado no topo.

## Troubleshooting

- **`Chrome não encontrado em nenhum dos caminhos esperados`**: o driver só procura
  em `C:/Program Files/Google/Chrome/Application/chrome.exe` e na variante x86. Se o
  Chrome estiver em outro lugar, edite `CHROME_CANDIDATES` no topo de `driver.mjs`.
- **Screenshot do vídeo de fundo aparece em preto/vazio no desktop**: limitação
  conhecida de compositing de vídeo em Chromium headless neste ambiente — não é
  necessariamente um bug do site. O mesmo vídeo costuma aparecer normalmente na
  screenshot mobile do mesmo run. Não trate isso como defeito sem confirmar
  visualmente no navegador real (`Run (human path)`).
