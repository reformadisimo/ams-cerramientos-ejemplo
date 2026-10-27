/* Render realista de ventanas para el configurador (sustituye a los dibujos en pantalla). */
(function(){
'use strict';
var N=0;
function hex(c){c=c.replace('#','');return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function mix(a,b,t){var x=hex(a),y=hex(b);return '#'+[0,1,2].map(function(i){return ('0'+Math.round(x[i]+(y[i]-x[i])*t).toString(16)).slice(-2);}).join('');}
var BASE={blanco:'#F4F4F1',color:'#3B4045',bicolor:'#F4F4F1',madera:'#7A4A27',negro:'#1F2022'};
var f2=function(n){return Math.round(n*100)/100;};
function R(x,y,w,h,a){return '<rect x="'+f2(x)+'" y="'+f2(y)+'" width="'+f2(Math.max(0,w))+'" height="'+f2(Math.max(0,h))+'" '+(a||'')+'/>';}
function band(x,y,w,h,t,fill,extra){ /* marco hueco: rectangulo menos interior */
 var o='M'+f2(x)+' '+f2(y)+'h'+f2(w)+'v'+f2(h)+'h'+f2(-w)+'z',i='M'+f2(x+t)+' '+f2(y+t)+'v'+f2(h-2*t)+'h'+f2(w-2*t)+'v'+f2(-(h-2*t))+'z';
 return '<path d="'+o+i+'" fill-rule="evenodd" fill="'+fill+'" '+(extra||'')+'/>';
}
function bevel(x,y,w,h,t,id){ /* luces y sombras del perfil */
 return '<path d="M'+f2(x)+' '+f2(y+h)+'V'+f2(y)+'H'+f2(x+w)+'l'+f2(-t)+' '+f2(t)+'H'+f2(x+t)+'V'+f2(y+h-t)+'z" fill="#fff" opacity=".28"/>'+
  '<path d="M'+f2(x+w)+' '+f2(y)+'V'+f2(y+h)+'H'+f2(x)+'l'+f2(t)+' '+f2(-t)+'H'+f2(x+w-t)+'V'+f2(y+t)+'z" fill="#000" opacity=".16"/>'+
  R(x+t-.6,y+t-.6,w-2*t+1.2,h-2*t+1.2,'fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".8"');
}

function real(it,opt){
 opt=opt||{};var scene=!!opt.scene,id='r'+(++N);
 if(it.tipo==='techo')return techo(it,scene,id);
 if(it.tipo==='claraboya')return clara(it,scene,id);
 var VW=scene?400:300,VH=scene?400:240;
 var floor=it.tipo==='balconera'||(it.tipo==='corredera'&&it.h>=180);
 var bg=scene&&opt.bg,ext=!!opt.ext;
 var persH=it.pers&&it.pers!=='no'?20:0, sill=scene&&!floor&&!bg?30:0;
 var sc=scene?(bg?Math.min(250/it.w,(floor?300:250)/(it.h+persH),1.45):Math.min(300/it.w,(330-24)/(it.h+sill+persH),1.7)):Math.min(250/it.w,200/(it.h+persH));
 var W=it.w*sc,H=it.h*sc,x=(VW-W)/2,ground=scene?(bg?VH*.87:360):VH-12,y=scene?(bg&&!floor?VH*.44-(H-persH*sc)/2:ground-sill*sc-H):(VH-(H+persH*sc))/2+persH*sc;
 var colK=ext&&it.col==='bicolor'?'color':it.col;
 var base=BASE[colK]||BASE.blanco,lt=mix(base,'#ffffff',.38),dk=mix(base,'#000000',.22);
 var hand=colK==='blanco'||colK==='bicolor'?'#E9EBEC':'#2A2C2E',handE=colK==='blanco'||colK==='bicolor'?'#A9B0B6':'#000';
 var s='<svg viewBox="0 0 '+VW+' '+VH+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
  '<linearGradient id="'+id+'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lt+'"/><stop offset=".5" stop-color="'+base+'"/><stop offset="1" stop-color="'+dk+'"/></linearGradient>'+
  '<linearGradient id="'+id+'r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".42"/><stop offset=".56" stop-color="#fff" stop-opacity=".1"/><stop offset=".62" stop-color="#fff" stop-opacity=".3"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
  '<pattern id="'+id+'q" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><path d="M0 0H2.2M0 0V2.2" stroke="#3A4148" stroke-width=".35"/></pattern>'+
  '<pattern id="'+id+'l" width="10" height="'+f2(Math.max(3,4.2*sc))+'" patternUnits="userSpaceOnUse"><rect width="10" height="'+f2(Math.max(3,4.2*sc))+'" fill="'+(it.col==='blanco'||it.col==='bicolor'?'#E4E6E6':mix(base,'#ffffff',.12))+'"/><rect width="10" height=".9" fill="#000" opacity=".18"/></pattern>'+
  '<filter id="'+id+'b"><feGaussianBlur stdDeviation="'+(it.vid==='mate'?4:0)+'"/></filter>'+
  '<filter id="'+id+'s" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>'+
  (it.col==='madera'?'<pattern id="'+id+'w" width="60" height="9" patternUnits="userSpaceOnUse"><path d="M0 2 Q15 0 30 2.5 T60 2M0 6 Q20 4.5 40 6.5 T60 6" stroke="#3B200D" stroke-width=".7" fill="none" opacity=".45"/></pattern>':'')+
  '</defs>';
 // Fondo
 if(scene&&bg){
  s+='<image href="'+bg+'" x="0" y="0" width="'+VW+'" height="'+VH+'" preserveAspectRatio="xMidYMid slice"/>';
  s+=R(x-5*sc-4,y-persH*sc-5*sc,W+10*sc+8,H+persH*sc+5*sc+(floor?0:5),'fill="#000" opacity=".14"');
 } else if(scene){
  s+=R(0,0,VW,VH,'fill="'+(ext?'#E2D3BD':'#ECE8E1')+'"')+R(0,ground,VW,VH-ground,'fill="'+(ext?'#A9AEB2':'#C9A982')+'"')+R(0,ground,VW,3,'fill="#000" opacity=".08"');
  if(ext){for(var r=0;r<ground;r+=14)s+=R(0,r,VW,.8,'fill="#B9A685" opacity=".55"');}
  else for(var k=0;k<6;k++)s+=R(0,ground+8+k*7,VW,.6,'fill="#8F6E4D" opacity=".35"');
  s+=R(x-4*sc-6,y-persH*sc-6*sc,W+8*sc+12,H+persH*sc+6*sc+(floor?0:6),'fill="#D9D3C9"');
 } else {
  s+='<ellipse cx="'+(VW/2)+'" cy="'+(y+H+6)+'" rx="'+(W*.55)+'" ry="7" fill="#12202B" opacity=".18" filter="url(#'+id+'s)"/>';
 }
 // Cajon de persiana
 if(persH){var bh=persH*sc;s+=R(x-1,y-bh,W+2,bh,'rx="1.5" fill="url(#'+id+'f)"')+bevel(x-1,y-bh,W+2,bh,Math.min(3,bh*.25));}
 // Cristal (una sola imagen detras de todas las hojas, para que la vista sea continua)
 var f=Math.max(4,6.5*sc),t=Math.max(3.5,6*sc),gx=x+f,gy=y+f,gw=W-2*f,gh=H-2*f;
 var n=it.hojas||1,panes=[],mull=it.tipo==='fijo'?0:0;
 var fy0=gy,fh0=gh,tr=null;
 if(it.fijo==='sup'||it.fijo==='inf'){var th=Math.min(40,it.h*.28)*sc;tr=it.fijo==='sup'?{y:gy,h:th}:{y:gy+gh-th,h:th};if(it.fijo==='sup'){fy0=gy+th;fh0=gh-th;}else{fh0=gh-th;}}
 var hw=gw/n;
 for(var i=0;i<n;i++){var a=(it.aper||[])[i]||'fija',px=gx+i*hw,pw=hw;
  if(it.tipo==='corredera'){px=gx+i*hw-(i?t*.5:0);pw=hw+(i&&i<n-1?t:t*.5);}
  panes.push({x:px,y:fy0,w:pw,h:fh0,a:a,i:i});}
 s+='<clipPath id="'+id+'c">'+R(gx,gy,gw,gh)+'</clipPath>';
 var tint={doble:'#9CC3DB',bajoe:'#9CC6D6',solar:'#8C7E60',mate:'#FFFFFF',acustico:'#9FC0D8',seguridad:'#A6C4D8',triple:'#93BBCF'}[it.vid]||'#9CC3DB';
 s+='<g clip-path="url(#'+id+'c)"><image href="/img/vista-exterior.jpg" x="'+f2(gx-gw*.05)+'" y="'+f2(gy-gh*.05)+'" width="'+f2(gw*1.1)+'" height="'+f2(gh*1.1)+'" preserveAspectRatio="xMidYMid slice" filter="url(#'+id+'b)"/>'+
  R(gx,gy,gw,gh,'fill="'+tint+'" opacity="'+(it.vid==='mate'?.62:it.vid==='solar'?.38:.2)+'"')+R(gx,gy,gw,gh,'fill="url(#'+id+'r)"')+'</g>';
 // Persiana medio bajada
 if(persH){s+=R(gx,gy,gw,gh*.28,'fill="url(#'+id+'l)"')+R(gx,gy+gh*.28-1.5,gw,2.2,'fill="'+dk+'"');}
 // Mosquitera
 if(it.mosq&&it.mosq!=='no')s+=R(gx,gy,gw,gh,'fill="url(#'+id+'q)" opacity=".38"');
 // Marco exterior
 s+=band(x,y,W,H,f,'url(#'+id+'f)')+(it.col==='madera'?band(x,y,W,H,f,'url(#'+id+'w)'):'')+bevel(x,y,W,H,f);
 // Fijo superior o inferior
 if(tr){var by=it.fijo==='sup'?tr.y+tr.h-t*.5:tr.y-t*.5;s+=R(gx,by,gw,t,'fill="url(#'+id+'f)"')+R(gx,by,gw,1,'fill="#fff" opacity=".3"')+R(gx,by+t-1,gw,1,'fill="#000" opacity=".2"');}
 // Hojas
 panes.forEach(function(p){
  if(p.a==='fija'&&it.tipo!=='fijo'){s+=R(p.x,p.y,p.w,p.h,'fill="none" stroke="'+dk+'" stroke-width="'+f2(Math.max(1.5,t*.45))+'"');return;}
  if(it.tipo==='fijo'){s+=R(p.x+.5,p.y+.5,p.w-1,p.h-1,'fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1"');return;}
  var ox=p.x,ow=p.w,oy=p.y,oh=p.h;
  if(it.tipo==='corredera'){oy+= (p.i%2?0:1.5);oh-=1.5;}
  s+=band(ox,oy,ow,oh,t,'url(#'+id+'f)')+(it.col==='madera'?band(ox,oy,ow,oh,t,'url(#'+id+'w)'):'')+bevel(ox,oy,ow,oh,t);
  var hingeLeft=n===1||p.i<n/2,cy=oy+oh*(it.tipo==='balconera'?.48:.5);
  if(ext)return;
  if(p.a==='practicable'||p.a==='osc'){
   var hx=hingeLeft?ox+ow-t*.5:ox+t*.5,L=Math.max(9,13*sc);
   s+=R(hx-2.2,cy-L*.35,4.4,L*.7,'rx="2" fill="'+hand+'" stroke="'+handE+'" stroke-width=".6"')+R(hx-1.6,cy-1,3.2,L,'rx="1.6" fill="'+hand+'" stroke="'+handE+'" stroke-width=".6"');
   var st='stroke="'+(it.col==='blanco'?'#4A5A68':'#fff')+'" stroke-opacity=".45" stroke-width=".8" fill="none" stroke-dasharray="3 2.5"';
   var ix=ox+t,iw=ow-2*t,iy=oy+t,ih=oh-2*t,c1=hingeLeft?ix+iw:ix,c2=hingeLeft?ix:ix+iw;
   s+='<path d="M'+f2(c1)+' '+f2(iy)+'L'+f2(c2)+' '+f2(iy+ih/2)+'L'+f2(c1)+' '+f2(iy+ih)+'" '+st+'/>';
   if(p.a==='osc')s+='<path d="M'+f2(ix)+' '+f2(iy)+'L'+f2(ix+iw/2)+' '+f2(iy+ih)+'L'+f2(ix+iw)+' '+f2(iy)+'" '+st+'/>';
  }
  if(p.a==='corredera'){var hx2=p.i%2?ox+t*.5:ox+ow-t*.5;s+=R(hx2-1.8,cy-Math.max(8,12*sc)/2,3.6,Math.max(8,12*sc),'rx="1.8" fill="'+hand+'" stroke="'+handE+'" stroke-width=".6"');}
 });
 if(n>1&&it.tipo!=='corredera'){for(var j=1;j<n;j++){var mx=gx+j*hw;s+=R(mx-.6,gy,1.2,gh,'fill="#000" opacity=".25"');}}
 // Alfeizar
 if(scene&&!floor&&!bg)s+=R(x-10,y+H,W+20,7,'fill="'+(ext?'#CFC6B8':'#E9E5DE')+'"')+R(x-10,y+H+7,W+20,2.5,'fill="#000" opacity=".12"');
 if(scene&&floor)s+=R(x-3,y+H-2,W+6,4,'fill="#9AA0A6"');
 if(opt.label!==false&&scene)s+='<text x="'+(VW/2)+'" y="'+f2(Math.max(16,y-(persH?persH*sc:0)-10))+'" font-size="13" font-weight="700" text-anchor="middle" fill="'+(bg?'#fff':'#4A5A68')+'" '+(bg?'style="paint-order:stroke" stroke="rgba(0,0,0,.45)" stroke-width="3"':'')+' font-family="Inter,sans-serif">'+Math.round(it.w)+' × '+Math.round(it.h)+' cm</text>';
 return s+'</svg>';
}

function techo(it,scene,id){
 var p=it.talla.split('x'),w=+p[0],h=+p[1],VW=scene?400:300,VH=scene?400:240;
 var sc=scene?Math.min(220/114,260/140):Math.min(150/114,190/140),W=w*sc,H=h*sc,x=(VW-W)/2,y=(VH-H)/2+(scene?0:-4);
 var s='<svg viewBox="0 0 '+VW+' '+VH+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
  '<pattern id="'+id+'t" width="34" height="20" patternUnits="userSpaceOnUse"><rect width="34" height="20" fill="#B5553A"/><path d="M0 20 Q8.5 8 17 20 Q25.5 8 34 20" fill="#C8674A"/><path d="M0 20 Q8.5 8 17 20 Q25.5 8 34 20" fill="none" stroke="#7E3523" stroke-width="1"/></pattern>'+
  '<linearGradient id="'+id+'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E757B"/><stop offset="1" stop-color="#3F454A"/></linearGradient>'+
  '<linearGradient id="'+id+'r" x1="0" y1="0" x2="1" y2="1"><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
  '<clipPath id="'+id+'c">'+R(x+9,y+9,W-18,H-18)+'</clipPath></defs>';
 s+=R(0,0,VW,VH,'fill="url(#'+id+'t)"')+R(0,0,VW,VH,'fill="#000" opacity=".06"');
 s+=R(x-8,y-8,W+16,H+20,'rx="3" fill="#000" opacity=".25"')+R(x-6,y-6,W+12,H+14,'rx="3" fill="url(#'+id+'g)"');
 s+=R(x,y,W,H,'rx="2" fill="#4E555B"')+'<g clip-path="url(#'+id+'c)"><image href="/img/vista-exterior.jpg" x="'+(x-20)+'" y="'+(y-H*.6)+'" width="'+(W+40)+'" height="'+(H*1.6)+'" preserveAspectRatio="xMidYMin slice"/>'+R(x,y,W,H,'fill="#9CC3DB" opacity=".35"')+R(x,y,W,H,'fill="url(#'+id+'r)"')+
  (it.persext?R(x,y,W,H*.62,'fill="#3B4045"')+R(x,y+H*.62-2,W,3,'fill="#222"'):'')+(it.estor?R(x,y+H*.62,W,H*.38,'fill="#F2EFEA" opacity=".85"'):'')+'</g>';
 s+=R(x+9,y+9,W-18,H-18,'fill="none" stroke="#2F3438" stroke-width="2"');
 if(it.aper==='proyectante')s+=R(x+W*.3,y+H-14,W*.4,5,'rx="2.5" fill="#D8DCDF"');else s+=R(x+W*.3,y+6,W*.4,5,'rx="2.5" fill="#D8DCDF"');
 if(it.acc!=='manual')s+='<g transform="translate('+(x+W-24)+' '+(y-20)+')">'+(it.acc==='solar'?R(0,0,30,12,'fill="#1C2B3A" stroke="#7FA6C9" stroke-width="1"')+'<path d="M7 0V12M15 0V12M23 0V12" stroke="#7FA6C9" stroke-width=".6"/>':R(0,0,18,12,'rx="2" fill="#2F3438"'))+'</g>';
 if(it.obra==='nuevo'&&scene)s+='<text x="'+(VW/2)+'" y="'+(VH-14)+'" font-size="12" font-weight="700" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif">Hueco nuevo en el tejado</text>';
 if(scene)s+='<text x="'+(VW/2)+'" y="'+(y-26)+'" font-size="13" font-weight="700" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif">'+w+' × '+h+' cm</text>';
 return s+'</svg>';
}

function clara(it,scene,id){
 var w=+it.talla,VW=scene?400:300,VH=scene?400:240,sc=scene?2.3:1.75,W=w*sc,cx=VW/2,base=scene?250:170;
 var s='<svg viewBox="0 0 '+VW+' '+VH+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
  '<linearGradient id="'+id+'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC9EA"/><stop offset="1" stop-color="#E6F1F8"/></linearGradient>'+
  '<radialGradient id="'+id+'d" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="#E3F0F8" stop-opacity=".7"/><stop offset="1" stop-color="#9FBFD3" stop-opacity=".75"/></radialGradient>'+
  '<linearGradient id="'+id+'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F4F5"/><stop offset="1" stop-color="#B9C0C6"/></linearGradient></defs>';
 s+=R(0,0,VW,base+6,'fill="url(#'+id+'sky)"')+R(0,base+6,VW,VH-base,'fill="#A7AEB4"')+R(0,base+6,VW,3,'fill="#000" opacity=".12"');
 for(var k=0;k<8;k++)s+=R(0,base+16+k*12,VW,.8,'fill="#8E959B" opacity=".5"');
 s+='<ellipse cx="'+cx+'" cy="'+(base+12)+'" rx="'+(W*.62)+'" ry="8" fill="#000" opacity=".18"/>';
 s+=R(cx-W/2,base-16,W,24,'fill="url(#'+id+'k)"')+R(cx-W/2,base-16,W,2,'fill="#fff"');
 s+='<path d="M'+(cx-W/2+4)+' '+(base-16)+' Q'+cx+' '+(base-16-W*.42)+' '+(cx+W/2-4)+' '+(base-16)+' Z" fill="url(#'+id+'d)" stroke="#8FAEC2" stroke-width="1.2"/>';
 s+='<path d="M'+(cx-W*.28)+' '+(base-22)+' Q'+(cx-W*.18)+' '+(base-16-W*.33)+' '+(cx+W*.02)+' '+(base-16-W*.36)+'" stroke="#fff" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>';
 if(it.acc==='electrica')s+=R(cx+W/2-26,base-11,18,9,'rx="2" fill="#2F3438"');
 if(scene)s+='<text x="'+cx+'" y="'+(base+50)+'" font-size="13" font-weight="700" text-anchor="middle" fill="#12202B" font-family="Inter,sans-serif">'+w+' × '+w+' cm'+(it.acc==='electrica'?' · eléctrica':' · fija')+'</text>';
 return s+'</svg>';
}
window.AMSRender={real:real};
})();
