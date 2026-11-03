"""Audit public source URLs without downloading full datasets or PDF bodies."""
from pathlib import Path
import concurrent.futures,json,re,urllib.request,urllib.error,time
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data';ASSETS=ROOT/'assets'
REPORT=ROOT/'docs'/'reports'
urls={}
def walk(value,origin):
 if isinstance(value,dict):
  for v in value.values():walk(v,origin)
 elif isinstance(value,list):
  for v in value:walk(v,origin)
 elif isinstance(value,str):
  for u in re.findall(r'https?://[^\s<>"\\]+',value):
   u=u.rstrip(".,;)");urls.setdefault(u.split('#')[0],set()).add(origin)
for p in DATA.rglob('*.json'):
 if 'intermediate' in p.parts:continue
 walk(json.loads(p.read_text(encoding='utf8')),str(p.relative_to(ROOT)))
for p in [ROOT/'index.html',ROOT/'README.md',*(ASSETS/'js').glob('*.js'),*(ASSETS/'css').glob('*.css')]:
 for u in re.findall(r'https?://[^\s<>"\\]+',p.read_text(encoding='utf8')):
  u=u.split("'")[0].rstrip('.,;)`');urls.setdefault(u.split('#')[0],set()).add(str(p.relative_to(ROOT)))
def check_once(item, retry=False):
 u,origins=item;out={'url':u,'files':sorted(origins)}
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (compatible; PublicSourceLinkAudit/1.0)',**({} if retry else {'Range':'bytes=0-1023'})})
  with urllib.request.urlopen(req,timeout=22) as r:out.update(status=r.status,finalUrl=r.url,contentType=r.headers.get('Content-Type'));r.read(1024)
 except urllib.error.HTTPError as e:out.update(status=e.code,error=e.reason)
 except Exception as e:out.update(status=None,error=str(e))
 return out
def check(item):
 out=check_once(item)
 if out['status'] is None:out=check_once(item,True)
 return out
if __name__=='__main__':
 REPORT.mkdir(exist_ok=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:results=list(pool.map(check,sorted(urls.items())))
 data={'checkedOn':'2026-11-02','method':'GET limitado ao início da resposta; bloqueios de acesso e falhas de rede não comprovam remoção da fonte.','total':len(results),'results':results}
 (REPORT/'links.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
 from collections import Counter
 print(json.dumps({'total':len(results),'statuses':dict(Counter(str(r['status']) for r in results))},ensure_ascii=False))
 for r in results:
  if r['status'] not in [200,206]:print(str(r['status'])+' '+r['url']+' '+str(r.get('error','')))
