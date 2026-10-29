/* Gnomeville Public Library catalog v5. Adds provisional accession GPL-048 without modifying existing 47 canonical records. */
(()=>{'use strict';
const records=window.GNOMEVILLE_CATALOG||[];
// Provisional accession. Keep the original 47 records untouched until the master catalog is revised.
if(!records.some(r=>r.id==='GPL-048'))records.push({
 id:'GPL-048',kind:'Book',title:'Boners of the Dead',creator:'Rook Everhart',
 description:'A work by Rook Everhart. Synopsis awaiting confirmation from the publisher.',
 year:'',status:'Cataloged · Details pending',subjects:'Boners of the Dead Rook Everhart',
 series:'',note:'Approved cover artwork recovered. Publication details and synopsis not yet confirmed.',
 location:'Fiction · Classification pending'
});
const results=document.getElementById('catalog-results');if(!results)return;
const query=document.getElementById('catalog-query'),kind=document.getElementById('catalog-type'),count=document.getElementById('catalog-count'),sort=document.getElementById('catalog-sort'),spot=document.getElementById('catalog-spotlight');
const params=new URLSearchParams(location.search);
const requestedId=params.get('record');
if(params.get('q'))query.value=params.get('q');
if(params.get('type')&&[...kind.options].some(o=>o.value===params.get('type')))kind.value=params.get('type');
let browsingAll=!!requestedId;
const featured=document.getElementById('catalog-featured'),track=document.getElementById('featured-track');
const lower=v=>String(v||'').toLocaleLowerCase();
const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const knownCovers={
 'GPL-048':{src:'library-images/boners-of-the-dead-front.png',alt:'Approved front cover of Boners of the Dead by Rook Everhart'},
 'GPL-010':{src:'library-images/who-moved-my-cheese-front.png',alt:'Approved cover of Who Moved My Cheese? An Investigation into the 1987 Dairy Disappearance'},
 'GPL-011':{src:'library-images/goodnight-gnome-front.png',alt:'Approved cover of Goodnight Gnome'},
 'GPL-027':{src:'library-images/death-at-flip-flop-cove-front.png',alt:'Approved cover of Death at Flip Flop Cove'},
 'GPL-030':{src:'library-images/aloha-means-alibi-front.png',alt:'Approved cover of Aloha Means Alibi'}
};
const destinations={'GPL-001':'microfilm.html?reel=1969-TH','GPL-002':'microfilm.html?reel=004-B','GPL-003':'special-collections.html#babylon','GPL-006':'microfilm.html?reel=1969-TH'};
function recordLink(r){return 'catalog.html?record='+encodeURIComponent(r.id)}
function clearDeepLink(){if(!requestedId)return;const u=new URL(location.href);u.searchParams.delete('record');history.replaceState(null,'',u.pathname+u.search+u.hash)}
function render(){let q=lower(query.value.trim()),t=kind.value;const active=!!q||t!=='all'||browsingAll;featured.hidden=active;results.hidden=!active;spot.hidden=active;
if(!active){count.textContent=`${records.length} records in the collection · Search above or explore featured books`;results.replaceChildren();return;}
let rows=records.filter(r=>(t==='all'||r.kind===t)&&(!q||[r.title,r.creator,r.description,r.subjects,r.series,r.note,r.kind,r.location,r.id].some(v=>lower(v).includes(q))));
if(requestedId&&!q&&t==='all'&&browsingAll){const selected=records.find(r=>r.id===requestedId);if(selected)rows=[selected];}
if(sort.value==='title')rows.sort((a,b)=>a.title.localeCompare(b.title));if(sort.value==='author')rows.sort((a,b)=>a.creator.localeCompare(b.creator));
count.textContent=`${rows.length} of ${records.length} records displayed · Gnomeville Public Access Index`;results.replaceChildren();
rows.forEach(r=>{const card=node('article','catalog-record');card.id='record-'+r.id;const head=node('div','catalog-record-top');head.append(node('small','',`${r.id} · ${r.kind}${r.year?' · '+r.year:''}`),node('span','catalog-status',r.status));const title=node('h3','',r.title);const creator=node('p','catalog-creator',`By ${r.creator}`);const desc=node('p','catalog-description',r.description);const info=node('div','catalog-record-info',`${r.series?r.series+' · ':''}${r.location}`);card.append(head,title,creator);
if(knownCovers[r.id]){const fig=node('figure','catalog-cover');const img=node('img');img.src=knownCovers[r.id].src;img.alt=knownCovers[r.id].alt;img.loading='lazy';img.decoding='async';fig.append(img);card.append(fig)}
card.append(desc,info);
if(r.note){const details=node('details','catalog-details');const sum=node('summary','', 'Librarian’s notes & cross-references');details.append(sum,node('p','',r.note));card.append(details)}
if(destinations[r.id]){const a=node('a','catalog-action',r.kind==='Microfilm'?'View available microfilm →':'Visit Special Collections →');a.href=destinations[r.id];card.append(a)}
const share=node('a','catalog-record-permalink','Link to this catalog record ↗');share.href=recordLink(r);share.setAttribute('aria-label','Permanent link to '+r.title);card.append(share);
results.append(card)});
if(!rows.length)results.append(node('p','catalog-empty','No matching records. Ollie recommends checking the spelling before accusing the Archives of suppression.'));
}
function change(){browsingAll=false;clearDeepLink();render()}
query.addEventListener('input',change);kind.addEventListener('change',change);sort.addEventListener('change',()=>{if(!query.value.trim()&&kind.value==='all')browsingAll=true;render()});
document.querySelectorAll('[data-catalog-search]').forEach(b=>b.addEventListener('click',()=>{query.value=b.dataset.catalogSearch||'';kind.value=b.dataset.catalogType||'all';browsingAll=!query.value&&kind.value==='all';clearDeepLink();render();document.getElementById('catalog-search').scrollIntoView({behavior:'smooth',block:'start'});query.focus({preventScroll:true})}));
const books=records.filter(r=>r.kind==='Book'||r.kind==='Children’s Book');for(let i=books.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[books[i],books[j]]=[books[j],books[i]]}
const colors=['#633b4b','#304d4a','#5b4768','#7b4c35','#324c70','#526343'];
books.slice(0,6).forEach((r,i)=>{const card=node('button','featured-book');card.type='button';const cover=node('div','featured-book-cover');cover.style.background=colors[i];if(knownCovers[r.id]){cover.classList.add('has-approved-art');const img=node('img');img.src=knownCovers[r.id].src;img.alt=knownCovers[r.id].alt;img.loading='lazy';cover.append(img)}else{cover.append(node('span','featured-cover-top','GNOMEVILLE PUBLIC LIBRARY'),node('span','featured-cover-title',r.title),node('span','featured-cover-ornament','✦ ❦ ✦'),node('span','featured-cover-author',r.creator))}card.append(cover,node('strong','featured-book-title',r.title),node('span','featured-book-author',r.creator),node('span','featured-book-status',r.status));card.addEventListener('click',()=>{query.value=r.title;kind.value='all';browsingAll=false;clearDeepLink();render();document.getElementById('catalog-search').scrollIntoView({behavior:'smooth',block:'start'})});track.append(card)});
document.getElementById('featured-prev').addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.7,behavior:'smooth'}));
document.getElementById('featured-next').addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.7,behavior:'smooth'}));
document.getElementById('catalog-browse-all').addEventListener('click',()=>{browsingAll=true;query.value='';kind.value='all';clearDeepLink();render()});
const style=node('style');style.textContent='.catalog-record-permalink{display:block;margin-top:.8rem;font:700 .82rem/1.5 system-ui,sans-serif;color:#684354}.catalog-cover{max-width:230px;margin:1rem 0}.catalog-cover img{display:block;width:100%;height:auto;border:1px solid #cbbba4;box-shadow:0 3px 10px #0002}.featured-book-cover.has-approved-art{padding:0;border:0;background:transparent!important;overflow:hidden}.featured-book-cover.has-approved-art img{display:block;width:100%;height:100%;object-fit:contain}.catalog-record:target{outline:3px solid #a77d48;outline-offset:2px}';document.head.append(style);
// Keep the original library's navigation, but ensure borrowing applications are discoverable here.
const nav=document.querySelector('.library-nav');if(nav&&!nav.querySelector('a[href="library-card.html"]')){const a=node('a','','Library Cards');a.href='library-card.html';nav.append(a)}
render();
})();
