/* Gnomeville municipal shared navigation and footer. Update menu items HERE. */
(function(){
 const path=window.location.pathname.split('/').pop()||'index.html';
 const menu=[['index.html','Home'],['mayor.html','Office of the Mayor'],['index.html#services','Resident Services'],['index.html#news','News'],['index.html#calendar','Calendar'],['index.html#directory','Directory']];
 const links=menu.map(([url,label])=>`<a href="${url}"${url===path?' aria-current="page"':''}>${label}</a>`).join('');
 const head=`<div class="notice">Official Municipal Portal • Public Notices Subject to Revision</div><header><div class="wrap"><div class="brand"><a class="identity" href="index.html"><img src="municipal-seal.png" alt="Great Seal of Gnomeville"><div><small>MUNICIPALITY OF</small><strong>Gnomeville</strong></div></a><span class="tagline">Life happens here. So does everything else.</span></div><nav aria-label="Main navigation">${links}</nav></div></header>`;
 const foot=`<footer><img src="municipal-seal.png" alt="Gnomeville municipal seal"><p><strong>Gnomeville Municipal Government</strong></p><p class="muted">Life happens here. So does everything else.</p><p class="muted">Website last updated October 2026. Certain departments may not have been notified.</p><p class="muted">© 2026 Gnomeville • A fictional town with very real paperwork.</p></footer>`;
 const h=document.getElementById('municipal-header');const f=document.getElementById('municipal-footer');
 if(h)h.innerHTML=head;if(f)f.innerHTML=foot;
})();
