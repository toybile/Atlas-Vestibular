from pathlib import Path
from pypdf import PdfReader
import re,json,hashlib,zipfile,io,openpyxl,sys,argparse
sys.stdout.reconfigure(encoding='utf-8')
parser=argparse.ArgumentParser(description='Importar PDFs FUVEST, sinopses Inep e relatório agregado SiSU já baixados.')
parser.add_argument('--sources',type=Path,default=Path(__file__).resolve().parents[3]/'history-sources')
parser.add_argument('--site',type=Path,default=(Path(__file__).resolve().parents[2]/'Arquivos Principais'))
args=parser.parse_args();SRC=args.sources;SITE=args.site
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(name,data):((SITE.parent/'Arquivos Auxiliares (AI)'/name) if name=='sisu.json' else (SITE/name)).write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf8')
data=json.loads((SITE/'data.json').read_text(encoding='utf8'))
def stats(cut=None,vac=None,ins=None,absent=None,called=None,maximum=None):
 return dict(cut=cut,vacancies=vac,applicants=ins,absent=absent,called=called,maximum=maximum,ratio=ins/vac if ins is not None and vac else None)
for y in range(1994,2023):
 f=SRC/f'{y}.pdf';reader=PdfReader(f);text='\n'.join(p.extract_text() for p in reader.pages)
 f.with_suffix('.txt').write_text(text,encoding='utf8');rows=[];current=None
 if y==2021:
  # This publication lists cuts only; zero means no published cutoff, not zero points.
  for page in reader.pages:
   for m in re.finditer(r'^(\d{3})\s+(.+?)(?=^\d{3}\s|\Z)',page.extract_text(),re.S|re.M):
    code,block=m.groups();values=re.fullmatch(r'(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s*',block,re.S)
    assert values,(code,block)
    name,*cuts=values.groups();name=' '.join(name.split())
    if re.search('trein',name,re.I):continue
    rows.append(dict(code=int(code),name=name,modalities={mode:stats(int(c) or None) for mode,c in zip(['AC','EP','PPI'],cuts)}))
 elif y>=2019:
  for line in text.splitlines():
   line=line.strip()
   m=re.match(r'^(\d{3})[−–-](.+)$',line)
   if m:
    code,name=m.groups();current=dict(code=int(code),name=name,modalities={})
    if not re.search('trein',name,re.I):rows.append(current)
   elif current and re.match(r'^− (Ampla|Candidatos)',line):
    vals=re.findall(r'\d+(?:\.\d+)?',line);mode='AC' if 'Ampla' in line else 'PPI' if 'PPI' in line else 'EP'
    if len(vals)==7:
     vac,ins,ab,called,ratio,maximum,cut=vals;current['modalities'][mode]=stats(int(cut),int(vac),int(ins),int(ab),int(called),int(maximum))
    elif len(vals)==4:current['modalities'][mode]=stats(None,*map(int,vals))
    else:raise ValueError((y,line))
   elif line.startswith('Total'):current=None
 else:
  for line in text.splitlines():
   m=re.match(r'^(\d{3})[−–-](.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)\s+(\d+)\s+(\d+)\s*$',line)
   if m:
    code,name,vac,ins,ab,called,ratio,maximum,cut=m.groups();d=stats(int(cut),int(vac),int(ins),int(ab),int(called),int(maximum))
   else:
    m=re.match(r'^(\d{3})[−–-](.+?)\s+(\d+)\s+([\d.]+)\s+(\d+)\s+(\d+|−−−)\s+(\d+)\s*$',line)
    if not m:continue
    code,name,called,ratio,maximum,phase2,cut=m.groups();d=stats(int(cut),called=int(called),maximum=int(maximum))
   if not re.search('trein',name,re.I):rows.append(dict(code=int(code),name=name.strip(),modalities={'GERAL':d}))
 # The publications of 2008–2013 abbreviate the three training groups.
 if 2008<=y<=2013:rows=[r for r in rows if r['name'].lower() not in ['humanas','biologicas','biológicas','exatas']]
 if not rows:raise ValueError(('no rows',y))
 assert len({r['code'] for r in rows})==len(rows),(y,'duplicate code')
 for r in rows:
  assert r['modalities']
  for s in r['modalities'].values():
   assert s['cut'] is None or s['cut']>=0
   assert s['maximum'] is None or s['cut'] is None or s['cut']<=s['maximum'],(y,r)
 source=(SRC/f'{y}.url').read_text().strip() if (SRC/f'{y}.url').exists() else f'https://www.fuvest.br/wp-content/uploads/fuvest_{y}_corte.pdf'
 questions=None if y<2003 else 100 if y<2007 else 90
 data[str(y)]=dict(questions=questions,source=source,sha256=sha(f),careers=rows)
 print('FUVEST',y,len(rows))
for y,d in data.items():
 d['modalities']=({'GERAL':'Geral · tabela histórica'} if int(y)<2019 else {'AC':'Ampla concorrência','EP':'Escola pública','PPI':'Escola pública · grupo PPI'})
 d['scoreMax']=d['questions'] or 160
 d['scoreKind']='points' if int(y)<2019 else 'hits'
 d['note']=('Tabela histórica sem desagregação AC/EP/PPI. A categoria Geral preserva a publicação original; não equivale às modalidades atuais. ' if int(y)<2019 else '')+('Escala histórica: mostramos os pontos oficiais. Percentuais e equivalência em acertos ficam indisponíveis, pois a escala não foi validada por carreira.' if int(y)<2003 else f"Prova de {d['questions']} questões. O percentual é uma razão de escala; regras de bonificação ou aproveitamento do ENEM podem variar conforme o edital.")
 if int(y)==2021:d['note']+=' Esta fonte informa apenas os cortes. Vagas e inscrições não estão disponíveis; o valor 0 da publicação é tratado como corte não informado.'
for y in range(1977,1994):
 data[str(y)]=dict(questions=None,scoreMax=160,scoreKind='points',modalities={'GERAL':'Geral · edição histórica'},careers=[],source=f'https://www.fuvest.br/acervo-vestibular-{y}/',note='Edição do acervo histórico. Não foi localizada e validada uma tabela completa de cortes para esta edição. Nenhum valor foi estimado. Consulte os documentos oficiais no acervo.',status='unavailable')
data['2027']=dict(questions=80,scoreMax=80,scoreKind='hits',modalities={'AC':'Ampla concorrência','EP':'Escola pública','PPI':'Escola pública · grupo PPI'},careers=[],source='https://www.fuvest.br/',note='Edição em andamento. Cortes de 2027 ainda não incorporados: não foi obtida uma tabela oficial nesta consulta de 02/11/2026. Nenhuma nota de corte foi estimada.',status='pending')
write('data.json',data)
# ENEM: official aggregate sheets. Keep each area's own population and footnotes.
enem={};areas=['Ciências da Natureza','Ciências Humanas','Linguagens','Matemática','Redação']
for y in range(2009,2025):
 f=SRC/f'enem-{y}.zip';z=zipfile.ZipFile(f);names=[n for n in z.namelist() if n.endswith('.xlsx')]
 if not names:raise ValueError((y,z.namelist()))
 w=openpyxl.load_workbook(io.BytesIO(z.read(names[0])),data_only=True,read_only=True)
 regions={};notes=[]
 for i,area in enumerate(areas,1):
  sheet=w[f'{6 if y==2010 else 7}.{i}.1']
  for row in sheet.values:
   if len(row)<9:continue
   if not isinstance(row[2],(int,float)):continue
   region=row[1] or row[0]
   if not isinstance(region,str) or not isinstance(row[3],(int,float)):continue
   regions.setdefault(region,[]).append(dict(area=area,n=row[2],mean=row[3],median=row[4],mode=row[5],min=row[6],max=row[7],sd=row[8]))
  notes.extend(' '.join(str(v) for v in row if v is not None) for row in sheet.values if any(isinstance(v,str) and re.match(r'(Nota|Fonte|\(\d)',v) for v in row))
 assert len(regions['Brasil'])==5,(y,regions)
 enem[str(y)]=dict(source=(SRC/f'enem-{y}.url').read_text().strip(),sha256=sha(f),regions=regions,notes=list(dict.fromkeys(notes)))
 print('ENEM',y,len(regions))
write('enem-stats.json',enem)
# SiSU: publicly mirrored copy of the MEC aggregate report. No individual candidate records.
f=SRC/'sisu-2025.xlsx';w=openpyxl.load_workbook(f,read_only=True,data_only=True);sheet=w['inscricao_2025_1'];it=iter(sheet.values);head=next(it);records=[];modes={}
for idx,row in enumerate(it):
 d=dict(zip(head,row));mode=str(d['TIPO_CONCORRENCIA']).strip();desc=d['DS_MOD_CONCORRENCIA'];modes[mode]=desc
 records.append(dict(id=idx,courseCode=d['CO_IES_CURSO'],course=d['NO_CURSO'],institution=d['NO_IES'],acronym=d['SG_IES'],campus=d['NO_CAMPUS'],city=d['NO_MUNICIPIO_CAMPUS'],uf=d['SG_UF_CAMPUS'],degree=d['DS_GRAU'],shift=d['DS_TURNO'],mode=mode,modeDescription=desc,bonus=d['NU_PERCENTUAL_BONUS'],vacancies=d['QT_VAGAS_OFERTADAS'],cut=d['NU_NOTACORTE'],applicants=d['QT_INSCRICAO']))
descriptions=list(dict.fromkeys(r['modeDescription'] for r in records));desc_ids={d:i for i,d in enumerate(descriptions)}
for r in records:r['descriptionId']=desc_ids[r.pop('modeDescription')]
columns=list(records[0])
write('sisu.json',{'2025':dict(source='https://sisu.mec.gov.br/#/relatorio',download=(SRC/'sisu-2025.url').read_text().strip(),provenance='Relatório agregado atribuído ao MEC, obtido de cópia pública no repositório maiakanegae/sisu-data. A cópia não confere caráter oficial a esta interface; confira o edital e o portal SiSU.',sha256=sha(f),modalities=modes,descriptions=descriptions,columns=columns,rows=[[r[k] for k in columns] for r in records])})
print('SISU',len(records),'modalities',len(modes))
write('coverage.json',{'fuvest':{y:{'rows':len(d['careers']),'status':d.get('status','available'),'source':d['source']} for y,d in sorted(data.items())},'enem':{'years':list(enem),'source':'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas/enem','unavailable':{'2025':'Link listado pelo Inep, mas arquivo não obtido nesta consulta.'}},'sisu':{'years':['2025'],'source':'https://sisu.mec.gov.br/#/relatorio','mirrored':True}})
