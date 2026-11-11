// Painted character atlases keep the approved cast's original illustration.
// Existing game and wardrobe IDs remain unchanged.
import {drawMoru as vectorMoru,drawNari as vectorNari,COLORS} from './art-v2.js';
export {COLORS,ellipse,round,star,flower,line,shape,clouds,pixelTori,pixelLandscape,pixelObstacle,wardrobeBackground} from './art-v2.js';

const makeCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
async function atlas(url,columns,rows){
 const img=new Image();img.decoding='async';
 await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Character artwork failed: '+url));img.src=new URL(url,import.meta.url).href;});
 const cw=img.naturalWidth/columns,ch=img.naturalHeight/rows,result=[];
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const cell=makeCanvas(Math.ceil(cw),Math.ceil(ch)),cc=cell.getContext('2d',{willReadFrequently:true});cc.drawImage(img,col*cw,row*ch,cw,ch,0,0,cw,ch);
  const pixels=cc.getImageData(0,0,cell.width,cell.height),d=pixels.data;let x0=cell.width,y0=cell.height,x1=0,y1=0;
  for(let y=0;y<cell.height;y++)for(let x=0;x<cell.width;x++)if(d[(y*cell.width+x)*4+3]>30){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  if(x0>x1)throw Error('Empty character atlas cell');
  x0=Math.max(0,x0-2);y0=Math.max(0,y0-2);x1=Math.min(cell.width-1,x1+2);y1=Math.min(cell.height-1,y1+2);
  const crop=makeCanvas(x1-x0+1,y1-y0+1);crop.getContext('2d').drawImage(cell,x0,y0,crop.width,crop.height,0,0,crop.width,crop.height);
  let mass=0,total=0;for(let y=Math.floor(y0+(y1-y0)*.9);y<=y1;y++)for(let x=x0;x<=x1;x++){const a=d[(y*cell.width+x)*4+3];mass+=a;total+=a*(x-x0);}
  result.push({canvas:crop,width:crop.width,height:crop.height,anchor:mass?total/mass:crop.width/2});
 }
 img.src='';return result;
}

let moru=[],nari=[],accessories=[],wearables=[],garments=[];
const ready=await Promise.allSettled([
 atlas('./assets/moru-painted-v3.png',3,2),
 atlas('./assets/nari-painted-a-v3.png',2,2),
 atlas('./assets/nari-painted-b-v3.png',2,2),
 atlas('./assets/nari-accessories-v3.png',5,2),
 atlas('./assets/nari-wearables-v3.png',4,2),
 atlas('./assets/nari-garments-v3.png',4,2)
]);
if(ready[0].status==='fulfilled')moru=ready[0].value;
if(ready[1].status==='fulfilled'&&ready[2].status==='fulfilled')nari=[...ready[1].value,...ready[2].value];
if(ready[3].status==='fulfilled')accessories=ready[3].value;
if(ready[4].status==='fulfilled')wearables=ready[4].value;
if(ready[5].status==='fulfilled')garments=ready[5].value;
for(const r of ready)if(r.status==='rejected')console.warn(r.reason.message);

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hsl(r,g,b){r/=255;g/=255;b/=255;const hi=Math.max(r,g,b),lo=Math.min(r,g,b),d=hi-lo,l=(hi+lo)/2;if(!d)return[0,0,l];const s=d/(1-Math.abs(2*l-1));let h=hi===r?((g-b)/d)%6:hi===g?(b-r)/d+2:(r-g)/d+4;return[(h*60+360)%360,s,l];}
function rgb(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;const v=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return v.map(n=>Math.round((n+m)*255));}
const tintCache=new Map();
function tinted(index,color){
 const frame=nari[index];if(!frame||color===0)return frame?.canvas;
 const key=index+':'+color;if(tintCache.has(key))return tintCache.get(key);
 const out=makeCanvas(frame.width,frame.height),ctx=out.getContext('2d',{willReadFrequently:true});ctx.drawImage(frame.canvas,0,0);
 const image=ctx.getImageData(0,0,out.width,out.height),d=image.data;
 const hex=COLORS[color]||COLORS[0],target=hsl(...[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)));
 for(let y=0;y<out.height;y++)for(let x=0;x<out.width;x++){
  const i=(y*out.width+x)*4;if(d[i+3]<8)continue;const [h,s,l]=hsl(d[i],d[i+1],d[i+2]),yn=y/out.height,dx=Math.abs(x-frame.anchor)/out.height;
  const green=h>=47&&h<=170&&s>.045;
  const coat=index===4&&h>=32&&h<70&&s>.20&&dx<(yn<.60?.18:.225);
  const explorer=index===6&&yn<.67&&dx<.18&&h>=38&&h<90&&s>.08&&s<.65&&l<.8;
  if(yn<.25||yn>.84||(!green&&!coat&&!explorer))continue;
  const next=rgb(target[0],clamp(target[1]*(.86+s*.65),.08,.72),clamp((l-(index===4?.56:.45))*.86+target[2]*.85,.10,.94));
  d[i]=next[0];d[i+1]=next[1];d[i+2]=next[2];
 }
 ctx.putImageData(image,0,0);tintCache.set(key,out);if(tintCache.size>24)tintCache.delete(tintCache.keys().next().value);return out;
}

export function drawMoru(c,x,feet,height=120,t=0,opts={}){
 if(!moru.length)return vectorMoru(c,x,feet,height,t,opts);
 const vy=opts.vy||0,landing=clamp(opts.land||0,0,1);let index=0;
 if(landing>.45)index=4;else if(vy<-680)index=5;else if(vy<-125)index=1;else if(vy>150)index=3;else if(opts.jump||Math.abs(vy)>5)index=2;
 const frame=moru[index],s=height/moru[0].height;
 c.save();c.translate(x,feet);c.rotate(opts.tilt||Math.sin(t*1.8)*.012);
 c.scale(1+landing*.06,1-landing*.04);
 const breathing=index===0?Math.sin(t*2)*height*.008:0;
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.drawImage(frame.canvas,-frame.anchor*s,-frame.height*s+breathing,frame.width*s,frame.height*s);c.restore();
}

function accessory(c,index,x,bottom,width,height){const f=accessories[index];if(!f)return;const h=height??width*f.height/f.width;c.drawImage(f.canvas,x-width/2,bottom-h,width,h);}
const handCache=new Map();
function hands(frame,index){if(handCache.has(index))return handCache.get(index);const out=makeCanvas(frame.width,frame.height),cc=out.getContext('2d',{willReadFrequently:true});cc.drawImage(frame.canvas,0,0);const im=cc.getImageData(0,0,out.width,out.height),d=im.data;for(let y=0;y<out.height;y++)for(let x=0;x<out.width;x++){const i=(y*out.width+x)*4,[h,s,l]=hsl(d[i],d[i+1],d[i+2]),yn=y/out.height,dx=Math.abs(x-frame.anchor)/out.height;if(!(yn>.48&&yn<.60&&dx>.105&&dx<.18&&h>15&&h<48&&s>.13&&l>.4))d[i+3]=0;}cc.putImageData(im,0,0);handCache.set(index,out);return out;}

export function drawNari(c,x,feet,height=370,t=0,look={}){
 if(!nari.length)return vectorNari(c,x,feet,height,t,look);
 const o={dress:0,color:0,hat:0,shoes:0,prop:0,...look},frame=nari[o.dress]||nari[0],sprite=tinted(o.dress,o.color);
 const s=height/frame.height,breathe=Math.sin(t*1.8)*.002,motion=clamp(o.motion||0,0,1);
 c.save();c.translate(x,feet);c.rotate(Math.sin(t*1.25)*.006+Math.sin(t*5)*motion*.006);c.scale(1-breathe*.4,1+breathe);
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 // A small contact shadow makes the feet meet the ground without muddying the art.
 c.save();c.fillStyle='#4e503b18';c.beginPath();c.ellipse(0,height*.006,height*.075,height*.008,0,0,Math.PI*2);c.fill();c.restore();
 // Wearable parts include the head/ears or shins, so there is no floating hat or shoe.
 if(o.hat&&wearables.length){const head=wearables[o.hat],hs=height*.40/wearables[0].height;c.drawImage(head.canvas,-head.width*hs/2,-height*.60-head.height*hs,head.width*hs,head.height*hs);}
 if(o.shoes&&wearables.length){const leg=wearables[4+o.shoes],ls=height*.208/wearables[4].height;c.drawImage(leg.canvas,-leg.width*ls/2,-leg.height*ls,leg.width*ls,leg.height*ls);}
 c.save();c.beginPath();
 if(o.hat&&wearables.length){c.moveTo(-height*.05,-height*.765);c.lineTo(height*.05,-height*.765);c.lineTo(height*.148,-height*.70);c.lineTo(height*.158,-height*.505);c.lineTo(height,-height*.505);c.lineTo(height,height*.1);c.lineTo(-height,height*.1);c.lineTo(-height,-height*.505);c.lineTo(-height*.158,-height*.505);c.lineTo(-height*.148,-height*.70);c.closePath();c.clip();}
 if(o.shoes&&wearables.length){c.beginPath();c.rect(-height,-height*1.4,height*2,height*1.4-height*.18);c.clip();}
 c.drawImage(sprite,-frame.anchor*s,-height,frame.width*s,height);
 c.restore();
 const handX=height*.134,handY=-height*.432;
 if(o.prop===1)accessory(c,6,handX+height*.013,handY+height*.025,height*.145,height*.213);
 if(o.prop===2)accessory(c,7,handX+height*.015,handY+height*.078,height*.126,height*.161);
 if(o.prop===3){c.save();c.strokeStyle='#7a583e';c.lineWidth=height*.01;c.beginPath();c.moveTo(-height*.095,-height*.722);c.quadraticCurveTo(height*.025,-height*.53,height*.15,-height*.413);c.stroke();c.strokeStyle='#c9a271';c.lineWidth=height*.005;c.stroke();c.restore();accessory(c,8,handX+height*.015,handY+height*.10,height*.19,height*.17);}
 if(o.prop===4){c.save();c.translate(handX,handY+height*.025);c.rotate(.28+Math.sin(t*1.6)*.025);accessory(c,9,0,0,height*.083,height*.28);c.restore();}
 if(o.prop)c.drawImage(hands(frame,o.dress),-frame.anchor*s,-height,frame.width*s,height);
 c.restore();
}

export function drawWardrobeItem(canvas,category,index){
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);let f;
 if(category==='dress')f=garments[index];
 else if(category==='hat'&&index)f=accessories[index-1];
 else if(category==='shoes'&&index)f=accessories[index===1?3:index===2?4:5];
 else if(category==='prop'&&index)f=accessories[index+5];
 if(f){const s=Math.min((w-24)/f.width,(h-12)/f.height);c.drawImage(f.canvas,(w-f.width*s)/2,(h-f.height*s)/2,f.width*s,f.height*s);}
 else{c.strokeStyle='#a59c7b';c.lineWidth=2;c.beginPath();c.arc(w/2,h/2,17,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(w/2-11,h/2+11);c.lineTo(w/2+11,h/2-11);c.stroke();}
}
export const paintedArtStatus={moru:moru.length,nari:nari.length,accessories:accessories.length,wearables:wearables.length,garments:garments.length};
