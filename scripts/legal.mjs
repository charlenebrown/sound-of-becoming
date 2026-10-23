import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=JSON.parse(fs.readFileSync(path.join(root,'content/legal.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const header=source.match(/<header class="site-nav">[\s\S]*?<\/header>/)[0];
const footer='<footer><span>© 2026 Brand Misfit™ Media. Rights remain with their respective owners.</span><nav class="legal-links" aria-label="Legal"><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms of use</a><a href="music-rights.html">Music rights + permissions</a></nav></footer>';
for(const [slug,p] of Object.entries(pages)){
 const sections=p.sections.map(([title,body])=>'<section><h2>'+title+'</h2><p>'+body+'</p></section>').join('');
 fs.writeFileSync(path.join(root,slug+'.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+p.title+' · The Sound of Becoming</title><link rel="stylesheet" href="style.css"></head><body class="listening-room"><a class="skip" href="#main">Skip to content</a>'+header+'<div class="motion-toolbar"><button type="button" class="motion-toggle" aria-pressed="false">Pause motion</button></div><main id="main" class="legal-main"><a href="index.html">← Return to the circle</a><h1>'+p.title+'</h1><p class="legal-date">Last updated October 23, 2026</p><p class="'+(slug==='music-rights'?'rights-callout':'')+'">'+p.intro+'</p>'+sections+'</main>'+footer+'<script src="event-data.js"></script><script src="site.js"></script></body></html>');
}
