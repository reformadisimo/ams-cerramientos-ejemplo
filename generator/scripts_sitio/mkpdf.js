const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:900,height:1200}});
await p.route('**/api/**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
await p.route('**/_vercel/**',r=>r.abort());
await p.goto('http://localhost:8123/guia-javi.html?yo=1',{waitUntil:'networkidle'});
await p.addStyleTag({content:'video,.rx,.fab,.up,.btn-detalle,summary.dtb,#flotante,.flot,.cookie,.visita-nota{display:none!important}'});

await p.emulateMedia({media:'print'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}window.scrollTo(0,0);document.querySelectorAll('img[loading]').forEach(i=>i.loading='eager')});await p.waitForTimeout(2500);
await p.pdf({path:process.argv[3],format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="width:100%;font-size:8px;color:#6B7A87;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>AMS Cerramientos · Guía para Javi</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',margin:{top:'14mm',bottom:'16mm',left:'12mm',right:'12mm'}});
await b.close()})()
