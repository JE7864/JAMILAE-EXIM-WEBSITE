(() => {
'use strict';
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canvases = [...document.querySelectorAll('.live-art canvas')];
const state = canvases.map(canvas => ({canvas, ctx:canvas.getContext('2d'), w:0, h:0}));
let frame=0, visible=true;
const tau=Math.PI*2;
function line(ctx, points, color, width=1) {
 ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
 ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function dot(ctx,x,y,r,color) {ctx.beginPath();ctx.arc(x,y,r,0,tau);ctx.fillStyle=color;ctx.fill();}
function ai(ctx,t) {
 const layers=[[-137,[-53,0,53]],[-72,[-76,-26,26,76]],[0,[-63,0,63]],[72,[-76,-26,26,76]],[137,[-53,0,53]]];
 const glow=ctx.createRadialGradient(0,0,5,0,0,160);glow.addColorStop(0,'#4ad9eb20');glow.addColorStop(1,'#4ad9eb00');ctx.fillStyle=glow;ctx.fillRect(-185,-110,370,220);
 layers.slice(0,-1).forEach((layer,l)=>{
  layer[1].forEach((y,a)=>layers[l+1][1].forEach((yy,b)=>{
   const x=layer[0],xx=layers[l+1][0],phase=(t*.33+l*.24+a*.19+b*.13)%1;
   line(ctx,[[x,y],[xx,yy]],'rgba(74,217,235,.16)',.7);
   if((a+b+l)%2===0){
    const px=x+(xx-x)*phase,py=y+(yy-y)*phase;
    line(ctx,[[px-(xx-x)*.09,py-(yy-y)*.09],[px,py]],'rgba(138,224,189,.65)',1.4);
    dot(ctx,px,py,1.8,'#b9fff2');
   }
  }));
 });
 layers.forEach(([x,ys],l)=>ys.forEach((y,i)=>{
  const p=(Math.sin(t*2.2-l*.8-i*1.4)+1)/2;
  ctx.beginPath();ctx.arc(x,y,6+p*4,0,tau);ctx.strokeStyle='rgba(74,217,235,'+(.12+p*.2)+')';ctx.lineWidth=.7;ctx.stroke();
  dot(ctx,x,y,3+p,'#4ad9eb');dot(ctx,x,y,1.4,'#e1fff7');
 }));
 // Processing core.
 ctx.save();ctx.rotate(t*.18);for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,0,24+i*4,i*1.6,i*1.6+.9);ctx.strokeStyle=i%2?'#8ae0bd80':'#4ad9eb80';ctx.lineWidth=1;ctx.stroke();}ctx.restore();
 ctx.fillStyle='#9dcbd6';ctx.font='8px Manrope, sans-serif';ctx.textAlign='center';ctx.fillText('NEURAL INTELLIGENCE',0,104);
}
const continents=[
 [[-168,68],[-140,70],[-122,53],[-126,40],[-110,28],[-97,19],[-82,25],[-80,43],[-60,52],[-55,65],[-85,73],[-120,73]],
 [[-80,11],[-64,10],[-48,-1],[-36,-8],[-43,-23],[-55,-36],[-69,-54],[-77,-22]],
 [[-17,36],[9,37],[34,30],[51,11],[40,-12],[28,-34],[17,-35],[9,-15],[-8,5],[-17,20]],
 [[-10,36],[-10,58],[10,71],[35,69],[58,55],[90,75],[140,70],[179,54],[145,43],[124,23],[107,5],[98,9],[79,8],[67,24],[43,30],[30,42],[12,45]],
 [[113,-12],[135,-10],[153,-25],[145,-39],[117,-34]],
 [[-53,60],[-42,60],[-20,76],[-42,83],[-60,75]]
];
function vector(lon,lat){lon*=Math.PI/180;lat*=Math.PI/180;return [Math.cos(lat)*Math.sin(lon),-Math.sin(lat),Math.cos(lat)*Math.cos(lon)];}
const hubs=[[-74,41],[-.1,51],[55,25],[73,19],[104,1],[121,31],[151,-34],[-46,-24]].map(p=>vector(...p));
const routes=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,5],[1,3]];
function globe(ctx,t) {
 const angle=t*.15,r=87;
 function project(v,lift=1){const x=v[0]*Math.cos(angle)+v[2]*Math.sin(angle),z=v[2]*Math.cos(angle)-v[0]*Math.sin(angle);return [x*r*lift,v[1]*r*lift,z];}
 function curve(vs,color,width=1){let segment=[];for(const v of vs){const p=project(v);if(p[2]>-.03)segment.push(p);else {if(segment.length>1)line(ctx,segment,color,width);segment=[];}}if(segment.length>1)line(ctx,segment,color,width);}
 const halo=ctx.createRadialGradient(0,0,55,0,0,123);halo.addColorStop(0,'#d9bb8000');halo.addColorStop(.72,'#d9bb8012');halo.addColorStop(1,'#d9bb8000');ctx.fillStyle=halo;ctx.fillRect(-130,-125,260,250);
 dot(ctx,0,0,r,'#1b211e');
 for(let lat=-60;lat<=60;lat+=30)curve(Array.from({length:145},(_,i)=>vector(i*2.5-180,lat)),'#d9bb802b',.6);
 for(let lon=-180;lon<180;lon+=30)curve(Array.from({length:73},(_,i)=>vector(lon,i*2.5-90)),'#d9bb802b',.6);
 continents.forEach(poly=>{
  const pts=[];poly.forEach((p,i)=>{const next=poly[(i+1)%poly.length];for(let j=0;j<12;j++)pts.push(vector(p[0]+(next[0]-p[0])*j/12,p[1]+(next[1]-p[1])*j/12));});pts.push(pts[0]);curve(pts,'#d9bb8099',1.1);
 });
 routes.forEach(([a,b],i)=>{
  const va=hubs[a],vb=hubs[b];
  function point(f){const v=va.map((n,k)=>n*(1-f)+vb[k]*f),norm=Math.hypot(...v);return project(v.map(n=>n/norm),1+Math.sin(Math.PI*f)*.3);}
  let seg=[];for(let j=0;j<=55;j++){const p=point(j/55);if(p[2]>0)seg.push(p);else{if(seg.length>1)line(ctx,seg,'#e7c77e38',.7);seg=[];}}if(seg.length>1)line(ctx,seg,'#e7c77e38',.7);
  const f=(t*.12+i*.137)%1,p=point(f);
  if(p[2]>0){const q=point(Math.max(0,f-.035));line(ctx,[q,p],'#ffe2a7',1.8);dot(ctx,p[0],p[1],2,'#fff0cd');}
 });
 hubs.forEach((v,i)=>{const p=project(v);if(p[2]>0){dot(ctx,p[0],p[1],2.2,'#ffe1a0');ctx.beginPath();ctx.arc(p[0],p[1],4+((t*.6+i*.2)%1)*6,0,tau);ctx.strokeStyle='#e7c77e55';ctx.lineWidth=.7;ctx.stroke();}});
 ctx.beginPath();ctx.arc(0,0,r,0,tau);ctx.strokeStyle='#e7c77e66';ctx.lineWidth=.8;ctx.stroke();
 ctx.fillStyle='#c7b68d';ctx.font='8px Manrope, sans-serif';ctx.textAlign='center';ctx.fillText('CONNECTED ACROSS BORDERS',0,112);
}
function draw(ms) {
 const t=motion.matches?3:ms/1000;
 state.forEach(s=>{if(!s.ctx||!s.w||!s.h)return;const {ctx,w,h}=s,dpr=Math.min(window.devicePixelRatio||1,2);
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.translate(w/2,h/2);const scale=Math.min(w/370,h/240);ctx.scale(scale,scale);
 (s.canvas.dataset.scene==='ai'?ai:globe)(ctx,t);
 });
 frame=0;if(visible&&!motion.matches)frame=requestAnimationFrame(draw);
}
function start(){if(!frame)frame=requestAnimationFrame(draw);}
const observer=new ResizeObserver(entries=>{entries.forEach(entry=>{const s=state.find(x=>x.canvas===entry.target);if(!s)return;s.w=entry.contentRect.width;s.h=entry.contentRect.height;const dpr=Math.min(window.devicePixelRatio||1,2);s.canvas.width=Math.round(s.w*dpr);s.canvas.height=Math.round(s.h*dpr);});start();});
state.forEach(s=>observer.observe(s.canvas));
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible){cancelAnimationFrame(frame);frame=0;}else start();});
motion.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;start();});
})();