import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const profiles=JSON.parse(fs.readFileSync(path.join(root,'content/profiles.json'),'utf8'));const site=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));const missing=[];
const urlOK=v=>{try{return new URL(v).protocol==='https:'}catch{return false}};
for(const p of profiles){const m=[];if(!p.approved)m.push('final profile approval (existing bio is draft)');if(!p.bio)m.push('bio');if(!p.portrait)m.push('headshot');if(!urlOK(p.connectUrl))m.push('preferred website/social URL');
 if(p.album){if(!p.purpose)m.push('full album reason/purpose');if(!p.albumTitleConfirmed)m.push('confirmed album title');if(!p.songTitlesConfirmed)m.push('confirmed song titles/order');if(!p.songStories?.[0]||!p.songStories?.[1])m.push('two song stories');for(const [platform,url] of Object.entries(p.listen||{}))if(!urlOK(url)&&url!==false)m.push(platform+' album link (or explicit false if unavailable)');}
 else if(!p.services)m.push('how to work with Sanah');
 if(m.length)missing.push(p.name+': '+m.join('; '));}
if(!urlOK(site.downloadUrls.program))missing.push('Shared: program download URL');if(!site.downloadsVerified)missing.push('Shared: final keepsake/program files and signed-out Drive access verification');if(!site.approved||!site.publishReady)missing.push('Shared: editorial approval and requested public-release readiness');
if(missing.length){console.log('WAITING FOR CONTENT — not ready for publication\n'+missing.map(x=>'• '+x).join('\n'));if(process.argv.includes('--require-ready'))process.exit(1)}else console.log('Content fields complete. Visibility/hosting still require a separate authorized action.');
