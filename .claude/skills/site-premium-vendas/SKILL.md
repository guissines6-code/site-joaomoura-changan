---
name: site-premium-vendas
description: Constrói, revisa e refina sites e landing pages premium voltados para venda e captação de contatos. Use SEMPRE que o usuário pedir para criar, ajustar, estilizar, animar ou avaliar qualquer parte de um site — seção, hero, card, carrossel, formulário, CTA, navbar, rodapé, página de produto — mesmo que ele não use as palavras "design" ou "UX". Também use quando ele disser que algo "ficou feio", "ficou cru", "não parece profissional", "parece template", "está solto na página", ou quando pedir para deixar algo "mais bonito", "mais premium", "mais impactante" ou "com mais efeito". Cobre hierarquia visual, tipografia, espaçamento, cor, movimento/animação, responsividade mobile-first, copy de conversão, acessibilidade e performance.
---

# Site Premium de Vendas

Guia para construir interfaces web que vendem e parecem feitas por um profissional — não por um gerador automático.

## Princípio central

Um site de vendas tem uma única missão: **levar o visitante do "quem é isso?" ao "quero falar com essa pessoa"** com o mínimo de atrito. Toda decisão de design serve a isso. Beleza sem clareza não converte; clareza sem beleza não gera confiança.

Antes de escrever qualquer código, responda mentalmente:
1. **Quem** vai ver essa tela e em que estado mental?
2. **Qual a única ação** que essa seção deve provocar?
3. **O que essa seção prova** sobre quem vende?
4. **O que a torna diferente** de qualquer template genérico?

Se não conseguir responder as quatro, pergunte ao usuário antes de codar.

---

## Evitar "cara de IA"

Existe um conjunto de escolhas que denuncia site gerado automaticamente. Evite por padrão:

- Gradiente roxo/azul-violeta sem motivo
- Inter/Roboto como fonte única sem intenção
- Grade de 3 cards idênticos com ícone circular em cima
- Glassmorphism aplicado em tudo
- Sombras genéricas iguais em todos os elementos
- Texto centralizado em todas as seções
- Emoji como ícone em interface séria
- Frases vazias: "solução completa", "excelência em atendimento", "o melhor para você"

**Em vez disso:** comprometa-se com uma direção estética específica e leve ela até o fim. Um site premium escuro e cinematográfico não pode ter uma seção clara com cards genéricos no meio — isso quebra a promessa visual.

---

## Hierarquia visual

O olho precisa saber onde pousar primeiro. Em cada seção deve haver **um** elemento dominante, não três competindo.

Ordem típica de leitura em landing page:
1. Imagem/vídeo grande (chama)
2. Título curto (explica)
3. Subtítulo/apoio (contextualiza)
4. Prova (números, foto real, depoimento)
5. CTA (age)

**Regras práticas:**
- Diferença de tamanho entre título e corpo deve ser clara (mínimo 2x)
- Um só CTA primário por seção; secundários usam estilo visualmente mais fraco (borda, fundo translúcido)
- Se tudo está em destaque, nada está

---

## Espaçamento e ritmo

O erro mais comum em site amador é **espaçamento apertado e uniforme**. Espaço em branco é o que faz algo parecer caro.

- Use uma escala consistente (ex: 4, 8, 12, 16, 24, 32, 48, 64, 96px). Não invente valores aleatórios.
- Espaço **entre** seções deve ser bem maior que o espaço **dentro** de uma seção (isso agrupa visualmente)
- Elementos relacionados ficam próximos; elementos não relacionados ficam distantes (lei da proximidade)
- Seções alternando fundo claro/escuro criam ritmo e evitam a sensação de rolagem infinita monótona

---

## Integração de mídia (o erro mais frequente)

Foto e vídeo colados num card com borda dura são o que mais faz um site parecer amador. Mídia de destaque deve **pertencer ao ambiente**, não flutuar sobre ele.

Técnicas, em ordem de eficácia:
1. **Costura por gradiente** — sobreponha um gradiente da cor de fundo da página nas bordas superior/inferior da mídia, fazendo ela se fundir com a seção
2. **Glow atrás** — um `radial-gradient` desfocado (`filter: blur(40-60px)`) na cor de destaque, posicionado atrás da mídia, cria a sensação de iluminação de vitrine
3. **Sombra profunda** — `box-shadow: 0 20px 60px rgba(0,0,0,0.5)` dá flutuação e profundidade
4. **Borda de vidro** — uma segunda sombra `0 0 0 1px rgba(255,255,255,0.08)` suaviza o corte da imagem
5. **Full-bleed** — mídia de ponta a ponta da viewport, sem margem lateral, para momentos de imersão

**Nunca** tente integrar uma foto escurecendo-a com filtros pesados: isso apaga o conteúdo. Trabalhe o **entorno**, não a foto.

**Marca d'água de IA:** se a mídia tiver marca d'água, esconda com `overflow: hidden` no wrapper + `transform: scale()` e `object-position` ajustada, cortando a região da marca — nunca deixe visível.

---

## Movimento e animação

Animação existe para **guiar atenção e dar vida**, nunca para enfeitar. Se a animação não comunica nada, remova.

**Padrões que funcionam:**
- **Reveal on scroll** — elementos entram com `opacity: 0 → 1` e `translateY(24px → 0)`, transição de ~0.8s com easing `cubic-bezier(.22,1,.36,1)`. Dispare com `IntersectionObserver`.
- **Contador animado** — números sobem de 0 ao valor final quando entram na tela (~1,5s, via `requestAnimationFrame`). Só em números que impressionam.
- **Pulso sutil** — `@keyframes` infinito em `box-shadow`/`opacity` para badges de destaque. Suave, nunca piscante.
- **Hover com propósito** — `scale(1.03-1.05)` em cards/imagens, com `transition` de 300-700ms e `ease-out`.
- **Vídeo de fundo** — sempre `muted`, `loop`, `playsinline`, `preload="metadata"`, sem controles.

**Regras:**
- Duração: micro-interações 150-300ms; entradas 600-900ms
- Anime só `transform` e `opacity` (são performáticos); evite animar `width`, `height`, `top`, `left`
- Nada deve se mover sem que o usuário tenha causado ou percebido o motivo
- Respeite `prefers-reduced-motion`: desative animações não essenciais

---

## Mobile-first (inegociável em site de vendas)

A maioria do tráfego de landing page de vendedor vem de rede social, ou seja, celular. Projete o mobile primeiro e o desktop como adaptação.

**Checklist obrigatório:**
- Alvos de toque com no mínimo 44x44px
- Nada de rolagem horizontal acidental (`overflow-x: hidden` no `html`/`body`)
- Texto do corpo com no mínimo 15-16px
- CTA principal alcançável com o polegar (terço inferior da tela)
- Botão flutuante fixo não pode cobrir conteúdo importante nem outros botões
- Carrossel: usar `scroll-snap` e gesto de arrastar; setas são complemento, não a única forma
- Testar em largura de ~375px

**Cuidado com carrossel:** ele esconde conteúdo. Se são poucos itens (até 4-6) e todos importam, prefira **grade estática** — o usuário vê tudo sem esforço. Carrossel só quando há muitos itens ou quando o foco em um por vez é intencional.

---

## Estrutura de landing page que converte

Ordem que funciona para site de profissional/vendedor:

1. **Hero** — quem é, o que oferece, prova rápida (números), CTA. Deve caber a mensagem principal sem rolar.
2. **Destaque do produto/serviço principal** — o carro-chefe, sozinho, com espaço para brilhar.
3. **Catálogo/opções** — as demais alternativas.
4. **Diferenciais** — por que com essa pessoa e não com outra.
5. **Como funciona** — reduz medo do processo (passos numerados).
6. **Prova social** — depoimentos, fotos reais, vídeos de entrega. É a seção que mais converte.
7. **FAQ** — derruba objeções antes que virem desistência.
8. **Contato/CTA final** — endereço, horário, mapa, botões.
9. **Rodapé** — navegação e dados.

**Repita o CTA** ao longo da página: quem decide no meio não deve precisar rolar até o fim.

---

## Copy de conversão

Design ruim com texto bom converte mais que design bom com texto vazio.

- **Específico vence genérico.** "Consultor Changan há 8 anos na Barra da Tijuca" > "atendimento de excelência"
- **Benefício antes de característica.** O que a pessoa ganha, não o que o produto tem
- **CTA em primeira pessoa e concreto.** "Quero saber as condições" > "Saiba mais" > "Clique aqui"
- **Frases curtas.** Em mobile, três parágrafos densos não são lidos
- **Nunca invente números.** Dado inventado destrói confiança quando questionado — confirme com o usuário antes de usar qualquer métrica

---

## Prova social

É o ativo mais valioso de um site de vendas. Priorize por força:

1. Vídeo real de cliente/entrega (mais forte)
2. Foto real com o cliente e o produto
3. Depoimento com nome e localidade
4. Números verificáveis
5. Selos e certificações

**Cuidado:** foto de banco de imagens em prova social anula o efeito. Prefira foto real, mesmo com qualidade inferior — autenticidade vale mais que perfeição.

**Privacidade:** só publicar rosto e nome de cliente com autorização. Na dúvida, publicar sem identificação.

---

## Pontos de conversão e mensuração

Todo elemento que leva o visitante ao contato é um **ponto de conversão** e deve ser identificável para medição futura.

- Dê `id` ou `data-*` descritivos aos CTAs (ex: `id="cta-hero-whatsapp"`, `data-conversao="modelo-cs75"`)
- Mantenha HTML semântico e seções bem delimitadas
- Ao criar um novo CTA, avise ao usuário que ele é um ponto de conversão rastreável
- Não instale ferramenta de analytics sem pedir — apenas deixe o terreno preparado

---

## Acessibilidade (não é opcional)

- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- `alt` descritivo em toda imagem que comunica algo; `alt=""` em imagem decorativa
- `aria-label` em botão que só tem ícone
- Navegação por teclado funcional; foco visível
- Não comunicar informação só por cor
- Hierarquia de headings correta (um `h1` por página, sem pular níveis)

---

## Performance

Site premium que carrega devagar deixa de ser premium.

- `loading="lazy"` em imagem abaixo da primeira dobra
- Vídeo com `preload="metadata"` e `poster` definido
- Comprimir mídia antes de subir; vídeo de fundo idealmente abaixo de 5MB
- Pausar vídeo fora da viewport (`IntersectionObserver`)
- Não carregar fonte que não será usada
- Evitar bibliotecas pesadas para efeitos que CSS resolve

---

## Fluxo de trabalho ao receber um pedido

1. **Entender a intenção** — se o pedido for vago ("deixa mais bonito"), pergunte o que incomoda especificamente ou proponha 2-3 direções concretas
2. **Diagnosticar antes de mexer** — nomeie o problema real (ex: "a mídia está com borda dura e fundo que não conversa com a seção"), não apenas execute
3. **Propor com justificativa** — explique por que a mudança resolve, em linguagem simples
4. **Implementar de forma incremental** — mudanças pequenas e verificáveis; não refatore o que não foi pedido
5. **Validar** — rode o checklist abaixo antes de dizer que terminou

---

## Checklist de validação

Antes de entregar qualquer seção, verifique:

**Visual**
- [ ] Há um elemento dominante claro?
- [ ] Espaçamento segue escala consistente?
- [ ] A seção conversa com o resto do site (mesma linguagem visual)?
- [ ] Nenhuma mídia parece "colada" com borda dura?
- [ ] Nenhum padrão de "cara de IA" da lista acima?

**Mobile**
- [ ] Testado mentalmente em ~375px de largura?
- [ ] Sem rolagem horizontal?
- [ ] Alvos de toque ≥44px?
- [ ] Nada importante coberto por botão flutuante?

**Conversão**
- [ ] Fica claro qual a próxima ação?
- [ ] CTA com texto específico, não genérico?
- [ ] CTA tem `id`/`data-*` para medição?

**Técnico**
- [ ] Imagens com `alt`, botões de ícone com `aria-label`?
- [ ] `loading="lazy"` onde cabe?
- [ ] Animações usam só `transform`/`opacity`?
- [ ] Contraste adequado?

**Conteúdo**
- [ ] Nenhum número inventado?
- [ ] Texto específico em vez de genérico?

---

## Comunicação com o usuário

O usuário pode ser iniciante em programação. Ao explicar:
- Vá direto ao ponto, sem jargão desnecessário
- Ao usar termo técnico, explique em uma linha
- Diga o **porquê** da decisão, não só o que foi feito
- Antes de mudança grande, explique o plano primeiro
- Se faltar informação (um número, um link, uma decisão de conteúdo), **pergunte** em vez de inventar
