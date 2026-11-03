from pathlib import Path
import json,re
site=(Path(__file__).resolve().parents[1]/'data');s=site.parent.parent/'history-sources';p=s/'enem-report-2008.txt';
if not p.exists():
 from pypdf import PdfReader
 p.write_text('\n'.join(pg.extract_text() for pg in PdfReader(s/'enem-report-2008.pdf').pages),encoding='utf8')
t=p.read_text(encoding='utf8');start=t.index('Distribuição dos Inscritos, segundo Região, UF e ano de realização do ENEM 2008');block=t[start:t.index('FONTE: MEC/INEP/ENEM',start)];block=re.sub(r'(?<=\.) (?=\d)','',block)
ufs=dict(zip('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(),['Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Distrito Federal','Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul','Minas Gerais','Pará','Paraíba','Paraná','Pernambuco','Piauí','Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul','Rondônia','Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins']))
d=json.loads((site/'enem-stats.json').read_text(encoding='utf8'));found={}
for line in block.splitlines():
 m=re.fullmatch(r'(Brasil|Norte|Nordeste|Sudeste|Sul|Centro-Oeste|[A-Z]{2})\s+(.+)',line)
 if not m:continue
 vals=m[2].split()
 if len(vals)!=11:raise ValueError(line)
 found[ufs.get(m[1],m[1])]=[int(v.replace('.','')) for v in vals]
assert len(found)==33,len(found)
for i,y in enumerate(range(1998,2009)):
 e=d[str(y)];e.update(registrations={g:ns[i] for g,ns in found.items()},status='partial',source=(s/'enem-report-2008.pdf.url').read_text().strip(),registrationTable='Relatório Pedagógico ENEM 2008 · p. 43',notes=['Inscritos por Brasil, região e UF: série retrospectiva publicada no Relatório Pedagógico ENEM 2008, página impressa 43. Desempenho anterior a 2009 não incorporado: estrutura de prova e escala diferentes; nenhum valor foi estimado.'])
 assert sum(e['registrations'][g] for g in ['Norte','Nordeste','Sudeste','Sul','Centro-Oeste'])==e['registrations']['Brasil']
 assert sum(n for g,n in e['registrations'].items() if g not in ['Brasil','Norte','Nordeste','Sudeste','Sul','Centro-Oeste'])==e['registrations']['Brasil']
for y,e in d.items():
 if int(y)>=2009:
  for k in ['profiles','registrations']:
   e[k]={g:v for g,v in e[k].items() if g in e['regions']}
(site/'enem-stats.json').write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print('Validated retrospective registrations: 1998–2008 x 33 territories')

p=site/'admissions-index.json';d=json.loads(p.read_text(encoding='utf8'))
for year,process,name,source,note in [('2023','enem-usp','ENEM-USP','https://www.fuvest.br/acervo-enem-usp-2023/','Ainda não foi obtida e validada uma tabela de notas da primeira chamada de 2023. Nenhum valor foi estimado.'),('2026','sisu','SiSU','https://sisu.mec.gov.br/#/relatorio','Relatório agregado SiSU 2026 ainda não obtido nesta versão local. O ano não representa ausência de ofertas nem processo em andamento.')]:
 if not any(s['process']==process for s in d.setdefault(year,[])):d[year].append(dict(process=process,processName=name,year=year,source=source,count=0,status='unavailable',provenance=note))
(site/'admissions-index.json').write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')

from pathlib import Path
import json
site=(Path(__file__).resolve().parents[1]/'data');p=site/'fuvest-stats.json';d=json.loads(p.read_text(encoding='utf8'))
mapregs={'Norte':'AC AM AP PA RO RR TO','Nordeste':'AL BA CE MA PB PE PI RN SE','Centro-Oeste':'DF GO MS MT','Sudeste':'ES MG RJ SP','Sul':'PR RS SC'}
for y,e in d.items():
 q=next((q for q in e['questions'].values() if 'Estado da Federação' in q['title']),None)
 if not q:continue
 bins=[dict(label=region,count=sum(b['count'] for b in q['bins'] if b['label'][:2] in ufs.split())) for region,ufs in mapregs.items()]
 assert sum(b['count'] for b in bins)==q['n']
 e['questions']['BR']=dict(title='Região do Brasil · residência dos inscritos',n=q['n'],bins=bins,page=q['page'],derived='Agrupamento das 27 UFs nas cinco Grandes Regiões do IBGE. Denominador: respostas válidas à pergunta sobre Estado de residência. Não é distribuição de notas.')
p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')
# coverage is a record of data actually imported, including gaps.
fuvest=json.loads((site/'data.json').read_text(encoding='utf8'));enem=json.loads((site/'enem-stats.json').read_text(encoding='utf8'));ad=json.loads((site/'admissions-index.json').read_text(encoding='utf8'))
cov={'preparedAt':'2026-11-02','localOnly':True,'fuvest':{y:dict(rows=len(e['careers']),status=e.get('status','available'),source=e['source']) for y,e in sorted(fuvest.items())},'enem':{y:dict(status=e.get('status','available'),geographies=len(e['regions']),registrations=len(e['registrations']),source=e['source']) for y,e in sorted(enem.items())},'admissions':ad,'fuvestQase':{y:dict(questions=len(e['questions']),source=e['source']) for y,e in d.items()},'gaps':{'fuvest':'1977–1986: sem tabela de cortes validada; 1987–1993: tabela histórica de cobertura parcial; 2027: em andamento.','enem':'1998–2008: inscrições incorporadas, desempenho não estruturado; 2026: em andamento.','sisu':'2026: relatório agregado ainda não obtido; UF, município, vagas e inscrições ausentes nos relatórios 2010–2018.','enem-usp':'2023: notas da primeira chamada ainda não validadas.'}}
(site/'coverage.json').write_text(json.dumps(cov,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print('SiSU rows',sum(s['count'] for ss in ad.values() for s in ss if s['process']=='sisu'))
print('Fuvest career years',sum(len(e['careers']) for e in fuvest.values()))
