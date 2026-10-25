import fs from 'node:fs';
import path from 'node:path';
export function applyEventFooter(root){
 const footer='<footer class="event-footer"><nav class="footer-menu legal-links" aria-label="Footer navigation"><a href="index.html">Return to the circle ↑</a><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms of use</a><a href="music-rights.html">Music rights + permissions</a></nav><div class="footer-identity"><a class="footer-brand" href="index.html" aria-label="The Sound of Becoming home"><img src="assets/event-circles.svg" width="66" height="64" alt=""><span>The Sound of Becoming</span></a><p>5 women, 5 stories, 1 unforgettable night.</p></div><div class="footer-copyright"><p>© 2026 Brand Misfit™ Media. All rights reserved.</p><p>Website created by <a href="https://bklyncustomdesigns.com/">Bklyn Custom Designs®</a>.</p></div></footer>';
 for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
  const p=path.join(root,name);let h=fs.readFileSync(p,'utf8').replace(/<footer[\s\S]*?<\/footer>/,footer);
  // Keep the final two words together in prose, without forcing whole paragraphs onto one line.
  h=h.replace(/(<(?:p|h[1-6]|li|figcaption)[^>]*>)([\s\S]*?)(<\/(?:p|h[1-6]|li|figcaption)>)/g,(_,a,b,c)=>a+b.replace(/([^\s<>]+)[ \t]+([^\s<>]+)((?:\s*<\/[^>]+>)*\s*)$/, '$1\u00a0$2$3')+c);
  h=h.replace(/<a\b([^>]*?)href="(https?:[^"]+|mailto:[^"]+|downloads\/[^"]+\.pdf)"([^>]*)>/g,(_,before,url,after)=>'<a'+before+'href="'+url+'"'+(after.replace(/\s+(?:target|rel)="[^"]*"/g,''))+' target="_blank" rel="noopener noreferrer">');
  fs.writeFileSync(p,h);
 }
}
