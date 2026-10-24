import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const profiles=JSON.parse(fs.readFileSync(path.join(root,'content/profiles.json'),'utf8'));
const site=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const paragraphs=(value,fallback)=>String(value||fallback).split(/\n\s*\n/).filter(Boolean).map(v=>`<p${value?'':' class="placeholder-copy"'}>${esc(v).replaceAll('\n','<br>')}</p>`).join('');
const inline=value=>esc(value).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/(?<!\*)\*([^*]+)\*(?!\*)/g,'<em>$1</em>');
const richParagraphs=value=>String(value||'').split(/\n\s*\n/).filter(Boolean).map(v=>'<p>'+inline(v).replaceAll('\n','<br>')+'</p>').join('');
const publicReady=site.publishReady===true&&site.approved===true&&profiles.every(p=>p.approved===true);
const banner=publicReady?'':'<div class="review-strip">EVENT WEBSITE PREVIEW</div>';
function finish(template,values){
 let html=template.replace(/\{\{([A-Za-z0-9_\-]+)\}\}/g,(_,key)=>{if(!(key in values))throw new Error('Unknown template field '+key);return values[key]});
 if(publicReady)html=html.replace('<meta name="robots" content="noindex,nofollow">','');
 return html;
}
const platformIcons={'Spotify':'spotify.svg','Apple Music':'applemusic.svg','Amazon Music':'amazonmusic.svg','YouTube Music':'youtubemusic.svg','iHeart Radio':'iheartradio.svg','Tidal':'tidal.svg','Deezer':'deezer.svg'};
function albumPlatforms(p){return '<div class="platform-links">'+Object.entries(p.listen||{}).filter(([name,url])=>url&&platformIcons[name]).map(([name,url])=>'<a data-platform="'+esc(name)+'" href="'+esc(url)+'" aria-label="Listen to '+esc(p.album)+' on '+esc(name)+'"><img class="platform-icon" src="assets/platforms/'+platformIcons[name]+'" alt="" aria-hidden="true"><span class="platform-label">'+esc(name)+' ↗</span></a>').join('')+'</div>';}
for(const p of profiles){
 const values={ALBUM_PLATFORM_LINKS:albumPlatforms(p),REVIEW_BANNER:banner,BIO:richParagraphs(p.bioMarkdown||p.bio||'Sanah’s approved biography will appear here.'),BIO_STATUS:(p.bio||p.approved||p.bioApproved)?'':'<p class="small review-note">Biography shown as a layout draft.<br>Final copy and links are pending.</p>',PURPOSE:paragraphs(p.album?p.purpose:p.services,p.album?'Her full reason and purpose statement will appear here in her own words.':'Sanah’s approved collaboration details will appear here.'),PURPOSE_STATUS:(p.album?p.purpose:p.services)?'':'<span class="draft-tag">Awaiting her final statement</span>',ALBUM:esc(p.album),SONG_STATUS:p.songTitlesConfirmed?'':'<small>Song titles and presentation awaiting final confirmation.</small>'};
 values.CONNECT_LINKS=(p.connections||[]).map(c=>{let u;try{u=new URL(c.url)}catch{return ''}if(!['https:','mailto:'].includes(u.protocol))return '';return '<a class="button" href="'+esc(c.url)+'">'+esc(c.label)+' ↗</a>'}).filter(Boolean).join('<span class="contact-separator" aria-hidden="true"> ∙ </span>');
 values.PORTRAIT=p.portrait?`<img src="assets/${esc(p.portrait)}" alt="${esc(p.name)}" loading="lazy">`:'<div class="portrait-placeholder" role="img" aria-label="Sanah headshot to be supplied"><span>SBM</span><small>Her portrait, coming soon</small></div>';
 for(let i=0;i<2;i++){values['SONG_'+i]=esc(p.songs?.[i]);values['SONG_STORY_'+i]=p.songStories?.[i]?paragraphs(p.songStories[i],''):'';}
 fs.writeFileSync(path.join(root,p.slug+'.html'),finish(fs.readFileSync(path.join(root,'templates',p.slug+'.html'),'utf8'),values));
}
const programVisible=site.programVisible===true;
const programSection=programVisible?'<section class="program-section" id="program"><div><p class="eyebrow">THE EVENING</p><h2>The evening<br>unfolds.</h2><p>Five stories. A shared vision.</p></div><div><a class="button" href="program.html">View the evening program ↗</a></div></section>':'';
const homeValues={REVIEW_BANNER:banner,PROGRAM_SECTION:programSection,PROGRAM_DOWNLOAD_LINK:programVisible?'<a class="button secondary" href="program.html">View the evening program ↗</a><a class="button secondary" href="https://bklyncustomdesigns.com/sob-program">Download the program PDF ↗</a>':''};for(const p of profiles)if(p.album)homeValues['ALBUM_'+p.slug]=esc(p.album);
fs.writeFileSync(path.join(root,'index.html'),finish(fs.readFileSync(path.join(root,'templates/index.html'),'utf8'),homeValues));
fs.writeFileSync(path.join(root,'event-data.js'),'window.EVENT_DATA = '+JSON.stringify({downloadUrls:site.downloadUrls,people:profiles},null,2)+';\n');
console.log('Built website: home + '+profiles.length+' profiles. Final approved copy: '+publicReady+'.');

const programPath=path.join(root,'program.html');
const pdfPath=path.join(root,'downloads','Sound of Becoming Event Program.pdf');
if(site.programVisible===true){
 let program=fs.readFileSync(path.join(root,'templates/program.html'),'utf8');
 if(publicReady)program=program.replace('<meta name="robots" content="noindex,nofollow">','');
 fs.writeFileSync(programPath,program);
 const source=path.join(root,'content','program.pdf');
 if(fs.existsSync(source)){fs.mkdirSync(path.dirname(pdfPath),{recursive:true});fs.copyFileSync(source,pdfPath);}
}else{
 fs.writeFileSync(programPath,'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>The circle continues</title><body><main><h1>The circle continues.</h1><p>The event program is no longer available.</p><a href="index.html">Explore the stories and keepsake</a></main></body></html>');
 if(fs.existsSync(pdfPath))fs.unlinkSync(pdfPath);
}

await import('./legal.mjs');

const {applyEventFooter}=await import('./footer.mjs');
applyEventFooter(root);

// Refresh cached assets whenever their content changes.
const {createHash}=await import('node:crypto');
const versions=Object.fromEntries(['style.css','site.js','event-data.js'].map(name=>[name,createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex').slice(0,12)]));
for(const name of fs.readdirSync(root).filter(name=>name.endsWith('.html'))){const file=path.join(root,name);const html=fs.readFileSync(file,'utf8').replace(/(src|href)="(style\.css|site\.js|event-data\.js)(?:\?v=[^"]*)?"/g,(_,attr,asset)=>attr+'="'+asset+'?v='+versions[asset]+'"');fs.writeFileSync(file,html);}
