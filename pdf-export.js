(function(root){
  const COLORS={ink:'#181a2c',muted:'#687087',violet:'#6956ef',pale:'#f0edff',line:'#e4e7f0',soft:'#f8f9fd',orange:'#bb5c31'};
  function create({jsPDF,fonts,snapshot:s,kind}){
    const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4',compress:true,putOnlyUsedFonts:true});
    doc.addFileToVFS('Lato-Regular.ttf',fonts[0]);doc.addFont('Lato-Regular.ttf','Lato','normal');doc.addFileToVFS('Lato-Bold.ttf',fonts[1]);doc.addFont('Lato-Bold.ttf','Lato','bold');
    const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),M=35,R=W-M;
    const fmt=(v,d=1)=>v.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
    const text=(str,x,y,size=10,color=COLORS.ink,bold=false,options={})=>{doc.setFont('Lato',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(color);doc.text(Array.isArray(str)?str:String(str),x,y,options)};
    const wrap=(str,width,size=10)=>{doc.setFont('Lato','normal');doc.setFontSize(size);return doc.splitTextToSize(String(str),width)};
    const line=(x1,y1,x2,y2,color=COLORS.line,width=.7)=>{doc.setDrawColor(color);doc.setLineWidth(width);doc.line(x1,y1,x2,y2)};
    const rect=(x,y,w,h,color,r=0)=>{doc.setFillColor(color);if(r)doc.roundedRect(x,y,w,h,r,r,'F');else doc.rect(x,y,w,h,'F')};
    const metric=s.ranking==='ratio'?'Mais inscritos por vaga':'Maiores notas de corte';
    const subtitle=`FUVEST ${s.year}  /  ${s.mode} · ${s.modeName}  /  ${metric}`;
    function header(){rect(M,25,23,3,COLORS.violet);text('FUVEST · CORTES E CONCORRÊNCIA',M+32,31,8,COLORS.violet,true);text(kind==='chart'?'Notas de corte em perspectiva':'Tabela de notas de corte',M,63,23,COLORS.ink,true);text(subtitle,M,85,10,COLORS.muted);text(`${s.rows.length} carreiras · Top ${s.count}${s.ties?' com empates':''}${s.search?' · busca: '+s.search:''}`,M,103,9,COLORS.muted);text(s.referenceLabel,M,120,9,s.reference===null?COLORS.muted:COLORS.orange,true);line(M,132,R,132)}
    header();let y=147,firstRow=true;
    const plotX=365,plotEnd=R-90,plotW=plotEnd-plotX;
    function chartAxis(){text('POS. / CARREIRA',M,y+5,8,COLORS.muted,true);for(let i=0;i<=4;i++){text(s.axis==='hits'?fmt(i*90/4,i%2?1:0):i*25+'%',plotX+plotW*i/4,y+5,8,COLORS.muted,false,{align:i===0?'left':i===4?'right':'center'})}text('CORTE',R,y+5,8,COLORS.muted,true,{align:'right'});y+=20}
    const widths=[30,290,65,65,105,80,W-2*M-635];let xs=[M];for(let i=0;i<widths.length;i++)xs.push(xs[i]+widths[i]);
    function tableHeader(){rect(M,y-8,W-2*M,26,COLORS.pale,4);['Pos.','Carreira','Corte /90','Acerto','Inscritos/vaga','Vagas','Inscritos'].forEach((v,i)=>text(v,xs[i]+7,y+8,8,COLORS.violet,true));y+=28}
    if(kind==='chart')chartAxis();else tableHeader();
    s.rows.forEach((r,index)=>{
      const label=wrap(r.label,kind==='chart'?plotX-M-54:widths[1]-15,10.5),height=Math.max(kind==='table'?28:30,label.length*13+(kind==='chart'&&s.ranking==='ratio'?18:10));
      if(y+height>H-93){doc.addPage();header();y=147;if(kind==='chart')chartAxis();else tableHeader();firstRow=true}
      if(index%2===0)rect(M-2,y-6,W-2*M+4,height,COLORS.soft,4);
      if(kind==='chart'){
        const cy=y+height/2-6; text(r.rank,M+2,cy+3,9,COLORS.muted);text(label,M+28,y+9,10.5);if(s.ranking==='ratio')text(fmt(r.applicants/r.vacancies,2)+' inscritos/vaga',M+28,y+label.length*13+9,8,COLORS.muted);
        for(let i=0;i<=4;i++)line(plotX+plotW*i/4,y-6,plotX+plotW*i/4,y+height-6,COLORS.line,.5);
        rect(plotX,cy-3,plotW,9,COLORS.pale,3);rect(plotX,cy-3,plotW*r.pct/100,9,COLORS.violet,3);
        if(s.reference!==null){doc.setLineDashPattern([3,3],0);line(plotX+plotW*s.reference/100,y-6,plotX+plotW*s.reference/100,y+height-6,COLORS.orange,1.1);doc.setLineDashPattern([],0)}
        text(s.axis==='hits'?r.cut:fmt(r.pct)+'%',R,cy+1,12,COLORS.ink,true,{align:'right'});text(s.axis==='hits'?fmt(r.pct)+'%':r.cut+'/90',R,cy+15,8,COLORS.muted,false,{align:'right'});
      }else{
        const values=[String(r.rank),'',r.cut+'/90',fmt(r.pct)+'%',fmt(r.applicants/r.vacancies,2),String(r.vacancies),fmt(r.applicants,0)];values.forEach((v,i)=>text(v,xs[i]+7,y+11,10,i===0?COLORS.muted:COLORS.ink));text(label,xs[1]+7,y+9,10.5);
      }
      y+=height;firstRow=false;
    });
    const pages=doc.getNumberOfPages();
    for(let page=1;page<=pages;page++){doc.setPage(page);line(M,H-77,R,H-77);text('Cortes para a segunda fase; não representam aprovação final. Edições de 2023 a 2026: 90 questões.',M,H-60,8,COLORS.muted);text(s.ranking==='ratio'?'Inscritos/vaga = inscritos da modalidade ÷ vagas da mesma modalidade. Não estima probabilidade de aprovação.':'Percentuais calculados sobre 90 questões. Comparação de escala sem equivalência de dificuldade entre edições.',M,H-47,8,COLORS.muted);doc.setFont('Lato','normal');doc.setFontSize(7.5);doc.setTextColor(COLORS.violet);doc.textWithLink('Fonte: '+s.source,M,H-30,{url:s.source});text(`${page} / ${pages}`,R,H-30,8,COLORS.muted,false,{align:'right'});}
    doc.setProperties({title:`FUVEST ${s.year} · ${s.mode} · ${kind==='chart'?'Gráfico':'Tabela'} de cortes`,author:'FUVEST: Cortes e Concorrência',subject:subtitle,keywords:'FUVEST, notas de corte, primeira fase, '+s.mode});return doc;
  }
  root.AtlasPDF={create};if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
