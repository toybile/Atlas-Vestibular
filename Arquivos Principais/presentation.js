(function(root){
 'use strict';
 const present=v=>v!==null&&v!==undefined&&v!==''&&(typeof v!=='number'||Number.isFinite(v));
 const fmt=(v,d=0)=>Number.isFinite(v)?v.toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:d}):'—';
 const ratio=r=>Number.isFinite(r.applicants)&&r.vacancies>0?r.applicants/r.vacancies:null;
 const field=(id,label,read,decimals=0)=>({id,label,read,format:r=>{const v=read(r);return typeof v==='number'?fmt(v,decimals):present(v)?String(v):'—'}});
 function key(s){return s.kind==='stats'?(s.countOnly?'registrations':s.frequency?'frequency':'performance'):s.kind}
 function options(s){
  if(s.kind==='stats')return s.countOnly?[]:s.frequency?[field('count','Contagem',r=>r.count)]:[
   field('median','Mediana',r=>r.median,2),field('min','Mínimo',r=>r.min,2),field('max','Máximo',r=>r.max,2),field('sd','Desvio padrão',r=>r.sd,2)];
  return [
   ...(s.questions?[field('percent','% da escala',r=>r.pct,1)]:[]),
   field('vacancies','Vagas',r=>r.vacancies),field('applicants',s.kind==='sisu'?'Inscrições':'Inscritos',r=>r.applicants),
   field('ratio',s.kind==='sisu'?'Inscrições/vaga':'Inscritos/vaga',ratio,2),
   field('code','Código',r=>s.kind==='sisu'?r.courseCode:r.code),
   ...(s.kind==='sisu'?[field('bonus','Bônus (%)',r=>r.bonus,2),field('admissionRank','Classificação publicada',r=>r.admissionRank)]:[
    field('called','Convocados',r=>r.called),field('absent','Ausentes',r=>r.absent),field('maximum','Maior nota publicada',r=>r.maximum,2),field('sourceBase','Base histórica (pontos)',r=>r.sourceBase)])];
 }
 function resolve(s,rows,preference={preset:'essential'}){
  const fields=options(s).map(f=>({...f,available:rows.some(r=>present(f.read(r)))}));
  const selected=preference.preset==='detailed'?fields.filter(f=>f.available):preference.preset==='custom'?fields.filter(f=>(preference.fields||[]).includes(f.id)):[];
  return {fields,selected,preset:preference.preset||'essential'};
 }
 function model(s,rows,resolved){
  const stats=s.kind==='stats',sisu=s.kind==='sisu';
  const fixed=[field('rank','Pos.',r=>r.rank),field('label',stats?s.statLabel||'Categoria':sisu?'Curso / oferta':'Carreira',r=>r.label+(r.subtitle?' · '+r.subtitle:''))];
  if(sisu)fixed.push(field('process','Processo / edição',r=>r.processName+' '+r.year+(r.semester?' / '+r.semester:'')),field('mode','Modalidade',r=>r.mode));
  const metric=field('cut',stats?s.metricName:s.axis==='pct'?'Corte (% da escala)':'Corte ('+s.unit+')',r=>!stats&&s.axis==='pct'?r.pct:r.cut,stats?(s.countOnly?0:2):s.axis==='pct'?1:2);
  if(s.frequency)metric.label='Proporção (%)';
  fixed.push(metric);if(!stats&&s.ranking==='ratio'&&!resolved.selected.some(f=>f.id==='ratio'))fixed.push(field('ratio',sisu?'Inscrições/vaga':'Inscritos/vaga',ratio,2));
  if(stats&&!s.countOnly)fixed.push(field('population','População (n)',r=>r.n));
  const columns=[...fixed,...resolved.selected.filter(f=>!(f.id==='percent'&&s.axis==='pct'))];
  const chartDetails=r=>[
   ...(stats&&!s.countOnly?['n = '+fmt(r.n)]:[]),
   ...resolved.selected.map(f=>f.label+': '+f.format(r)+(f.id==='percent'?'%':''))
  ];
  return {preset:resolved.preset,fieldIds:resolved.selected.map(f=>f.id),columns:columns.map(f=>({id:f.id,label:f.label})),
   rows:rows.map(r=>({cells:columns.map(f=>f.format(r)),details:chartDetails(r)}))};
 }
 root.AtlasPresentation={key,options,resolve,model};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.AtlasPresentation;
})(typeof window!=='undefined'?window:globalThis);
