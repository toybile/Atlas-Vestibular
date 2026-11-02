# Cortes e Concorrência · FUVEST e ENEM

Versão de 02/11/2026, **somente local**. Nenhum envio ao GitHub, Pages ou Sites GPT.

## Abrir

Dê dois cliques em `Abrir site.cmd`. O servidor atende apenas em `http://127.0.0.1:8767/`. Alternativa: `python -m http.server 8767 --bind 127.0.0.1`, nesta pasta. Abrir o HTML diretamente não permite carregar as bases.

## Cobertura real

| Conjunto | Dados incorporados | Limites |
| --- | --- | --- |
| FUVEST | Cortes 1994–2026; tabela histórica USP 1987–1993; 3.483 registros carreira/edição | 1987–1993 têm cobertura parcial. 1977–1986 sem cortes validados. 2027 em andamento. |
| ENEM: inscrições | 1998–2025, Brasil, cinco regiões e 27 UFs | 1998–2008 vêm da série retrospectiva do Relatório Pedagógico 2008; não são notas. |
| ENEM: desempenho | 2009–2025, cinco áreas, Brasil/regiões/UFs | População própria por área; 2009/2010 também têm Exterior. Desempenho anterior a 2009 não estruturado. 2026 ainda sem resultados. |
| SiSU | 2010–2025, 635.255 registros de relatórios agregados, com semestre identificado | Cópias públicas atribuídas ao MEC, sem verificação binária contra a origem. Relatório 2026 não obtido. |
| ENEM-USP | Primeira chamada de 2024, 2025 e 2026 | Notas da primeira chamada de 2023 ainda não validadas. Sem estimar vagas/inscrições ausentes. |
| FUVEST: QASE | 2024/2025, total das carreiras, 34/38 perguntas com contagens validadas e mais um agrupamento por Grandes Regiões | Inclui treineiros; denominador por pergunta. Não é desempenho na prova. |

Os seletores inventariam também as lacunas, identificadas como sem dados, sem cortes validados ou aguardando resultados. Isso não representa ausência de cursos nem notas iguais a zero. Os dados não permitem afirmar que todos os cortes desde a criação da FUVEST estão disponíveis.

## Exploração

- O menu superior diferencia FUVEST (violeta) e ENEM (verde-petróleo), com nomes e indicação textual do exame ativo.
- ENEM: notas por área, comparação entre 27 estados e cinco regiões, série de desempenho desde 2009, faixas de nota, inscritos por território e evolução das inscrições desde 1998. Perfil/presença: sexo, cor/raça, idade e escolaridade, conforme tabelas disponíveis em cada ano.
- FUVEST: cortes/concorrência ou estatísticas/perfil. O QASE permite estado de residência, Grandes Regiões calculadas a partir das UFs, regiões imediatas/intermediárias de origem, idade, renda, escolaridade e demais perguntas com totais consistentes.
- SiSU/ENEM-USP: processo, edição, modalidade original, UF, instituição e curso/campus antes do Top; busca adicional dentro do Top. Últimas edições combina somente a mais recente incorporada de cada processo. Cada linha e exportação identifica processo, ano, semestre quando houver e modalidade.
- Dados de ingresso são carregados por edição, sob demanda. O navegador não baixa 635 mil registros ao abrir o site.
- Gráfico/tabela, PDF da visualização selecionada, CSV, temas, fontes ajustáveis e filtros no endereço permanecem disponíveis. PDFs alinham o centro do bloco de texto, números e barra na mesma altura e centralizam células numéricas.

## Método

Cada linha tem uma unidade definida: carreira/edição/modalidade (FUVEST), oferta/campus/turno/modalidade/semestre (SiSU), curso/unidade/turno/modalidade/chamada (ENEM-USP), área/território/população (desempenho ENEM) ou resposta/pergunta/população (perfil).

Não fundimos automaticamente modalidades de épocas e processos diferentes. Antes de 2019, FUVEST usa Geral conforme a fonte. No SiSU, categorias amplas L/V/B podem conter critérios diferentes por oferta; o detalhe preserva a descrição original. Não rebatizamos as categorias históricas com cotas atuais.

FUVEST 1987–1993 preserva a base publicada por carreira, inclusive escalas diferentes. Repetições idênticas da mesma carreira em grupos da tabela aparecem uma vez; `sourceOccurrences` registra as ocorrências. A extensão do gráfico é uma referência visual, não normalização de escalas. A base histórica aparece no detalhe/CSV. Até 2002 não há conversão geral em acertos ou percentual. Nas edições com base validada, percentual = pontos/base × 100; bônus e aproveitamento do ENEM variaram, portanto isso não é necessariamente proporção de acertos.

Média e distribuição não determinam causalmente dificuldade ou qualidade educacional. Populações mudam entre áreas, territórios e anos. As provas objetivas do ENEM usam TRI, sem conversão direta entre acertos e nota. A escala de 1.000 no gráfico é referência de exibição, não teto universal da TRI. A estrutura anterior a 2009, de prova objetiva/redação em escala de 0–100, não foi fundida à série moderna.

Proporções são calculadas das contagens: contagem/n × 100. Só foram incorporadas partições de perfil/distribuição cuja soma corresponde ao denominador publicado. Categorias como cor/raça são as declaradas na fonte; não são explicações causais de desempenho. O QASE representa inscritos que responderam à pergunta, incluindo treineiros no Total das Carreiras. Não representa a população brasileira. O agrupamento em Grandes Regiões usa o estado de residência; não é nota média regional.

Valores ausentes permanecem ausentes. Relatórios SiSU 2010–2018 não informam UF, município, vagas ou inscrições: esses campos permanecem null e a UF aparece como Não informada. Não deduzimos UF pelo nome de campus. Cortes zero/ausentes não entram no ranking SiSU, mas ficam na base. FUVEST 2021 é uma fonte de cortes apenas, e zeros nela indicam corte não informado. Não inferimos vagas a partir de razões arredondadas. Inscrições/vaga não é probabilidade de aprovação.

## Proveniência e reconstrução

- FUVEST: PDFs oficiais e [tabela histórica NAEG/USP hospedada na FFCLRP](https://www.ffclrp.usp.br/divulgacao/graduacao/NotaCorteFUVEST.htm).
- ENEM: [sinopses oficiais Inep](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas/enem), desempenho 7.x.1 (6.x.1 em 2010), distribuição 7.x.2/6.x.2 e perfis da seção 1. Relatório Pedagógico 2008, página impressa 43, para inscrições 1998–2008.
- QASE: PDFs oficiais `fuvest_2024_qase_inscritos_carreira.pdf` e `fuvest_2025_qase_inscritos_carreira.pdf`; somente páginas Total das Carreiras, sem somar carreiras repetidas.
- SiSU: relatórios agregados obtidos no repositório público [maiakanegae/sisu-data](https://github.com/maiakanegae/sisu-data). Procedência, download e SHA-256 preservados. Nenhuma lista individual utilizada.
- ENEM-USP: PDFs oficiais da primeira chamada. Página, classificação publicada, fonte e SHA-256 preservados por edição. Ausência de município explícito na unidade permanece null, sem atribuir automaticamente São Paulo.

`coverage.json` inventaria as edições e lacunas. `admissions-index.json` direciona os arquivos anuais em `admissions/`. Arquivos de origem estão na pasta irmã `../history-sources`, fora do servidor.

Para reconstruir com as origens já baixadas e as dependências de `requirements-data.txt`, execute nesta ordem:

```text
python tools/import_data.py --sources ../history-sources
python tools/import_enem_usp.py --pdf ../history-sources/enem-usp-2026-chamada1.pdf
python tools/expand_history.py
python tools/expand_admissions.py
python tools/finalize_data.py
node tools/verify_data.cjs
```

Os importadores não fazem downloads nem enviam arquivos. A verificação confere totais por território, partições e denominadores, ausência de estimativas nos campos históricos, identificadores e coexistência de processos no mesmo ano. A revisão local incluiu desktop/celular e renderização de oito PDFs dos novos recortes.

Dependências de exportação locais: jsPDF e Lato, com licenças em `vendor/` e `fonts/`. Interface independente, sem vínculo institucional com USP, FUVEST, MEC ou Inep. Não estima aprovação.
