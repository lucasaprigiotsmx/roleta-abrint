# Brainstorm de Design - Roleta ABRINT

## Contexto
Site de roleta interativa para stand na ABRINT com painel de personalização de tema, cores e probabilidades.

---

## Ideia 1: Design Moderno Corporativo com Glassmorphism
**Movimento de Design**: Glassmorphism + Minimalismo Corporativo  
**Probabilidade**: 0.08

### Princípios Principais
- Transparência e profundidade com efeito vidro fosco
- Hierarquia clara com tipografia geométrica
- Interações suaves e previsíveis
- Paleta neutra com destaque em cores vibrantes

### Filosofia de Cores
- Fundo: Gradiente sutil de cinza escuro para preto
- Roleta: Camadas com efeito vidro (backdrop-filter)
- Destaques: Azul elétrico, roxo vibrante, verde neon
- Texto: Branco com opacidade variável para hierarquia

### Paradigma de Layout
- Divisão assimétrica: Roleta grande à esquerda, painel de controle compacto à direita
- Roleta em primeiro plano com sombra profunda
- Painel flutuante semi-transparente com controles organizados verticalmente

### Elementos Assinatura
- Ícones geométricos minimalistas
- Cards com efeito vidro e bordas suaves
- Animações de entrada com fade e scale
- Indicadores de progresso circulares

### Filosofia de Interação
- Cliques suaves com feedback imediato
- Hover com aumento de opacidade e brilho
- Transições de 300-400ms para mudanças de estado
- Feedback visual com pulsos de luz

### Animação
- Entrada da roleta: Fade + scale suave (600ms)
- Rotação: Easing cubic-bezier com desaceleração natural
- Painel de controle: Slide in from right (400ms)
- Hover em botões: Glow effect com duração 200ms

### Sistema de Tipografia
- Display: Poppins Bold (700) para títulos
- Corpo: Inter Regular (400) para texto
- Controles: Poppins Medium (600) para labels
- Tamanhos: 48px (título), 24px (subtítulo), 14px (corpo)

---

## Ideia 2: Design Lúdico e Festivo com Gradientes Vibrantes
**Movimento de Design**: Maximalismo Divertido + Neomorfismo Suave  
**Probabilidade**: 0.07

### Princípios Principais
- Cores saturadas e gradientes dinâmicos
- Formas arredondadas e amigáveis
- Sensação de festa e celebração
- Interações que celebram vitórias

### Filosofia de Cores
- Fundo: Gradiente multicolor (rosa → roxo → azul)
- Roleta: Fatias com gradientes individuais vibrantes
- Destaques: Amarelo ouro, rosa quente, ciano
- Texto: Branco com sombra suave para legibilidade

### Paradigma de Layout
- Roleta centralizada e dominante
- Painel de controle abaixo da roleta em layout horizontal
- Decorações visuais (confete, stars) ao redor
- Espaço generoso para movimento de elementos

### Elementos Assinatura
- Roleta com gradientes em cada fatia
- Botões com formas arredondadas (border-radius 50px+)
- Ícones com estilo cartoon/ilustrativo
- Confete e partículas ao girar

### Filosofia de Interação
- Feedback celebratório ao ganhar
- Sons visuais (sem áudio real) com animações
- Botões que "pulam" ao hover
- Sensação de movimento contínuo

### Animação
- Entrada: Bounce in (800ms com easing elastic)
- Rotação: Easing ease-out com parada dramática
- Vitória: Confete caindo com fade out (1000ms)
- Botões: Pulse suave contínuo
- Painel: Slide up com bounce (500ms)

### Sistema de Tipografia
- Display: Fredoka Bold (700) para títulos
- Corpo: Fredoka Regular (400) para texto
- Controles: Fredoka Medium (600) para labels
- Tamanhos: 56px (título), 28px (subtítulo), 16px (corpo)

---

## Ideia 3: Design Elegante Minimalista com Foco em Dados
**Movimento de Design**: Minimalismo Escandinavo + Data Visualization  
**Probabilidade**: 0.09

### Princípios Principais
- Simplicidade radical com foco em funcionalidade
- Tipografia forte e legível
- Espaço em branco abundante
- Cores limitadas e propositais

### Filosofia de Cores
- Fundo: Branco ou cinza muito claro
- Roleta: Linhas limpas com cores primárias (vermelho, azul, verde, amarelo)
- Destaques: Preto para ênfase, cinza para secundário
- Texto: Preto puro para máximo contraste

### Paradigma de Layout
- Roleta em grid simétrico no topo
- Painel de controle em grid abaixo com cards informativos
- Divisão clara entre visualização e controle
- Alinhamento rigoroso em grid 8px

### Elementos Assinatura
- Linhas geométricas limpas
- Números e percentuais em destaque
- Cards com apenas borda, sem preenchimento
- Tipografia sans-serif forte

### Filosofia de Interação
- Cliques diretos e sem surpresas
- Feedback textual (números atualizando)
- Transições mínimas e propositais
- Foco em clareza de informação

### Animação
- Entrada: Fade simples (300ms)
- Rotação: Linear ou ease-out suave
- Atualizações: Números com fade in (200ms)
- Painel: Aparecimento gradual (400ms)
- Hover: Apenas mudança de cor, sem movimento

### Sistema de Tipografia
- Display: IBM Plex Mono Bold (700) para números
- Corpo: IBM Plex Sans Regular (400) para texto
- Controles: IBM Plex Sans Medium (600) para labels
- Tamanhos: 52px (números), 24px (subtítulo), 14px (corpo)

---

## Decisão Final
Escolherei a **Ideia 1: Design Moderno Corporativo com Glassmorphism** por oferecer:
- Profissionalismo adequado para um evento corporativo (ABRINT)
- Equilíbrio entre sofisticação e diversão
- Flexibilidade para personalização de cores
- Efeitos visuais impressionantes sem parecer amador
