import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const profiles=JSON.parse(fs.readFileSync(path.join(root,'content/profiles.json'),'utf8'));
const site=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const paragraphs=(value,fallback)=>String(value||fallback).split(/\n\s*\n/).filter(Boolean).map(v=>`<p${value?'':' class="placeholder-copy"'}>${esc(v).replaceAll('\n','<br>')}</p>`).join('');
const publicReady=site.publishReady===true&&site.approved===true&&profiles.every(p=>p.approved===true);
const banner=publicReady?'':'<div class="review-strip">PRIVATE WORKING DRAFT · Final profile content and links pending</div>';
function finish(template,values){
 let html=template.replace(/\{\{([A-Za-z0-9_\-]+)\}\}/g,(_,key)=>{if(!(key in values))throw new Error('Unknown template field '+key);return values[key]});
 if(publicReady)html=html.replace('<meta name="robots" content="noindex,nofollow">','');
 return html;
}
for(const p of profiles){
 const values={REVIEW_BANNER:banner,BIO:esc(p.bio||'Sanah’s approved biography will appear here.'),BIO_STATUS:p.approved?'':'<p class="small review-note">Biography shown as a layout draft.<br>Final copy and links are pending.</p>',PURPOSE:paragraphs(p.album?p.purpose:p.services,p.album?'Her full reason and purpose statement will appear here in her own words.':'Sanah’s approved collaboration details will appear here.'),PURPOSE_STATUS:(p.album?p.purpose:p.services)?'':'<span class="draft-tag">Awaiting her final statement</span>',ALBUM:esc(p.album),SONG_STATUS:p.songTitlesConfirmed?'':'<small>Song titles and presentation awaiting final confirmation.</small>'};
 values.PORTRAIT=p.portrait?`<img src="assets/${esc(p.portrait)}" alt="${esc(p.name)}" loading="lazy">`:'<div class="portrait-placeholder" role="img" aria-label="Sanah headshot to be supplied"><span>SBM</span><small>Her portrait, coming soon</small></div>';
 for(let i=0;i<2;i++){values['SONG_'+i]=esc(p.songs?.[i]);values['SONG_STORY_'+i]=paragraphs(p.songStories?.[i],'Her notes on this song will appear here.');}
 fs.writeFileSync(path.join(root,p.slug+'.html'),finish(fs.readFileSync(path.join(root,'templates',p.slug+'.html'),'utf8'),values));
}
const homeValues={REVIEW_BANNER:banner};for(const p of profiles)if(p.album)homeValues['ALBUM_'+p.slug]=esc(p.album);
fs.writeFileSync(path.join(root,'index.html'),finish(fs.readFileSync(path.join(root,'templates/index.html'),'utf8'),homeValues));
fs.writeFileSync(path.join(root,'event-data.js'),'window.EVENT_DATA = '+JSON.stringify({downloadUrls:site.downloadUrls,people:profiles},null,2)+';\n');
console.log('Built selected website: home + '+profiles.length+' profiles. Publication: OFF.');
