(()=>{const data=window.EVENT_DATA;if(!data)return;function activate(el,url,label){if(!url)return;try{const u=new URL(url);if(u.protocol!=='https:')return;}catch{return}el.href=url;el.removeAttribute('aria-disabled');if(label)el.textContent=label;}document.querySelectorAll('[data-download]').forEach(el=>{const k=el.dataset.download;activate(el,data.downloadUrls[k],k==='keepsake'?'Download The Keepsake ↗':'Download the Event Program ↗');});document.querySelectorAll('[data-person]').forEach(section=>{const p=data.people.find(x=>x.slug===section.dataset.person);if(!p)return;const c=section.querySelector('[data-connect]');if(c)activate(c,p.connectUrl,p.album?'Connect with '+p.name.split(' ')[0]+' ↗':'Connect with Sanah ↗');section.querySelectorAll('[data-platform]').forEach(el=>{const url=p.listen[el.dataset.platform];if(url===false){el.textContent=el.dataset.platform+' · Not available';}else{activate(el,url,el.dataset.platform+' ↗');}});});})();
/* One sample at a time. Animation indicates playback; it is not an amplitude analyser. */
(()=>{
 const data=window.EVENT_DATA;if(!data)return;
 const slug=decodeURIComponent(location.pathname).split('/').pop().replace(/\.html$/,'');
 const person=data.people.find(p=>p.slug===slug);if(!person||!person.album)return;
 const players=[];
 document.querySelectorAll('.song-grid article').forEach((card,index)=>{
  const song=person.songs[index];if(!song)return;
  const wave=card.querySelector('.waveform');if(wave){wave.replaceChildren();for(let i=0;i<43;i++){const bar=document.createElement('i');bar.style.setProperty('--bar-height',(12+Math.sin(i*1.9)**2*42)*Math.sin((i+1)/44*Math.PI)+'px');bar.style.setProperty('--bar-delay',(-i*.11)+'s');bar.style.setProperty('--bar-speed',(.6+(i%5)*.13)+'s');wave.append(bar)}}
  const controls=document.createElement('div');controls.className='sample-controls';
  const button=document.createElement('button');button.type='button';button.className='button sample-play';button.textContent='Sample forthcoming';button.disabled=true;button.setAttribute('aria-label','Sample for '+song+' forthcoming');button.setAttribute('aria-pressed','false');
  const status=document.createElement('span');status.className='sample-status';status.setAttribute('role','status');status.textContent='Clean sample will be added here.';
  controls.append(button,status);card.append(controls);
  const url=person.sampleUrls?.[index];if(!url)return;
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
