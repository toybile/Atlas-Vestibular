(function(root){
 const C={ink:'#181a2c',muted:'#687087',violet:'#6956ef',pale:'#f0edff',line:'#e4e7f0',soft:'#f8f9fd',orange:'#bb5c31'};
 function create({jsPDF,fonts,snapshot:s,kind}){
  const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4',compress:true,putOnlyUsedFonts:true});
  for(const [i,weight] of ['normal','bold'].entries()){doc.addFileToVFS('Lato-'+weight+'.ttf',fonts[i]);doc.addFont('Lato-'+weight+'.ttf','Lato',weight)}
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),M=35,R=W-M,stats=s.kind==='stats',sisu=s.kind==='sisu';
  const fmt=(n,d=1)=>Number.isFinite(n)?n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
  const ratio=r=>Number.isFinite(r.applicants)&&r.vacancies>0?r.applicants/r.vacancies:null;
  const text=(str,x,y,size=10,color=C.ink,bold=false,options={})=>{doc.setFont('Lato',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(color);doc.text(Array.isArray(str)?str:String(str),x,y,options)};
  const wrap=(str,width,size=10)=>{doc.setFont('Lato','normal');doc.setFontSize(size);return doc.splitTextToSize(String(str??''),width)};
  const line=(x1,y1,x2,y2,color=C.line,width=.7)=>{doc.setDrawColor(color);doc.setLineWidth(width);doc.line(x1,y1,x2,y2)};
  const rect=(x,y,w,h,color,r=0)=>{doc.setFillColor(color);if(r)doc.roundedRect(x,y,w,h,r,r,'F');else doc.rect(x,y,w,h,'F')};
  const metric=stats?s.metricName:s.ranking==='ratio'?(sisu?'Inscrições por vaga':'Inscritos por vaga'):'Maiores cortes';
  const subtitle=`${s.exam} ${s.editionLabel||s.year} / ${s.mode} · ${stats?s.modeName:metric}`;
  function header(){rect(M,25,23,3,C.violet);text(s.exam+' · '+(stats?'ESTATÍSTICAS E PERFIL':'CORTES E CONCORRÊNCIA'),M+32,31,8,C.violet,true);text(wrap(stats?(s.statTitle||s.metricName+' por área'):sisu&&s.process!=='sisu'?(kind==='chart'?'Notas publicadas por processo':'Tabela de notas publicadas'):kind==='chart'?'Notas de corte em perspectiva':'Tabela de notas de corte',W-2*M,19).slice(0,2),M,56,19,C.ink,true);text(subtitle,M,99,10,C.muted);text(`${s.rows.length} ${stats?'registros':sisu?'ofertas':'carreiras'}${stats?'':' · Top '+s.count+(s.ties?' com empates':'')}`,M,114,9,C.muted);const filters=wrap([s.filters,s.search?'Busca: '+s.search:'',s.referenceLabel].filter(Boolean).join(' · '),W-2*M,8);text(filters.slice(0,2),M,128,8,C.muted);line(M,145,R,145)}
  header();let y=155;const plotX=365,plotEnd=R-90,plotW=plotEnd-plotX;
  const tableHeads=stats?(s.countOnly?['Pos.',s.statLabel||'Território','Inscritos']:s.frequency?['Pos.',s.statLabel||'Categoria','Proporção','Contagem','População (n)']:['Pos.',s.statLabel||'Área',s.metricName,'n','Mediana','Mín.','Máx.','DP']):sisu?['Pos.','Curso / oferta','Processo / ano','Modalidade','Pontos','Inscrições/vaga','Vagas','Inscrições']:['Pos.',sisu?'Curso / oferta':'Carreira','Pontos',s.questions?'% escala':'Unidade',sisu?'Inscrições/vaga':'Inscritos/vaga','Vagas',sisu?'Inscrições':'Inscritos'];
  const widths=stats&&s.countOnly?[30,430,W-2*M-460]:stats&&s.frequency?[30,330,130,130,W-2*M-620]:sisu?[30,230,95,70,70,100,75,W-2*M-670]:stats?[30,230,80,105,85,75,75,W-2*M-680]:[30,290,65,65,105,80,W-2*M-635];let xs=[M];widths.forEach(w=>xs.push(xs.at(-1)+w));
  function axis(){text(stats?(s.statLabel||'Área').toUpperCase():sisu?'CURSO / OFERTA':'POS. / CARREIRA',M,y,8,C.muted,true);for(let i=0;i<=4;i++)text(s.axis==='pct'?i*25+'%':fmt(i*s.scale/4,s.scale>10000?0:1),plotX+plotW*i/4,y,8,C.muted,false,{align:i===0?'left':i===4?'right':'center'});text(stats?'VALOR':'CORTE',R,y,8,C.muted,true,{align:'right'});y+=20}
  // Center a whole text block, not just its first baseline.
  function centeredBlock(lines,x,centerY,size,color,bold=false,align='left'){
   const block=Array.isArray(lines)?lines:[String(lines)],leading=size*1.3;
   text(block,x,centerY-(block.length-1)*leading/2,size,color,bold,{baseline:'middle',align,lineHeightFactor:1.3});
  }
  function tableHeader(){
   const top=y-9,height=30;rect(M,top,W-2*M,height,C.pale,4);
   tableHeads.forEach((v,i)=>centeredBlock(wrap(v,widths[i]-12,8).slice(0,2),i===1?xs[i]+7:xs[i]+widths[i]/2,top+height/2,8,C.violet,true,i===1?'left':'center'));
   y+=33;
  }
  if(kind==='chart')axis();else tableHeader();
  s.rows.forEach((r,index)=>{
   const label=wrap(r.label+(sisu&&kind==='chart'?' · '+(r.processName||'SiSU')+' '+(r.year||s.year)+' / '+(r.mode||s.mode):'')+(sisu&&r.subtitle?' · '+r.subtitle:''),kind==='chart'?plotX-M-54:widths[1]-14,10),detail=stats?(s.frequency?fmt(r.count,0)+' de '+fmt(r.n,0):'n = '+fmt(r.n,0)):s.ranking==='ratio'?fmt(ratio(r),2)+(sisu?' inscrições/vaga':' inscritos/vaga'):'';
   const height=Math.max(36,label.length*13+(kind==='chart'&&detail?24:14));
   if(y+height>H-105){doc.addPage();header();y=155;if(kind==='chart')axis();else tableHeader()}
   if(index%2===0)rect(M-2,y-6,W-2*M+4,height,C.soft,4);
   if(kind==='chart'){
    const cy=y+height/2-6;
    centeredBlock(r.rank,M+10,cy,9,C.muted,false,'center');
    const labelCenter=cy-(detail?7.5:0);
    centeredBlock(label,M+28,labelCenter,10,C.ink);
    if(detail)centeredBlock(detail,M+28,labelCenter+(label.length-1)*6.5+15,8,C.muted);
    for(let i=0;i<=4;i++)line(plotX+plotW*i/4,y-6,plotX+plotW*i/4,y+height-6,C.line,.5);
    rect(plotX,cy-4.5,plotW,9,C.pale,3);if(r.pct>0)rect(plotX,cy-4.5,plotW*Math.min(100,r.pct)/100,9,C.violet,3);
    if(s.reference!==null){doc.setLineDashPattern([3,3],0);line(plotX+plotW*s.reference/100,y-6,plotX+plotW*s.reference/100,y+height-6,C.orange,1.1);doc.setLineDashPattern([],0)}
    centeredBlock(s.axis==='pct'?fmt(r.pct)+'%':fmt(r.cut,stats&&s.metric==='n'?0:Number.isInteger(r.cut)?0:2),R,cy-6.5,11,C.ink,true,'right');
    centeredBlock(s.axis==='pct'?fmt(r.cut,0)+'/'+s.questions:s.unit,R,cy+8.5,8,C.muted,false,'right');
   }else{
    const values=stats?(s.countOnly?[r.rank,'',fmt(r.cut,0)]:s.frequency?[r.rank,'',fmt(r.cut,2)+'%',fmt(r.count,0),fmt(r.n,0)]:[r.rank,'',fmt(r.cut,s.metric==='n'?0:2),fmt(r.n,0),fmt(r.median,2),fmt(r.min,2),fmt(r.max,2),fmt(r.sd,2)]):sisu?[r.rank,'',(r.processName||'SiSU')+' '+(r.year||s.year)+(r.semester?' / '+r.semester:''),r.mode||s.mode,fmt(r.cut,2),fmt(ratio(r),2),fmt(r.vacancies,0),fmt(r.applicants,0)]:[r.rank,'',fmt(r.cut,Number.isInteger(r.cut)?0:2),s.questions?fmt(r.pct)+'%':'pontos',fmt(ratio(r),2),fmt(r.vacancies,0),fmt(r.applicants,0)];
    const cy=y+height/2-6;
    values.forEach((v,i)=>{if(i===1)return;centeredBlock(wrap(v,widths[i]-12,9),xs[i]+widths[i]/2,cy,9,i===0?C.muted:C.ink,false,'center')});
    centeredBlock(label,xs[1]+7,cy,10,C.ink);
   }
   y+=height;
  });
  const pages=doc.getNumberOfPages();
  for(let page=1;page<=pages;page++){doc.setPage(page);line(M,H-88,R,H-88);const note=stats?(s.note||'População e critérios da tabela de origem; estatísticas descritivas.'):sisu?'Cada oferta identifica processo e ano. ENEM-USP: 1ª chamada para matrícula. SiSU: corte do relatório. Pesos e etapas diferem.':s.questions?'Cortes para a segunda fase. Percentual = pontos / '+s.questions+' × 100; sem equivalência de dificuldade entre edições.':'Escala histórica: pontos publicados. Sem conversão em acertos ou percentual. Cortes para a segunda fase.';text(wrap(note,W-2*M,8).slice(0,2),M,H-71,8,C.muted);text(sisu?(s.process==='enem-usp'?'ENEM-USP: PDF oficial FUVEST. Valores ausentes permanecem ausentes.':s.process==='sisu'?'SiSU: relatório agregado obtido de cópia pública atribuída ao MEC. Consulte a fonte.':'SiSU: cópia pública atribuída ao MEC. ENEM-USP: PDF oficial FUVEST. Modalidades preservadas.'):stats?'A população (n) é própria da pergunta ou área. Proporção = contagem / n × 100. Consulte a fonte.':'Dados ausentes permanecem ausentes. Tabela histórica Geral não equivale automaticamente à AC atual.',M,H-44,7.5,C.muted);doc.setFontSize(7.5);doc.setTextColor(C.violet);const sources=s.sources?.length?s.sources:[{source:s.source,processName:s.exam,year:s.year}];sources.slice(0,2).forEach((source,i)=>doc.textWithLink((source.processName||'Fonte')+' '+source.year+': '+source.source,M,H-(sources.length>1?28-i*12:27),{url:source.source}));text(page+' / '+pages,R,H-27,8,C.muted,false,{align:'right'});}
  doc.setProperties({title:s.exam+' '+s.year+' · '+s.mode+' · '+(kind==='chart'?'Gráfico':'Tabela'),author:'Cortes e Concorrência',subject:subtitle});return doc;
 }
 root.AtlasPDF={create};if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
