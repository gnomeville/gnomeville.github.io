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
function ready(){
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
