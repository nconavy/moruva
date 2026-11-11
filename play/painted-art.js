// Painted character atlases keep the approved cast's original illustration.
// Existing game and wardrobe IDs remain unchanged.
import {drawMoru as vectorMoru,drawNari as vectorNari,pixelTori as fallbackTori,COLORS} from './art-v2.js?v=20261112-game4';
export {COLORS,ellipse,round,star,flower,line,shape,clouds,pixelLandscape,pixelObstacle,wardrobeBackground} from './art-v2.js?v=20261112-game4';

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
  result.push({canvas:crop,width:crop.width,height:crop.height,anchor:mass?total/mass:crop.width/2,cellX:x0,cellY:y0,cellWidth:cw,cellHeight:ch});
 }
 img.src='';return result;
}

let moru=[],nari=[],accessories=[],wearables=[],garments=[],moruSide=[],tori=[],hats=[],toriSlide=[];
const ready=await Promise.allSettled([
 atlas('./assets/moru-painted-v3.png',3,2),
 atlas('./assets/nari-painted-a-v3.png',2,2),
 atlas('./assets/nari-painted-b-v3.png',2,2),
 atlas('./assets/nari-accessories-v3.png',5,2),
 atlas('./assets/nari-wearables-v3.png',4,2),
 atlas('./assets/nari-garments-v3.png',4,2),
 atlas('./assets/moru-direction-v4.png',2,2),
 atlas('./assets/tori-pixel-v4.png',4,2),
 atlas('./assets/nari-hats-v4.png',3,1),
 atlas('./assets/tori-slide-v4.png',1,1)
]);
if(ready[0].status==='fulfilled')moru=ready[0].value;
if(ready[1].status==='fulfilled'&&ready[2].status==='fulfilled')nari=[...ready[1].value,...ready[2].value];
if(ready[3].status==='fulfilled')accessories=ready[3].value;
if(ready[4].status==='fulfilled')wearables=ready[4].value;
if(ready[5].status==='fulfilled')garments=ready[5].value;
if(ready[6].status==='fulfilled')moruSide=ready[6].value;
if(ready[7].status==='fulfilled')tori=ready[7].value;
if(ready[8].status==='fulfilled')hats=ready[8].value;
if(ready[9].status==='fulfilled')toriSlide=ready[9].value;
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
 const directional=opts.facing&&moruSide.length;
 const sideIndex=landing>.45?0:vy<-125?1:vy>150?3:opts.jump||Math.abs(vy)>5?2:0;
 const frame=directional?moruSide[sideIndex]:moru[index],s=height/(directional?moruSide[0].height:moru[0].height);
 c.save();c.translate(x,feet);c.rotate(opts.tilt||Math.sin(t*1.8)*.012);
 c.scale((opts.facing<0?-1:1)*(1+landing*.06),1-landing*.04);
 const breathing=index===0?Math.sin(t*2)*height*.008:0;
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.drawImage(frame.canvas,-frame.anchor*s,-frame.height*s+breathing,frame.width*s,frame.height*s);c.restore();
}

// Nearest-neighbour rendering keeps the generated Tori on a real, coarse pixel grid.
const toriPixels=tori.map(f=>{const s=52/tori[0].height,out=makeCanvas(Math.max(1,Math.round(f.width*s)),Math.max(1,Math.round(f.height*s))),cc=out.getContext('2d',{willReadFrequently:true});cc.imageSmoothingEnabled=false;cc.drawImage(f.canvas,0,0,out.width,out.height);const im=cc.getImageData(0,0,out.width,out.height);for(let i=0;i<im.data.length;i+=4)im.data[i+3]=im.data[i+3]>100?255:0;cc.putImageData(im,0,0);return{canvas:out,width:out.width,height:out.height,anchor:(f.cellWidth*.57-f.cellX)*s,baseline:(f.cellHeight*.88-f.cellY)*s};});
if(toriSlide.length){const f=toriSlide[0],out=makeCanvas(Math.round(f.width/f.height*21),21),cc=out.getContext('2d',{willReadFrequently:true});cc.imageSmoothingEnabled=false;cc.drawImage(f.canvas,0,0,out.width,out.height);const im=cc.getImageData(0,0,out.width,out.height);for(let i=0;i<im.data.length;i+=4)im.data[i+3]=im.data[i+3]>100?255:0;cc.putImageData(im,0,0);toriPixels[7]={canvas:out,width:out.width,height:out.height,anchor:out.width*.42,baseline:21};}
export function pixelTori(c,x,feet,t=0,slide=false,air=false,scale=1,opts={}){
 if(!toriPixels.length)return fallbackTori(c,x,feet,t,slide,air,scale,opts);
 const run=[0,1,2,3,4,5],rate=clamp((opts.speed||360)/360,1,1.65)*10;
 const index=slide?7:air?6:run[Math.floor(t*rate)%run.length],f=toriPixels[index];
 const unit=3.5*scale;
 c.save();c.imageSmoothingEnabled=false;
 const base=slide||air?f.height:f.baseline;
 c.drawImage(f.canvas,Math.round(x-f.anchor*unit),Math.round(feet-base*unit),Math.round(f.width*unit),Math.round(f.height*unit));c.restore();
}

function accessory(c,index,x,bottom,width,height){const f=accessories[index];if(!f)return;const h=height??width*f.height/f.width;c.drawImage(f.canvas,x-width/2,bottom-h,width,h);}
const handCache=new Map();
function hands(frame,index){if(handCache.has(index))return handCache.get(index);const out=makeCanvas(frame.width,frame.height),cc=out.getContext('2d',{willReadFrequently:true});cc.drawImage(frame.canvas,0,0);const im=cc.getImageData(0,0,out.width,out.height),d=im.data;for(let y=0;y<out.height;y++)for(let x=0;x<out.width;x++){const i=(y*out.width+x)*4,[h,s,l]=hsl(d[i],d[i+1],d[i+2]),yn=y/out.height,dx=Math.abs(x-frame.anchor)/out.height;if(!(yn>.48&&yn<.60&&dx>.105&&dx<.18&&h>15&&h<48&&s>.13&&l>.4))d[i+3]=0;}cc.putImageData(im,0,0);handCache.set(index,out);return out;}

const legCache=new Map();
function rowSpans(f){const d=f.canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,f.width,f.height).data,rows=[];for(let y=0;y<f.height;y++){const halves=[];for(let side=0;side<2;side++){let l=f.width,r=-1;const from=side?Math.floor(f.width/2):0,to=side?f.width:Math.floor(f.width/2);for(let x=from;x<to;x++)if(d[(y*f.width+x)*4+3]>100){l=Math.min(l,x);r=x;}halves.push(r>=l?[l,r]:null);}rows.push(halves);}return rows;}
// Preserve the original calves; only replace footwear below each shoe's opening.
function fittedLegs(frame,index,shoe){
 const key=index+':'+shoe;if(legCache.has(key))return legCache.get(key);
 const part=wearables[4+shoe],out=makeCanvas(frame.width,frame.height),cc=out.getContext('2d'),targetRows=rowSpans(frame),partRows=rowSpans(part);
 const feet=[0,1].map(side=>{let left=frame.width,right=0;for(let y=Math.floor(frame.height*.94);y<frame.height;y++){const r=targetRows[y][side];if(r){left=Math.min(left,r[0]);right=Math.max(right,r[1]);}}return{center:(left+right)/2,width:right-left+1};});
 const shoeStart=shoe===1?.40:shoe===2?.68:.62;
 const soleWidth=[0,1].map(side=>Math.max(...partRows.slice(Math.floor(part.height*shoeStart)).map(r=>r[side]?r[side][1]-r[side][0]+1:0)));
 const top=Math.round(frame.height*.78),span=frame.height-top,join=top+span*shoeStart;
 const centers=[0,1].map(side=>{const r=targetRows[Math.floor(join)][side];return r?(r[0]+r[1])/2:feet[side].center;});
 for(let y=top;y<frame.height;y++){
  const u=(y-top)/(span-1),py=Math.min(part.height-1,Math.round(u*(part.height-1)));
  if(y<join)continue;cc.globalAlpha=clamp((y-join)/2,0,1);
  for(let side=0;side<2;side++){
   const target=targetRows[y][side],src=partRows[py][side];if(!src)continue;
   const nativeWidth=(src[1]-src[0]+1)*feet[side].width/soleWidth[side];
   const width=nativeWidth,center=centers[side];
   cc.drawImage(part.canvas,src[0],py,src[1]-src[0]+1,1,center-width/2,y,width,1.02);
  }
 }
 cc.globalAlpha=1;legCache.set(key,out);return out;
}
function drawHat(c,height,hat){
 // Only the crown accessory overlaps the original head; the original neck stays intact.
 const f=hats[hat-1];if(!f)return;const width=height*(hat===1?.34:hat===2?.285:.30),h=width*f.height/f.width;
 c.drawImage(f.canvas,-width/2,-height*.89-h,width,h);
}

export function drawNari(c,x,feet,height=370,t=0,look={}){
 if(!nari.length)return vectorNari(c,x,feet,height,t,look);
 const o={dress:0,color:0,hat:0,shoes:0,prop:0,...look},frame=nari[o.dress]||nari[0],sprite=tinted(o.dress,o.color);
 const s=height/frame.height,breathe=Math.sin(t*1.8)*.002,motion=clamp(o.motion||0,0,1);
 c.save();c.translate(x,feet);c.rotate(Math.sin(t*1.25)*.006+Math.sin(t*5)*motion*.006);c.scale(1-breathe*.4,1+breathe);
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 // A small contact shadow makes the feet meet the ground without muddying the art.
 c.save();c.fillStyle='#4e503b18';c.beginPath();c.ellipse(0,height*.006,height*.075,height*.008,0,0,Math.PI*2);c.fill();c.restore();
 c.save();c.beginPath();
 if(o.shoes&&wearables.length){const opening=.78+.22*(o.shoes===1?.40:o.shoes===2?.68:.62)+.004;c.beginPath();c.rect(-height,-height*1.4,height*2,height*(.4+opening));c.clip();}
 c.drawImage(sprite,-frame.anchor*s,-height,frame.width*s,height);
 c.restore();
 if(o.shoes&&wearables.length)c.drawImage(fittedLegs(frame,o.dress,o.shoes),-frame.anchor*s,-height,frame.width*s,height);
 if(o.hat&&wearables.length)drawHat(c,height,o.hat);
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
 else if(category==='hat'&&index)f=hats[index-1]||accessories[index-1];
 else if(category==='shoes'&&index)f=accessories[index===1?3:index===2?4:5];
 else if(category==='prop'&&index)f=accessories[index+5];
 if(f){const s=Math.min((w-24)/f.width,(h-12)/f.height);c.drawImage(f.canvas,(w-f.width*s)/2,(h-f.height*s)/2,f.width*s,f.height*s);}
 else{c.strokeStyle='#a59c7b';c.lineWidth=2;c.beginPath();c.arc(w/2,h/2,17,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(w/2-11,h/2+11);c.lineTo(w/2+11,h/2-11);c.stroke();}
}
export const paintedArtStatus={moru:moru.length,moruDirections:moruSide.length,tori:toriPixels.length,nari:nari.length,accessories:accessories.length,wearables:wearables.length,garments:garments.length,hats:hats.length};
