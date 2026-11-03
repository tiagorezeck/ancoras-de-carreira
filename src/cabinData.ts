/**
 * @license
 * Comprehensive Assessment of Basic Interests (CABIN) - Su et al. (2019)
 * Instrumento psicométrico com 41 interesses básicos, 164 atividades e 8 dimensões SETPOINT.
 */

export type SetpointCode = 'HEALTH_SCIENCE' | 'CREATIVE_EXPRESSION' | 'TECHNOLOGY' | 'PEOPLE' | 'ORGANIZATION' | 'INFLUENCE' | 'NATURE' | 'T_THINGS';

export interface CabinItem {
  id: number; // 1 to 164
  scaleId: number; // 1 to 41
  textPt: string;
  textEn: string;
}

export interface CabinScale {
  id: number; // 1 to 41
  number: number;
  namePt: string;
  nameEn: string;
  dimension: SetpointCode;
  description: string;
  environments: string[];
  sampleActivities: string[];
  itemIds: number[];
}

export interface SetpointDimension {
  code: SetpointCode;
  letter: string; // S, E, T, P, O, I, N, T
  namePt: string;
  nameEn: string;
  scaleIds: number[];
  description: string;
  typicalEnvironments: string[];
  colorHex: string;
}

export const SETPOINT_DIMENSIONS: SetpointDimension[] = [
  {"code": "HEALTH_SCIENCE", "letter": "S", "namePt": "Ciências da Saúde (Health Science)", "nameEn": "Health Science", "scaleIds": [13, 27, 12], "description": "Compreensão de patologias, mecanismos biológicos celulares, terapêutica médica e assistência hospitalar a indivíduos em sofrimento biopsicossocial.", "typicalEnvironments": ["Hospitais de alta complexidade", "Laboratórios biomédicos e genômicos", "Centros de pesquisa clínica", "Indústria farmacêutica"], "colorHex": "#0ea5e9"},
  {"code": "CREATIVE_EXPRESSION", "letter": "E", "namePt": "Expressão Criativa (Creative Expression)", "nameEn": "Creative Expression", "scaleIds": [18, 19, 20, 21, 22, 23, 24, 15], "description": "Geração de obras estéticas, narrativas literárias, composições musicais, cenografia, atuações performáticas, produções midiáticas e gastronomia autoral.", "typicalEnvironments": ["Estúdios de design e arte", "Companhias de teatro e cinema", "Agências de criação audiovisual", "Cozinhas autorais e ateliês"], "colorHex": "#a855f7"},
  {"code": "TECHNOLOGY", "letter": "T", "namePt": "Tecnologia e Ciências Exatas (Technology)", "nameEn": "Technology", "scaleIds": [10, 17, 16, 11], "description": "Resolução de enigmas analíticos, modelagem estatística, arquitetura de sistemas computacionais, engenharia aplicada e estudo das leis fundamentais da física.", "typicalEnvironments": ["Polos de tecnologia e software", "Data centers e laboratórios de IA", "Centros de engenharia estrutural", "Institutos de física e astronomia"], "colorHex": "#3b82f6"},
  {"code": "PEOPLE", "letter": "P", "namePt": "Pessoas e Desenvolvimento Humano (People)", "nameEn": "People", "scaleIds": [25, 26, 28, 29, 14], "description": "Transmissão pedagógica de conhecimento, mediação comunitária, assistência humanitária, espiritualidade, hospitalidade e pesquisa das dinâmicas socioculturais.", "typicalEnvironments": ["Instituições de ensino e pesquisa", "Organizações sociais e ONGs", "Centros de acolhimento e hospitalidade", "Espaços comunitários"], "colorHex": "#10b981"},
  {"code": "ORGANIZATION", "letter": "O", "namePt": "Organização e Processos (Organization)", "nameEn": "Organization", "scaleIds": [34, 35, 37, 36], "description": "Estruturação de dados contábeis, gestão orçamentária rigorosa, conformidade fiscal, rotinas de escritório e administração criteriosa de políticas de pessoas.", "typicalEnvironments": ["Departamentos de tesouraria e controladoria", "Firmas de auditoria contábil", "Backoffices corporativos", "Bancos e corretoras"], "colorHex": "#f59e0b"},
  {"code": "INFLUENCE", "letter": "I", "namePt": "Influência, Negócios e Liderança (Influence)", "nameEn": "Influence", "scaleIds": [31, 32, 33, 38, 39, 40, 41, 30], "description": "Liderança executiva, negociações comerciais estratégicas, expansão de negócios, campanhas persuasivas de marketing, debate judiciário e governança política.", "typicalEnvironments": ["Diretorias executivas e conselhos", "Salas de negociação corporativa", "Tribunais e fóruns de advocacia", "Plenários legislativos"], "colorHex": "#ef4444"},
  {"code": "NATURE", "letter": "N", "namePt": "Natureza e Agropecuária (Nature)", "nameEn": "Nature", "scaleIds": [6, 7, 8], "description": "Interação com ciclos botânicos, manejo da fertilidade de solos, preservação de ecossistemas naturais, silvicultura e cuidados veterinários da fauna.", "typicalEnvironments": ["Fazendas sustentáveis e pomares", "Reservas florestais e bioparques", "Clínicas de reabilitação veterinária", "Unidades de conservação ambiental"], "colorHex": "#14b8a6"},
  {"code": "T_THINGS", "letter": "T", "namePt": "Coisas e Práticas Manuais (Things)", "nameEn": "Things", "scaleIds": [1, 2, 3, 4, 5, 9], "description": "Manuseio prático de maquinários pesados, reparo mecânico e eletrônico, carpintaria estrutural, logística de carga, operações de segurança e vigor físico esportivo.", "typicalEnvironments": ["Oficinas mecânicas e usinas", "Canteiros de obras e marcenarias", "Pátios logísticos e frotas de transporte", "Complexos esportivos e táticos"], "colorHex": "#64748b"},
];

export const CABIN_SCALES: CabinScale[] = [
  {"id": 1, "number": 1, "namePt": "Mecânica e Eletrônica", "nameEn": "Mechanics/Electronics", "dimension": "T_THINGS", "description": "Interesse em consertar, operar, montar e realizar manutenção de veículos, maquinários, circuitos e equipamentos eletrônicos.", "environments": ["Oficinas mecânicas", "Hospitais de equipamentos", "Usinas de energia", "Centros de manutenção industrial"], "sampleActivities": ["Reparar motores", "Realizar manutenção aeronáutica", "Manter geradores eólicos", "Instalar sistemas de rádio"], "itemIds": [1, 2, 3, 4]},
  {"id": 2, "number": 2, "namePt": "Construção e Marcenaria", "nameEn": "Construction/Woodwork", "dimension": "T_THINGS", "description": "Interesse em fabricar objetos em madeira, erguer estruturas civis, reparar móveis e construir instalações físicas.", "environments": ["Marcenarias", "Canteiros de obras", "Ateliês de restauração", "Fábricas de móveis planejados"], "sampleActivities": ["Construir prateleiras", "Fabricar armários de cozinha", "Lixar e envernizar móveis", "Construir cercas"], "itemIds": [5, 6, 7, 8]},
  {"id": 3, "number": 3, "namePt": "Transporte e Operação de Máquinas", "nameEn": "Transportation/Machine Operation", "dimension": "T_THINGS", "description": "Interesse em conduzir veículos terrestres, trens ou operar maquinário pesado de logística e movimentação de carga.", "environments": ["Empresas de transporte coletivo", "Centros de distribuição logística", "Ferrovias", "Portos e terminais de carga"], "sampleActivities": ["Dirigir ônibus", "Conduzir caminhão de entregas", "Conduzir locomotiva", "Operar guindastes portuários"], "itemIds": [9, 10, 11, 12]},
  {"id": 4, "number": 4, "namePt": "Trabalho Físico e Operacional", "nameEn": "Physical/Manual Labor", "dimension": "T_THINGS", "description": "Interesse em tarefas dinâmicas que demandam esforço corporal, movimentação de materiais e ritmo ativo de execução.", "environments": ["Terminais aeroportuários", "Galpões logísticos", "Canteiros de edificação", "Docas de distribuição"], "sampleActivities": ["Carregar bagagens", "Descarregar mercadorias", "Transportar materiais em obras", "Embalar produtos"], "itemIds": [13, 14, 15, 16]},
  {"id": 5, "number": 5, "namePt": "Serviços de Segurança e Proteção", "nameEn": "Protective Service", "dimension": "T_THINGS", "description": "Interesse na manutenção da ordem pública, fiscalização de normas de segurança, vigilância e investigação preventiva.", "environments": ["Corporações policiais", "Alfândegas e postos de controle", "Agências de inteligência", "Empresas de segurança patrimonial"], "sampleActivities": ["Prender suspeitos de crimes", "Vigiar alvos investigados", "Inspecionar cargas ilegais", "Investigar o crime organizado"], "itemIds": [17, 18, 19, 20]},
  {"id": 6, "number": 6, "namePt": "Agricultura e Produção Rural", "nameEn": "Agriculture", "dimension": "NATURE", "description": "Interesse no cultivo agrícola, análise de solos, proteção fitossanitária de lavouras e manejo da fertilidade da terra.", "environments": ["Propriedades rurais", "Empresas de agronegócio", "Institutos de pesquisa agronômica", "Pomares e estufas"], "sampleActivities": ["Colher lavouras", "Inspecionar pomares", "Estudar clima e solos", "Aplicar ciência do solo"], "itemIds": [21, 22, 23, 24]},
  {"id": 7, "number": 7, "namePt": "Natureza e Atividades ao Ar Livre", "nameEn": "Nature/Outdoors", "dimension": "NATURE", "description": "Interesse em atuar em contato direto com o ecossistema, conservação de florestas, viveiros botânicos e reservas naturais.", "environments": ["Parques e reservas ambientais", "Jardins botânicos", "Florestas protegidas", "Projetos de reflorestamento"], "sampleActivities": ["Cultivar plantas ornamentais", "Vistoriar florestas", "Plantar mudas em reservas", "Restaurar habitats"], "itemIds": [25, 26, 27, 28]},
  {"id": 8, "number": 8, "namePt": "Cuidado e Serviços com Animais", "nameEn": "Animal Service", "dimension": "NATURE", "description": "Interesse no bem-estar, tratamento, alimentação, manejo zoológico e acolhimento de animais domésticos ou silvestres.", "environments": ["Clínicas veterinárias", "Zoológicos e bioparques", "Abrigos de proteção animal", "Centros de reabilitação de fauna"], "sampleActivities": ["Tratar animais feridos", "Alimentar animais em zoológicos", "Exercitar animais diariamente", "Resgatar animais abandonados"], "itemIds": [29, 30, 31, 32]},
  {"id": 9, "number": 9, "namePt": "Esportes e Atletismo", "nameEn": "Athletics", "dimension": "T_THINGS", "description": "Interesse em prática esportiva competitiva, condicionamento físico vigoroso, preparação atlética e treinamento de equipes.", "environments": ["Centros de alto rendimento esportivo", "Clubes atléticos", "Academias de preparação física", "Arenas esportivas"], "sampleActivities": ["Praticar esportes coletivos", "Disputar competições esportivas", "Treinar para esportes de elite", "Treinar equipes esportivas"], "itemIds": [33, 34, 35, 36]},
  {"id": 10, "number": 10, "namePt": "Engenharia e Otimização", "nameEn": "Engineering", "dimension": "TECHNOLOGY", "description": "Interesse no projeto estrutural, desenvolvimento de novos materiais de engenharia e aprimoramento de linhas produtivas.", "environments": ["Escritórios de engenharia", "Plantas industriais", "Laboratórios de prototipagem", "Indústria aeroespacial e automotiva"], "sampleActivities": ["Projetar estruturas resistentes", "Desenvolver novos materiais", "Redesenhar linhas fabris", "Melhorar interfaces homem-máquina"], "itemIds": [37, 38, 39, 40]},
  {"id": 11, "number": 11, "namePt": "Ciências Físicas e Planetárias", "nameEn": "Physical Science", "dimension": "TECHNOLOGY", "description": "Interesse no estudo do cosmos, física quântica, astrofísica, estrutura molecular da matéria e fenômenos geológicos da Terra.", "environments": ["Observatórios astronômicos", "Centros de pesquisa geológica", "Laboratórios de física experimental", "Universidades"], "sampleActivities": ["Estudar evolução de galáxias", "Analisar minerais extraterrestres", "Investigar estruturas moleculares", "Compreender terremotos"], "itemIds": [41, 42, 43, 44]},
  {"id": 12, "number": 12, "namePt": "Ciências da Vida e Biologia", "nameEn": "Life Science", "dimension": "HEALTH_SCIENCE", "description": "Interesse no mapeamento genômico, fisiologia dos seres vivos, microbiologia experimental e mecanismos moleculares da vida.", "environments": ["Institutos de biologia molecular", "Centros de sequenciamento genômico", "Laboratórios de microbiologia", "Institutos de biotecnologia"], "sampleActivities": ["Mapear genes humanos", "Estudar fisiologia animal", "Investigar DNA e genomas", "Pesquisar bactérias"], "itemIds": [45, 46, 47, 48]},
  {"id": 13, "number": 13, "namePt": "Ciências Médicas e Patologia", "nameEn": "Medical Science", "dimension": "HEALTH_SCIENCE", "description": "Interesse no estudo de mecanismos virais, causas de doenças crônicas, farmacologia de medicamentos e estratégias preventivas de saúde.", "environments": ["Centros de pesquisa médica", "Indústria farmacêutica e vacinas", "Institutos de saúde pública", "Hospitais universitários"], "sampleActivities": ["Examinar infecções virais", "Investigar causas de doenças", "Analisar efeitos colaterais", "Criar métodos preventivos"], "itemIds": [49, 50, 51, 52]},
  {"id": 14, "number": 14, "namePt": "Ciências Sociais e Sociedade", "nameEn": "Social Science", "dimension": "PEOPLE", "description": "Interesse em compreender a diversidade cultural, impactos da desigualdade socioeconômica, políticas públicas e psicologia social.", "environments": ["Centros de pesquisa sociológica", "Observatórios de políticas públicas", "Institutos de demografia", "Universidades"], "sampleActivities": ["Estudar diferenças culturais", "Investigar pobreza e educação", "Avaliar redução da violência", "Compreender preconceitos"], "itemIds": [53, 54, 55, 56]},
  {"id": 15, "number": 15, "namePt": "Humanidades e História", "nameEn": "Humanities", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse na análise de civilizações antigas, correntes filosóficas do pensamento, história comparada e tradições dos povos.", "environments": ["Acervos históricos e bibliotecas", "Centros de estudos filosóficos", "Museus de antropologia", "Departamentos de história"], "sampleActivities": ["Estudar civilizações antigas", "Debater correntes filosóficas", "Comparar história entre nações", "Documentar tradições"], "itemIds": [57, 58, 59, 60]},
  {"id": 16, "number": 16, "namePt": "Matemática e Estatística", "nameEn": "Mathematics/Statistics", "dimension": "TECHNOLOGY", "description": "Interesse na formulação de equações, teoremas abstratos, modelagem estatística preditiva e resolução quantitativa de problemas.", "environments": ["Centros de modelagem estatística", "Institutos de matemática pura", "Equipes de ciência de dados", "Laboratórios quantitativos"], "sampleActivities": ["Resolver problemas matemáticos", "Explorar geometria teórica", "Aplicar equações a desafios reais", "Modelar fenômenos"], "itemIds": [61, 62, 63, 64]},
  {"id": 17, "number": 17, "namePt": "Tecnologia da Informação (TI)", "nameEn": "Information Technology", "dimension": "TECHNOLOGY", "description": "Interesse em infraestrutura de software, administração de bancos de dados, diagnóstico de redes e suporte computacional avançado.", "environments": ["Empresas de software e nuvem", "Centros de operações de rede (NOC)", "Data centers", "Departamentos de TI corporativos"], "sampleActivities": ["Testar softwares", "Criar bancos de dados", "Monitorar sistemas de TI", "Diagnosticar falhas de TI"], "itemIds": [65, 66, 67, 68]},
  {"id": 18, "number": 18, "namePt": "Artes Visuais", "nameEn": "Visual Arts", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse em desenho artístico, pintura, ilustração visual e concepção de obras plásticas originais.", "environments": ["Ateliês de pintura", "Galerias de arte contemporânea", "Estúdios de ilustração editorial", "Centros culturais"], "sampleActivities": ["Fazer esboços artísticos", "Pintar paisagens", "Ilustrar livros e narrativas", "Criar obras plásticas"], "itemIds": [69, 70, 71, 72]},
  {"id": 19, "number": 19, "namePt": "Artes Aplicadas e Design", "nameEn": "Applied Arts and Design", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse em design de produtos, cenografia teatral/cinematográfica, iluminação de exposições e embalagens inovadoras.", "environments": ["Escritórios de design de produto", "Estúdios de cenografia", "Agências de branding e embalagens", "Espaços museológicos"], "sampleActivities": ["Desenhar móveis funcionais", "Criar cenários teatrais", "Projetar luz em exposições", "Criar embalagens únicas"], "itemIds": [73, 74, 75, 76]},
  {"id": 20, "number": 20, "namePt": "Artes Cênicas e Interpretação", "nameEn": "Performing Arts", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse na atuação teatral, dramaturgia cinematográfica, performance cênica ao vivo e comédia para entretenimento do público.", "environments": ["Companhias de teatro", "Sets de filmagem", "Estúdios de dublagem e TV", "Palcos de comédia stand-up"], "sampleActivities": ["Atuar no palco para plateias", "Interpretar papéis em peças", "Gravar cenas dramáticas", "Apresentar comédia ao público"], "itemIds": [77, 78, 79, 80]},
  {"id": 21, "number": 21, "namePt": "Música e Composição", "nameEn": "Music", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse em tocar instrumentos, compor harmonias musicais, tocar em grupos/bandas e arranjar trilhas sonoras.", "environments": ["Estúdios de gravação sonora", "Orquestras e conjuntos musicais", "Produtoras de trilhas de cinema/games", "Casas de espetáculo"], "sampleActivities": ["Tocar instrumentos", "Compor canções originais", "Integrar bandas musicais", "Arranjar trilhas sonoras"], "itemIds": [81, 82, 83, 84]},
  {"id": 22, "number": 22, "namePt": "Escrita Criativa e Literatura", "nameEn": "Writing", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse na produção literária de romances, contos ficcionais, poesia e no estudo das técnicas de escrita narrativa.", "environments": ["Editoras de livros", "Agências literárias", "Oficinas de escrita criativa", "Revistas culturais"], "sampleActivities": ["Escrever um romance", "Criar contos ficcionais", "Compor poesias", "Estudar escrita criativa"], "itemIds": [85, 86, 87, 88]},
  {"id": 23, "number": 23, "namePt": "Mídia e Produção Audiovisual", "nameEn": "Media", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse na direção televisiva/cinematográfica, roteirização de filmes, locução de programas de rádio e podcasts.", "environments": ["Emissoras de TV", "Produtoras de cinema e streaming", "Estúdios de podcast", "Rádios digitais"], "sampleActivities": ["Dirigir programas de TV", "Roteirizar filmes", "Apresentar programas de rádio", "Criar podcasts temáticos"], "itemIds": [89, 90, 91, 92]},
  {"id": 24, "number": 24, "namePt": "Artes Culinárias e Gastronomia", "nameEn": "Culinary Art", "dimension": "CREATIVE_EXPRESSION", "description": "Interesse na seleção de insumos gastronômicos, criação de receitas autorais, desenvolvimento de técnicas de cocção e confeitaria.", "environments": ["Restaurantes de alta gastronomia", "Confeitarias artesanais", "Cozinhas experimentais de P&D", "Ateliês culinários"], "sampleActivities": ["Selecionar ingredientes nobres", "Criar receitas exclusivas", "Inovar técnicas de sabor", "Aprender pontos de confeitaria"], "itemIds": [93, 94, 95, 96]},
  {"id": 25, "number": 25, "namePt": "Ensino e Educação", "nameEn": "Teaching/Education", "dimension": "PEOPLE", "description": "Interesse em transmitir competências pedagógicas, explicar conceitos difíceis com clareza, orientar aprendizes e mediar visitas educativas.", "environments": ["Escolas e colégios", "Universidades e faculdades", "Plataformas educacionais", "Museus com programas pedagógicos"], "sampleActivities": ["Ensinar novas competências", "Explicar temas do zero", "Capacitar iniciantes", "Conduzir visitas educativas"], "itemIds": [97, 98, 99, 100]},
  {"id": 26, "number": 26, "namePt": "Serviço e Assistência Social", "nameEn": "Social Service", "dimension": "PEOPLE", "description": "Interesse no voluntariado humanitário, aconselhamento para superação de crises pessoais, auxílio a populações vulneráveis e inclusão.", "environments": ["Centros de assistência social (CRAS/CREAS)", "Organizações não governamentais (ONGs)", "Abrigos comunitários", "Projetos de acolhimento"], "sampleActivities": ["Atuar no voluntariado comunitário", "Apoiar em crises pessoais", "Auxiliar estudantes vulneráveis", "Apoiar PcD no trabalho"], "itemIds": [101, 102, 103, 104]},
  {"id": 27, "number": 27, "namePt": "Assistência e Cuidados de Saúde", "nameEn": "Health Care Service", "dimension": "HEALTH_SCIENCE", "description": "Interesse no atendimento clínico direto a pacientes agudos, acompanhamento de enfermagem em estado crítico e planos terapêuticos.", "environments": ["Prontos-socorros e UPAs", "Unidades de Terapia Intensiva (UTIs)", "Clínicas de fisioterapia e enfermagem", "Enfermarias"], "sampleActivities": ["Tratar lesões e enfermidades agudas", "Cuidar de pacientes críticos", "Monitorar reações clínicas", "Traçar planos de cuidado"], "itemIds": [105, 106, 107, 108]},
  {"id": 28, "number": 28, "namePt": "Atividades Religiosas e Espirituais", "nameEn": "Religious Activities", "dimension": "PEOPLE", "description": "Interesse no aconselhamento de base espiritual, interpretação de textos sagrados, ensino de práticas devocionais e grupos de jovens.", "environments": ["Templos religiosos e capelas", "Centros comunitários de fé", "Pastoral e capelania hospitalar", "Retiros espirituais"], "sampleActivities": ["Oferecer orientação espiritual", "Interpretar textos sagrados", "Ensinar rituais religiosos", "Liderar jovens na fé"], "itemIds": [109, 110, 111, 112]},
  {"id": 29, "number": 29, "namePt": "Atendimento Pessoal e Hospitalidade", "nameEn": "Personal Service", "dimension": "PEOPLE", "description": "Interesse no planejamento de viagens turísticas, recepção de clientes com excelência, organização de celebrações e lazer.", "environments": ["Hotéis de excelência e resorts", "Agências de viagem de luxo", "Empresas de eventos sociais", "Clubes de lazer e bem-estar"], "sampleActivities": ["Montar roteiros de viagens", "Recepcionar com hospitalidade", "Planejar comemorações", "Organizar recreação"], "itemIds": [113, 114, 115, 116]},
  {"id": 30, "number": 30, "namePt": "Assessoria e Aconselhamento Profissional", "nameEn": "Professional Advising", "dimension": "INFLUENCE", "description": "Interesse no coaching executivo de lideranças, preparação para processos seletivos, mentoria de carreira e comunicação interpessoal.", "environments": ["Consultorias de carreira e coaching", "Empresas de recolocação profissional", "Programas corporativos de liderança", "Mentoria de negócios"], "sampleActivities": ["Desenvolver líderes", "Preparar para entrevistas", "Aconselhar metas de carreira", "Treinar comunicação"], "itemIds": [117, 118, 119, 120]},
  {"id": 31, "number": 31, "namePt": "Empreendedorismo e Iniciativas de Negócios", "nameEn": "Business Initiatives", "dimension": "INFLUENCE", "description": "Interesse na prospecção de parcerias corporativas, fundação de novos empreendimentos, diversificação de produtos e visão de mercado.", "environments": ["Startups e venture builders", "Aceleradoras de negócios", "Holdings empresariais", "Feiras de inovação e investimento"], "sampleActivities": ["Negociar acordos empresariais", "Criar novas empresas", "Expandir linhas de produtos", "Superar concorrentes no mercado"], "itemIds": [121, 122, 123, 124]},
  {"id": 32, "number": 32, "namePt": "Vendas e Negociação Comercial", "nameEn": "Sales", "dimension": "INFLUENCE", "description": "Interesse na persuasão comercial, alcance de metas em campanhas de incentivo, prospecção ativa de clientes e fechamento de vendas.", "environments": ["Departamentos comerciais", "Salas de negociação corporativa", "Plataformas de venda consultiva (B2B)", "Feiras de negócios"], "sampleActivities": ["Persuadir sobre novos produtos", "Bater metas em campanhas", "Vender serviços a nichos", "Dominar táticas de venda"], "itemIds": [125, 126, 127, 128]},
  {"id": 33, "number": 33, "namePt": "Marketing e Publicidade", "nameEn": "Marketing/Advertising", "dimension": "INFLUENCE", "description": "Interesse no planejamento de campanhas publicitárias, posicionamento em redes sociais, ativações de marca e promoção de eventos.", "environments": ["Agências de marketing digital", "Departamentos de publicidade corporativos", "Produtoras de conteúdo de marca", "Consultorias de branding"], "sampleActivities": ["Liderar campanhas publicitárias", "Divulgar empresas nas redes", "Coordenar ações promocionais", "Distribuir materiais de marca"], "itemIds": [129, 130, 131, 132]},
  {"id": 34, "number": 34, "namePt": "Finanças e Análise de Investimentos", "nameEn": "Finance", "dimension": "ORGANIZATION", "description": "Interesse na alocação de capital baseada em métricas financeiras, análise de balanços, projeção de despesas e precificação de riscos.", "environments": ["Bancos de investimento", "Fundos de private equity e venture capital", "Departamentos de tesouraria corporativa", "Corretoras"], "sampleActivities": ["Decidir investimentos financeiros", "Analisar dados contábeis de empresas", "Projetar gastos futuros", "Calcular riscos e retornos"], "itemIds": [133, 134, 135, 136]},
  {"id": 35, "number": 35, "namePt": "Contabilidade e Conformidade Fiscal", "nameEn": "Accounting", "dimension": "ORGANIZATION", "description": "Interesse no processamento de folhas de pagamento, conciliação bancária mensal, escrituração societária e cálculo de tributos fiscais.", "environments": ["Escritórios de contabilidade", "Firmas de auditoria independente", "Controladorias corporativas", "Departamentos fiscais"], "sampleActivities": ["Calcular folhas de pagamento", "Conciliar extratos bancários", "Manter livros contábeis", "Apurar deduções fiscais"], "itemIds": [137, 138, 139, 140]},
  {"id": 36, "number": 36, "namePt": "Recursos Humanos e Gestão de Pessoas", "nameEn": "Human Resources", "dimension": "ORGANIZATION", "description": "Interesse em atração e seleção de talentos, programas de integração de colaboradores, gestão de benefícios e clima organizacional.", "environments": ["Departamentos de Recursos Humanos", "Consultorias de Executive Search", "Áreas de People & Culture", "Centros de treinamento corporativo"], "sampleActivities": ["Recrutar e admitir talentos", "Conduzir onboarding de novatos", "Explicar políticas e benefícios", "Pesquisar clima da equipe"], "itemIds": [141, 142, 143, 144]},
  {"id": 37, "number": 37, "namePt": "Rotinas e Operações de Escritório", "nameEn": "Office Work", "dimension": "ORGANIZATION", "description": "Interesse na inserção de dados em softwares corporativos, catalogação documental, produção de materiais para conferências e atendimento.", "environments": ["Secretarias administrativas", "Cartórios e arquivos centrais", "Centros de serviços compartilhados (CSC)", "Recepções executivas"], "sampleActivities": ["Cadastrar registros em sistemas", "Catalogar arquivos do escritório", "Preparar material de eventos", "Registrar chamados de clientes"], "itemIds": [145, 146, 147, 148]},
  {"id": 38, "number": 38, "namePt": "Gestão e Liderança Executiva", "nameEn": "Management/Administration", "dimension": "INFLUENCE", "description": "Interesse na direção geral de organizações, supervisão de grandes equipes de trabalho, liderança de conselhos diretivos e associações.", "environments": ["Salas de conselho executivo (C-Level)", "Presidências de órgãos setoriais", "Diretorias operacionais", "Associações empresariais"], "sampleActivities": ["Gerenciar organização média", "Supervisionar times numerosos", "Presidir conselho de diretores", "Liderar associação profissional"], "itemIds": [149, 150, 151, 152]},
  {"id": 39, "number": 39, "namePt": "Oratória e Comunicação Pública", "nameEn": "Public Speaking", "dimension": "INFLUENCE", "description": "Interesse em palestrar em grandes conferências, atuar como porta-voz institucional, liderar eventos de arrecadação e mobilizar causas.", "environments": ["Centros de convenções e plenárias", "Eventos de captação de recursos", "Comunicação corporativa institucional", "Entrevistas para a imprensa"], "sampleActivities": ["Apresentar ideias em palestras", "Ser porta-voz da instituição", "Fazer discursos de caridade", "Discursar para conscientização"], "itemIds": [153, 154, 155, 156]},
  {"id": 40, "number": 40, "namePt": "Política e Articulação Governamental", "nameEn": "Politics", "dimension": "INFLUENCE", "description": "Interesse em disputar cargos eletivos, presidir câmaras legislativas, liderar comissões de políticas públicas e assumir mandatos.", "environments": ["Parlamentos e assembleias legislativas", "Gabinete municipal e estadual", "Partidos políticos e federações", "Comissões de políticas públicas"], "sampleActivities": ["Disputar cargos eletivos", "Presidir conselho municipal", "Liderar comissões políticas", "Assumir liderança pública"], "itemIds": [157, 158, 159, 160]},
  {"id": 41, "number": 41, "namePt": "Direito e Prática Jurídica", "nameEn": "Law", "dimension": "INFLUENCE", "description": "Interesse no patrocínio da defesa jurídica de clientes, sustentação oral em tribunais de justiça, produção de provas e mediação litigiosa.", "environments": ["Tribunais de justiça", "Escritórios de advocacia contenciosa e consultiva", "Câmaras de arbitragem e mediação", "Ministério Público"], "sampleActivities": ["Defender clientes em juízo", "Sustentar argumentos em corte", "Produzir provas em julgamentos", "Mediar disputas judiciais"], "itemIds": [161, 162, 163, 164]},
];

export const CABIN_ITEMS: CabinItem[] = [
  {"id": 1, "scaleId": 1, "textPt": "Consertar motores de automóveis", "textEn": "Repair car engines"},
  {"id": 2, "scaleId": 1, "textPt": "Realizar manutenção em aeronaves", "textEn": "Perform aircraft maintenance"},
  {"id": 3, "scaleId": 1, "textPt": "Fazer a manutenção de geradores de turbinas eólicas", "textEn": "Maintain wind turbine generators"},
  {"id": 4, "scaleId": 1, "textPt": "Instalar sistemas de radiocomunicação", "textEn": "Install radio communication systems"},
  {"id": 5, "scaleId": 2, "textPt": "Construir prateleiras de parede em madeira", "textEn": "Build wood wall shelves"},
  {"id": 6, "scaleId": 2, "textPt": "Fabricar armários de cozinha sob medida", "textEn": "Build kitchen cabinets"},
  {"id": 7, "scaleId": 2, "textPt": "Lixar e reformar peças de mobiliário", "textEn": "Sand and refinish a piece of furniture"},
  {"id": 8, "scaleId": 2, "textPt": "Construir cercas e divisórias de madeira", "textEn": "Build a fence"},
  {"id": 9, "scaleId": 3, "textPt": "Dirigir um ônibus de transporte de passageiros", "textEn": "Drive a bus"},
  {"id": 10, "scaleId": 3, "textPt": "Dirigir um caminhão de entrega e logística", "textEn": "Drive a delivery truck"},
  {"id": 11, "scaleId": 3, "textPt": "Operar um trem ou locomotiva ferroviária", "textEn": "Operate a train"},
  {"id": 12, "scaleId": 3, "textPt": "Operar um guindaste para movimentar cargas e mercadorias", "textEn": "Operate a crane to move freight and cargo"},
  {"id": 13, "scaleId": 4, "textPt": "Carregar e descarregar bagagens em aeronaves", "textEn": "Load and unload aircraft baggage"},
  {"id": 14, "scaleId": 4, "textPt": "Carregar e descarregar contêineres e mercadorias", "textEn": "Load and unload cargo"},
  {"id": 15, "scaleId": 4, "textPt": "Transportar materiais de construção em canteiros de obras", "textEn": "Move building materials on construction sites"},
  {"id": 16, "scaleId": 4, "textPt": "Embalar e movimentar produtos em depósitos logísticos", "textEn": "Pack and move products in a warehouse"},
  {"id": 17, "scaleId": 5, "textPt": "Prender suspeitos em flagrante delito por atos criminosos", "textEn": "Arrest suspects of criminal acts"},
  {"id": 18, "scaleId": 5, "textPt": "Realizar vigilância e monitoramento tático de suspeitos", "textEn": "Conduct surveillance of suspects"},
  {"id": 19, "scaleId": 5, "textPt": "Inspecionar pessoas e veículos à procura de itens ilícitos", "textEn": "Inspect people and vehicles for illegal goods"},
  {"id": 20, "scaleId": 5, "textPt": "Investigar denúncias relacionadas ao crime organizado", "textEn": "Investigate reports of organized crime"},
  {"id": 21, "scaleId": 6, "textPt": "Cultivar e colher lavouras agrícolas", "textEn": "Farm and harvest crops"},
  {"id": 22, "scaleId": 6, "textPt": "Inspecionar pomares para identificar pragas ou doenças", "textEn": "Inspect orchards to detect diseases or pests"},
  {"id": 23, "scaleId": 6, "textPt": "Aprender sobre as exigências de solo e clima de diferentes plantas", "textEn": "Learn about soil and climate requirements of various plants"},
  {"id": 24, "scaleId": 6, "textPt": "Aplicar princípios de pedologia e conservação do solo", "textEn": "Apply principles of soil science to conserve land"},
  {"id": 25, "scaleId": 7, "textPt": "Regar e fertilizar plantas e áreas verdes de jardins", "textEn": "Water and fertilize garden plants"},
  {"id": 26, "scaleId": 7, "textPt": "Mapear áreas florestais e suas vias de acesso ecológicas", "textEn": "Survey forest areas and access roads"},
  {"id": 27, "scaleId": 7, "textPt": "Plantar mudas de árvores nativas em uma reserva florestal", "textEn": "Plant trees in a nature preserve"},
  {"id": 28, "scaleId": 7, "textPt": "Trabalhar na recuperação e restauração de habitats selvagens", "textEn": "Work to restore a wildlife habitat"},
  {"id": 29, "scaleId": 8, "textPt": "Tratar e cuidar da recuperação de animais feridos", "textEn": "Treat and care for injured animals"},
  {"id": 30, "scaleId": 8, "textPt": "Alimentar e higienizar animais em um zoológico", "textEn": "Feed and bathe animals in a zoo"},
  {"id": 31, "scaleId": 8, "textPt": "Exercitar animais diariamente para mantê-los saudáveis", "textEn": "Exercise animals daily to keep them healthy"},
  {"id": 32, "scaleId": 8, "textPt": "Localizar animais abandonados e encaminhá-los a abrigos de proteção", "textEn": "Find stray animals and take them to a shelter"},
  {"id": 33, "scaleId": 9, "textPt": "Praticar uma modalidade esportiva coletiva ou individual", "textEn": "Play a team or individual sport"},
  {"id": 34, "scaleId": 9, "textPt": "Participar ativamente de competições e torneios esportivos", "textEn": "Participate in athletic events"},
  {"id": 35, "scaleId": 9, "textPt": "Treinar intensamente para uma modalidade esportiva competitiva", "textEn": "Train for a competitive sport"},
  {"id": 36, "scaleId": 9, "textPt": "Treinar e coordenar sessões práticas para uma equipe esportiva", "textEn": "Coach practice sessions for a sports team"},
  {"id": 37, "scaleId": 10, "textPt": "Projetar uma estrutura capaz de suportar fortes rajadas de vento", "textEn": "Design a structure that can withstand heavy wind"},
  {"id": 38, "scaleId": 10, "textPt": "Desenvolver materiais mais leves e resistentes para novos produtos", "textEn": "Develop lighter and stronger materials for new products"},
  {"id": 39, "scaleId": 10, "textPt": "Redesenhar uma linha de produção industrial para maximizar eficiência", "textEn": "Redesign a production line to improve its efficiency"},
  {"id": 40, "scaleId": 10, "textPt": "Aprimorar a interface homem-máquina em um sistema operacional de controle", "textEn": "Improve the human-machine interface of an operation system"},
  {"id": 41, "scaleId": 11, "textPt": "Estudar a formação e a evolução das galáxias no universo", "textEn": "Study the formation and evolution of galaxies"},
  {"id": 42, "scaleId": 11, "textPt": "Analisar amostras minerais coletadas no planeta Marte", "textEn": "Analyze a mineral sample found on Mars"},
  {"id": 43, "scaleId": 11, "textPt": "Investigar a estrutura molecular de uma substância desconhecida", "textEn": "Investigate the molecular structure of an unknown substance"},
  {"id": 44, "scaleId": 11, "textPt": "Estudar as causas geológicas de terremotos e tsunamis", "textEn": "Study the causes for earthquakes and tsunamis"},
  {"id": 45, "scaleId": 12, "textPt": "Mapear a arquitetura e os cromossomos do genoma humano", "textEn": "Map human gene structure"},
  {"id": 46, "scaleId": 12, "textPt": "Estudar a estrutura fisiológica e anatômica de animais", "textEn": "Study the physiological structure of animals*"},
  {"id": 47, "scaleId": 12, "textPt": "Investigar o sequenciamento genético de organismos vivos", "textEn": "Investigate the genetic sequence of organisms*"},
  {"id": 48, "scaleId": 12, "textPt": "Pesquisar bactérias recém-descobertas através de experimentos laboratoriais", "textEn": "Research newly discovered bacteria with laboratory"},
  {"id": 49, "scaleId": 13, "textPt": "Examinar a forma como determinados vírus infectam o corpo humano", "textEn": "Examine how viruses infects the human body"},
  {"id": 50, "scaleId": 13, "textPt": "Investigar os fatores etiológicos que originam problemas de saúde crônicos", "textEn": "Investigate the cause of a chronic health problem"},
  {"id": 51, "scaleId": 13, "textPt": "Pesquisar os efeitos colaterais e a farmacocinética de novos medicamentos", "textEn": "Research the side effects of a medicine"},
  {"id": 52, "scaleId": 13, "textPt": "Desenvolver métodos e protocolos de prevenção contra doenças epidêmicas", "textEn": "Investigate prevention methods for diseases"},
  {"id": 53, "scaleId": 14, "textPt": "Estudar diferenças culturais, crenças e costumes entre diferentes grupos sociais", "textEn": "Study cultural differences between groups"},
  {"id": 54, "scaleId": 14, "textPt": "Investigar como a vulnerabilidade econômica afeta o nível de escolaridade", "textEn": "Investigate how poverty influences educational attainment"},
  {"id": 55, "scaleId": 14, "textPt": "Avaliar o impacto de políticas públicas na redução de índices de violência", "textEn": "Study the effects of dietary intake on patient recovery"},
  {"id": 56, "scaleId": 14, "textPt": "Pesquisar as raízes psicossociais que sustentam estereótipos e preconceitos", "textEn": "Research why people have stereotypes and prejudice"},
  {"id": 57, "scaleId": 15, "textPt": "Estudar a história, as leis e a dinâmica social de civilizações antigas", "textEn": "Study the history of an ancient society"},
  {"id": 58, "scaleId": 15, "textPt": "Aprofundar o conhecimento nas diversas correntes da filosofia humana", "textEn": "Study various branches of philosophy"},
  {"id": 59, "scaleId": 15, "textPt": "Comparar as trajetórias históricas modernas de diferentes países e povos", "textEn": "Compare the modern history of different countries"},
  {"id": 60, "scaleId": 15, "textPt": "Documentar e preservar tradições e memórias de comunidades remotas", "textEn": "Document the traditions of a remote community"},
  {"id": 61, "scaleId": 16, "textPt": "Resolver problemas matemáticos complexos e desafios analíticos", "textEn": "Solve mathematical problems"},
  {"id": 62, "scaleId": 16, "textPt": "Aprender sobre novas teorias e formulações em geometria avançada", "textEn": "Learn about a new theory in geometry"},
  {"id": 63, "scaleId": 16, "textPt": "Utilizar equações matemáticas para solucionar problemas práticos do cotidiano", "textEn": "Use mathematical equations to solve practical problems"},
  {"id": 64, "scaleId": 16, "textPt": "Desenvolver modelos estatísticos probabilísticos para explicar fenômenos reais", "textEn": "Develop a statistical model to explain a phenomenon"},
  {"id": 65, "scaleId": 17, "textPt": "Testar, comparar e homologar diferentes softwares e soluções digitais", "textEn": "Test and compare different software"},
  {"id": 66, "scaleId": 17, "textPt": "Projetar e estruturar uma nova base de dados computacional escalável", "textEn": "Create a new computer database"},
  {"id": 67, "scaleId": 17, "textPt": "Monitorar a estabilidade, capacidade e desempenho contínuo de sistemas de TI", "textEn": "Monitor the daily performance of computer systems"},
  {"id": 68, "scaleId": 17, "textPt": "Diagnosticar e solucionar problemas complexos em hardware ou software", "textEn": "Diagnose and resolve computer hardware or software problems"},
  {"id": 69, "scaleId": 18, "textPt": "Fazer esboços e desenhos detalhados a mão livre", "textEn": "Sketch a picture"},
  {"id": 70, "scaleId": 18, "textPt": "Pintar uma paisagem utilizando técnicas de óleo, aquarela ou acrílico", "textEn": "Paint a landscape"},
  {"id": 71, "scaleId": 18, "textPt": "Criar ilustrações conceituais e visuais para um livro", "textEn": "Draw illustrations for a book"},
  {"id": 72, "scaleId": 18, "textPt": "Conceber e produzir uma obra de arte plástica original e autoral", "textEn": "Create a unique piece of artwork"},
  {"id": 73, "scaleId": 19, "textPt": "Criar uma peça de mobiliário que seja ao mesmo tempo artística e funcional", "textEn": "Create a piece of artistic and functional furniture"},
  {"id": 74, "scaleId": 19, "textPt": "Projetar e construir o cenário visual para um filme ou peça teatral", "textEn": "Create the set for a movie or stage play"},
  {"id": 75, "scaleId": 19, "textPt": "Desenvolver o layout espacial e o projeto de iluminação de uma exposição", "textEn": "Design the layout and lighting of an exhibition"},
  {"id": 76, "scaleId": 19, "textPt": "Conceber uma embalagem inovadora, atraente e única para um produto", "textEn": "Design unique packaging for a product"},
  {"id": 77, "scaleId": 20, "textPt": "Apresentar-se no palco atuando para uma plateia com expressividade", "textEn": "Perform on stage for a group of people"},
  {"id": 78, "scaleId": 20, "textPt": "Interpretar um personagem principal ou coadjuvante em uma peça de teatro", "textEn": "Act in a play"},
  {"id": 79, "scaleId": 20, "textPt": "Atuar em uma cena cinematográfica de alta intensidade emocional", "textEn": "Act out an emotional movie scene"},
  {"id": 80, "scaleId": 20, "textPt": "Fazer apresentações de comédia para divertir e envolver o público", "textEn": "Perform comedy to entertain an audience"},
  {"id": 81, "scaleId": 21, "textPt": "Tocar com fluência um instrumento musical de sua preferência", "textEn": "Play a musical instrument (Music)"},
  {"id": 82, "scaleId": 21, "textPt": "Compor uma melodia ou peça musical inteiramente original", "textEn": "Compose an original piece of music (Music)"},
  {"id": 83, "scaleId": 21, "textPt": "Integrar e ensaiar com uma banda ou grupo musical", "textEn": "Play in a band (Music)*"},
  {"id": 84, "scaleId": 21, "textPt": "Elaborar o arranjo de uma trilha sonora de fundo para um espetáculo", "textEn": "Arrange background music for a show (Music)*"},
  {"id": 85, "scaleId": 22, "textPt": "Escrever um livro de ficção ou romance com narrativa aprofundada", "textEn": "Write a novel"},
  {"id": 86, "scaleId": 22, "textPt": "Escrever contos e histórias curtas explorando enredos envolventes", "textEn": "Write short stories"},
  {"id": 87, "scaleId": 22, "textPt": "Compor poemas e versos explorando métricas e sonoridades expressivas", "textEn": "Compose a poem"},
  {"id": 88, "scaleId": 22, "textPt": "Estudar teorias e técnicas avançadas de redação e escrita criativa", "textEn": "Study creative writing"},
  {"id": 89, "scaleId": 23, "textPt": "Dirigir a equipe artística e técnica na gravação de um programa de TV", "textEn": "Direct a TV show"},
  {"id": 90, "scaleId": 23, "textPt": "Escrever o roteiro cinematográfico completo para um longa-metragem", "textEn": "Write a movie screenplay"},
  {"id": 91, "scaleId": 23, "textPt": "Apresentar e conduzir um programa dinâmico de rádio ao vivo", "textEn": "Host a radio program"},
  {"id": 92, "scaleId": 23, "textPt": "Desenvolver, produzir e gravar uma série documental em podcast", "textEn": "Develop a podcast series"},
  {"id": 93, "scaleId": 24, "textPt": "Selecionar criteriosamente ingredientes frescos para preparar refeições", "textEn": "Select ingredients to prepare food"},
  {"id": 94, "scaleId": 24, "textPt": "Elaborar e testar a receita original de um prato gastronômico exclusivo", "textEn": "Create the recipe for a new dish"},
  {"id": 95, "scaleId": 24, "textPt": "Criar uma nova técnica de preparo culinário para realçar aromas e sabores", "textEn": "Create a new cooking technique to enhance flavor"},
  {"id": 96, "scaleId": 24, "textPt": "Dominar os parâmetros exatos de temperatura e tempo de cocção na panificação", "textEn": "Learn about required temperature and time for baking pastries"},
  {"id": 97, "scaleId": 25, "textPt": "Ensinar um novo conjunto de competências e conhecimentos para alunos", "textEn": "Teach students a new set of skills"},
  {"id": 98, "scaleId": 25, "textPt": "Explicar didaticamente um tema complexo para quem nunca teve contato anterior", "textEn": "Explain a topic to someone with no prior knowledge of the subject"},
  {"id": 99, "scaleId": 25, "textPt": "Capacitar pacientemente um profissional iniciante na execução de tarefas", "textEn": "Teach a beginner how to perform a task"},
  {"id": 100, "scaleId": 25, "textPt": "Mediar e conduzir grupos de visitantes em roteiros e visitas pedagógicas", "textEn": "Teach visitors on educational field trips"},
  {"id": 101, "scaleId": 26, "textPt": "Trabalhar como voluntário em um centro de atendimento comunitário", "textEn": "Volunteer at a community service center"},
  {"id": 102, "scaleId": 26, "textPt": "Ajudar uma pessoa a encontrar caminhos para superar um momento de crise", "textEn": "Help someone overcome an obstacle in personal life"},
  {"id": 103, "scaleId": 26, "textPt": "Prestar assistência e mentoria a estudantes em situação de vulnerabilidade", "textEn": "Provide aid to students from underprivileged backgrounds"},
  {"id": 104, "scaleId": 26, "textPt": "Auxiliar pessoas com deficiência na conquista de oportunidades profissionais", "textEn": "Assist people with disabilities in finding employment"},
  {"id": 105, "scaleId": 27, "textPt": "Prestar atendimento direto e tratar pacientes com doenças ou ferimentos agudos", "textEn": "Treat patients for acute illnesses or injuries"},
  {"id": 106, "scaleId": 27, "textPt": "Cuidar com dedicação e atenção de pacientes internados em estado crítico", "textEn": "Care for patients in critical condition"},
  {"id": 107, "scaleId": 27, "textPt": "Monitorar de forma contínua as reações clínicas e vitais de pacientes", "textEn": "Monitor patient reactions to medicines"},
  {"id": 108, "scaleId": 27, "textPt": "Elaborar e coordenar planos terapêuticos personalizados para o bem-estar", "textEn": "Formulate treatment plans for patients"},
  {"id": 109, "scaleId": 28, "textPt": "Oferecer conforto e orientação espiritual a pessoas que buscam propósito", "textEn": "Provide spiritual guidance for others"},
  {"id": 110, "scaleId": 28, "textPt": "Explicar e aprofundar o significado ético e histórico de textos sagrados", "textEn": "Explain a religious text to people"},
  {"id": 111, "scaleId": 28, "textPt": "Ensinar preceitos, tradições e rituais de uma crença ou comunidade de fé", "textEn": "Teach religious beliefs and rituals"},
  {"id": 112, "scaleId": 28, "textPt": "Coordenar encontros e atividades formativas com grupos de jovens religiosos", "textEn": "Work with a religious youth group"},
  {"id": 113, "scaleId": 29, "textPt": "Organizar e agendar itinerários turísticos e hospedagens para clientes", "textEn": "Arrange travel plans and accommodations for clients"},
  {"id": 114, "scaleId": 29, "textPt": "Recepcionar visitantes com cordialidade e tirar dúvidas em balcões informativos", "textEn": "Greet guests and answer questions at an information desk"},
  {"id": 115, "scaleId": 29, "textPt": "Ajudar clientes a planejar celebrações marcantes e datas especiais", "textEn": "Help clients plan for their special occasions"},
  {"id": 116, "scaleId": 29, "textPt": "Planejar e coordenar atividades de recreação, integração e lazer", "textEn": "Organize recreational activities for clients"},
  {"id": 117, "scaleId": 30, "textPt": "Orientar e capacitar profissionais para o desenvolvimento de competências de liderança", "textEn": "Coach others to develop leadership skills"},
  {"id": 118, "scaleId": 30, "textPt": "Preparar candidatos com simulações e dicas para entrevistas de emprego", "textEn": "Coach people to prepare for job interviews"},
  {"id": 119, "scaleId": 30, "textPt": "Aconselhar pessoas a traçarem e alcançarem metas estratégicas de carreira", "textEn": "Advise people in meeting their professional goals"},
  {"id": 120, "scaleId": 30, "textPt": "Treinar clientes em técnicas expressivas de comunicação interpessoal assertiva", "textEn": "Instruct clients in effective communication techniques"},
  {"id": 121, "scaleId": 31, "textPt": "Conduzir e fechar negociações estratégicas em acordos comerciais de grande porte", "textEn": "Negotiate a business deal"},
  {"id": 122, "scaleId": 31, "textPt": "Estruturar e fundar uma rede de pequenos empreendimentos de sucesso", "textEn": "Set up a string of small business enterprises"},
  {"id": 123, "scaleId": 31, "textPt": "Expandir os negócios de uma empresa incorporando novas linhas de produtos", "textEn": "Expand a business to incorporate a new line of products"},
  {"id": 124, "scaleId": 31, "textPt": "Superar a concorrência no mercado através de práticas estratégicas arrojadas", "textEn": "Beat competitors through strategic business practices"},
  {"id": 125, "scaleId": 32, "textPt": "Persuadir clientes a conhecerem e experimentarem um produto inovador", "textEn": "Persuade customers to try a new product"},
  {"id": 126, "scaleId": 32, "textPt": "Aumentar o faturamento de vendas durante uma campanha especial de promoção", "textEn": "Increase sales for a company during a promotion week"},
  {"id": 127, "scaleId": 32, "textPt": "Apresentar e vender soluções em serviços para um público-alvo qualificado", "textEn": "Sell services to a target group of people"},
  {"id": 128, "scaleId": 32, "textPt": "Dominar técnicas consultivas e táticas comprovadas para fechar negócios com sucesso", "textEn": "Learn tactics to be effective at sales"},
  {"id": 129, "scaleId": 33, "textPt": "Liderar o planejamento criativo e a execução de uma campanha publicitária", "textEn": "Lead an advertising campaign"},
  {"id": 130, "scaleId": 33, "textPt": "Construir a presença e o engajamento de uma marca nas mídias sociais", "textEn": "Market a company on social media platforms"},
  {"id": 131, "scaleId": 33, "textPt": "Coordenar ações de marketing para impulsionar o lançamento de um novo produto", "textEn": "Coordinate marketing activities to promote a new product"},
  {"id": 132, "scaleId": 33, "textPt": "Planejar a distribuição de materiais promocionais para dar visibilidade a um evento", "textEn": "Distribute promotional materials to advertise an event"},
  {"id": 133, "scaleId": 34, "textPt": "Tomar decisões de investimento estratégico com base em dados de mercado", "textEn": "Make investment decisions based on financial data"},
  {"id": 134, "scaleId": 34, "textPt": "Analisar detalhadamente demonstrações financeiras e balanços patrimoniais", "textEn": "Analyze the financial information of a company"},
  {"id": 135, "scaleId": 34, "textPt": "Elaborar projeções orçamentárias de receitas e despesas futuras de um negócio", "textEn": "Project future expenditures of a business"},
  {"id": 136, "scaleId": 34, "textPt": "Avaliar a relação entre riscos operacionais e potenciais retornos financeiros", "textEn": "Assess potential risks and gains of an investment"},
  {"id": 137, "scaleId": 35, "textPt": "Calcular a folha de pagamento de funcionários com encargos e benefícios", "textEn": "Prepare employee payroll"},
  {"id": 138, "scaleId": 35, "textPt": "Acompanhar saldos contábeis e emitir demonstrativos financeiros mensais", "textEn": "Monitor account balance and prepare monthly statements"},
  {"id": 139, "scaleId": 35, "textPt": "Manter em perfeita ordem os livros de escrituração contábil de uma organização", "textEn": "Keep accounting records for a company"},
  {"id": 140, "scaleId": 35, "textPt": "Apurar e calcular deduções e créditos fiscais legais para uma empresa", "textEn": "Calculate tax deductions for a business"},
  {"id": 141, "scaleId": 36, "textPt": "Conduzir o processo seletivo de novos funcionários e os trâmites de contratação", "textEn": "Hire employees and process hiring-related paperwork"},
  {"id": 142, "scaleId": 36, "textPt": "Apresentar a empresa e ministrar sessões de integração (onboarding) aos recém-chegados", "textEn": "Conduct orientation sessions for new workers"},
  {"id": 143, "scaleId": 36, "textPt": "Esclarecer dúvidas sobre as diretrizes institucionais, políticas e plano de benefícios", "textEn": "Explain company policies and benefits to employees"},
  {"id": 144, "scaleId": 36, "textPt": "Aplicar e analisar pesquisas periódicas de satisfação e clima organizacional", "textEn": "Conduct surveys of employee satisfaction"},
  {"id": 145, "scaleId": 37, "textPt": "Cadastrar dados cadastrais e prontuários de pessoal em sistemas de informação", "textEn": "Enter personnel records into a computer program"},
  {"id": 146, "scaleId": 37, "textPt": "Organizar e catalogar arquivos físicos e digitais de um departamento", "textEn": "Catalog files in an office"},
  {"id": 147, "scaleId": 37, "textPt": "Preparar e providenciar a impressão de documentações para reuniões e conferências", "textEn": "Print and disseminate documents to be used at a conference"},
  {"id": 148, "scaleId": 37, "textPt": "Registrar, triar e acompanhar as solicitações encaminhadas por clientes", "textEn": "Keep track of customer requests"},
  {"id": 149, "scaleId": 38, "textPt": "Exercer a gestão geral e o planejamento estratégico de uma organização média", "textEn": "Manage a medium-sized organization"},
  {"id": 150, "scaleId": 38, "textPt": "Supervisionar e alinhar o trabalho integrado de um grande número de colaboradores", "textEn": "Supervise a large number of workers"},
  {"id": 151, "scaleId": 38, "textPt": "Atuar como presidente de um conselho diretivo (Board) em reuniões corporativas", "textEn": "Serve as the chairperson for a corporate board"},
  {"id": 152, "scaleId": 38, "textPt": "Exercer a liderança institucional como presidente de uma associação profissional", "textEn": "Serve as the president of a professional association"},
  {"id": 153, "scaleId": 39, "textPt": "Apresentar teses, propostas e ideias inovadoras em conferências para grandes audiências", "textEn": "Present your ideas at a conference"},
  {"id": 154, "scaleId": 39, "textPt": "Falar em público como representante oficial e porta-voz de uma organização", "textEn": "Speak as the representative of an organization"},
  {"id": 155, "scaleId": 39, "textPt": "Fazer o discurso principal em um evento beneficente de arrecadação de recursos", "textEn": "Be the speaker at a fund-raising event for a worthy cause"},
  {"id": 156, "scaleId": 39, "textPt": "Fazer um pronunciamento público para conscientizar a população sobre temas comunitários", "textEn": "Make a public speech to raise awareness of community issues"},
  {"id": 157, "scaleId": 40, "textPt": "Concorrer a um cargo político eletivo em eleições democráticas", "textEn": "Run for a political office"},
  {"id": 158, "scaleId": 40, "textPt": "Presidir a mesa de trabalhos da câmara de vereadores ou conselho municipal", "textEn": "Be the head of the city council"},
  {"id": 159, "scaleId": 40, "textPt": "Liderar uma comissão temática encarregada de formular diretrizes e políticas públicas", "textEn": "Lead a committee to make policy decisions"},
  {"id": 160, "scaleId": 40, "textPt": "Assumir mandatos e responsabilidades públicas de liderança política perante a sociedade", "textEn": "Assume political leadership responsibilities"},
  {"id": 161, "scaleId": 41, "textPt": "Atuar como advogado de defesa para proteger os direitos de um cliente perante a justiça", "textEn": "Defend a client against a legal charge"},
  {"id": 162, "scaleId": 41, "textPt": "Apresentar argumentos lógicos e fundamentados perante magistrados em uma corte judicial", "textEn": "Present logical arguments in a courtroom"},
  {"id": 163, "scaleId": 41, "textPt": "Reunir evidências técnicas incontestáveis para respaldar a tese de um julgamento", "textEn": "Provide compelling evidence for a trial"},
  {"id": 164, "scaleId": 41, "textPt": "Mediar e solucionar disputas legais e contratuais entre partes litigantes", "textEn": "Resolve legal disputes between parties"},
];

export interface LikertOption {
  value: number;
  label: string;
  shortLabel: string;
  description: string;
}

export const CABIN_LIKERT_OPTIONS: LikertOption[] = [
  {
    value: 1,
    label: 'Não gostaria de realizar de forma alguma',
    shortLabel: 'Detestaria',
    description: 'Rejeição total à atividade; não teria interesse em realizá-la sob nenhuma circunstância.'
  },
  {
    value: 2,
    label: 'Gostaria pouco de realizar',
    shortLabel: 'Pouco interesse',
    description: 'Pouca atração pela atividade; preferiria evitar se pudesse escolher.'
  },
  {
    value: 3,
    label: 'Nem gostaria nem desgostaria',
    shortLabel: 'Neutro / Indiferente',
    description: 'Sentimento neutro ou indiferença; não me atrai particularmente nem me desagrada.'
  },
  {
    value: 4,
    label: 'Gostaria de realizar',
    shortLabel: 'Gostaria',
    description: 'Interesse genuíno e disposição positiva em realizar a atividade.'
  },
  {
    value: 5,
    label: 'Gostaria muito de realizar',
    shortLabel: 'Gostaria muito',
    description: 'Entusiasmo expressivo; atividade altamente prazerosa e alinhada às minhas afinidades.'
  }
];

export interface CabinScores {
  scales: Record<number, number>; // scaleId (1-41) -> score (1.0 to 5.0)
  dimensions: Record<SetpointCode, number>; // dimension code -> score (1.0 to 5.0)
  overallMean: number;
  highestInterestIds: number[]; // top 5
  intermediateInterestIds: number[];
  lowestInterestIds: number[]; // bottom 5
  differentiationIndex: number; // max - min
}

/**
 * Procedimento de pontuação oficial Su et al. (2019):
 * 1. Cada interesse básico = média aritmética das 4 respostas correspondentes.
 * 2. Cada macrodimensão SETPOINT = média aritmética das escalas de interesses que a compõem.
 */
export function calculateCabinScores(answers: Record<number, number>): CabinScores {
  const scaleScores: Record<number, number> = {};
  
  CABIN_SCALES.forEach((scale) => {
    const scaleItems = scale.itemIds;
    let sum = 0;
    let count = 0;
    scaleItems.forEach((id) => {
      const val = answers[id];
      if (typeof val === 'number' && val >= 1 && val <= 5) {
        sum += val;
        count += 1;
      }
    });
    // Se não respondido, fallback seguro para 3.0 (neutro)
    scaleScores[scale.id] = count > 0 ? Number((sum / count).toFixed(2)) : 3.0;
  });

  const dimensionScores: Record<SetpointCode, number> = {
    HEALTH_SCIENCE: 0,
    CREATIVE_EXPRESSION: 0,
    TECHNOLOGY: 0,
    PEOPLE: 0,
    ORGANIZATION: 0,
    INFLUENCE: 0,
    NATURE: 0,
    T_THINGS: 0
  };

  SETPOINT_DIMENSIONS.forEach((dim) => {
    let dimSum = 0;
    dim.scaleIds.forEach((sId) => {
      dimSum += scaleScores[sId] || 3.0;
    });
    dimensionScores[dim.code] = Number((dimSum / dim.scaleIds.length).toFixed(2));
  });

  const allScores = Object.values(scaleScores);
  const overallMean = Number((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2));
  
  // Classificação
  const sortedScaleEntries = Object.entries(scaleScores)
    .map(([id, sc]) => ({ id: Number(id), score: sc }))
    .sort((a, b) => b.score - a.score);

  const highestInterestIds = sortedScaleEntries.filter((s) => s.score >= 3.75).map((s) => s.id);
  const lowestInterestIds = sortedScaleEntries.filter((s) => s.score <= 2.25).map((s) => s.id);
  const intermediateInterestIds = sortedScaleEntries
    .filter((s) => s.score > 2.25 && s.score < 3.75)
    .map((s) => s.id);

  const maxScore = sortedScaleEntries[0]?.score || 5;
  const minScore = sortedScaleEntries[sortedScaleEntries.length - 1]?.score || 1;
  const differentiationIndex = Number((maxScore - minScore).toFixed(2));

  return {
    scales: scaleScores,
    dimensions: dimensionScores,
    overallMean,
    highestInterestIds,
    intermediateInterestIds,
    lowestInterestIds,
    differentiationIndex
  };
}

/**
 * Perfil fictício demonstrativo 1: Liderança Tecnológica & Estratégia de Negócios
 */
export const DEMO_PROFILE_TECH_LEAD: Record<number, number> = {};

// Helper to fill demo profiles
(function initDemoProfile() {
  // Scales with high interest: IT (17), Engineering (10), Math (16), Management (38), Business Initiatives (31), Advising (30), Marketing (33) -> 5 or 4
  // Creative / People: intermediate (3 or 4)
  // Manual / Animal / Religious / Nature: lower (1 or 2)
  CABIN_SCALES.forEach((scale) => {
    let target = 3;
    if ([17, 10, 16, 38, 31, 30].includes(scale.id)) target = 5;
    else if ([33, 39, 41, 11, 34].includes(scale.id)) target = 4;
    else if ([19, 23, 25, 36, 14, 15].includes(scale.id)) target = 3;
    else if ([12, 13, 20, 22, 24, 27, 29].includes(scale.id)) target = 2;
    else target = 1;

    scale.itemIds.forEach((itemId, idx) => {
      // slight variation across the 4 items
      const variance = (idx % 2 === 0) ? 0 : (target === 5 ? -1 : (target === 1 ? 1 : 0));
      const val = Math.max(1, Math.min(5, target + variance));
      DEMO_PROFILE_TECH_LEAD[itemId] = val;
    });
  });
})();

/**
 * Perfil fictício demonstrativo 2: Saúde Biomédica & Cuidado com Pessoas
 */
export const DEMO_PROFILE_HEALTH_PEOPLE: Record<number, number> = {};

(function initDemoProfileHealth() {
  CABIN_SCALES.forEach((scale) => {
    let target = 3;
    if ([13, 27, 12, 25, 26].includes(scale.id)) target = 5;
    else if ([8, 7, 30, 14, 28].includes(scale.id)) target = 4;
    else if ([11, 15, 29, 36, 16, 24].includes(scale.id)) target = 3;
    else if ([18, 22, 34, 35, 37, 39].includes(scale.id)) target = 2;
    else target = 1;

    scale.itemIds.forEach((itemId, idx) => {
      const variance = (idx % 2 === 0) ? 0 : (target === 5 ? -1 : (target === 1 ? 1 : 0));
      const val = Math.max(1, Math.min(5, target + variance));
      DEMO_PROFILE_HEALTH_PEOPLE[itemId] = val;
    });
  });
})();
