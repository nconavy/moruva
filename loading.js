(()=>{'use strict';
const images=new Map(),names=['moru','nari','tori','luan','dodam','neuru'];
let running=0;const queue=[];
const frames=(n=2)=>new Promise(resolve=>{const next=()=>--n<=0?resolve():requestAnimationFrame(next);requestAnimationFrame(next);});
function drain(){while(running<3&&queue.length){running++;const job=queue.shift();job().finally(()=>{running--;drain();});}}
function image(src){
 const url=new URL(src,document.baseURI).href;if(images.has(url))return images.get(url);
 const task=new Promise((resolve,reject)=>{queue.push(async()=>{const im=new Image();im.decoding='async';let timer;
  try{im.src=url;await Promise.race([im.decode(),new Promise((_,fail)=>timer=setTimeout(()=>fail(Error('Image load timed out')),25000))]);if(!im.naturalWidth)throw Error('Image unavailable');resolve(im);}
  catch(error){images.delete(url);reject(error);}finally{clearTimeout(timer);}
 });drain();});images.set(url,task);return task;
}
function hud(parent,initial=false){
 if(initial)return{root:parent,label:parent.querySelector('#load-status'),bar:parent.querySelector('#load-bar'),count:parent.querySelector('#load-count')};
 let root=parent.querySelector('.route-loader');if(!root){root=document.createElement('div');root.className='route-loader';root.setAttribute('role','status');root.innerHTML='<div class="loading-orbit" aria-hidden="true"><i></i><b>m.</b></div><small class="loading-label"></small><div class="loading-track"><i></i></div><span class="loading-count">00</span>';parent.append(root);}
 return{root,label:root.querySelector('.loading-label'),bar:root.querySelector('.loading-track i'),count:root.querySelector('.loading-count')};
}
function progress(ui,value,label){if(!ui||ui.root.classList.contains('load-failed'))return;ui.label.textContent=label;ui.bar.style.transform=`scaleX(${value})`;ui.count.textContent=String(Math.round(value*100)).padStart(2,'0');}
function reset(ui,label){ui.root.querySelector('.loading-actions')?.remove();ui.root.classList.remove('load-failed');progress(ui,0,label);}
async function retry(ui,work,{initial=false}={}){
 for(;;){try{ui.root.classList.remove('load-failed');return await work();}catch(error){
  ui.root.classList.add('load-failed');ui.label.textContent='연결이 잠시 느려요';ui.count.textContent='';
  const actions=document.createElement('div');actions.className='loading-actions';actions.innerHTML='<button type="button">다시 불러오기 ↻</button>'+(!initial?'<button type="button">돌아가기</button>':'');ui.root.append(actions);
  const again=await new Promise(resolve=>{actions.children[0].onclick=()=>resolve(true);if(actions.children[1])actions.children[1].onclick=()=>resolve(false);});actions.remove();
  if(!again){const cancelled=Error('Loading cancelled');cancelled.name='AbortError';throw cancelled;}
 }}
}
const labels={games:'놀이터를 준비하는 중',home:'친구들을 만나러 가는 중',chapters:'장면을 준비하는 중',friends:'친구들을 준비하는 중',objects:'오브젝트를 준비하는 중',cards:'카드팩을 준비하는 중',story:'영상을 준비하는 중'};
function sources(name,index){
 const logos=['assets/moruva-logo.svg','assets/moruva-logo-cream.svg'];
 if(name==='games')return logos.concat(['jump','dress','run'].map(s=>`assets/game-${s}-v4.jpg`));
 if(name==='home')return logos.concat(['hero-camera-sharp.png','branch-large-a.svg','branch-large-b.svg','branch-large-c.svg','sprig-a.svg','sprig-b.svg'].map(s=>'assets/'+s));
 if(name==='chapters'||name==='story')return logos.concat(window.MoruShots.map(s=>'assets/'+s.image));
 if(name==='friends')return logos.concat(names.map(s=>`assets/motion-${s}.webp`));
 if(name==='objects')return logos.concat(products.map(p=>'assets/'+p.image));
 if(name==='cards')return logos.concat(names.map(s=>`assets/card-${s}.webp`));
 return logos;
}
async function prepare(name,index,ui){
 const files=[...new Set(sources(name,index))];let done=0;const total=files.length+2;
 const advance=()=>progress(ui,++done/total,labels[name]);progress(ui,0,labels[name]);
 await Promise.all(files.map(src=>image(src).then(advance)));
 if(name==='home')await window.MoruHome?.ready;
 if(name==='story')await window.MoruFilms?.prepare(name,index);
 advance();await frames(2);advance();
}
function videoReady(video,start=0,end=4){
 const enough=()=>{if(video.readyState<3||video.seeking)return false;const target=Math.min(end,Number.isFinite(video.duration)?video.duration:end);for(let i=0;i<video.buffered.length;i++)if(video.buffered.start(i)<=start+.12&&video.buffered.end(i)>=target-.12)return true;return false;};
 return new Promise((resolve,reject)=>{let timer;const events=['loadeddata','canplay','canplaythrough','progress','seeked','durationchange'];const clear=()=>{clearTimeout(timer);events.forEach(e=>video.removeEventListener(e,check));video.removeEventListener('error',fail);};const check=()=>{if(enough()){clear();resolve();}};const fail=()=>{clear();reject(Error('Video unavailable'));};events.forEach(e=>video.addEventListener(e,check));video.addEventListener('error',fail);timer=setTimeout(fail,25000);check();});
}
async function fonts(){let timer;try{await Promise.race([document.fonts.ready,new Promise(resolve=>{timer=setTimeout(()=>{if(document.fonts.status!=='loaded')document.documentElement.style.fontFamily='system-ui,sans-serif';resolve();},8000);})]);}finally{clearTimeout(timer);}}
async function paint(name){
 const page=document.querySelector(`[data-route="${name}"]`);
 await Promise.all([...page.querySelectorAll('img[src]')].filter(im=>im.getAttribute('src')).map(im=>{im.loading='eager';return im.decode();}));
 if(name==='home')await window.MoruHome?.warm();
 window.MoruFX?.draw();window.MoruMaterials?.warm();
 await frames(1);await fonts();await frames(2);
}
window.MoruLoad={image,hud,reset,progress,retry,prepare,paint,videoReady,frames,labels};
})();
