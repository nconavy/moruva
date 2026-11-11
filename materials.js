(()=>{'use strict';
const canvas=document.createElement('canvas');canvas.className='material-light';canvas.setAttribute('aria-hidden','true');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let gl,program,uniforms={},host=null,anchor=null,kind=0,last=0,scan=0;
let pointer={x:.5,y:.5,inside:false},smooth={x:.5,y:.5};
const vert=`attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const frag=`precision highp float;varying vec2 uv;uniform vec2 light;uniform float kind;uniform vec2 size;uniform float clock;
float fold(vec2 p,vec2 n,float at,float width){float d=dot(p,n)-at;return exp(-d*d/width);}
float heightAt(vec2 p){
 float h=.0011*sin(p.x*24.+p.y*8.)+.0007*sin(p.x*51.-p.y*23.);
 h+=.004*fold(p,normalize(vec2(1.,.24)),.17,.00008)*(1.-smoothstep(.18,.55,p.y));
 h+=.003*fold(p,normalize(vec2(.46,1.)),.85,.00005)*smoothstep(.45,.9,p.x);
 h-=.003*fold(p,normalize(vec2(1.,-.37)),.72,.00005)*smoothstep(.2,.8,p.y);
 h+=.002*fold(p,normalize(vec2(.85,.52)),.4,.00008)*(1.-smoothstep(.25,.6,p.x));
 float rim=exp(-min(p.x,1.-p.x)*75.);h+=rim*sin(p.y*47.)*.003;
 if(kind>1.5&&kind<2.5)h+=.002*sin(p.x*110.+sin(p.y*17.))*rim+.0015*sin(p.x*39.+p.y*17.);
 if(kind>.5&&kind<1.5)h*=.09;if(kind>2.5)h*=.06;
 return h;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 p=vec2(uv.x,1.-uv.y);float e=.002;
 vec2 slope=vec2(heightAt(p+vec2(e,0.))-heightAt(p-vec2(e,0.)),heightAt(p+vec2(0.,e))-heightAt(p-vec2(0.,e)))/(2.*e);
 vec3 n=normalize(vec3(-slope*3.5,1.));vec3 l=normalize(vec3((light-p)*2.,.65));vec3 halfVector=normalize(l+vec3(0.,0.,1.));
 float spec=pow(max(dot(n,halfVector),0.),kind>1.5&&kind<2.5?55.:28.);
 float beam=exp(-pow((p.x*.75+p.y*.35-light.x*.85-light.y*.25)*9.,2.));
 float edge=pow(1.-min(min(p.x,1.-p.x),min(p.y,1.-p.y))*2.,9.);
 float windowLight=exp(-pow((p.x*.72-p.y*.42-light.x*.65+light.y*.35)*11.,2.));float sleeve=pow(max(0.,sin(p.x*22.+p.y*4.+slope.x*6.)),14.)*smoothstep(.3,.95,p.y);float a=spec*.25+beam*.12+edge*.045+windowLight*.10+sleeve*.08;
 vec3 color=vec3(1.,.975,.86);
 if(kind>.5&&kind<1.5)a*=.32;
 if(kind>1.5&&kind<2.5)a=spec*.42+beam*.1+edge*.07;
 if(kind>2.5){color=.68+.3*cos(vec3(0.,2.1,4.2)+(p.x-p.y+light.x)*7.);float diffraction=pow(max(0.,sin((p.x+p.y)*110.+light.x*8.)),18.);a=(spec*.3+beam*.24+diffraction*.08)*( .4+.6*smoothstep(.12,.4,length(p-.5)));}
 float grain=hash(floor(p*size));a+=grain*.012;
 gl_FragColor=vec4(color,clamp(a,0.,.5));}`;
function init(){try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'low-power'});if(!gl)return;
 const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);['light','kind','size'].forEach(n=>uniforms[n]=gl.getUniformLocation(program,n));document.body.dataset.materialEngine='webgl';
 }catch(e){gl=null;document.body.dataset.materialEngine='css';console.warn('Material fallback:',e.message);}}
function choose(){const modal=document.querySelector('#detail-dialog[open] .display-card');if(modal)return[modal.querySelector('.card-front'),modal,3];if(document.querySelector('dialog[open]'))return[null,null,0];
 const page=document.body.dataset.page;if(page==='chapters'){const a=document.querySelector('#chapter-deck .active .cover-face');return[a,a,0];}if(page==='objects'){const a=document.querySelector('#object-deck .active .cover-face');return[a,a,1];}
 if(page==='cards'){if(document.body.dataset.packState!=='dealt'){return[document.querySelector('.pack-body'),document.querySelector('#foil-pack'),2];}
 const a=document.querySelector('#dealt-cards .revealed:hover')||document.querySelector('#dealt-cards .revealed');return[a?.querySelector('.card-front'),a,3];}return[null,null,0];}
function reset(el){if(!el)return;['--rx','--ry','--rz','--px','--mx','--my','--material-float'].forEach(k=>el.style.removeProperty(k));delete el.dataset.materialActive;}
addEventListener('pointermove',e=>{if(!anchor)return;const r=anchor.getBoundingClientRect();pointer.inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;if(pointer.inside){pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height;}},{passive:true});
document.addEventListener('pointerleave',()=>pointer.inside=false);
function render(t){requestAnimationFrame(render);if(document.hidden||t-last<32)return;last=t;
 if(t-scan>100){scan=t;const next=choose();if(next[0]!==host){reset(anchor);host=next[0];anchor=next[1];kind=next[2];pointer.inside=false;smooth.x=smooth.y=.5;if(host){host.append(canvas);host.dataset.material=String(kind);anchor.dataset.materialActive='true';}else canvas.remove();}}
 if(!host||document.body.dataset.loaderState!=='ready')return;
 const idle=reduced?0:t*.001;const tx=pointer.inside?pointer.x:.5+Math.sin(idle*.48)*.36,ty=pointer.inside?pointer.y:.45+Math.cos(idle*.35)*.28;
 smooth.x+=(tx-smooth.x)*.075;smooth.y+=(ty-smooth.y)*.075;
 const tilt=pointer.inside?12:2.5;anchor.style.setProperty('--rx',((.5-smooth.y)*tilt).toFixed(3)+'deg');anchor.style.setProperty('--ry',((smooth.x-.5)*tilt).toFixed(3)+'deg');anchor.style.setProperty('--rz',((smooth.x-.5)*tilt*.35).toFixed(3)+'deg');anchor.style.setProperty('--px',smooth.x.toFixed(3));anchor.style.setProperty('--mx',(smooth.x*100).toFixed(1)+'%');anchor.style.setProperty('--my',(smooth.y*100).toFixed(1)+'%');anchor.style.setProperty('--material-float',(Math.sin(idle*.8)*2.5).toFixed(2)+'px');
 canvas.dataset.light=smooth.x.toFixed(2)+','+smooth.y.toFixed(2);
 if(!gl)return;const r=host.getBoundingClientRect();if(r.width<1||r.height<1)return;const w=Math.min(720,Math.max(1,Math.round(r.width))),h=Math.max(1,Math.round(w*r.height/r.width));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.uniform2f(uniforms.light,smooth.x,smooth.y);gl.uniform1f(uniforms.kind,kind);gl.uniform2f(uniforms.size,w,h);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,6);
}init();requestAnimationFrame(render);
})();
