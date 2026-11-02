from pathlib import Path
import json,re,hashlib,openpyxl,sys
from pypdf import PdfReader
sys.stdout.reconfigure(encoding='utf8');site=Path(__file__).resolve().parents[1];src=site.parent/'history-sources'
def save(name,d):
 p=site/name;p.parent.mkdir(exist_ok=True,parents=True);p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def url(p):return (Path(str(p)+'.url') if Path(str(p)+'.url').exists() else p.with_suffix('.url')).read_text(encoding='utf-8-sig').strip()
# Keep the source's semester within the selected calendar year.
index={};byyear={}
cols=['id','courseCode','course','institution','acronym','campus','city','uf','degree','shift','mode','bonus','vacancies','cut','applicants','descriptionId','semester']
for p in src.glob('*.xlsx'):
 if not ('corte' in p.name or p.name=='sisu-2025.xlsx'):continue
 w=openpyxl.load_workbook(p,data_only=True,read_only=True);it=iter(w.worksheets[-1].values);old='2010 a 2018' in p.name
 if old:
  for _ in range(4):next(it)
 head=next(it)
 for row in it:
  d=dict(zip(head,row))
  if old:
   ed=str(row[0]);year=ed[:4]
   if not year.isdigit():continue
   courseCode,course,ins,acronym,campus,city,uf,degree,shift,mode,bonus,vac,cut,app,desc=row[5],row[6],row[2],row[3],row[4],None,None,row[7],row[8],row[9],row[11],None,row[12],None,row[10]
  else:
   ed=str(d.get('EDICAO') or (str(d.get('NU_ANO'))+'/'+str(d.get('NU_EDICAO'))));year=ed[:4]
   if not year.isdigit():continue
   courseCode,course,ins,acronym,campus,city,uf,degree,shift,mode,bonus,vac,cut,app,desc=[d.get(k) for k in ['CO_IES_CURSO','NO_CURSO','NO_IES','SG_IES','NO_CAMPUS','NO_MUNICIPIO_CAMPUS','SG_UF_CAMPUS','DS_GRAU','DS_TURNO','TIPO_CONCORRENCIA','NU_PERCENTUAL_BONUS','QT_VAGAS_OFERTADAS','NU_NOTACORTE','QT_INSCRICAO','DS_MOD_CONCORRENCIA']]
   mode=mode or d.get('TP_MOD_CONCORRENCIA');vac=vac if vac is not None else d.get('QT_VAGAS_CONCORRENCIA')
  if not course:continue
  mode='AC' if 'ampla' in str(mode).lower() else str(mode).strip();desc=str(desc or mode)
  e=byyear.setdefault(year,dict(rows=[],descriptions=[],modalities={},files=[]));e['modalities'][mode]=str(mode)
  if desc not in e['descriptions']:e['descriptions'].append(desc)
  sem=ed.split('/')[-1] if '/' in ed else ('2' if re.search(r'202[0-3][_-]2',p.name) else '1')
  e['rows'].append([len(e['rows']),courseCode,course,ins,acronym,campus,city,uf,degree,shift,mode,bonus,vac,cut,app,e['descriptions'].index(desc),sem])
  if str(p) not in e['files']:e['files'].append(str(p))
 print(p.name)
for year,e in byyear.items():
 sources=[dict(download=url(Path(p)),sha256=sha(Path(p))) for p in e.pop('files')];e.update(columns=cols,source='https://sisu.mec.gov.br/#/relatorio',download=sources[0]['download'],sourceFiles=sources,sha256=sources[0]['sha256'],provenance='Relatório agregado atribuído ao MEC, obtido da cópia pública maiakanegae/sisu-data. Conferência byte a byte com a origem MEC não realizada. Semestres identificados por linha. '+('2010–2018: a fonte não informa UF, município, vagas ou inscrições; não foram inferidos a partir do nome do campus.' if int(year)<=2018 else ''))
 file='admissions/sisu-'+year+'.json';save(file,{year:e});index.setdefault(year,[]).append(dict(process='sisu',processName='SiSU',year=year,file=file,source=e['source'],download=e['download'],sha256=e['sha256'],provenance=e['provenance'],count=len(e['rows'])))
 print(year,len(e['rows']))
save('admissions-index.json',index)
# ENEM-USP 2024/2025 layout; 2026 existing validated extraction.
usp=json.loads((site/'enem-usp.json').read_text(encoding='utf8'));modes=usp['2026']['modalities']
for year in ['2024','2025']:
 p=src/f'enem-usp-{year}-chamada1.pdf';records=[]
 for page,pg in enumerate(PdfReader(p).pages,1):
  text=pg.extract_text().replace('−','-');lines=text.splitlines();starts=[i for i,l in enumerate(lines) if 'CÓDIGO FUVEST:' in l]
  for block_index,start in enumerate(starts):
   cod=re.search(r'CÓDIGO FUVEST:\s*(\d+/\d+)\s+CODIGO USP:\s*(\d+/\d+)',lines[start]);assert cod
   title=lines[start-2].strip();unit=lines[start-1].strip();values=re.findall(r'^(AC|EP-L1|PPI-L2|EP-L3|PPI-L4)\s*\n([\d.,]+|-)\s*\n(\d+|-)', '\n'.join(lines[start+1:(starts[block_index+1]-2 if block_index+1<len(starts) else len(lines))]),re.M);assert len(values)==5,(year,page,title)
   for mode,points,rank in values:
    records.append(dict(id=f'usp-{year}-{cod[1]}-{mode}',course=title,unit=unit,fuvestCode=cod[1],courseCode=cod[2],degree=None,shift=None,page=page,institution='Universidade de São Paulo',acronym='USP',campus=unit,city=next((c for c in ['Ribeirão Preto','São Carlos','Piracicaba','Pirassununga','Lorena','Bauru'] if c in unit),None),uf='SP',mode=mode,modeDescription=modes[mode],cut=None if points=='-' else float(points.replace('.','').replace(',','.')),admissionRank=None if rank=='-' else int(rank.replace('.','')),vacancies=None,applicants=None,bonus=None,process='enem-usp',processName='ENEM-USP',year=year,stage='1ª chamada · matrícula',source=url(p),sourcePage=page))
  # Every printed course block should have been parsed once.
 assert len({r['id'] for r in records})==len(records),(year,'duplicate')
 usp[year]=dict(source=url(p),sha256=sha(p),modalities=modes,records=records,provenance=f'PDF oficial FUVEST · ENEM-USP {year} · pontos finais mínimos e classificação na 1ª chamada para matrícula. Curso/turno preservado como publicado. Não equivale a nota parcial SiSU.')
for year,e in usp.items():
 file='admissions/usp-'+year+'.json';save(file,{year:e});index.setdefault(year,[]).append(dict(process='enem-usp',processName='ENEM-USP',year=year,file=file,source=e['source'],sha256=e['sha256'],provenance=e['provenance'],count=len(e['records'])))
save('admissions-index.json',index)
