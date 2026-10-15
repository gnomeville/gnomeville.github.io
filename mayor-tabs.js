/* In-place Mayor office tabs: click, keyboard navigation and deep-link hash */
(()=>{const tabs=[...document.querySelectorAll('.mayor-tabs [role="tab"]')];if(!tabs.length)return;
function activate(tab,focus=false){for(const t of tabs){const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;}if(focus)tab.focus();}
for(const tab of tabs){tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let i=tabs.indexOf(tab),n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(tabs[n],true);});}
const hash=decodeURIComponent(location.hash.slice(1));const target=tabs.find(t=>t.id===hash||t.getAttribute('aria-controls')===hash);if(target)activate(target);
})();
