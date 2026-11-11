(()=>{'use strict';
const $=s=>document.querySelector(s),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const home=$('.home'),botanical=$('.botanical-stage');
const shadows=document.createElement('div');shadows.className='canopy-light';shadows.setAttribute('aria-hidden','true');shadows.innerHTML='<i></i><i></i><b></b>';botanical.prepend(shadows);
const podium=document.createElement('div');podium.className='object-plinth';podium.setAttribute('aria-hidden','true');podium.innerHTML='<i></i><b></b><span></span>';$('.objects').prepend(podium);
const ornament=document.createElement('div');ornament.className='friend-ornaments';ornament.setAttribute('aria-hidden','true');$('.friend-disc').append(ornament);
const glyphs=[
 '<path d="m24 3 5 16 16 5-16 5-5 16-5-16-16-5 16-5Z"/><circle cx="24" cy="24" r="5"/>',
 '<g><ellipse cx="24" cy="13" rx="5" ry="10"/><ellipse cx="24" cy="35" rx="5" ry="10"/><ellipse cx="13" cy="24" rx="10" ry="5"/><ellipse cx="35" cy="24" rx="10" ry="5"/><circle cx="24" cy="24" r="6"/></g>',
 '<path d="M24 24 7 8q22-7 17 16ZM24 24 40 7q9 22-16 17ZM24 24l17 16q-22 9-17-16ZM24 24 8 41Q0 19 24 24Z"/><circle cx="24" cy="24" r="3"/>',
 '<ellipse cx="24" cy="24" rx="21" ry="8" transform="rotate(-32 24 24)"/><circle cx="24" cy="24" r="12"/><path d="m35 4 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/>',
 '<path d="m24 4 17 10v20L24 44 7 34V14Z"/><circle cx="24" cy="24" r="9"/>',
 '<path d="M24 43V23M24 29Q3 28 7 9q17 0 17 20Zm0-6Q26 3 43 7q2 18-19 16Z"/>'
];
function ornaments(i=0,animate=true){ornament.innerHTML=[0,1,2].map((n)=>`<span class="friend-token token-${n}"><svg viewBox="0 0 48 48">${glyphs[i]}</svg></span>`).join('');if(animate&&!reduced)gsap.fromTo(ornament.children,{scale:0,rotation:-50,opacity:0},{scale:1,rotation:0,opacity:1,duration:.9,stagger:.12,ease:'back.out(1.5)'});}
ornaments(0,false);document.addEventListener('moru:friend',e=>ornaments(e.detail));

const canvas=document.createElement('canvas');canvas.id='ambient-details';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const ctx=canvas.getContext('2d');
const pointer={x:.5,y:.5,sx:.5,sy:.5,inside:false},bursts=[];let last=0,w=0,h=0,tick=0;
const motes=Array.from({length:26},(_,i)=>({x:((i*37+11)%101)/101,y:((i*29+17)%97)/97,r:1+(i%4)*.7,s:.18+(i%6)*.065}));
function sparkle(x,y,r,opacity,color){ctx.globalAlpha=opacity;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x+r*.16,y-r*.12,x+r,y);ctx.quadraticCurveTo(x+r*.14,y+r*.16,x,y+r);ctx.quadraticCurveTo(x-r*.16,y+r*.13,x-r,y);ctx.quadraticCurveTo(x-r*.14,y-r*.16,x,y-r);ctx.fill();}
function butterfly(x,y,s,time,phase){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(time*.7+phase)*.2-.35);const flap=.24+.76*Math.abs(Math.sin(time*5.5+phase));ctx.scale(s*flap,s);ctx.globalAlpha=.7;ctx.fillStyle='#f0c979';ctx.strokeStyle='#80704a';ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-20,-30,-31,-5,-5,8);ctx.bezierCurveTo(-24,8,-12,24,0,4);ctx.bezierCurveTo(12,24,24,8,5,8);ctx.bezierCurveTo(31,-5,20,-30,0,0);ctx.fill();ctx.stroke();ctx.restore();}
function render(now){requestAnimationFrame(render);if(document.hidden||now-last<33)return;last=now;const page=document.body.dataset.page,active=document.body.dataset.loaderState==='ready'&&document.body.dataset.routeState==='idle'&&!document.querySelector('dialog[open]')&&page!=='story';canvas.hidden=!active;if(!active)return;
 const ratio=Math.min(devicePixelRatio,1.5);if(w!==innerWidth||h!==innerHeight){w=innerWidth;h=innerHeight;canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}ctx.clearRect(0,0,w,h);tick=reduced?0:now/1000;pointer.sx+=(pointer.x-pointer.sx)*.045;pointer.sy+=(pointer.y-pointer.sy)*.045;
 document.documentElement.style.setProperty('--depth-x',((pointer.sx-.5)*18).toFixed(2)+'px');document.documentElement.style.setProperty('--depth-y',((pointer.sy-.5)*11).toFixed(2)+'px');
 if(page==='home'){
  for(const [i,m]of motes.entries()){const x=(m.x*w+Math.sin(tick*m.s+i)*20+w)%w,y=(m.y*h-tick*m.s*5%h+h)%h;const distance=Math.hypot(x/w-pointer.sx,y/h-pointer.sy);sparkle(x,y,m.r*(1+Math.max(0,.18-distance)*5),.24+.25*Math.sin(tick*.8+i)**2,'#fff7ce');}
  butterfly(w*(.17+Math.sin(tick*.24)*.038),h*(.43+Math.cos(tick*.31)*.07),w<800?.45:.7,tick,0);
  butterfly(w*(.86+Math.cos(tick*.19)*.025),h*(.66+Math.sin(tick*.28)*.05),w<800?.32:.5,tick,2);
 }
 for(let i=bursts.length-1;i>=0;i--){const b=bursts[i],age=(now-b.t)/1000;if(age>1){bursts.splice(i,1);continue;}const ease=1-(1-age)**3;ctx.strokeStyle=b.color;ctx.globalAlpha=(1-age)*.42;ctx.lineWidth=1;ctx.beginPath();ctx.arc(b.x,b.y,5+ease*30,0,Math.PI*2);ctx.stroke();for(let j=0;j<5;j++){const a=j*Math.PI*2/5;sparkle(b.x+Math.cos(a)*ease*42,b.y+Math.sin(a)*ease*42,3*(1-age),.65*(1-age),b.color);}}
 ctx.globalAlpha=1;
}requestAnimationFrame(render);
addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer.x=e.clientX/innerWidth;pointer.y=e.clientY/innerHeight;pointer.inside=true;},{passive:true});document.addEventListener('pointerleave',()=>{pointer.x=pointer.y=.5;pointer.inside=false;});
document.addEventListener('click',e=>{if(reduced||document.body.dataset.page==='story'||e.target.closest('dialog')||!e.target.closest('button,a'))return;bursts.push({x:e.clientX,y:e.clientY,t:performance.now(),color:document.body.dataset.page==='cards'?'#f7df9f':'#c0934e'});if(bursts.length>6)bursts.shift();});

const magnets=[...document.querySelectorAll('.nav nav a,.enter-button,.deck-controls button,.object-controls button,.friend-actions button,.home-film')];
if(fine&&!reduced)magnets.forEach(el=>{el.classList.add('soft-magnet');el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.18;el.style.setProperty('--magnet-x',Math.max(-7,Math.min(7,x))+'px');el.style.setProperty('--magnet-y',Math.max(-5,Math.min(5,y))+'px');});el.addEventListener('pointerleave',()=>{el.style.setProperty('--magnet-x','0px');el.style.setProperty('--magnet-y','0px');});});

function deck(type,direction){if(reduced)return;const selector=type==='chapter'?'.record-orbit':'.object-plinth';gsap.fromTo(selector,{'--deck-turn':direction*-9+'deg','--deck-scale':.94},{'--deck-turn':'0deg','--deck-scale':1,duration:1.3,ease:'elastic.out(.8,.75)',overwrite:true});const target=$(`#${type}-deck`);target.classList.remove('light-pass');void target.offsetWidth;target.classList.add('light-pass');}
document.addEventListener('moru:entered',e=>{if(reduced)return;if(e.detail==='objects'){gsap.fromTo(podium,{y:90,opacity:0,scale:.75},{y:0,opacity:1,scale:1,duration:1.1,ease:'power3.out'});deck('object',1);}if(e.detail==='chapters')deck('chapter',1);});

for(const stage of [$('#story-frame'),$('.film-stage')]){const b=document.createElement('button');b.className='film-expand';b.type='button';b.textContent='⛶';b.setAttribute('aria-label','영상 전체 화면');b.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen?.();else await stage.requestFullscreen?.();}catch{notify('이 브라우저에서는 전체 화면을 지원하지 않아요.');}};stage.append(b);stage.querySelector('video').setAttribute('controlslist','nofullscreen');document.addEventListener('fullscreenchange',()=>b.setAttribute('aria-label',document.fullscreenElement===stage?'영상 전체 화면 해제':'영상 전체 화면'));}
$('#film-dialog').addEventListener('close',()=>{if(document.fullscreenElement?.closest('#film-dialog'))document.exitFullscreen?.().catch(()=>{});});
window.MoruExperience={deck};document.body.dataset.experience='v12';
})();
