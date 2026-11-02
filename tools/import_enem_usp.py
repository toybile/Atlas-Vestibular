from pathlib import Path
from pypdf import PdfReader
import re,json,hashlib,argparse
parser=argparse.ArgumentParser();parser.add_argument('--pdf',type=Path,default=Path(__file__).resolve().parents[2]/'history-sources/enem-usp-2026-chamada1.pdf');args=parser.parse_args()
site=Path(__file__).resolve().parents[1]
url='https://www.fuvest.br/wp-content/uploads/enem_usp_2026_notas_minimas_classificacao_aprovado_chamada_1.pdf'
modes={'AC':'Ampla concorrência · ENEM-USP','EP-L1':'Ensino médio em escola pública · renda per capita até 1,5 salário mínimo','PPI-L2':'Escola pública · pretos, pardos ou indígenas · renda per capita até 1,5 salário mínimo','EP-L3':'Ensino médio em escola pública · independentemente da renda','PPI-L4':'Escola pública · pretos, pardos ou indígenas · independentemente da renda'}
records=[];offers=[]
for page_number,page in enumerate(PdfReader(args.pdf).pages,1):
 text=page.extract_text().replace('\r',' ')
 starts=list(re.finditer(r'^(.+?\([^\n]+\) - [^\n]+)\n',text,re.M))
 assert len(starts)==text.count('código fuvest:'),(page_number,len(starts),text.count('código fuvest:'))
 for i,m in enumerate(starts):
  block=text[m.end():starts[i+1].start() if i+1<len(starts) else len(text)]
  metadata=re.search(r'(.+?)\s+código fuvest:\s*(\d+/\d+)\s+código USP:\s*(\d+/\d+)\s+modalidade\s+pontos finais\s+classificação\s+',block,re.S)
  assert metadata,(page_number,block)
  unit,fuvest_code,usp_code=metadata.groups();unit=' '.join(unit.split())
  title=m[1];course,degree,shift=re.fullmatch(r'(.+?)\((.+)\) - (.+)',title).groups();course=course.strip().removesuffix('-').strip()
  city=next((c for c in ['Ribeirão Preto','São Carlos','Piracicaba','Pirassununga','Lorena','Bauru'] if c in unit),None)
  # Unspecified municipality stays absent. UF is SP for USP's undergraduate units.
  values=re.findall(r'^(AC|EP-L1|PPI-L2|EP-L3|PPI-L4)\s*\n([\d.,]+|-)\s*\n(\d+|-)\s*(?=\n|$)',block,re.M)
  assert len(values)==5,(page_number,title,values)
  offer=dict(course=course,unit=unit,fuvestCode=fuvest_code,courseCode=usp_code,degree=degree,shift=shift,page=page_number)
  offers.append(offer)
  for mode,points,classification in values:
   cut=None if points=='-' else float(points.replace('.','').replace(',','.'))
   rank=None if classification=='-' else int(classification)
   assert (cut is None)==(rank is None)
   assert cut is None or 0<=cut<=1000
   records.append(dict(id='usp-2026-'+fuvest_code+'-'+mode,**offer,institution='Universidade de São Paulo',acronym='USP',campus=unit,city=city,uf='SP',mode=mode,modeDescription=modes[mode],cut=cut,admissionRank=rank,vacancies=None,applicants=None,bonus=None,process='enem-usp',processName='ENEM-USP',year='2026',stage='1ª chamada · matrícula',source=url,sourcePage=page_number))
assert len({r['id'] for r in records})==len(records)
data={'2026':dict(source=url,sha256=hashlib.sha256(args.pdf.read_bytes()).hexdigest(),modalities=modes,process='enem-usp',processName='ENEM-USP',stage='1ª chamada · matrícula',records=records,offers=len(offers),provenance='PDF oficial FUVEST. Pontos finais mínimos e classificações de chamados para matrícula na 1ª chamada do ENEM-USP 2026. Não se trata de corte da primeira fase da FUVEST nem de nota parcial do SiSU.')}
(site/'enem-usp.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf8')
coverage=json.loads((site/'coverage.json').read_text(encoding='utf8'));coverage['enem-usp']={'years':['2026'],'offers':len(offers),'records':len(records),'source':url,'stage':'1ª chamada para matrícula','sha256':data['2026']['sha256']};(site/'coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print(json.dumps({'offers':len(offers),'records':len(records),'published_scores':sum(r['cut'] is not None for r in records),'law':[r for r in records if r['course']=='Direito' and r['mode']=='AC']},ensure_ascii=True))
