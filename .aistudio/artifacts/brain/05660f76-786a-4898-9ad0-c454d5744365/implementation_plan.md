# Relatório Integrado de Perfil Profissional — Assessment COMET

> **Escolhas e Direcionamento de Carreira**  
> Integração Interpretativa dos Instrumentos: RIASEC (Holland), CABIN (Su et al.) e Âncoras de Carreira (Schein).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> A integração dos três instrumentos ocorre **estritamente no nível interpretativo e pedagógico**. Não há fusão de notas, recálculo ou pontuação combinada arbitrária. Cada teste mantém seu questionário, pontuação psicométrica e relatório individual 100% autônomos.

- **Acesso no Sistema (Confirmado via Entrevista)**: 
  Adicionar a 4ª aba no alternador superior (`📊 4. Relatório Integrado`) e um botão de ação destacado no painel da Categoria Temática Perfil Profissional.
- **Tratamento de Testes Pendentes (Confirmado via Entrevista)**:
  Exibir painel de auditoria visual com os 3 módulos (concluídos vs. pendentes) e permitir carregar com 1 clique perfis fictícios de demonstração completa (ex: *Líder de Tecnologia & Inovação* ou *Especialista em Gestão e Saúde*) para análise imediata.
- **Navegação do Relatório (Confirmado via Entrevista)**:
  Abas executivas organizadas por capítulos temáticos (Visão Geral, Mapas Individuais, Análise Cruzada COMET, Direcionamento & Planos), com botão de visualização em fluxo contínuo e exportação em formato de impressão / PDF.

---

## 1. Overview & Core Concept

O **Relatório Integrado de Perfil Profissional** é o instrumento culminante da área Mentalidade do Assessment COMET. Ele articula os três instrumentos existentes através de uma narrativa lógica e estruturada:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     RIASEC      │       │      CABIN      │       │     ÂNCORAS     │
│    (Holland)    │  ───> │ (Su et al.,19)  │  ───> │    (Schein)     │
│   DESCOBERTA    │       │   EXPLORAÇÃO    │       │  DIRECIONAMENTO │
│ Onde estão as   │       │ Quais tarefas e │       │ O que preciso   │
│ afinidades?     │       │ áreas atraem?   │       │ encontrar?      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │                 NARRATIVA INTEGRADA                 │
        │ Afinidades ➔ Interesses ➔ Valores ➔ Possibilidades  │
        │               ➔ Direcionamento Prático              │
        └─────────────────────────────────────────────────────┘
```

### O que o relatório entrega:
- **Público-alvo**: Profissionais em transição, universitários em escolha de carreira, líderes em busca de alinhamento vocacional e consultores/mentores de carreira.
- **Valor agregado**: Supera diagnósticos isolados que geram dúvidas (ex: gostar de liderar no RIASEC mas valorizar estilo de vida nas Âncoras) através de uma **análise cruzada profunda de convergências, complementaridades e tensões**.
- **Prontidão prática**: Entrega campos de atuação categorizados em 3 níveis (Alta Afinidade, A Explorar, Pontos de Atenção), caminhos de carreira diferenciados (Emprego, Empreendedorismo, Autônomo, Especialista, Gestão, Acadêmico) e Plano de Ação em 3 horizontes (30, 90 e 180 dias).

---

## 2. User Experience & Visual Design

### A. Fluxo do Usuário
1. **Ponto de Entrada**:
   - Pelo cabeçalho principal: Nova aba `📊 4. Relatório Integrado`.
   - Pelo painel Perfil Profissional: Botão dedicado `[ 📊 Acessar Relatório Integrado ]` ao lado de `Realizar Teste`.
2. **Checagem de Prontidão (Audit Gate)**:
   - Se os 3 testes estiverem respondidos: O relatório abre imediatamente com os dados reais do usuário.
   - Se houver testes pendentes: Exibe cards de status com botões para "Completar Teste Pendente" OU "Carregar Perfil Demonstrativo Completo" para visualização instantânea.
3. **Navegação Modular do Relatório**:
   - **Capa Executiva & Identidade COMET**
   - **Capítulo I: Apresentação & Síntese da Tríade**
   - **Capítulo II: Os Três Mapas Fundamentais** (Abas secundárias: RIASEC, CABIN e Âncoras com seus gráficos oficiais)
   - **Capítulo III: Análise Integrada Cruzada** (Convergências, Complementaridades, Tensões e Síntese da Identidade)
   - **Capítulo IV: Campos de Exploração & Direcionamento** (Níveis 1, 2 e 3 + Ambientes e Modalidades)
   - **Capítulo V: Plano de Desenvolvimento & Reflexão** (Plano 30-90-180 dias + Perguntas personalizadas + Conclusão Executiva)
4. **Exportação & Compartilhamento**:
   - Botão para visualização completa em página única (`Ver Documento Contínuo`).
   - Botão de impressão com estilos CSS dedicados (`@media print`) para PDF corporativo limpo.

### B. Identidade Visual & Diretrizes
- **Diretriz de Design (Anti-Slop & Zero-Pills)**:
  - Sem badges estáticas em formato de pílula; metadados em texto tipográfico elegante com separadores discretos (`·` ou `/`).
  - Sem falsos índices de telemetria ou porcentagens arbitrárias inventadas.
  - Paleta equilibrada 60-30-10: Canvas neutro (ardósia profunda no dark mode, branco puro/marfim no light mode), superfícies estruturais em tons de ardósia com bordas ultrafinas de 1px, e acentos cromáticos funcionais identificando cada instrumento:
    - **Indigo (`#6366f1`)**: RIASEC (John Holland)
    - **Teal (`#14b8a6`)**: CABIN (Su et al.)
    - **Violeta/Âmbar (`#8b5cf6` / `#f59e0b`)**: Âncoras de Carreira (Edgar Schein)
    - **Esmeralda (`#10b981`)**: Convergências e Alta Afinidade
- **Tipografia**:
  - Títulos em sans-serif de peso contemporâneo (`Plus Jakarta Sans`), numerais e scores rigorosamente alinhados com `tabular-nums` / `font-mono`.
  - Leitura editorial confortável com medida de linha balanceada (`max-w-3xl`, entrelinha 1.6).

---

## 3. Key Product Decisions & Trade-Offs

### Decisão 1: Integração em Módulo Adicional Dedicado (`IntegratedReportApp.tsx`)
- **Abordagem Escolhida**: Criar um componente isolado e robusto `src/IntegratedReportApp.tsx` que consome as fontes de dados de `App.tsx`, `CabinApp.tsx` e `RiasecApp.tsx`.
- **Por quê**: Garante zero acoplamento destrutivo nos componentes existentes e protege a integridade psicométrica exigida no edital.

### Decisão 2: Motor Interpretativo Baseado em Regras Psicométricas Reais (`src/integratedReportEngine.ts`)
- **Abordagem Escolhida**: Criar uma biblioteca pura com funções analíticas determinísticas que cruzam as tipologias reais:
  - Cruza o Código Holland RIASEC com as 8 dimensões SETPOINT e as 41 escalas do CABIN.
  - Cruza os interesses com a âncora primária e secundária de Schein.
  - Detecta padrões clássicos de **convergência** (ex: *Investigativo + Tecnologia + Especialização Técnica*), **complementaridade** (ex: *Empreendedor + Influência + Estilo de Vida*) e **tensão saudável** (ex: *Artístico/Criativo + Autonomia + Segurança/Estabilidade*).
- **Por quê**: Elimina textos genéricos e alucinações; toda interpretação é rigorosamente derivada dos scores reais calculados pelos instrumentos originais.

### Decisão 3: Suporte a Perfis Fictícios Integrados
- **Abordagem Escolhida**: Incluir 3 perfis fictícios pré-construídos que preenchem simultaneamente RIASEC, CABIN e Âncoras:
  1. *Líder de Tecnologia & Inovação* (RIASEC: ICR, CABIN: Tecnologia/Inovação, Âncora: Técnica + Autonomia).
  2. *Gestora de Pessoas & Impacto Social* (RIASEC: SAE, CABIN: People/Saúde, Âncora: Causa + Gerencial).
  3. *Empreendedor Estratégico* (RIASEC: ESC, CABIN: Influence/Organization, Âncora: Empreendedora + Desafio).
- **Por quê**: Permite ao usuário, cliente ou recrutador avaliar imediatamente a profundidade do relatório antes mesmo de completar os 164 itens do CABIN ou os 12 blocos do RIASEC.

---

## 4. Technical Architecture & Data Strategy

### Diagrama Arquitetural da Solução

```
┌────────────────────────────────────────────────────────────────────────┐
│                          LOCAL STORAGE / STATE                         │
│                                                                        │
│   ancora-carreira-progress-v1     comet_cabin_v1      comet_riasec_v1  │
│   (ratings: 40, bonus: 3)         (answers: 164)      (answers: 12)    │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        INTEGRATION ENGINE                              │
│                    src/integratedReportEngine.ts                       │
│                                                                        │
│   - Consome resultados oficiais sem alterar algoritmos                 │
│   - Mapeia matriz de convergências (RIASEC x CABIN x Âncoras)          │
│   - Detecta complementaridades e tensões estruturais                   │
│   - Formula campos de atuação em 3 níveis (Alta, Explorar, Atenção)    │
│   - Gera plano de ação (30, 90, 180 dias) e questões reflexivas        │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATED REPORT UI                           │
│                      src/IntegratedReportApp.tsx                       │
│                                                                        │
│   ├── Capa & Apresentação COMET (Auditoria de preenchimento)           │
│   ├── Cap. I: Visão Geral Integrada                                    │
│   ├── Cap. II: Três Mapas Fundamentais (Gráficos RIASEC, CABIN, Schein)│
│   ├── Cap. III: Análise Integrada Cruzada (Convergências e Tensões)    │
│   ├── Cap. IV: Campos de Exploração & Direcionamento de Carreira       │
│   ├── Cap. V: Plano de Desenvolvimento (30-90-180d) & Reflexão         │
│   └── Exportação (Print/PDF, Visualização Contínua)                    │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     APP.TSX NAVIGATION & HUB WIRING                    │
│                                                                        │
│   - Aba '📊 4. Relatório Integrado' no Top Navbar                      │
│   - Botão 'Acessar Relatório Integrado' no painel Perfil Profissional  │
│   - Sincronização com Tema Claro / Escuro                              │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping

| Arquivo / Componente | Função Principal |
| :--- | :--- |
| `src/integratedReportEngine.ts` | Motor determinístico de análise cruzada, geração de diagnósticos individualizados, identificação de convergências/tensões, campos de exploração e planos de ação. |
| `src/IntegratedReportApp.tsx` | Componente de visualização do Relatório Integrado com as 10 seções, navegação por abas executivas, modo contínuo de impressão, gráficos vetoriais legíveis e seletor de perfis demo. |
| `src/App.tsx` | Inclusão do 4º módulo no switcher do topo (`'integrated'`), botão de acesso rápido no painel da Categoria Temática e passagem do estado dos 3 testes. |

---

## 5. Matriz das 10 Seções do Relatório

1. **Capa Executiva**: Identidade visual COMET, metadados do participante, data de emissão e indicadores de completude dos 3 testes.
2. **Apresentação do Perfil**: Abertura narrativa fundamentada nos dados reais (Afinidades ➔ Atividades ➔ Motivações).
3. **Mapa de Afinidades (RIASEC)**: Radar/barras dos 6 tipos, Código Holland de 3 letras, descrição dos tipos predominantes e ambientes vocacionais.
4. **Mapa de Interesses Específicos (CABIN)**: 8 dimensões SETPOINT agregadas, top 10 escalas e 5 escalas de menor atração, campos de atividades concretas.
5. **Mapa de Valores e Motivações (Âncoras)**: Âncora dominante e secundária, motivadores inegociáveis e condições de satisfação no trabalho.
6. **Análise Integrada dos Três Instrumentos**: Matriz cruzada de Convergências, Complementaridades, Divergências/Tensões e Síntese da Identidade Profissional.
7. **Afinidades e Campos de Exploração**: Tabela e cards organizados em Nível 1 (Alta Afinidade), Nível 2 (A Explorar) e Nível 3 (Pontos de Atenção).
8. **Direcionamento Profissional**: Ambientes compatíveis, atividades para experimentar e avaliação de caminhos (Emprego, Empreendedorismo, Autônomo, Especialista, Gestão, Acadêmico/Criativo).
9. **Plano de Exploração e Desenvolvimento**: Ações concretas em 3 horizontes (0-30 dias autoconhecimento, 30-90 dias experimentação, 90-180 dias direcionamento).
10. **Perguntas de Reflexão & Conclusão Executiva**: Questões personalizadas ao perfil e síntese analítica final orientada a tomada de decisão.
