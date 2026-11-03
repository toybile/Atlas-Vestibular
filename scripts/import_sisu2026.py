"""Import the official 2026 regular-call report without inferring missing values."""
from pathlib import Path
import sys,json,hashlib,math
SITE=(Path(__file__).resolve().parents[1]/'data')
sys.path.insert(0,str(SITE.parent.parent/'data-deps'))
import openpyxl
src=SITE.parent.parent/'history-sources'/'sisu-2026.xlsx'
url=Path(str(src)+'.url').read_text(encoding='utf8').strip()
w=openpyxl.load_workbook(src,read_only=True,data_only=True)
it=iter(w['inscricao_2026_1'].values);head=next(it)
cols=['id','courseCode','course','institution','acronym','campus','city','uf','degree','shift','mode','bonus','vacancies','cut','applicants','descriptionId','semester']
rows=[];descriptions=[];modes={}
for raw in it:
 d=dict(zip(head,raw))
 if not d.get('NO_CURSO'):continue
 mode=str(d['TIPO_CONCORRENCIA']).strip();desc=str(d['DS_MOD_CONCORRENCIA'] or mode)
 if desc not in descriptions:descriptions.append(desc)
 modes[mode]=mode
 row=[len(rows),d['CO_IES_CURSO'],d['NO_CURSO'],d['NO_IES'],d['SG_IES'],d['NO_CAMPUS'],d['NO_MUNICIPIO_CAMPUS'],d['SG_UF_CAMPUS'],d['DS_GRAU'],d['DS_TURNO'],mode,d['NU_PERCENTUAL_BONUS'],d['QT_VAGAS_CONCORRENCIA'],d['NU_NOTACORTE'],d['QT_INSCRICAO'],descriptions.index(desc),'1']
 assert row[13] is None or isinstance(row[13],(int,float)) and math.isfinite(row[13])
 rows.append(row)
sha=hashlib.sha256(src.read_bytes()).hexdigest()
provenance='Relatório oficial MEC, baixado diretamente do portal SiSU. Resultado da chamada regular de 2026: inscrições, vagas e notas de corte por oferta e modalidade. O campo EDICAO é um identificador interno (302); o ano 2026 consta do título e do dicionário do arquivo. Valores ausentes e zeros originais preservados.'
e=dict(columns=cols,rows=rows,descriptions=descriptions,modalities=modes,source='https://sisu.mec.gov.br/#/relatorio',download=url,sha256=sha,sourceFiles=[dict(download=url,sha256=sha)],provenance=provenance)
def save(file,data):(SITE/file).write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf8')
save('admissions/sisu-2026.json',{'2026':e})
index=json.loads((SITE/'admissions-index.json').read_text(encoding='utf8'))
index['2026']=[s for s in index['2026'] if s['process']!='sisu']+[dict(process='sisu',processName='SiSU',year='2026',file='admissions/sisu-2026.json',source=e['source'],download=url,sha256=sha,provenance=provenance,count=len(rows))]
save('admissions-index.json',index)
coverage=json.loads((SITE/'coverage.json').read_text(encoding='utf8'));coverage['admissions']=index;coverage['gaps']['sisu']='2026: relatório oficial da chamada regular incorporado. UF, município, vagas e inscrições não informados nos relatórios de notas 2010–2018 desta base.';save('coverage.json',coverage)
print(json.dumps(dict(records=len(rows),ac=sum(r[10]=='AC' for r in rows),sha256=sha)))
