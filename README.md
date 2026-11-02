# FUVEST: Cortes e Concorrência

Site interativo para explorar notas de corte da primeira fase da FUVEST de **2023 a 2026**, nas modalidades **AC, EP e PPI**.

**Site:** https://toybile.github.io/FUVEST-Cortes-e-Concorrencia/

## Uso

- Padrão: 2026, AC, Top 10, empates incluídos e sem linha de referência.
- Seleção por corte ou inscritos da modalidade por vaga; quantidade configurável e busca no recorte.
- Linha opcional em percentual ou acertos sobre 90 ou 80 questões; a escala de 80 serve apenas para comparação com 2027.
- Gráfico e tabela; botão único Exportar com PDF da visualização ativa e dados em CSV.
- Temas claro e escuro, fonte ajustável e filtros recolhíveis no celular.
- Barra lateral fixa e centralizada verticalmente no computador, com rolagem interna quando necessário.

## Estrutura e publicação

HTML, CSS e JavaScript estáticos na raiz, sem instalação ou compilação. GitHub Pages publica a raiz da branch `main`; `.nojekyll` evita processamento pelo Jekyll. Basta enviar commits para `main` para atualizar a publicação. Sites GPT não participa mais do fluxo.

Para testar localmente: `python -m http.server 8000` e abra `http://localhost:8000`.

`data.json` contém os registros e as fontes por edição; `pdf-export.js` gera PDFs no navegador; `fonts/` e `vendor/` incluem dependências locais e suas licenças. Nenhuma credencial é necessária para executar o site. As preferências de tema e fonte ficam somente no navegador; os filtros são preservados no endereço.

## Método

341 registros de carreira/edição: 107 de 2023, 85 de 2024, 75 de 2025 e 74 de 2026. As edições são tratadas separadamente, pois nomes, códigos e agrupamentos mudam. Treineiros são excluídos. Os totais de vagas conferem com os documentos oficiais menos 600 vagas de treineiros: 8.230 em 2023 e 8.147 em cada edição de 2024 a 2026.

Percentual do corte = pontos / 90 × 100. Inscritos por vaga = inscritos da modalidade / vagas da mesma modalidade; esse quociente não é a coluna de convocados por vaga nem uma probabilidade de aprovação. Atingir o corte histórico não garante convocação futura ou matrícula. Valores ausentes não são convertidos em zero.

Os links oficiais e os SHA-256 dos PDFs de origem estão em `data.json`. As fontes também estão disponíveis no site em Método e fontes. Interface independente, sem vínculo institucional com USP/FUVEST.

## Licenças de terceiros

jsPDF 4.2.1: `vendor/JSPDF-LICENSE.txt`. Lato: `fonts/OFL.txt`.

## Navegação e layout
Ano, modalidade e critério de ordenação também podem ser alterados pelos seletores acima do gráfico, sincronizados com a barra lateral e os parâmetros do endereço. A marca abre um seletor de concurso; somente FUVEST está ativa, e ENEM aparece desabilitado como opção futura, sem dados incorporados. O cabeçalho ocupa a largura da página, os títulos ficam centralizados e a barra lateral é centralizada na área visível abaixo do cabeçalho. Barras de rolagem finas e discretas nos temas claro e escuro.

