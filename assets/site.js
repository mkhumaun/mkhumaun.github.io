/* Progressive enhancement. All research and citations are present in the HTML. */
'use strict';
document.querySelectorAll('.menu-toggle').forEach(button=>{
  const nav=button.parentElement.querySelector('.nav');
  button.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');button.setAttribute('aria-expanded','false');}});
});
function norm(s){return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');}
document.querySelectorAll('[data-publication-browser]').forEach(browser=>{
  const search=browser.querySelector('input[data-search]'),kind=browser.querySelector('select[data-kind]'),role=browser.querySelector('select[data-role]');
  const articles=[...browser.querySelectorAll('.publication')],chips=[...browser.querySelectorAll('[data-topic-filter]')];
  let topic='All';
  const filter=()=>{
    let count=0;const terms=norm(search.value.trim()).split(/\s+/).filter(Boolean);
    articles.forEach(article=>{
      const matches=terms.every(term=>norm(article.dataset.search).includes(term))&&
        (kind.value==='All'||article.dataset.kind===kind.value)&&
        (role.value==='All'||(role.value==='Lead'?['First author','Co-first author','Equal-contribution author'].includes(article.dataset.role):article.dataset.role==='Co-author'))&&
        (topic==='All'||article.dataset.topics.split('|').includes(topic));
      article.hidden=!matches;if(matches)count++;
    });
    browser.querySelector('[data-result-count]').textContent=`${count} of ${articles.length} publications`;
    browser.querySelector('.empty-state').hidden=count!==0;
  };
  search.addEventListener('input',filter);kind.addEventListener('change',filter);role.addEventListener('change',filter);
  chips.forEach(chip=>chip.addEventListener('click',()=>{topic=chip.dataset.topicFilter;chips.forEach(c=>c.setAttribute('aria-pressed',String(c===chip)));filter();}));
  browser.querySelector('.reset-filters').addEventListener('click',()=>{search.value='';kind.value='All';role.value='All';topic='All';chips.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.topicFilter==='All')));filter();search.focus();});
});
async function copyText(text){
  if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(text);return;}catch(e){/* local-file fallback below */}}
  const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();
  const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('Copy not supported by this browser.');
}
document.querySelectorAll('.copy-citation').forEach(button=>button.addEventListener('click',async()=>{
  const original=button.textContent;
  try{await copyText(button.dataset.citation);button.textContent='Copied';button.setAttribute('aria-label','Citation copied');}
  catch(e){button.textContent='Select citation text to copy';}
  setTimeout(()=>{button.textContent=original;button.setAttribute('aria-label','Copy citation');},2200);
}));
document.querySelectorAll('[data-print-cv]').forEach(button=>button.addEventListener('click',()=>window.print()));
