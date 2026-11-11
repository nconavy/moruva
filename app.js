'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let current='home',chapter=0,object=0,friend=0,busy=false,ready=false,artId=0,sound=false,audioContext,toastTimer,packBusy=false,packOpened=false,physicsReady=false,storyMotion,homeMotion;
const chapters=window.MoruShots;

function notify(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600);}
function tone(kind='tap'){if(!sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const now=audioContext.currentTime;(kind==='pack'?[440,554,659]:kind==='camera'?[150,90]:[620]).forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=kind==='camera'?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+i*.06);g.gain.exponentialRampToValueAtTime(.035,now+i*.06+.01);g.gain.exponentialRampToValueAtTime(.0001,now+i*.06+.13);o.connect(g);g.connect(audioContext.destination);o.start(now+i*.06);o.stop(now+i*.06+.15);});}catch{sound=false;}}
$('#sound-toggle').onclick=()=>{sound=!sound;$('#sound-toggle').setAttribute('aria-pressed',sound);$('#sound-toggle').setAttribute('aria-label',sound?'효과음 끄기':'효과음 켜기');tone();};
$('#fullscreen-toggle').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('브라우저의 전체 화면 기능을 이용해 주세요.');}};
$('#menu-toggle').onclick=()=>{const open=$('.nav').classList.toggle('menu-open');$('#menu-toggle').setAttribute('aria-expanded',open);$('#menu-toggle').setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');};
function closeMenu(){$('.nav').classList.remove('menu-open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','메뉴 열기');}
function parseRoute(){const [raw,num]=location.hash.slice(1).split('/');const alias={cast:'friends',episodes:'chapters',play:'games'};const name=alias[raw]||raw||'home';return{name:$(`[data-route="${CSS.escape(name)}"]`)?name:'home',index:Math.max(0,Math.min(chapters.length-1,(Number(num)||1)-1))};}
function leavePage(){homeMotion?.pause();storyMotion?.kill();$('#story-video').pause();}
function preparePage(name){
 const p=$(`[data-route="${name}"]`);gsap.killTweensOf(p);gsap.set(p,{opacity:1,scale:1});
 if(name==='chapters')layoutDeck('chapter',chapter,true);
 if(name==='objects')layoutDeck('object',object,true);
 if(name==='friends')selectFriend(friend,false);
 if(name==='story')prepareStory();
}
function revealPage(name){
 const p=$(`[data-route="${name}"]`),heading=p.querySelector('.page-label,.story-copy');
 if(heading&&!reduced)gsap.fromTo(heading,{y:18,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'});
 if(name==='friends')selectFriend(friend,true);
 if(name==='story')enterStory();
 document.dispatchEvent(new CustomEvent('moru:entered',{detail:name}));
}
let queuedRoute=null;
async function navigate(name,index=chapter,historyMode='push',initial=false){
 if(busy&&!initial){queuedRoute={name,index,historyMode};return;}
 const inlineFilm=!initial&&current==='story'&&name==='story';
 const changed=name!==current||(name==='story'&&index!==chapter);if(!changed&&!initial)return;
 busy=true;document.body.dataset.routeState='transitioning';closeMenu();tone();
 const previous=current,previousChapter=chapter;let succeeded=false;
 const ui=initial?MoruLoad.hud($('#loader'),true):inlineFilm?null:MoruLoad.hud($('#transition'));
 if(ui)MoruLoad.reset(ui,MoruLoad.labels[name]);
 const apply=async()=>{
  const prepare=()=>MoruLoad.prepare(name,index,ui);
  if(ui)await MoruLoad.retry(ui,prepare,{initial});else await prepare();
  leavePage();chapter=name==='story'?index:chapter;
  if(name!=='story')await window.MoruFilms?.prepare(name,chapter);
  $$('.page').forEach(p=>{p.hidden=p.dataset.route!==name;p.inert=p.hidden;});current=name;
  document.body.dataset.page=name;
  $$('.nav nav a').forEach(a=>{if(a.hash==='#'+(name==='story'?'chapters':name))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  MoruFX.theme(name,name==='friends'?friends[friend].color:undefined);
  $('#scene-announcement').textContent=({home:'첫 화면',chapters:'장면 선택',story:chapters[chapter].name,friends:'친구 소개',objects:'오브젝트',cards:'카드팩',games:'놀이터'})[name];
  preparePage(name);await MoruLoad.paint(name);
  if(historyMode==='push')history.pushState(null,'','#'+name+(name==='story'?'/'+(chapter+1):''));
 };
 try{
  if(initial||inlineFilm){await apply();if(inlineFilm){gsap.set('#story-frame',{x:0,xPercent:-50,yPercent:-50,y:0,opacity:1,scale:1});document.dispatchEvent(new CustomEvent('moru:entered',{detail:name}));}}
  else await MoruFX.transition(name==='home'?0:name==='cards'?2:name==='friends'?3:1,apply,()=>revealPage(name));
  succeeded=true;
 }catch(error){
  if(error.name!=='AbortError')console.warn('Page preparation:',error.message);
  if(historyMode==='none'&&!initial)history.replaceState(null,'','#'+previous+(previous==='story'?'/'+(previousChapter+1):''));
  if(inlineFilm)window.MoruFilms?.showLoadError();
 }finally{busy=false;document.body.dataset.routeState='idle';}
 if(succeeded&&!initial&&name==='story'&&current==='story')window.MoruFilms?.playStory();
 if(queuedRoute){const next=queuedRoute;queuedRoute=null;queueMicrotask(()=>navigate(next.name,next.index,next.historyMode));}
}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;e.preventDefault();const name=a.hash.slice(1);navigate(name);});
addEventListener('popstate',()=>{const r=parseRoute();navigate(r.name,r.index,'none');});
let gestureUntil=0;
function gesture(el,callback){let start=null,lastWheel=0,wheelTimer,acc=0;el.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.shot-strip,.story-controller,.film-finish,#story-related'))return;start={x:e.clientX,y:e.clientY};});el.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(!busy&&performance.now()>gestureUntil&&Math.max(Math.abs(dx),Math.abs(dy))>65){gestureUntil=performance.now()+1100;el.dataset.suppressClick='true';setTimeout(()=>delete el.dataset.suppressClick,80);callback((Math.abs(dx)>Math.abs(dy)?dx:dy)<0?1:-1);}});el.addEventListener('pointercancel',()=>start=null);el.addEventListener('wheel',e=>{if(e.target.closest('.shot-strip'))return;e.preventDefault();const now=performance.now();if(busy||now<gestureUntil||now-lastWheel<1000)return;acc+=e.deltaY+e.deltaX;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>acc=0,180);if(Math.abs(acc)>48){lastWheel=now;gestureUntil=now+1400;callback(acc>0?1:-1);acc=0;}},{passive:false});}
function reflect(el){el.dataset.reflect='true';}
$('#chapter-deck').innerHTML=chapters.map((c,i)=>`<button class="cover" data-chapter="${i}" aria-label="${c.name} 장면"><span class="cover-face" style="--paper:${c.color}"><img class="cover-image" src="assets/${c.image}" alt="${c.caption}" loading="lazy"><span class="cover-label">MORUVA / FILM 0${i+1}</span><span class="cover-stamp">FILM<br>0${i+1} / 08</span><span class="cover-title">${c.en.replace(/ (\S+)$/,'<br>$1')}</span></span></button>`).join('');
$('#object-deck').innerHTML=products.map((p,i)=>`<button class="cover" data-object="${i}" aria-label="${p.name}"><span class="cover-face" style="--paper:${p.color}"><img class="cover-image" src="assets/${p.image}" alt="${p.name} 디자인 목업" loading="lazy"></span></button>`).join('');
function layoutDeck(type,index,instant=false){const list=$$(`#${type}-deck .cover`),n=list.length;list.forEach((el,i)=>{let d=(i-index+n)%n;if(d>n/2)d-=n;const offset=innerWidth<800?innerWidth*.68:Math.min(innerWidth*.36,type==='object'?560:420);el.classList.toggle('active',d===0);el.setAttribute('aria-current',d===0?'true':'false');el.style.zIndex=10-Math.abs(d);el.tabIndex=Math.abs(d)<=1?0:-1;gsap.to(el,{xPercent:-50,yPercent:-50,x:d*offset,y:Math.abs(d)*14,z:-Math.abs(d)*160,rotationY:d===0?0:d>0?-24:24,rotationZ:d===0?-2:d>0?8:-8,scale:d===0?1:.9,opacity:Math.abs(d)>1?0:.94+(d===0?.06:0),duration:instant||reduced?0:1.05,ease:'power3.out',overwrite:true});el.style.pointerEvents=Math.abs(d)<=1?'auto':'none';});if(type==='chapter'){$('#chapter-count').textContent=`0${index+1} / 0${chapters.length}`;$('#chapter-name').textContent=chapters[index].name;$('#chapter-subtitle').textContent=chapters[index].en;}else{$('#object-number').textContent=`0${index+1} / 06`;$('#object-name').textContent=products[index].name;MoruFX.theme('objects',products[index].color);}}
function changeChapter(d){window.MoruExperience?.deck('chapter',d);chapter=(chapter+d+chapters.length)%chapters.length;layoutDeck('chapter',chapter);tone();}function changeObject(d){window.MoruExperience?.deck('object',d);object=(object+d+6)%6;layoutDeck('object',object);tone();}
$$('.cover-face').forEach(reflect);$$('[data-chapter]').forEach(el=>el.onclick=()=>{if($('#chapter-deck').dataset.suppressClick)return;const i=+el.dataset.chapter;if(i===chapter)navigate('story',i);else{chapter=i;layoutDeck('chapter',chapter);}});$$('[data-object]').forEach(el=>el.onclick=()=>{if($('#object-deck').dataset.suppressClick)return;const i=+el.dataset.object;if(i===object)openProduct(i);else{object=i;layoutDeck('object',object);}});
$('#chapter-prev').onclick=()=>changeChapter(-1);$('#chapter-next').onclick=()=>changeChapter(1);$('#chapter-enter').onclick=()=>navigate('story',chapter);$('#object-prev').onclick=()=>changeObject(-1);$('#object-next').onclick=()=>changeObject(1);$('#object-detail').onclick=()=>openProduct(object);gesture($('#chapter-deck'),changeChapter);gesture($('#object-deck'),changeObject);

function prepareStory(){
 const c=chapters[chapter];$('#story-title').textContent=c.name;$('#story-index').textContent=c.en;$('#story-counter').textContent=`0${chapter+1} / 0${chapters.length}`;
 $('#story-image').src='assets/'+c.image;$('#story-image').alt=c.caption;$('#story-frame').style.background=c.color;
 $('#story-related').hidden=c.product==null;if(c.product!=null){$('#story-related').textContent=products[c.product].name+' ↗';$('#story-related').onclick=()=>openProduct(c.product);}
 window.MoruFilms?.select(chapter);
}
function enterStory(){
 storyMotion?.kill();storyMotion=gsap.timeline();
 if(!reduced)storyMotion.fromTo('#story-frame',{x:0,xPercent:-50,yPercent:-50,opacity:0,y:16,scale:.98},{x:0,xPercent:-50,yPercent:-50,opacity:1,y:0,scale:1,duration:.6,ease:'power3.out'});
 else gsap.set('#story-frame',{x:0,xPercent:-50,yPercent:-50,y:0,opacity:1,scale:1});
 if(!busy&&ready)window.MoruFilms?.playStory();
}
function nextStory(d){navigate('story',(chapter+d+chapters.length)%chapters.length);}$('#story-back').onclick=()=>navigate('chapters');$('#story-prev').onclick=()=>nextStory(-1);$('#story-next').onclick=()=>nextStory(1);$('#story-replay').onclick=enterStory;gesture($('.story'),nextStory);
$('#friend-tabs').innerHTML=friends.map((f,i)=>`<button role="tab" id="friend-tab-${i}" aria-controls="friend-art" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-friend="${i}">${f.name}</button>`).join('');
let selectFriend;
$$('[data-friend]').forEach(b=>{b.onclick=()=>selectFriend(+b.dataset.friend);b.onkeydown=e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();selectFriend(e.key==='Home'?0:e.key==='End'?5:friend+(e.key==='ArrowRight'?1:-1));$('#friend-tab-'+friend).focus();}};});$('#friend-card').onclick=()=>openCard(friend);gesture($('.friends'),d=>selectFriend(friend+d));
const openers=new WeakMap();function openDialog(id){const d=$(id);openers.set(d,document.activeElement);d.showModal();tone();if(!reduced)gsap.fromTo(d,{opacity:0,y:25,scale:.96},{opacity:1,y:0,scale:1,duration:.4,ease:'power3.out'});}$$('dialog').forEach(d=>{d.querySelector('.dialog-close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});d.addEventListener('close',()=>openers.get(d)?.focus({preventScroll:true}));});
function openProduct(i){const p=products[i];$('#detail-content').innerHTML=`<div class="product-detail"><div class="detail-photo" style="background:${p.color}"><img src="assets/${p.image}" alt="${p.name} 디자인 목업"></div><div class="product-copy"><small>${p.en}</small><h2>${p.name}</h2><p>${p.desc}</p><dl>${p.specs.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><small>MORUVA 오브젝트 컬렉션 · 제품 디자인 콘셉트</small></div></div>`;openDialog('#detail-dialog');}

$('#camera-hit').onclick=()=>{tone('camera');MoruFX.pulse();const tl=gsap.timeline();tl.to('.photo-flash',{opacity:.7,duration:.055}).to('.photo-flash',{opacity:0,duration:.4}).call(()=>{$('#detail-content').innerHTML='<div class="photo-preview"><img src="assets/hero-camera-sharp.png" alt="방금 찍은 여섯 친구의 사진"><span>MORUVA · TAKE 06</span></div>';openDialog('#detail-dialog');});};

document.addEventListener('keydown',e=>{if(!ready||busy||$('dialog[open]')||e.target.closest('button,a,input'))return;if(e.key==='Escape'&&current!=='home'){navigate('chapters');return;}const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();if(current==='chapters')changeChapter(d);if(current==='objects')changeObject(d);if(current==='story')nextStory(d);if(current==='friends')selectFriend(friend+d);});
addEventListener('resize',()=>{if(current==='chapters')layoutDeck('chapter',chapter,true);if(current==='objects')layoutDeck('object',object,true);if(packOpened)layoutCards(false);});document.addEventListener('visibilitychange',()=>{if(document.hidden){homeMotion?.pause();storyMotion?.pause();$('#story-video').pause();}else{if(current==='home')homeMotion?.play();if(current==='story'){storyMotion?.play();}}});

async function boot(){
 const ui=MoruLoad.hud($('#loader'),true);MoruLoad.reset(ui,'글꼴과 화면을 준비하는 중');
 await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(()=>{if(document.fonts.status!=='loaded')document.documentElement.style.fontFamily='system-ui,sans-serif';resolve();},8000))]);
 const route=parseRoute();await navigate(route.name,route.index,'none',true);
 await MoruLoad.frames(3);MoruLoad.progress(ui,1,'준비됐어요');
 document.body.dataset.loaderState='revealing';revealPage(route.name);
 await gsap.to('#loader',{yPercent:-105,duration:reduced?0:.65,ease:'power3.inOut'});
 $('#loader').hidden=true;ready=true;document.body.dataset.loaderState='ready';
 if(route.name==='story')window.MoruFilms?.playStory();
}
gesture($('.home'),()=>navigate('chapters'));
addEventListener('DOMContentLoaded',()=>boot().catch(e=>{console.error(e);$('#load-status').textContent='화면을 준비하지 못했어요. 새로고침해 주세요.';}),{once:true});
