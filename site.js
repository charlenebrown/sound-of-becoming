(()=>{const data=window.EVENT_DATA;if(!data)return;function activate(el,url,label){if(!url)return;try{const u=new URL(url);if(u.protocol!=='https:')return;}catch{return}el.href=url;el.target='_blank';el.rel='noopener noreferrer';el.removeAttribute('aria-disabled');if(label){const labelEl=el.querySelector(".platform-label");if(labelEl)labelEl.textContent=label;else el.textContent=label;}}document.querySelectorAll('[data-download]').forEach(el=>{const k=el.dataset.download;activate(el,data.downloadUrls[k],k==='keepsake'?'Download The Keepsake ↗':'Download the Event Program ↗');});document.querySelectorAll('[data-person]').forEach(section=>{const p=data.people.find(x=>x.slug===section.dataset.person);if(!p)return;const c=section.querySelector('[data-connect]');if(c)activate(c,p.connectUrl,p.album?'Connect with '+p.name.split(' ')[0]+' ↗':'Connect with Sanah ↗');section.querySelectorAll('[data-platform]').forEach(el=>{const url=p.listen[el.dataset.platform];if(url===false){el.textContent=el.dataset.platform+' · Not available';}else{activate(el,url,el.dataset.platform+' ↗');}});});})();
/* One sample at a time. Animation indicates playback; it is not an amplitude analyser. */
(()=>{
 const data=window.EVENT_DATA;if(!data)return;
 const slug=decodeURIComponent(location.pathname).split('/').pop().replace(/\.html$/,'');
 const person=data.people.find(p=>p.slug===slug);if(!person||!person.album)return;
 const players=[];
 document.querySelectorAll('.song-grid article').forEach((card,index)=>{
  const song=person.songs[index];if(!song)return;
  const wave=card.querySelector('.waveform');if(wave){wave.replaceChildren();for(let i=0;i<43;i++){const bar=document.createElement('i');bar.style.setProperty('--bar-height',(12+Math.sin(i*1.9)**2*42)*Math.sin((i+1)/44*Math.PI)+'px');bar.style.setProperty('--bar-delay',(-i*.11)+'s');bar.style.setProperty('--bar-speed',(.6+(i%5)*.13)+'s');wave.append(bar)}}
  const url=person.sampleUrls?.[index];if(!url)return;
  const controls=document.createElement('div');controls.className='sample-controls';
  const button=document.createElement('button');button.type='button';button.className='button sample-play';button.textContent='Play sample';button.disabled=true;button.setAttribute('aria-label','Play sample: '+song);button.setAttribute('aria-pressed','false');
  const status=document.createElement('span');status.className='sample-status';status.setAttribute('role','status');status.textContent='Ready to listen';
  controls.append(button,status);card.append(controls);
  let parsed;try{parsed=new URL(url,location.href);if(!['http:','https:','file:'].includes(parsed.protocol))return;if(parsed.origin!==location.origin&&parsed.protocol!=='https:')return;}catch{return}
  const audio=document.createElement('audio');audio.preload='none';audio.src=url;card.append(audio);button.disabled=false;button.textContent='Play sample';button.setAttribute('aria-label','Play sample: '+song);status.textContent='Ready to listen';
  const entry={audio,button,card};players.push(entry);
  function state(playing){card.classList.toggle('sample-is-playing',playing);button.textContent=playing?'Pause sample':'Play sample';button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',(playing?'Pause sample: ':'Play sample: ')+song)}
  audio.addEventListener('play',()=>{players.forEach(other=>{if(other!==entry)other.audio.pause()})});
  audio.addEventListener('playing',()=>{state(true);status.textContent='Playing'});
  audio.addEventListener('waiting',()=>{state(false);status.textContent='Loading sample…'});
  audio.addEventListener('pause',()=>{state(false);status.textContent=audio.ended?'Finished':'Paused'});
  audio.addEventListener('ended',()=>{state(false);audio.currentTime=0;status.textContent='Finished · play again'});
  audio.addEventListener('error',()=>{state(false);status.textContent='Sample unavailable. Please try again.'});
  button.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return}players.forEach(other=>{if(other!==entry)other.audio.pause()});try{await audio.play()}catch{state(false);status.textContent='Unable to play. Please try again.'}});
 });
 window.addEventListener('pagehide',()=>players.forEach(p=>p.audio.pause()));
})();

/* In-page interactions: no analytics, cookies or persistent storage. */
(()=>{
 const control=document.querySelector('.motion-toggle');const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 function setMotion(paused){document.body.classList.toggle('motion-paused',paused);if(control){control.textContent=paused?'Enable motion':'Pause motion';control.setAttribute('aria-pressed',String(paused))}}
 setMotion(preference.matches);control?.addEventListener('click',()=>setMotion(!document.body.classList.contains('motion-paused')));preference.addEventListener('change',event=>setMotion(event.matches));
 const button=document.querySelector('.discover-album');const result=document.querySelector('.discovery-result');let last=-1;
 button?.addEventListener('click',()=>{const people=(window.EVENT_DATA?.people||[]).filter(p=>p.album);if(!people.length||!result)return;const choices=people.map((p,i)=>i).filter(i=>i!==last);last=choices[Math.floor(Math.random()*choices.length)];const p=people[last];const title=document.createElement('strong');title.textContent=p.album;const name=document.createElement('p');name.textContent='The story of '+p.name+'.';const link=document.createElement('a');link.href=p.slug+'.html';link.textContent='Meet '+p.name.split(' ')[0]+' + explore the album ↗';result.replaceChildren(title,name,link);button.textContent='Discover another album';});
})();

/* Native touch/pen feedback without intercepting link navigation. */
(()=>{document.querySelectorAll('.platform-links a').forEach(link=>{
 let timer;const clear=()=>{clearTimeout(timer);link.classList.remove('touch-active')};
 link.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.pointerType==='pen'){clearTimeout(timer);link.classList.add('touch-active')}});
 link.addEventListener('pointerup',()=>{timer=setTimeout(clear,180)});link.addEventListener('pointercancel',clear);link.addEventListener('pointerleave',clear);link.addEventListener('blur',clear);
});})();

/* Smooth same-page navigation; preserve normal modifier-key and external-link behavior. */
(()=>{document.addEventListener('click',event=>{const a=event.target.closest('a[href]');if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||a.target==='_blank')return;let u;try{u=new URL(a.href,location.href)}catch{return}if(u.origin!==location.origin||u.pathname!==location.pathname||!u.hash)return;const target=document.getElementById(decodeURIComponent(u.hash.slice(1)));if(!target)return;event.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});history.pushState(null,'',u.hash);});})();
