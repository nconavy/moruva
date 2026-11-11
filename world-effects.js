(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const palettes={home:['#f5edda','#dfc68b'],chapters:['#285345','#e9b064'],friends:['#cad7b4','#e9cf9e'],objects:['#c0b6d4','#e5c7a2'],cards:['#153b32','#cbad69'],play:['#a9b8cb','#e2cb9c'],story:['#acbca1','#ead5ae']};
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const state={r:.61,g:.608,b:.82,ar:.71,ag:.69,ab:.875,t:0,px:.5,py:.5,tx:.5,ty:.5,pulse:0,mode:0,scene:0};
const vertex='attribute vec2 position; varying vec2 vUv;void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
const fragment=`precision mediump float;varying vec2 vUv;uniform vec2 resolution,mouse;uniform vec3 base,accent;uniform float time,progress,mode,pass,pulse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 uv=vUv;float a=resolution.x/resolution.y;vec2 p=(uv-.5)*vec2(a,1.);vec2 m=(mouse-.5)*vec2(a,1.);float wave=sin(length(p-m*.17)*10.-time*.3)*.5+.5;float ring=smoothstep(.43,.44,length(p+vec2(.11*sin(time*.12),.03)))-smoothstep(.442,.449,length(p+vec2(.11*sin(time*.12),.03)));float tint=.09*wave;
if(mode>.5&&mode<1.5){vec2 q=p-vec2(.045*sin(time*.23),.035*cos(time*.18));float angle=atan(q.y,q.x);float radius=length(q)+.026*sin(angle*3.+time*.27)+.016*sin(angle*5.-time*.19);float bands=sin(radius*13.-time*.22+dot(q,m)*.7);tint=.11+.42*smoothstep(-.25,.65,bands);}
if(mode>1.5&&mode<2.5)tint=.2*smoothstep(.7,0.,length(p-vec2(-.3,-.1)));if(mode>3.5&&mode<4.5)tint=.15*smoothstep(.7,0.,length(p))*wave;
if(mode>2.5&&mode<3.5){float arch=abs(length((p-vec2(0.,-.2))*vec2(.7,1.))-.54-.03*sin(time*.25));tint=.1+.26*exp(-arch*arch*22.)+.07*uv.y;}
if(mode>4.5&&mode<5.5){vec2 cell=fract(uv*vec2(52.*a,52.));tint=.08+step(length(cell-.5),.055)*.24;}
vec3 color=mix(base,accent,tint);float caustic=sin(p.x*8.+sin(p.y*5.+time*.16)+time*.18)*sin(p.y*7.-time*.13);color+=accent*.025*pow(max(0.,caustic),8.);float grain=(hash(floor(uv*resolution))-.5)*.013;color+=grain;color+=pulse*max(0.,1.-length(p-m)*2.)*.13;
if(pass>.5){float field=length(p)/max(a,.8);if(mode>.5&&mode<1.5)field=uv.x*.72+uv.y*.14+sin(uv.y*9.+time*.4)*.07;else if(mode>1.5)field=uv.y*.8+sin(uv.x*11.)*.05;float amount=progress<=1.?progress:2.-progress;float edge=amount*1.7-.2;float alpha=1.-smoothstep(edge-.05,edge+.05,field+grain*2.);gl_FragColor=vec4(mix(base,accent,.3+sin(uv.x*9.+uv.y*4.)*.07),alpha);}else{gl_FragColor=vec4(color,1.);}}`;
function surface(canvas){const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return null;function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);const uniforms={};['resolution','mouse','base','accent','time','progress','mode','pass','pulse'].forEach(k=>uniforms[k]=gl.getUniformLocation(program,k));return{draw(pass=0,progress=0,mode=0){const dpr=Math.min(devicePixelRatio,1.5),w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.uniform2f(uniforms.resolution,w,h);gl.uniform2f(uniforms.mouse,state.px,1-state.py);gl.uniform3f(uniforms.base,state.r,state.g,state.b);gl.uniform3f(uniforms.accent,state.ar,state.ag,state.ab);gl.uniform1f(uniforms.time,state.t);gl.uniform1f(uniforms.progress,progress);gl.uniform1f(uniforms.mode,mode);gl.uniform1f(uniforms.pass,pass);gl.uniform1f(uniforms.pulse,state.pulse);gl.drawArrays(gl.TRIANGLES,0,6);}};}
let bg;try{bg=surface(document.getElementById('world-fx'));}catch(e){console.warn('WebGL visual fallback:',e.message);}document.body.dataset.fx=bg?'webgl':'css';let last=0,raf;
function render(now){raf=requestAnimationFrame(render);if(document.hidden||document.body.dataset.page==='home'||document.body.dataset.routeState==='transitioning'||now-last<33)return;last=now;state.t=reduced?0:now*.001;state.px+=(state.tx-state.px)*.08;state.py+=(state.ty-state.py)*.08;bg?.draw(0,0,state.scene);}
raf=requestAnimationFrame(render);addEventListener('pointermove',e=>{state.tx=e.clientX/innerWidth;state.ty=e.clientY/innerHeight;},{passive:true});
const api={theme(name,color){state.scene=({home:0,chapters:1,friends:2,objects:3,cards:4,play:5,story:6})[name]||0;const p=palettes[name]||palettes.home,c=rgb(color||p[0]),a=rgb(p[1]);document.documentElement.style.background=color||p[0];gsap.to(state,{r:c[0],g:c[1],b:c[2],ar:a[0],ag:a[1],ab:a[2],duration:reduced||document.body.dataset.routeState!=='idle'?0:.65,overwrite:true,ease:'power2.inOut'});},pulse(){gsap.fromTo(state,{pulse:1},{pulse:0,duration:1.2});},async transition(mode,midpoint,reveal){
 const wipe=document.getElementById('transition'),panels=[...wipe.querySelectorAll(':scope > i')],word=wipe.querySelector(':scope > span');
 const body=document.body;const route=body.dataset.page;const ui=MoruLoad.hud(wipe);body.dataset.wipeCount=String(Number(body.dataset.wipeCount||0)+1);
 if(reduced){wipe.style.display='block';wipe.setAttribute('aria-hidden','false');wipe.dataset.covered='true';ui.root.dataset.visible='true';try{await midpoint();reveal?.();}finally{wipe.style.display='none';wipe.setAttribute('aria-hidden','true');delete wipe.dataset.covered;delete ui.root.dataset.visible;}return;}

 gsap.killTweensOf([...panels,word]);gsap.set(panels,{clearProps:'all'});gsap.set(word,{clearProps:'all'});
 wipe.style.display='block';wipe.style.pointerEvents='auto';wipe.setAttribute('aria-hidden','false');body.dataset.transitionPhase='covering';
 gsap.set(panels,{x:0,y:0,xPercent:0,yPercent:0,scale:1,rotation:0,skewX:0,transformOrigin:'50% 50%'});
 gsap.set(word,{autoAlpha:0});
 const circle=mode===0||mode===3;
 if(circle){gsap.set(panels,{width:'160vmax',height:'160vmax',left:'calc(50% - 80vmax)',top:'calc(50% - 80vmax)',right:'auto',bottom:'auto',borderRadius:'50%',scale:0});}
 else{gsap.set(panels,{left:'-30vmax',right:'-30vmax',top:'-25%',bottom:'-25%',width:'auto',height:'auto',borderRadius:0,xPercent:mode===2?0:-110,yPercent:mode===2?110:0,skewX:mode===2?0:-8});}
 const tween=(targets,vars)=>new Promise(resolve=>gsap.to(targets,{...vars,onComplete:()=>resolve()}));
 try{
  await tween(panels,circle?{scale:1,duration:.48,stagger:.045,ease:'power3.inOut'}:{xPercent:0,yPercent:0,duration:.46,stagger:.045,ease:'power3.inOut'});
  body.dataset.transitionPhase='covered';wipe.dataset.covered='true';ui.root.dataset.visible='true';

  const corners=[[1,1],[innerWidth-1,1],[1,innerHeight-1],[innerWidth-1,innerHeight-1]];
  body.dataset.wipeCoverage=String(corners.every(([x,y])=>panels.includes(document.elementFromPoint(x,y))));
  body.dataset.wipeFrom=route;
  await midpoint();
  body.dataset.transitionPhase='revealing';delete wipe.dataset.covered;delete ui.root.dataset.visible;
  reveal?.();
  await tween(panels,circle?{scale:0,duration:.57,stagger:.04,ease:'power3.inOut'}:{xPercent:mode===2?0:110,yPercent:mode===2?-110:0,duration:.55,stagger:.04,ease:'power3.inOut'});
 }finally{
  wipe.style.display='none';wipe.setAttribute('aria-hidden','true');wipe.style.pointerEvents='none';delete wipe.dataset.covered;delete ui.root.dataset.visible;gsap.set(panels,{clearProps:'all'});gsap.set(word,{clearProps:'all'});body.dataset.transitionPhase='idle';
 }
},draw(){bg?.draw(0,0,state.scene);},ready:Promise.resolve(Boolean(bg))};window.MoruFX=api;
})();
