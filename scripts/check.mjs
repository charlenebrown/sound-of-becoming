import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const profiles=JSON.parse(fs.readFileSync(path.join(root,'content/profiles.json'),'utf8'));
const files=['index.html','program.html','privacy.html','terms.html','music-rights.html',...profiles.map(p=>p.slug+'.html')];const failures=[];
for(const name of files){const html=fs.readFileSync(path.join(root,name),'utf8');if(html.includes('{{'))failures.push(name+': unrendered field');for(const [,v] of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(?:https?:|mailto:|#)/.test(v))continue;const local=decodeURIComponent(v.split('#')[0].split('?')[0]);if(local&&!fs.existsSync(path.resolve(root,local)))failures.push(name+': missing '+v);}
 const p=profiles.find(p=>p.slug+'.html'===name);if(!p)continue;
 if(p.album){const hero=html.indexOf('class="profile-hero"'),album=html.indexOf('class="album-access"'),story=html.indexOf('class="story-layout"');if(!(hero<album&&album<story))failures.push(name+': wrong album section placement');if((html.match(/data-platform(?:-pending)?="Spotify"/g)||[]).length!==2)failures.push(name+': expected both album link sets');}
 else if(/data-platform=|class="album-access"|class="featured-songs"/.test(html))failures.push(name+': producer has album content');
}
if(fs.existsSync(path.join(root,'.github/workflows')))failures.push('Unexpected workflow directory: publishing remains manual.');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}console.log('PASS: 11 pages; local links/assets; two album sections per songwriter; producer separation; no deployment workflows.');
