from pathlib import Path
import re,json,hashlib,html,zipfile,io,openpyxl,itertools,sys
from pypdf import PdfReader
sys.stdout.reconfigure(encoding='utf8')
SITE=Path(__file__).resolve().parents[1];SRC=SITE.parent/'history-sources'
def save(name,d):
 p=SITE/name;p.parent.mkdir(exist_ok=True,parents=True);p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def url(p):return Path(str(p)+'.url').read_text(encoding='utf-8-sig').strip()
def number(v):
 if isinstance(v,(int,float)):return v
 if isinstance(v,str):
  try:return float(v.replace('.','').replace(',','.'))
  except:pass
 return None
def geo_name(v):
 v=str(v).strip();return {'R. G. do Norte':'Rio Grande do Norte','R. G. do Sul':'Rio Grande do Sul','M. G. do Sul':'Mato Grosso do Sul','-----':'Exterior'}.get(v,v)
# Historical USP career table: preserve source-specific denominator per career.
data=json.loads((SITE/'data.json').read_text(encoding='utf8'));p=SRC/'ffclrp-historical.html'
text=p.read_text(encoding='latin1');by={str(y):[] for y in range(1987,1994)}
for tr in re.findall(r'<TR[^>]*>(.*?)</TR>',text,re.S|re.I):
 cells=[html.unescape(re.sub('<[^>]+>','',x)).strip() for x in re.findall(r'<TD[^>]*>(.*?)</TD>',tr,re.S|re.I)]
 if len(cells)!=21 or cells[0]=='Carreira':continue
 for i,y in enumerate(range(1987,1994),1):
  m=re.fullmatch(r'(\d+(?:,\d+)?)/(\d+)',cells[i])
  if m:
   cut=float(m[1].replace(',','.'));base=int(m[2]);by[str(y)].append(dict(code='hist-'+str(len(by[str(y)])+1),name=' '.join(cells[0].split()),sourceBase=base,modalities={'GERAL':dict(cut=cut,vacancies=None,applicants=None,absent=None,called=None,maximum=None,ratio=None)}))
for y,rows in by.items():
 unique={}
 for r in rows:
  key=(r['name'],r['sourceBase'],r['modalities']['GERAL']['cut'])
  if key in unique:unique[key]['sourceOccurrences']+=1
  else:r['sourceOccurrences']=1;unique[key]=r
 rows=list(unique.values())
 if rows:data[y]=dict(questions=None,scoreMax=max(r['sourceBase'] for r in rows),scoreKind='points',modalities={'GERAL':'Geral · tabela histórica USP'},careers=rows,source='https://www.ffclrp.usp.br/divulgacao/graduacao/NotaCorteFUVEST.htm',sha256=sha(p),status='partial',note='Cobertura da tabela histórica NAEG/USP hospedada pela FFCLRP. Inclui apenas carreiras com nota registrada nesta tabela; não se afirma completude do concurso. Escalas variam por carreira (denominador preservado no detalhe e CSV). Pontos brutos de escalas diferentes não são diretamente comparáveis. Vagas e inscrições ausentes.')
 print('Fuvest',y,len(rows))
save('data.json',data)
# Official ENEM sinopses, annual geography/performance + distributions and profiles.
enem=json.loads((SITE/'enem-stats.json').read_text(encoding='utf8'));areas=['Ciências da Natureza','Ciências Humanas','Linguagens','Matemática','Redação']
for y in range(2009,2026):
 p=SRC/(f'enem-{y}.zip' if y<2025 else 'sinopse_enem_2025.zip');z=zipfile.ZipFile(p);w=openpyxl.load_workbook(io.BytesIO(z.read(next(n for n in z.namelist() if n.endswith('.xlsx')))),read_only=True,data_only=True)
 e=enem.setdefault(str(y),{});e.update(source=f'https://download.inep.gov.br/informacoes_estatisticas/sinopses_estatisticas/sinopses_enem/{y}/sinopse_enem_{y}.zip' if y==2025 else (SRC/f'enem-{y}.url').read_text().strip(),sha256=sha(p),regions={},distributions={},profiles={},registrations={},geoRegions={},notes=e.get('notes',[]))
 if y==2025:e['download']='http://download.inep.gov.br/informacoes_estatisticas/sinopses_estatisticas/sinopses_enem/2025/sinopse_enem_2025.zip'
 section=6 if y==2010 else 7
 for i,area in enumerate(areas,1):
  sn=f'{section}.{i}.1'
  for row in w[sn].values:
   if len(row)>=9 and isinstance(row[2],(int,float)) and isinstance(row[3],(int,float)) and isinstance(row[1] or row[0],str):
    geo=geo_name(row[1] or row[0]);e['regions'].setdefault(geo,[]).append(dict(area=area,n=row[2],mean=row[3],median=row[4],mode=row[5],min=row[6],max=row[7],sd=row[8],table=sn));e['geoRegions'][geo]=geo_name(row[0])
  sn=f'{section}.{i}.2'
  if sn not in w.sheetnames:continue
  rs=list(w[sn].values);headers=next((r for r in rs[:12] if any(isinstance(v,str) and '[' in v for v in r[3:])),None)
  if not headers:continue
  cols=[(j,str(v).strip()) for j,v in enumerate(headers) if j>=3 and v is not None]
  for r in rs:
   if len(r)>3 and isinstance(r[2],(int,float)) and isinstance(r[1] or r[0],str):
    bins=[dict(label=l,count=number(r[j])) for j,l in cols]
    if all(b['count'] is not None for b in bins) and sum(b['count'] for b in bins)==r[2]:e['distributions'].setdefault(geo_name(r[1] or r[0]),{})[area]=dict(n=r[2],bins=bins,table=sn)
 for sn,key in [('1.1','registrations'),('1.2','presence'),('1.3','sex'),('1.4','race'),('1.5','age'),('1.6','marital'),('1.10','schooling')]:
  if sn not in w.sheetnames:continue
  rs=list(w[sn].values);title=' '.join(str(v) for r in rs[:5] for v in r if v and isinstance(v,str) and re.match(r'1\.\d',v))
  # Profile table numbering differs in older editions. Confirm subject before using.
  terms={'presence':['presença','presenca'],'sex':['sexo'],'race':['raça','raca'],'age':['idade','etária','etaria'],'marital':['civil'],'schooling':['ensino médio','ensino medio']}
  if key!='registrations' and not any(t in title.lower() for t in terms[key]):continue
  header=next((r for r in reversed(rs[:9]) if any(v is not None for v in r[3:])),None)
  for r in rs:
   if len(r)<=2 or not isinstance(r[2],(int,float)) or not isinstance(r[1] or r[0],str):continue
   geo=geo_name(r[1] or r[0])
   if geo not in e['regions']:continue
   if key=='registrations':e['registrations'][geo]=r[2];continue
   if not header:continue
   cols=[(j,str(v).strip()) for j,v in enumerate(header) if j>=3 and v is not None];bins=[dict(label=l,count=number(r[j])) for j,l in cols]
   if bins and all(b['count'] is not None for b in bins) and sum(b['count'] for b in bins)==r[2]:e['profiles'].setdefault(geo,{})[key]=dict(title=title,n=r[2],bins=bins,table=sn)
 print('ENEM',y,len(e['regions']),len(e['profiles']))
 save('enem-stats.json',enem)
# Legacy editions are explicitly documented, without imposing the post-2009 scale.
for y in range(1998,2009):
 p=SRC/f'enem-report-{y}.pdf';source=url(p) if p.exists() else 'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/enem'
 enem[str(y)]=dict(source=source,regions={'Brasil':[]},registrations={},profiles={},distributions={},geoRegions={},status='unavailable',notes=['Edição da estrutura anterior a 2009: prova objetiva e redação em escala de 0 a 100. Relatório pedagógico disponível na fonte quando localizado. Estatísticas estruturadas ainda não validadas; nenhum valor foi estimado.'])
enem['2026']=dict(source='https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem',regions={'Brasil':[]},registrations={},profiles={},distributions={},geoRegions={},status='pending',notes=['Edição em andamento. Não há estatísticas de desempenho incorporadas; não foi estimado nenhum resultado.'])
save('enem-stats.json',enem)
# FUVEST QASE total-career aggregate, not per-career repeated populations.
qase={}
for y in [2024,2025]:
 p=SRC/f'fuvest-qase-{y}.pdf';reader=PdfReader(p);parts=[]
 for idx in range(max(0,len(reader.pages)-12),len(reader.pages)):
  t=reader.pages[idx].extract_text()
  if re.search(r'Total das Carreiras\s*\nCopyright',t):parts.append((idx+1,t))
 questions={}
 for page,t in parts:
  starts=list(re.finditer(r'^([0-9]{2})\s*\n(.+?)\n([\d.]+) respostas\s*\n',t,re.M|re.S))
  for i,m in enumerate(starts):
   num,title,n=m.groups();n=int(n.replace('.',''));block=t[m.end():starts[i+1].start() if i+1<len(starts) else len(t)];bins=[]
   for b in re.finditer(r'^([\d,]+)% (.+) \(([\d.]+)\)\s*$',block,re.M):bins.append(dict(label=b[2].strip(),count=int(b[3].replace('.','')),publishedPct=float(b[1].replace(',','.'))))
   if bins and sum(b['count'] for b in bins)==n:questions[num]=dict(title=' '.join(title.split()),n=n,bins=bins,page=page)
 qase[str(y)]=dict(source=url(p),sha256=sha(p),questions=questions,note='QASE · inscritos · Total das Carreiras (inclui treineiros). População de respostas específica de cada pergunta. Percentuais recalculados a partir das contagens. Não é desempenho na prova nem amostra representativa da população brasileira.')
 print('QASE',y,len(questions))
save('fuvest-stats.json',qase)
