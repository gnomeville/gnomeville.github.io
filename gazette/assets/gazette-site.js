/* GNOMEVILLE GAZETTE shared chrome: edit headlines/links here once for all pages. */
(function(){'use strict';
const headlines=[
 {text:'MUNICIPAL COMMITTEE VOTES TO REVISIT PREVIOUS VOTE',url:'/gazette/sections/mayor-statement.html'},
 {text:'RESIDENT CONFIRMS SIDEWALK REMAINS OUTDOORS',url:'/index.html'},
 {text:'SQUIRRELS REMAIN AT LARGE',url:'/gazette/articles/flamingo-battery-2026.html'},
 {text:'MAYOR CALLS FOR CALM; WINE GLASS UNACCOUNTED FOR',url:'/gazette/sections/mayor-statement.html'},
 {text:'LIBRARY REQUESTS RETURN OF OVERDUE MANUSCRIPT',url:'/library.html'},
 {text:'SALTY PETE DECLINES COMMENT',url:'/gazette/index.html'}
];

// Seasonal Gazette masthead. Dates are evaluated in Gnomeville (Chicago) time.
// Override for editorial preview: ?masthead=thanksgiving|christmas|halloween|standard|auto
function seasonalMasthead(){
 const now=new Date();
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(now);
 const value=k=>Number(parts.find(p=>p.type===k).value);
 const year=value('year'),month=value('month'),day=value('day');
 const novemberFirst=new Date(Date.UTC(year,10,1)).getUTCDay();
 const thanksgiving=22+((4-novemberFirst+7)%7);
 let season=month===10?'halloween':month===11&&day<=thanksgiving?'thanksgiving':(month===11&&day>thanksgiving||month===12)?'christmas':'standard';
 const override=new URLSearchParams(location.search).get('masthead');
 if(['standard','thanksgiving','halloween','christmas'].includes(override))season=override;
 const wordmark='/gazette/assets/gazette-wordmark.png';
 const thanksgivingArt='/gazette/assets/thanksgiving-background.webp';
 const oldHalloween='/gazette/assets/halloween-masthead.webp';
 const oldFlourish='/gazette/assets/halloween-flourish.webp';
 const useImage=(url,callback,fallback)=>{const probe=new Image();probe.onload=callback;probe.onerror=fallback;probe.src=url;};
 document.querySelectorAll('.mast').forEach(mast=>{
  const art=mast.querySelector('.mast-art'),flourish=mast.querySelector('.flourish-art'),title=mast.querySelector('h1');
  if(!art)return;
  const setArt=(images,description)=>{
   art.style.setProperty('display','block','important');
   art.style.setProperty('background-image',images,'important');
   art.style.setProperty('background-position','center','important');
   art.style.setProperty('background-size','100% 100%','important');
   art.style.setProperty('background-repeat','no-repeat','important');
   art.setAttribute('aria-label',description);
   if(title){title.classList.add('visually-hidden');title.removeAttribute('style');}
  };
  const hideFlourish=()=>{if(flourish)flourish.style.setProperty('display','none','important');};
  const showPermanent=background=>{
   hideFlourish();
   useImage(wordmark,()=>setArt('url("'+wordmark+'"),'+background,'The Gnomeville Gazette permanent wordmark'),()=>{
    art.style.setProperty('display','none','important');
    if(title){title.classList.remove('visually-hidden');title.style.cssText='position:static!important;width:auto!important;height:auto!important;clip:auto!important;overflow:visible!important;white-space:normal!important;display:block!important;text-align:center;font:bold clamp(32px,7vw,75px) Georgia,serif;padding:20px 8px;color:#211a16';}
   });
  };
  if(season==='thanksgiving'){
   useImage(thanksgivingArt,()=>showPermanent('url("'+thanksgivingArt+'")'),()=>showPermanent('linear-gradient(115deg,#261813,#5e3926,#2c211d)'));
  }else if(season==='halloween'){
   useImage(oldHalloween,()=>{
    setArt('url("'+oldHalloween+'")','The Gnomeville Gazette Halloween illustrated masthead');
    if(flourish){flourish.style.setProperty('display','block','important');flourish.style.setProperty('background-image','url("'+oldFlourish+'")','important');}
   },()=>showPermanent('linear-gradient(115deg,#261813,#5e3926,#2c211d)'));
  }else{
   // Christmas remains on the permanent masthead until a separate approved background is published.
   showPermanent('linear-gradient(115deg,#261813,#5e3926,#2c211d)');
  }
 });
}

const gazetteSearchCache={pages:null};

function gazetteOnlyUrl(value,base=location.href){
 try{
  const url=new URL(value,new URL(base,location.origin));
  const path=url.pathname.replace(/\/{2,}/g,'/');
  if(url.origin!==location.origin||!path.startsWith('/gazette/'))return null;
  if(!path.endsWith('.html')&&!path.endsWith('/'))return null;
  return path+url.search+url.hash;
 }catch(_error){return null;}
}

async function loadGazetteSearchPages(){
 if(gazetteSearchCache.pages)return gazetteSearchCache.pages;
 const records=new Map();
 const addRecord=item=>{
  const url=gazetteOnlyUrl(item.url||'');
  if(!url)return;
  const key=url.split(/[?#]/)[0];
  const existing=records.get(key)||{};
  records.set(key,{
   title:item.title||existing.title||key.split('/').pop().replace(/[-_]/g,' '),
   url:key,
   description:item.description||existing.description||'',
   keywords:item.keywords||existing.keywords||'',
   text:item.text||existing.text||''
  });
 };
 const responses=await Promise.allSettled([
  fetch('/gazette/search-index.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Search index unavailable');return r.json();}),
  fetch('/gazette/sections/archives.html',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Archive unavailable');return r.text();}),
  fetch('/gazette/index.html',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Front page unavailable');return r.text();})
 ]);
 if(responses[0].status==='fulfilled'&&Array.isArray(responses[0].value.pages)){
  responses[0].value.pages.forEach(addRecord);
 }
 const discoveryBases=['/gazette/sections/archives.html','/gazette/index.html'];
 responses.slice(1).forEach((result,resultIndex)=>{
  if(result.status!=='fulfilled')return;
  const doc=new DOMParser().parseFromString(result.value,'text/html');
  doc.querySelectorAll('a[href]').forEach(link=>{
   const url=gazetteOnlyUrl(link.getAttribute('href'),discoveryBases[resultIndex]);
   if(url)addRecord({title:link.textContent.replace(/\s+/g,' ').replace(/\s*[→»]+\s*$/,'').trim(),url});
  });
 });
 addRecord({title:'The Gnomeville Gazette',url:'/gazette/index.html',description:'The Gazette front page and current headlines.'});
 addRecord({title:'Gazette Archives',url:'/gazette/sections/archives.html',description:'Past Gazette reporting and preserved coverage.'});
 const pages=[...records.values()];
 const details=await Promise.allSettled(pages.map(page=>fetch(page.url,{cache:'no-store'}).then(r=>r.ok?r.text():'').then(html=>{
  if(!html)return page;
  const doc=new DOMParser().parseFromString(html,'text/html');
  const title=(doc.querySelector('main h1, main h2, article h1, article h2')?.textContent||doc.title||page.title).replace(/\s+/g,' ').trim();
  const text=(doc.querySelector('main')?.textContent||'').replace(/\s+/g,' ').trim();
  const description=doc.querySelector('meta[name="description"]')?.content||page.description;
  return {...page,title,description,text};
 })));
 gazetteSearchCache.pages=details.map((result,index)=>result.status==='fulfilled'?result.value:pages[index]);
 return gazetteSearchCache.pages;
}

function renderGazetteSearchResults(query,pages){
 let panel=document.getElementById('gazette-search-results');
 if(!panel){
  panel=document.createElement('section');
  panel.id='gazette-search-results';
  panel.className='gazette-search-results';
  panel.setAttribute('aria-live','polite');
  const main=document.querySelector('main');
  if(main)main.prepend(panel);
 }
 panel.replaceChildren();
 const heading=document.createElement('h2');
 heading.textContent='Gazette Search';
 panel.append(heading);
 const terms=query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
 const ranked=pages.map(page=>{
  const title=(page.title||'').toLocaleLowerCase();
  const haystack=[page.title,page.description,page.keywords,page.text].join(' ').toLocaleLowerCase();
  if(!terms.every(term=>haystack.includes(term)))return null;
  let score=terms.reduce((total,term)=>total+(title.startsWith(term)?8:title.includes(term)?4:1),0);
  return {page,score};
 }).filter(Boolean).sort((a,b)=>b.score-a.score||a.page.title.localeCompare(b.page.title));
 const summary=document.createElement('p');
 summary.className='gazette-search-summary';
 summary.textContent=ranked.length?ranked.length+' Gazette result'+(ranked.length===1?'':'s')+' for “'+query+'”.':'No Gazette results found for “'+query+'”.';
 panel.append(summary);
 if(ranked.length){
  const list=document.createElement('div');
  list.className='gazette-search-list';
  ranked.forEach(({page})=>{
   const article=document.createElement('article');
   const link=document.createElement('a');
   link.href=page.url;
   link.textContent=page.title;
   article.append(link);
   if(page.description){
    const description=document.createElement('p');
    description.textContent=page.description;
    article.append(description);
   }
   list.append(article);
  });
  panel.append(list);
 }
 const close=document.createElement('button');
 close.type='button';
 close.className='gazette-search-close';
 close.textContent='Close search results';
 close.addEventListener('click',()=>{panel.remove();const input=document.querySelector('form.search input');if(input)input.focus();});
 panel.append(close);
 panel.scrollIntoView({behavior:'smooth',block:'start'});
}

function installGazetteSearch(){
 document.querySelectorAll('form.search').forEach(form=>{
  if(form.dataset.gazetteSearchReady)return;
  form.dataset.gazetteSearchReady='true';
  const input=form.querySelector('input');
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   const query=(input?.value||'').trim();
   if(!query){if(input)input.focus();return;}
   let panel=document.getElementById('gazette-search-results');
   if(!panel){
    panel=document.createElement('section');
    panel.id='gazette-search-results';
    panel.className='gazette-search-results';
    panel.setAttribute('aria-live','polite');
    document.querySelector('main')?.prepend(panel);
   }
   panel.innerHTML='<h2>Gazette Search</h2><p>Searching Gazette pages…</p>';
   try{
    const pages=await loadGazetteSearchPages();
    renderGazetteSearchResults(query,pages);
    const url=new URL(location.href);
    url.searchParams.set('q',query);
    history.replaceState(null,'',url);
   }catch(_error){
    panel.innerHTML='<h2>Gazette Search</h2><p>Search is temporarily unavailable. Please try again.</p>';
   }
  });
 });
 const query=new URLSearchParams(location.search).get('q');
 const form=document.querySelector('form.search');
 const input=form?.querySelector('input');
 if(query&&form&&input){
  input.value=query;
  form.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));
 }
}

function ready(){
 seasonalMasthead();
 installGazetteSearch();
 document.querySelectorAll('.mast .meta').forEach(function(meta){
  const spans=meta.querySelectorAll('span');if(spans[0])spans[0].textContent='GNOMEVILLE, IL';
  const target=meta.querySelector('#edition')||spans[1];if(target){target.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date());target.setAttribute('aria-label','Current date in Gnomeville');}
 });
 document.querySelectorAll('.ticker').forEach(function(ticker){
  ticker.replaceChildren();const label=document.createElement('span');label.className='ticker-label';label.textContent='BREAKING NEWS »';ticker.append(label);
  const viewport=document.createElement('div');viewport.className='ticker-window';viewport.tabIndex=0;viewport.setAttribute('aria-label','Breaking news headlines; scroll horizontally to browse');
  const track=document.createElement('div');track.className='ticker-track';
  for(let repeat=0;repeat<2;repeat++){headlines.forEach(function(item){const a=document.createElement('a');a.className='ticker-item';a.href=item.url;a.textContent='✤  '+item.text; if(repeat)a.setAttribute('aria-hidden','true');track.append(a);});}
  viewport.append(track);ticker.append(viewport);
  const toggle=document.createElement('button');toggle.type='button';toggle.className='ticker-toggle';toggle.textContent='Pause';toggle.setAttribute('aria-label','Pause breaking news ticker');toggle.setAttribute('aria-pressed','false');
  toggle.addEventListener('click',function(){const paused=ticker.classList.toggle('is-paused');toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume breaking news ticker':'Pause breaking news ticker');});ticker.append(toggle);
  ['pointerdown','touchstart','wheel'].forEach(function(e){viewport.addEventListener(e,function(){viewport.classList.add('is-interacting');},{passive:true});});
  viewport.addEventListener('focusin',function(){viewport.classList.add('is-interacting');});
  viewport.addEventListener('focusout',function(){viewport.classList.remove('is-interacting');});
 });
 document.querySelectorAll('footer').forEach(function(footer){if(footer.querySelector('.community-links'))return;const links=document.createElement('div');links.className='community-links';links.innerHTML='Community links: <a href="/index.html">Gnomeville Municipal Government</a> · <a href="/gnomenet.html">GnomeNet</a>';footer.append(links);});
 const home=document.getElementById('homepage');if(home&&!document.querySelector('.community-partners')){const box=document.createElement('section');box.className='community-partners';box.setAttribute('aria-label','Community partners and sponsors');box.innerHTML='<h2>Community Partners · Proudly Supporting Independent Journalism</h2><div class="partner-grid"><a href="/index.html"><strong>Gnomeville Municipal Government</strong><small>Official civic information. Accuracy subject to committee review.</small></a><a href="/gnomenet.html"><strong>GnomeNet</strong><small>Connecting the municipality, whenever technically convenient.</small></a></div>';home.append(box);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
