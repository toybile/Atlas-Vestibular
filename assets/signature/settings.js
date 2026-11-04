/* Approved complete Portfolio settings. Gesture and picker preserved. */
(()=>{'use strict';if(document.querySelector('#themes-dialog'))return;document.body.insertAdjacentHTML('beforeend',"<dialog class=\"themes-dialog toybile-settings\" id=\"themes-dialog\" aria-labelledby=\"themes-title\">\n    <div class=\"dialog-panel\">\n      <button class=\"dialog-close\" type=\"button\" data-close-appearance aria-label=\"Fechar configurações\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button>\n      <p class=\"dialog-eyebrow\">DO SEU JEITO</p>\n      <button class=\"settings-language\" type=\"button\" id=\"settings-language\" aria-label=\"Mudar para inglês\"></button>\n      <h2 class=\"dialog-title\" id=\"themes-title\">Configurações</h2>\n      <p class=\"dialog-subtitle\">Idioma e aparência, do seu jeito.</p>\n\n      <fieldset class=\"appearance-section\">\n        <legend>Modo de exibição</legend>\n        <div class=\"mode-options\">\n          <button class=\"mode-option\" type=\"button\" data-appearance-mode=\"system\" aria-pressed=\"true\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M8 21h8m-4-4v4\"/></svg>Automático</button>\n          <button class=\"mode-option\" type=\"button\" data-appearance-mode=\"light\" aria-pressed=\"false\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5\"/></svg>Claro</button>\n          <button class=\"mode-option\" type=\"button\" data-appearance-mode=\"dark\" aria-pressed=\"false\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3a9 9 0 1 0 9 9c0-.8-.1-1.6-.3-2.3A7 7 0 0 1 12 3Z\"/></svg>Escuro</button>\n        </div>\n        <p class=\"mode-hint\" id=\"mode-hint\">Acompanha automaticamente o tema do navegador.</p>\n      </fieldset>\n\n      <fieldset class=\"appearance-section\">\n        <legend>Temas</legend>\n        <div class=\"theme-grid\" id=\"theme-grid\"></div>\n      </fieldset>\n      <fieldset class=\"appearance-section\" id=\"cursor-settings\">\n        <legend>Cursor</legend>\n        <div class=\"mode-options\">\n          <button class=\"mode-option\" type=\"button\" id=\"cursor-custom\" aria-pressed=\"true\">Mão personalizada</button>\n          <button class=\"mode-option\" type=\"button\" id=\"cursor-system\" aria-pressed=\"false\">Padrão do sistema</button>\n        </div>\n        <label class=\"cursor-size-row\" for=\"cursor-size\"><span>Tamanho do cursor</span><output id=\"cursor-size-value\" for=\"cursor-size\">100%</output></label>\n        <input id=\"cursor-size\" type=\"range\" min=\"60\" max=\"160\" step=\"any\" value=\"100\">\n      </fieldset>\n      <div class=\"appearance-actions\">\n        <button class=\"text-button\" type=\"button\" id=\"appearance-reset\">Restaurar padrão</button>\n        <button class=\"primary-button\" type=\"button\" data-close-appearance>Pronto</button>\n      </div>\n      <p class=\"gesture-note\">Para abrir de novo: toque no fundo e segure o segundo toque por 0,5 s.<br>Atalho de teclado: <kbd>Alt + T</kbd>.</p>\n    </div>\n  </dialog><button class=\"settings-launcher\" id=\"appearance-open\" type=\"button\" aria-label=\"Configurações\" title=\"Configurações\" aria-haspopup=\"dialog\" aria-controls=\"themes-dialog\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path pathLength=\"1\" d=\"m9.5 3-.7 2.2-2 .9-2.1-.5-2 3.4 1.5 1.7v2.6L2.7 15l2 3.4 2.1-.5 2 .9.7 2.2h4.9l.7-2.2 2-.9 2.1.5 2-3.4-1.5-1.7v-2.6L21.2 9l-2-3.4-2.1.5-2-.9L14.4 3Z\"/><circle pathLength=\"1\" cx=\"12\" cy=\"12\" r=\"3\"/></svg></button>");

const config=window.ToybileSignatureConfig||{},hostProperties=new Map();
function syncHost(state){
 const root=document.documentElement,scheme=state.scheme(),p=state.families.find(f=>f.id===state.family)[scheme],panel=document.querySelector('.toybile-settings');
 if(panel){panel.dataset.appearanceTheme=p.id;panel.dataset.theme=scheme;panel.dataset.themeFamily=state.family;}
 config.setScheme?.(scheme,state.mode);
 const props={bg:p.canvas,canvas:p.canvas,panel:p.paper,surface:p.paper,card:p.paper,ink:p.ink,text:p.ink,tx:p.ink,muted:p.quiet,mu:p.quiet,line:p.edge,ln:p.edge,border:p.edge,soft:p.soft,pale:p.soft,accent:p.accent,a:p.accent,green:p.accent};
 for(const target of [root,document.body])for(const [name,value]of Object.entries(props)){const key=target===root?'root:'+name:'body:'+name;if(!hostProperties.has(key))hostProperties.set(key,{value:target.style.getPropertyValue('--'+name),priority:target.style.getPropertyPriority('--'+name)});if(state.family==='original'&&!config.forcePalette){const old=hostProperties.get(key);if(old.value)target.style.setProperty('--'+name,old.value,old.priority);else target.style.removeProperty('--'+name);}else target.style.setProperty('--'+name,value);}
 if(state.family==='original'&&!config.setScheme)for(const [name,value]of Object.entries(props))root.style.setProperty('--'+name,value);
 root.style.setProperty('--toybile-paper',p.paper);root.style.setProperty('--toybile-accent',p.accent);root.style.setProperty('--toybile-edge',p.edge);
}


(function(){"use strict";
const families=[{"id":"original","name":"Original","light":{"id":"light","name":"Original","scheme":"light","canvas":"#f3f5f8","paper":"#ffffff","ink":"#26292e","quiet":"#626b76","edge":"#e9ebef","soft":"#f0f2f5","accent":"#3d526e","family":"original"},"dark":{"id":"dark","name":"Original","scheme":"dark","canvas":"#16181c","paper":"#202124","ink":"#e9ebef","quiet":"#9da3ad","edge":"#34363b","soft":"#303238","accent":"#b6c9e1","family":"original"}},{"id":"indigo","name":"Índigo","light":{"id":"indigo-light","name":"Índigo","scheme":"light","canvas":"#f4f4fd","paper":"#fff","ink":"#23263e","quiet":"#626b86","edge":"#dcdff1","soft":"#eef0fc","accent":"#4c57c9","family":"indigo"},"dark":{"id":"indigo-dark","name":"Índigo","scheme":"dark","canvas":"#0f1023","paper":"#15172e","ink":"#f3f3fc","quiet":"#b4bad3","edge":"#30344f","soft":"#212540","accent":"#a4b0ff","family":"indigo"}},{"id":"petroleum","name":"Petróleo e turquesa","light":{"id":"petroleum-light","scheme":"light","canvas":"#e8f2f1","paper":"#f8fdfc","ink":"#173c42","quiet":"#4c6c71","edge":"#c4dad8","soft":"#dcecea","accent":"#177a73","name":"Petróleo e turquesa","family":"petroleum"},"dark":{"id":"petroleum","name":"Petróleo e turquesa","scheme":"dark","canvas":"#0b2027","paper":"#132d35","ink":"#edf8f7","quiet":"#a0b9bc","edge":"#294b53","soft":"#1c3d45","accent":"#68d8cc","family":"petroleum"}},{"id":"graphite","name":"Grafite e âmbar","light":{"id":"graphite-light","scheme":"light","canvas":"#f2efe9","paper":"#fcfaf5","ink":"#3a3329","quiet":"#70634e","edge":"#ddd3c2","soft":"#eee5d4","accent":"#856122","name":"Grafite e âmbar","family":"graphite"},"dark":{"id":"graphite","name":"Grafite e âmbar","scheme":"dark","canvas":"#18191d","paper":"#24252b","ink":"#f5f0e7","quiet":"#beb7aa","edge":"#424044","soft":"#33302b","accent":"#e8b866","family":"graphite"}},{"id":"sand","name":"Areia e azul","light":{"id":"sand","name":"Areia e azul","scheme":"light","canvas":"#f2eadf","paper":"#fffaf2","ink":"#293b50","quiet":"#6b6861","edge":"#ded4c5","soft":"#e8edf2","accent":"#416b99","family":"sand"},"dark":{"id":"sand-dark","scheme":"dark","canvas":"#191c23","paper":"#232a34","ink":"#f1e7da","quiet":"#b4b5b9","edge":"#3d4654","soft":"#303a48","accent":"#9dbde1","name":"Areia e azul","family":"sand"}},{"id":"sage","name":"Sálvia e oliva","light":{"id":"sage","name":"Sálvia e oliva","scheme":"light","canvas":"#edf2e8","paper":"#fbfdf7","ink":"#29382c","quiet":"#5e6b5d","edge":"#d4decf","soft":"#e5ecdf","accent":"#55734a","family":"sage"},"dark":{"id":"sage-dark","scheme":"dark","canvas":"#151d17","paper":"#202c22","ink":"#edf3e8","quiet":"#b0c0a9","edge":"#384d38","soft":"#2c3c2a","accent":"#accb92","name":"Sálvia e oliva","family":"sage"}},{"id":"rose","name":"Rosé e vinho","light":{"id":"rose-light","scheme":"light","canvas":"#f7eef1","paper":"#fff9fb","ink":"#432b35","quiet":"#795d6a","edge":"#ead4de","soft":"#f2e2e9","accent":"#a34064","name":"Rosé e vinho","family":"rose"},"dark":{"id":"rose-dark","scheme":"dark","canvas":"#25151d","paper":"#34212b","ink":"#f9edf3","quiet":"#d0abbc","edge":"#59394a","soft":"#482c3b","accent":"#ef9dbd","name":"Rosé e vinho","family":"rose"}},{"id":"plum","name":"Ameixa e lavanda","light":{"id":"plum-light","scheme":"light","canvas":"#f2eef8","paper":"#fcfaff","ink":"#362c48","quiet":"#6f5e7d","edge":"#dfd4ed","soft":"#eae2f4","accent":"#79509d","name":"Ameixa e lavanda","family":"plum"},"dark":{"id":"plum-dark","scheme":"dark","canvas":"#1b1527","paper":"#2a2039","ink":"#f4ecfc","quiet":"#bdacd1","edge":"#48355e","soft":"#392b4c","accent":"#c1a0e7","name":"Ameixa e lavanda","family":"plum"}}];
const themes=families.flatMap(f=>[f.light,f.dark]);
const root=document.documentElement,key='toybile-settings-appearance-v2:'+location.pathname,system=matchMedia('(prefers-color-scheme: dark)');
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){}
const oldTheme=themes.find(t=>t.id===(saved.selection==='system'?(system.matches?saved.lastDark:saved.lastLight):saved.selection));
const family=families.some(f=>f.id===saved.family)?saved.family:(oldTheme?.family||'original');
const mode=['system','light','dark'].includes(saved.mode)?saved.mode:(saved.selection==='system'?'system':oldTheme?.scheme||'system');
const state={families,themes,key,system,family,mode,
 scheme(){return this.mode==='system'?(system.matches?'dark':'light'):this.mode;},
 resolve(){return families.find(f=>f.id===this.family)[this.scheme()].id;},
 persist(){try{localStorage.setItem(key,JSON.stringify({family:this.family,mode:this.mode}));}catch(_){}},
 apply(){const item=themes.find(t=>t.id===this.resolve());root.dataset.appearanceTheme=item.id;root.dataset.themeFamily=this.family;root.dataset.theme=item.scheme;root.style.colorScheme=item.scheme;syncHost(this);}
};
state.apply();window.ToybileAppearance=state;
})();



(function(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),dialog=document.getElementById('themes-dialog');
 let previous,overflow,animation,closing=false;
 window.ToybileGuideUI={
  openModal(d){
   if(document.querySelector('dialog[open]'))return;
   previous=document.activeElement;overflow=document.documentElement.style.overflow;closing=false;
   d.showModal();document.documentElement.style.overflow='hidden';d.querySelector('.dialog-title').tabIndex=-1;d.querySelector('.dialog-title').focus({preventScroll:true});
   if(!reduced.matches)animation=d.animate([{opacity:0,transform:'translateY(10px) scale(.98)'},{opacity:1,transform:'none'}],{duration:230,easing:'cubic-bezier(.2,.8,.2,1)'});
  },
  closeModal(d){
   if(!d.open||closing)return;closing=true;animation?.cancel();
   if(reduced.matches){d.close();return;}
   animation=d.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(6px) scale(.985)'}],{duration:150,easing:'ease-in',fill:'forwards'});
   animation.onfinish=()=>{d.close();animation.cancel();};
  }
 };
 dialog.addEventListener('cancel',e=>{e.preventDefault();window.ToybileGuideUI.closeModal(dialog);});
 dialog.addEventListener('close',()=>{closing=false;document.documentElement.style.overflow=overflow;previous?.focus({preventScroll:true});});
})();




(function(){
"use strict";
const state=window.ToybileAppearance,root=document.documentElement,systemTheme=state.system;
const dialog=document.getElementById('themes-dialog'),grid=document.getElementById('theme-grid'),modeHint=document.getElementById('mode-hint');
const feedback=document.createElement('div');feedback.className='theme-hold-feedback';feedback.setAttribute('aria-hidden','true');
feedback.innerHTML='<span class="theme-hold-ring"><span class="hold-icon"></span></span><span class="theme-hold-label"></span>';
document.body.append(feedback);
const label=feedback.querySelector('.theme-hold-label'),icon=feedback.querySelector('.hold-icon');
const live=document.createElement('div');live.className='sr-only';live.setAttribute('role','status');document.body.append(live);
const icons={
sun:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>',
moon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>',
mode:'<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.8-.1-1.6-.3-2.3A7 7 0 0 1 12 3Z"/></svg>',
themes:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 3-.7 2.2-2 .9-2.1-.5-2 3.4 1.5 1.7v2.6L2.7 15l2 3.4 2.1-.5 2 .9.7 2.2h4.9l.7-2.2 2-.9 2.1.5 2-3.4-1.5-1.7v-2.6L21.2 9l-2-3.4-2.1.5-2-.9L14.4 3Z"/><circle cx="12" cy="12" r="3"/></svg>',
check:'<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>'
};
function applyAppearance(announce){
 state.apply();
 document.querySelectorAll('[data-appearance-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.appearanceMode===(state.mode))));
 grid.querySelectorAll('[data-appearance-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.appearanceChoice===state.family)));
 modeHint.textContent=state.mode==='system'?'Acompanha o navegador, mantendo a paleta escolhida.':'Modo e paleta ficam salvos neste navegador.';
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=getComputedStyle(root).getPropertyValue('--canvas').trim();
 grid.querySelectorAll('[data-appearance-choice]').forEach(button=>{
  const item=state.families.find(f=>f.id===button.dataset.appearanceChoice)[state.scheme()];
  button.style.cssText='--preview-canvas:'+item.canvas+';--preview-paper:'+item.paper+';--preview-accent:'+item.accent+';--preview-soft:'+item.soft+';--preview-edge:'+item.edge;
 });
 if(announce)live.textContent=state.families.find(f=>f.id===state.family).name+', modo '+(state.scheme()==='dark'?'escuro':'claro')+'.';
}
function selectTheme(id){
 if(!state.families.some(f=>f.id===id))return;
 state.family=id;state.persist();applyAppearance(true);
}
function setMode(mode){
 if(!['system','light','dark'].includes(mode))return;
 state.mode=mode;state.persist();applyAppearance(true);
}
function toggleMode(){setMode(root.dataset.theme==='dark'?'light':'dark');}
for(const family of state.families){
 const button=document.createElement('button');button.type='button';button.className='theme-option';button.dataset.appearanceChoice=family.id;button.setAttribute('aria-label',family.name);
 button.innerHTML='<span class="theme-preview" aria-hidden="true"><span class="preview-header"></span><span class="preview-row"><i></i><b></b></span><span class="preview-row"><i></i><b></b></span></span><span class="theme-option-name">'+family.name+'</span><span class="theme-check" aria-hidden="true">'+icons.check+'</span>';
 button.addEventListener('click',()=>selectTheme(family.id));grid.append(button);
}
document.querySelectorAll('[data-appearance-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.appearanceMode)));
document.getElementById('appearance-reset').addEventListener('click',()=>{
 state.family='original';state.mode='system';
 state.persist();
 applyAppearance(true);
});
dialog.querySelectorAll('[data-close-appearance]').forEach(b=>b.addEventListener('click',()=>window.ToybileGuideUI.closeModal(dialog)));
let backdropPress=false;
dialog.addEventListener('pointerdown',e=>{backdropPress=e.target===dialog;});
dialog.addEventListener('click',e=>{if(backdropPress&&e.target===dialog)window.ToybileGuideUI.closeModal(dialog);backdropPress=false;});
function openThemes(){window.ToybileGuideUI.openModal(dialog);}
document.getElementById("appearance-open").addEventListener("click",openThemes);
systemTheme.addEventListener('change',()=>{if(state.mode==='system')applyAppearance(false);});
applyAppearance(false);
  // A short tap arms the next hold; a solitary hold always toggles appearance.
  const HOLD_MS = 500, DOUBLE_TAP_MS = 420, MOVE_PX = 14, TAP_DISTANCE = 32;
  let active = null;
  let lastTap = null;
  let holdTimer = null;
  let hideTimer = null;
  let frame = null;
  function isBackground(target, x, y) {
    // Empty space inside a heading's layout box is background; its text is not.
    if (target instanceof Element && target.closest('header,.hub-section h2') && !document.querySelector('dialog[open]') && !target.closest('button,a,summary,input,textarea,select,[role="button"],[contenteditable="true"]')) {
      const container=target.closest('header,.hub-section h2'),walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()) {
        if(!walker.currentNode.nodeValue.trim())continue;
        const range=document.createRange();range.selectNodeContents(walker.currentNode);
        for(const rect of range.getClientRects())if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)return false;
      }
      return true;
    }

    if (!(target instanceof Element) || document.querySelector("dialog[open]")) return false;
    if (target.closest('button, a, summary, input, textarea, select, dialog, [role="button"], [contenteditable="true"], .column, .hero h1, .hero p, .hub-tile, .hub-section h2, .extras-trigger')) return false;
    return target === document.body || target === root || Boolean(target.closest(".hero, .columns, .page, .hub-product"));
  }
  function hideFeedback() {
    // Leave label and progress untouched during the opacity transition.
    feedback.classList.remove("is-visible");
  }
  function clearTimers() {
    clearTimeout(holdTimer); clearTimeout(hideTimer);
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }
  function cancelGesture() { clearTimers(); active = null; lastTap = null; hideFeedback(); }
  function updateProgress(now) {
    if (!active || active.triggered) return;
    feedback.style.setProperty("--hold-progress", Math.min(100, (now - active.started) / HOLD_MS * 100) + "%");
    frame = requestAnimationFrame(updateProgress);
  }
  function startHold(event) {
    if (!event.isPrimary) { cancelGesture(); return; }
    if (event.button !== 0 || !isBackground(event.target,event.clientX,event.clientY)) { lastTap = null; return; }
    if (active) cancelGesture();
    clearTimers();
    const now = performance.now();
    const isSecond = lastTap && now - lastTap.at <= DOUBLE_TAP_MS && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) <= TAP_DISTANCE;
    active = { id: event.pointerId, x: event.clientX, y: event.clientY, started: now, action: isSecond ? "themes" : "mode", triggered: false };
    lastTap = null;
    feedback.dataset.action = active.action;
    feedback.classList.remove("is-complete");
    feedback.style.setProperty("--hold-x", Math.max(84, Math.min(innerWidth - 84, event.clientX)) + "px");
    feedback.style.setProperty("--hold-y", Math.max(80, Math.min(innerHeight - 8, event.clientY)) + "px");
    feedback.style.setProperty("--hold-progress", "0%");
    label.textContent = "";
    icon.innerHTML = isSecond ? icons.themes : (root.dataset.theme === "dark" ? icons.sun : icons.moon);
    feedback.classList.add("is-visible");
    frame = requestAnimationFrame(updateProgress);
    holdTimer = setTimeout(function () {
      if (!active) return;
      active.triggered = true;
      if (frame !== null) cancelAnimationFrame(frame);
      feedback.style.setProperty("--hold-progress", "100%");
      if (active.action === "themes") {
        hideFeedback();
        openThemes();
      } else {
        toggleMode();
        label.textContent = "";
        icon.innerHTML = root.dataset.theme === "dark" ? icons.moon : icons.sun;
        feedback.classList.add("is-complete");
        hideTimer = setTimeout(hideFeedback, 200);
      }
    }, HOLD_MS);
  }
  function moveHold(event) {
    if (!active || event.pointerId !== active.id || active.triggered) return;
    if (Math.hypot(event.clientX - active.x, event.clientY - active.y) > MOVE_PX) cancelGesture();
  }
  function finishHold(event) {
    if (!active || event.pointerId !== active.id) return;
    clearTimeout(holdTimer);
    if (frame !== null) cancelAnimationFrame(frame);
    if (!active.triggered) {
      lastTap = active.action === "mode" && performance.now() - active.started < 300
        ? { at: performance.now(), x: active.x, y: active.y } : null;
      hideFeedback();
    }
    active = null;
  }
  // Word selection starts on mousedown, before the later dblclick event.
  document.addEventListener("mousedown", function (event) {
    if (event.button === 0 && event.detail > 1 && isBackground(event.target,event.clientX,event.clientY)) event.preventDefault();
  }, true);
  document.addEventListener("pointerdown", startHold, { passive: true });
  document.addEventListener("pointermove", moveHold, { passive: true });
  document.addEventListener("pointerup", finishHold, { passive: true });
  document.addEventListener("pointercancel", cancelGesture, { passive: true });
  window.addEventListener("blur", cancelGesture);
  document.addEventListener("scroll", function () { if (active && !active.triggered) cancelGesture(); }, { passive: true, capture: true });
  document.addEventListener("contextmenu", function (event) { if (active) event.preventDefault(); });
  document.addEventListener("dblclick", function (event) { if (isBackground(event.target,event.clientX,event.clientY)) event.preventDefault(); });
  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key.toLowerCase() === "t" && !event.repeat) { event.preventDefault(); cancelGesture(); openThemes(); }
  });
})();


(function () {
  'use strict';
  const root = document.documentElement;
  const key = 'toybile-settings-surface-v2:'+location.pathname;
  const reduced = matchMedia('(prefers-reduced-transparency: reduce)');
  let enabled = false;
  try { enabled = localStorage.getItem(key) === 'glass'; } catch (_) {}
  const region = document.querySelector('#theme-grid')?.closest('fieldset');
  if (!region) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'surface-control';
  button.setAttribute('role', 'switch');
  button.setAttribute('aria-label', 'Fundo translúcido');
  button.innerHTML = '<span class="surface-copy"><span class="surface-title">Fundo translúcido</span><span class="surface-description">Luz e cores suaves no fundo e sob os cartões.</span></span><span class="surface-state"></span><span class="surface-track" aria-hidden="true"><span></span></span>';
  const status = document.createElement('p');
  status.className = 'surface-announcement sr-only';
  status.setAttribute('role', 'status');
  region.before(button, status);
  function apply(announce) {
    const effective = enabled && !reduced.matches;
    root.dataset.surfaceMode = effective ? 'glass' : 'solid';root.dataset.toybileGlass=effective?'on':'off';
    button.setAttribute('aria-checked', String(effective));
    button.querySelector('.surface-state').textContent = effective ? 'Ativado' : 'Desativado';
    button.querySelector('.surface-description').textContent = reduced.matches
      ? 'O sistema está configurado para reduzir a transparência.'
      : 'Luz e cores suaves no fundo e sob os cartões.';
    button.disabled = reduced.matches;
    if (announce) status.textContent = 'Fundo translúcido ' + (effective ? 'ativado.' : 'desativado.');
  }
  button.addEventListener('click', function () {
    enabled = !enabled;
    try { localStorage.setItem(key, enabled ? 'glass' : 'solid'); } catch (_) {}
    apply(true);
  });
  document.querySelector('#appearance-reset')?.addEventListener('click', function () {
    enabled = false;
    try { localStorage.removeItem(key); } catch (_) {}
    apply(true);
  });
  reduced.addEventListener('change', () => apply(false));
  apply(false);
})();


(function(){
'use strict';
const key='toybile-settings-language-v2:'+location.pathname,button=document.getElementById('settings-language');
let language='en';try{language=localStorage.getItem(key)==='pt-BR'?'pt-BR':'en';}catch(_){}
const flags = {
  pt: '<svg viewBox="0 0 30 20" aria-hidden="true" style="stroke:none;width:26px;height:18px"><rect width="30" height="20" rx="2" fill="#229e45"/><path d="M15 2 28 10 15 18 2 10Z" fill="#ffdf42"/><circle cx="15" cy="10" r="5" fill="#24459b"/><path d="M10.5 8.5q5-1 9 3" fill="none" stroke="#fff" stroke-width="1"/></svg>',
  en: '<svg viewBox="0 0 30 20" aria-hidden="true" style="stroke:none;width:26px;height:18px"><rect width="30" height="20" rx="2" fill="#243b79"/><path d="m0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="5"/><path d="m0 0 30 20M30 0 0 20" stroke="#ce3545" stroke-width="2"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="7"/><path d="M15 0v20M0 10h30" stroke="#ce3545" stroke-width="4"/></svg>',
};

const pairs=[["Mão personalizada","Custom hand"],["Padrão do sistema","System default"],["Tamanho do cursor","Cursor size"],["Configurações", "Settings"], ["Fechar configurações", "Close settings"], ["DO SEU JEITO", "MAKE IT YOURS"], ["Idioma e aparência, do seu jeito.", "Language and appearance, your way."], ["Modo de exibição", "Display mode"], ["Automático", "Automatic"], ["Claro", "Light"], ["Escuro", "Dark"], ["Temas", "Themes"], ["Restaurar padrão", "Restore default"], ["Pronto", "Done"], ["Fundo translúcido", "Translucent background"], ["Luz e cores suaves no fundo e sob os cartões.", "Soft light and colors in the background and beneath the cards."], ["Ativado", "On"], ["Desativado", "Off"], ["O sistema está configurado para reduzir a transparência.", "Your system is set to reduce transparency."], ["Fundo translúcido ativado.", "Translucent background enabled."], ["Fundo translúcido desativado.", "Translucent background disabled."], ["Acompanha o navegador, mantendo a paleta escolhida.", "Follows your browser while keeping your chosen palette."], ["Modo e paleta ficam salvos neste navegador.", "Your mode and palette are saved in this browser."], ["Acompanha automaticamente o tema do navegador.", "Automatically follows your browser theme."], ["Para abrir de novo: toque no fundo e segure o segundo toque por 0,5 s.", "To open settings: tap the background and hold the second tap for 0.5 s."], ["Atalho de teclado:", "Keyboard shortcut:"], ["Configs · 0,5 s", "Settings · 0.5 s"], ["0,5 s", "0.5 s"], ["Índigo", "Indigo"], ["Petróleo e turquesa", "Petroleum and turquoise"], ["Grafite e âmbar", "Graphite and amber"], ["Areia e azul", "Sand and blue"], ["Sálvia e oliva", "Sage and olive"], ["Rosé e vinho", "Rose and wine"], ["Ameixa e lavanda", "Plum and lavender"], ["Sites", "Websites"], ["Programas para baixar (GitHub)", "Downloads (GitHub)"], ["Editor de Lógica", "Logic Editor"], ["Escreva, organize e exporte argumentos.", "Write, organize and export arguments."], ["Editor no navegador", "Browser editor"], ["Explore notas de corte, concorrência e estatísticas da FUVEST e do ENEM.", "Explore FUVEST and ENEM cut-off scores, competition and statistics."], ["Painel de dados", "Data dashboard"], ["Sua versão com interface aprimorada.", "Your version with an improved interface."], ["Projeto no GitHub", "GitHub project"], ["Liste e remova experiências dos favoritos.", "List and remove experiences from your favorites."], ["Script Python no GitHub", "Python script on GitHub"], ["Criações de toybile", "toybile’s creations"], ["Abrir outros projetos: três cliques ou Alt + O", "Open other projects: three clicks or Alt + O"], ["Fechar outros projetos", "Close other projects"], ["UM PEQUENO DESVIO", "A SMALL DETOUR"], ["Fora de órbita", "Out of orbit"], ["Guias, mapas e outras curiosidades.", "Guides, maps and other curiosities."], ["Outros projetos", "Other projects"], ["Guia completo", "Complete guide"], ["Ordens de exibição de Steins;Gate e links para assistir.", "Steins;Gate viewing orders and links to watch."], ["Sem spoilers", "Spoiler-free"], ["Atlas de linhas de mundo", "World line atlas"], ["Um mapa dos campos atratores e das linhas de mundo de Steins;Gate.", "A map of the attractor fields and world lines of Steins;Gate."], ["Ainda não publicado", "Not published yet"], ["Contém spoilers", "Contains spoilers"], ["Você encontrou o outro lado do portfólio.", "You found the other side of the portfolio."], ["Aplicativo desktop", "Desktop App"], ["Script de console", "Console Script"], ["Programas no GitHub", "Programs on GitHub"], ["Um pequeno desvio da linha de mundo", "A small world-line shift"], ["Desvio de linha de mundo", "World-line shift"], ["Silenciar", "Mute"], ["Ativar som", "Enable sound"], ["Pular", "Skip"]];
const toEnglish=new Map(pairs),toPortuguese=new Map(pairs.map(([pt,en])=>[en,pt]));
function translate(value){
 const word=value.trim(),map=language==='en'?toEnglish:toPortuguese;
 let translated=map.get(word);
 if(translated===undefined){
  let match;
  if(language==='en'&&(match=word.match(/^(.+), modo (claro|escuro)\.$/)))translated=(toEnglish.get(match[1])||match[1])+', '+(match[2]==='escuro'?'dark':'light')+' mode.';
  else if(language!=='en'&&(match=word.match(/^(.+), (light|dark) mode\.$/)))translated=(toPortuguese.get(match[1])||match[1])+', modo '+(match[2]==='dark'?'escuro':'claro')+'.';
 }
 return translated===undefined?value:value.replace(word,translated);
}
function apply(){
 document.documentElement.lang=language;
 
 const code=language==='en'?'en':'pt';
 languagePicker.refresh();

 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(node.parentElement.closest('script,style,svg,input,textarea,code,[translate=no],#settings-language'))continue;
  const next=translate(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;
 }
 document.querySelectorAll('[aria-label],[title]').forEach(element=>{
  if(element===button||element.closest('svg,[translate=no]'))return;
  for(const attr of ['aria-label','title']){const value=element.getAttribute(attr);if(value!==null){const next=translate(value);if(next!==value)element.setAttribute(attr,next);}}
 });
}
function createLanguagePicker(button,flags,getLanguage,setLanguage){
 const icon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h12M9 2v3M5 5c1 5 4 8 8 10M13 5c-1 5-4 8-8 10m9 6 4-10 4 10m-6.5-4h5"/></svg>';
 button.innerHTML=icon;button.setAttribute('aria-label','Idioma / Language');button.removeAttribute('title');button.dataset.hintText='Idioma / Language';
 const picker=document.createElement('div');picker.id='site-language-picker';picker.className='site-language-picker';picker.setAttribute('popover','auto');picker.setAttribute('role','menu');picker.setAttribute('aria-label','Idioma / Language');picker.setAttribute('translate','no');
 const choices=[['pt-BR','pt','Português Brasileiro (pt-br)'],['en','en','International English (en)']];
 for(const [code,flag,label] of choices){const option=document.createElement('button');option.type='button';option.className='site-language-card';option.dataset.languageChoice=code;option.setAttribute('role','menuitemradio');option.setAttribute('lang',code);option.innerHTML='<span class="site-language-flag" aria-hidden="true">'+flags[flag]+'</span><span class="site-language-name"></span>';option.lastElementChild.textContent=label;option.addEventListener('click',()=>{if(getLanguage()!==code)setLanguage(code);refresh();picker.hidePopover();button.focus({preventScroll:true});button.dispatchEvent(new Event('languagechange'));});picker.append(option);}
 const parent=button.closest('dialog,[popover]')||document.body;parent.append(picker);button.setAttribute('popovertarget',picker.id);button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');
 function refresh(){const code=getLanguage()==='en'?'en':'pt-BR';button.dataset.language=code==='en'?'en':'pt';for(const option of picker.children){const active=option.dataset.languageChoice===code;option.setAttribute('aria-checked',String(active));option.tabIndex=active?0:-1;}}
 function position(){const anchor=button.getBoundingClientRect(),width=picker.offsetWidth||Math.min(448,innerWidth-24),height=picker.offsetHeight||88;const bounds=parent.getBoundingClientRect(),left=anchor.left+width>Math.min(innerWidth-12,bounds.right-12)?anchor.right-width:anchor.left;picker.style.left=Math.max(12,Math.min(innerWidth-width-12,left))+'px';picker.style.top=Math.max(12,anchor.bottom+8+height<=innerHeight-12?anchor.bottom+8:anchor.top-height-8)+'px';}
 picker.addEventListener('beforetoggle',event=>{if(event.newState==='open'){refresh();position();}});
 picker.addEventListener('toggle',event=>{const open=event.newState==='open';button.setAttribute('aria-expanded',String(open));if(open){position();picker.querySelector('[aria-checked="true"]').focus({preventScroll:true});}});
 picker.addEventListener('keydown',event=>{if(event.key==='Tab'){picker.hidePopover();button.focus({preventScroll:true});return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const options=[...picker.children],index=options.indexOf(document.activeElement);options[event.key==='Home'?0:event.key==='End'?1:(index+1)%2].focus();});
 window.addEventListener('resize',()=>{if(picker.matches(':popover-open'))position();});
 parent.addEventListener('scroll',event=>{if(picker.matches(':popover-open')&&!picker.contains(event.target))picker.hidePopover();},true);
 parent.addEventListener('close',()=>{if(picker.matches(':popover-open'))picker.hidePopover();});parent.addEventListener('toggle',event=>{if(event.target===parent&&event.newState==='closed'&&picker.matches(':popover-open'))picker.hidePopover();});
 refresh();return{refresh};
}

const languagePicker=createLanguagePicker(button,flags,()=>language,code=>{language=code;try{localStorage.setItem(key,language);}catch(_){}apply();});
document.getElementById('appearance-reset').addEventListener('click',()=>{language='en';try{localStorage.removeItem(key);}catch(_){}apply();});
const observer=new MutationObserver(records=>{if(records.some(record=>!(record.target.nodeType===Node.ELEMENT_NODE?record.target:record.target.parentElement)?.closest('[translate=no]')))apply();});observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
apply();
})();

const cursorArtwork="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"46\" height=\"46\" viewBox=\"0 0 256 256\"><image width=\"256\" height=\"256\" href=\"data:image/png;base64,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\"/></svg>";
(()=>{
 const root=document.documentElement,key='toybile-cursor-v2:'+location.pathname+'',range=document.getElementById('cursor-size'),value=document.getElementById('cursor-size-value'),custom=document.getElementById('cursor-custom'),system=document.getElementById('cursor-system');
 let state={mode:'system',size:100};try{const saved=JSON.parse(localStorage.getItem(key));if(saved){state.mode=saved.mode==='custom'?'custom':'system';state.size=Math.max(60,Math.min(160,Number(saved.size)||100));}}catch{}
 function apply(){
  root.dataset.siteCursor=state.mode;
  range?.style.setProperty('--cursor-progress',((state.size-60)/100*100)+'%');
  const size=46*state.size/100,x=Math.round(size*56/256),y=Math.round(size*22/256);
  const svg=cursorArtwork.replace('height="46"','height="'+size+'"').replace('width="46"','width="'+size+'"');
  const cursor='url("data:image/svg+xml,'+encodeURIComponent(svg)+'") '+x+' '+y;
  root.style.setProperty('--site-cursor',cursor);root.style.setProperty('--site-cursor-pressed',cursor);
  if(range){range.value=state.size;range.disabled=state.mode==='system';value.textContent=Math.round(state.size)+'%';custom.setAttribute('aria-pressed',String(state.mode==='custom'));system.setAttribute('aria-pressed',String(state.mode==='system'));}
 }
 function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{}apply();}
 custom?.addEventListener('click',()=>{state.mode='custom';save();});system?.addEventListener('click',()=>{state.mode='system';save();});range?.addEventListener('input',()=>{state.size=Number(range.value);save();});
 document.getElementById('appearance-reset')?.addEventListener('click',()=>{state={mode:'system',size:100};save();});apply();
})();
})();
