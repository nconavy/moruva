// MORUVA artwork, second edition. All artwork is drawn locally from shapes.
// Existing coordinates and wardrobe IDs are deliberately preserved.
import {COLORS,ellipse,round,star,flower,line,shape} from './art.js?v=20261112-game4';
export {COLORS,ellipse,round,star,flower,line,shape} from './art.js?v=20261112-game4';
const INK='#725240',SKIN='#ffe5bd';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mod=(v,m)=>(v%m+m)%m;
const mix=(a,b,t)=>{a=a.replace('#','');b=b.replace('#','');return '#'+[0,2,4].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');};
function gradient(c,x,y,w,h,a,b,mid){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);if(mid)g.addColorStop(.48,mid);g.addColorStop(1,b);return g;}
function path(c,d,fill,stroke=INK,width=1.4){shape(c,d,fill,stroke,width);}
function stroke(c,d,color=INK,width=1){path(c,d,'transparent',color,width);}
function soft(c,x,y,rx,ry,color){const g=c.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');c.save();c.translate(x,y);c.scale(1,ry/rx);ellipse(c,0,0,rx,rx,g);c.restore();}
function button(c,x,y,r=3){ellipse(c,x,y,r,r,gradient(c,x-r,y-r,r*2,r*2,'#fff6dc','#cbb287'),INK,.65);ellipse(c,x-r*.22,y-r*.15,.5,.5,'#896c4d');ellipse(c,x+r*.22,y+r*.15,.5,.5,'#896c4d');}
function stitched(c,d,color='#efd8ae',width=.7){c.save();c.setLineDash([1.5,1.8]);stroke(c,d,color,width);c.restore();}
function fabric(c,d,color,bounds,pattern=0){const [x,y,w,h]=bounds;path(c,d,gradient(c,x,y,w,h,mix(color,'#fff7dd',.16),mix(color,'#293f3e',.24),color));c.save();c.clip(new Path2D(d));
 for(let i=0;i<5;i++){const xx=x+w*(i+.4)/5;stroke(c,`M${xx} ${y+12} Q${xx-7} ${y+h*.5} ${xx-3} ${y+h+7}`,i%2?'#fffce820':'#354a4522',i%2?2:3.5);}
 if(pattern===1){for(let j=0;j<7;j++)for(let i=0;i<7;i++){const xx=x+5+i*10+(j%2)*5,yy=y+12+j*14;flower(c,xx,yy,1.7,'#fff3dc');line(c,xx,yy+2,xx-1,yy+5,'#6b8d6977',.6);}}
 if(pattern===2){c.strokeStyle='#fffae622';c.lineWidth=.8;for(let i=0;i<15;i++)line(c,x+i*6,y,x+i*6,y+h,'#fffae622',.6);for(let i=0;i<15;i++)line(c,x,y+i*6,x+w,y+i*6,'#fffae622',.6);}
 c.restore();}
function eyes(c,y,separation=16,t=0,emotion='happy'){const blink=t>0&&mod(t,5.3)>5.12;for(const side of [-1,1]){const x=side*separation;if(blink){stroke(c,`M${x-5} ${y} Q${x} ${y+3} ${x+5} ${y}`,'#6c4832',1.8);}else{ellipse(c,x,y,5.4,7.4,'#fff8dc');ellipse(c,x+.6,y+.4,4.5,6.6,gradient(c,x-3,y-7,6,14,'#4d3326','#b67c39'));ellipse(c,x+.8,y+1,2.6,4.7,'#3d3026');ellipse(c,x-1.1,y-3,1.7,2.1,'#fffef3');ellipse(c,x+2,y+3.3,.85,1.1,'#ffdc8b');stroke(c,`M${x-5} ${y-3} Q${x-3} ${y-9} ${x+3} ${y-7}`,'#6f4e3b',1.1);}
 const cheek=c.createRadialGradient(x+side*5,y+13,0,x+side*5,y+13,8);cheek.addColorStop(0,'#ee9d7d99');cheek.addColorStop(1,'#ee9d7d00');ellipse(c,x+side*5,y+13,8,5,cheek);}
 ellipse(c,.2,y+9,2.2,1.5,'#ac7650');if(emotion==='surprise'){ellipse(c,0,y+18,3.2,4,'#86553a');ellipse(c,0,y+20,2.1,1.2,'#d7977b');}else{stroke(c,`M-6 ${y+16} Q0 ${y+22} 7 ${y+16}`,'#8d6042',1.15);}}

export function drawMoru(c,x,feet,height=120,t=0,opts={}){
 const land=clamp(opts.land||0,0,1),vy=opts.vy??(opts.jump?-300:0),air=opts.jump||Math.abs(vy)>30,up=vy<0;
 const stretch=air?clamp(-vy/11000,-.025,.045):0;const sx=1+land*.15-stretch,sy=1-land*.16+stretch;
 c.save();c.translate(x,feet);const scale=height/166;c.scale(scale*(opts.flip?-1:1),scale);c.rotate(opts.tilt??clamp((opts.vx||0)/2400,-.12,.12));c.scale(sx,sy);
 const breath=air?0:Math.sin(t*2.4)*1.1,headBob=Math.sin(t*2.4)*.7,legLift=air?(up?7:2):0;
 for(const side of [-1,1]){c.save();c.translate(side*18,-legLift+(opts.walk?Math.sin(t*14+side)*4:0));c.rotate(air?side*(up?-.13:.07):0);
 path(c,'M-9 -34 Q1 -38 10 -33 L10 -10 Q18 -8 19 -2 Q19 5 6 6 L-8 6 Q-18 4 -16 -3 L-10 -10 Z',gradient(c,-10,-34,25,40,'#4e9388','#28645e'));
 path(c,'M-12 -5 Q-3 -11 9 -7 Q20 -5 18 1 Q14 7 -1 6 Q-15 7 -17 2 Z',gradient(c,-14,-8,31,13,'#fff0d1','#e0ba87'));
 stroke(c,'M-5 -3 Q-2 0 -4 5 M4 -4 Q8 0 5 5','#b98c62',.9);ellipse(c,-5,-6,6,1.8,'#fff8df88');c.restore();}
 c.translate(0,breath);
 path(c,'M-24 -86 Q-35 -80 -37 -63 L-27 -55 L-15 -72 L15 -72 L27 -55 L37 -63 Q35 -81 24 -86 Z',gradient(c,-28,-87,56,36,'#fff6dd','#e7c99c'));
 for(const side of [-1,1]){c.save();c.translate(side*27,-76);c.rotate(side*(air?(up?.55:-.36):Math.sin(t*2.4)*.045));c.scale(side,1);
 path(c,'M-2 -3 Q9 -3 13 8 L15 26 Q22 31 18 39 Q12 46 5 39 Q0 35 2 26 L-2 12 Z',gradient(c,0,0,18,40,'#55968a','#2e7067'));
 path(c,'M3 26 Q6 23 10 27 Q16 25 20 30 Q23 35 18 40 Q12 45 7 40 Q3 37 3 32 Z',gradient(c,3,25,19,18,'#fff1d3','#e6bc8b'));stroke(c,'M9 34 L9 39 M14 33 L15 38','#b58a62',.7);
 path(c,'M-4 -6 L8 -5 Q15 1 15 9 L1 14 Q-5 6 -4 -6 Z',gradient(c,-3,-6,20,18,'#fff5db','#e1bc8a'));stitched(c,'M2 10 L13 6','#caa77a');c.restore();}
 const overall='M-25 -78 L-24 -52 Q-33 -38 -27 -27 Q-21 -20 -6 -24 L0 -28 L6 -24 Q21 -20 27 -27 Q33 -38 24 -52 L25 -78 L15 -83 L11 -62 L-11 -62 L-15 -83 Z';
 fabric(c,overall,'#c57445',[-28,-83,56,63]);path(c,'M-15 -48 Q0 -44 15 -48 L14 -36 Q0 -28 -14 -36 Z',gradient(c,-15,-48,30,17,'#dc9561','#bc653a'));stitched(c,'M-12 -44 L-11 -37 Q0 -31 11 -37 L12 -44');
 stroke(c,'M0 -29 L0 -39','#a55735',1);stroke(c,'M-23 -28 L-7 -28 M7 -28 L23 -28','#e7ab72',2.5);for(const side of [-1,1]){button(c,side*18,-62,4.6);stitched(c,`M${side*19} -76 L${side*15} -66`);}
 path(c,'M-13 -84 L0 -74 L13 -84 L9 -89 L-9 -89 Z','#fff1d4');
 c.save();c.translate(0,headBob);c.rotate(clamp((opts.vx||0)/6000,-.04,.04));
 for(const side of [-1,1]){c.save();c.translate(side*36,-106);c.rotate(side*(Math.sin(t*3)*.035+(air?clamp(vy/8000,-.07,.07):0)));c.scale(side,1);path(c,'M-6 -14 Q4 -11 7 -2 Q10 5 14 9 Q17 16 10 20 Q1 25 -7 17 Q-12 11 -8 2 Z',gradient(c,-9,-13,25,36,'#57998a','#2e6e65'));path(c,'M1 1 Q6 7 11 11 Q15 17 7 19 Q-2 21 -6 14 Q-7 7 1 1 Z',gradient(c,-5,1,20,20,'#fff0d0','#e9bf8c'),INK,1);c.restore();}
 path(c,'M-43 -120 Q-43 -142 -24 -152 Q-4 -161 18 -154 Q41 -148 43 -125 Q47 -103 31 -91 Q1 -76 -31 -91 Q-45 -101 -43 -120 Z',gradient(c,-39,-153,80,70,'#65a291','#2f7169','#42877a'));
 path(c,'M-35 -111 Q-35 -133 -20 -133 Q-9 -134 0 -121 Q9 -134 21 -132 Q37 -130 36 -111 Q33 -88 0 -86 Q-34 -88 -35 -111 Z',gradient(c,-33,-137,70,55,'#fff0d4','#edc999','#ffe8c1'));
 c.save();c.translate(0,-152);c.rotate(Math.sin(t*3)*.03+(up?-.06:0));path(c,'M-5 4 Q-18 -5 -11 -15 Q-3 -24 8 -18 Q20 -13 13 -3 Q8 4 0 3 Q8 -3 5 -9 Q2 -13 -3 -10 Q-8 -8 -5 4 Z',gradient(c,-13,-20,31,26,'#fff6dd','#e5c597'));stroke(c,'M-8 -13 Q-3 -20 6 -14','#fffbed',1.4);c.restore();
 eyes(c,-116,16,t,!up&&vy>480?'surprise':'happy');ellipse(c,-23,-145,8,2,'#c2e0c444');c.restore();c.restore();
}

export function drawNari(c,x,feet,height=370,t=0,look={}){
 const o={dress:0,color:0,hat:0,shoes:0,prop:0,...look};const breath=Math.sin(t*1.8)*.75,sway=Math.sin(t*1.35)*.012,accent=clamp(look.motion||0,0,1);
 c.save();c.translate(x,feet);c.scale(height/242,height/242);c.rotate(sway*.22);const dressColor=COLORS[o.color]||COLORS[0];
 // Feet are anchored; the upper body and cloth have separate motion.
 for(const s of [-1,1]){c.save();c.translate(s*10,0);c.scale(s,1);path(c,'M-4 -52 L6 -52 L6 -12 Q5 -8 13 -5 Q20 1 13 4 Q3 6 -5 3 Q-10 0 -7 -5 Z',gradient(c,-6,-50,25,55,'#ffedce','#e7c08c'));stroke(c,'M6 -1 L7 4 M11 -1 L12 3','#b78b61',.65);
 if(o.shoes===1){path(c,'M-7 -27 L8 -27 L8 -9 Q22 -5 17 3 Q3 7 -9 2 Z',gradient(c,-8,-26,28,31,'#ecc66d','#b78b3e'));path(c,'M-8 0 Q6 5 19 0 L18 5 Q4 9 -9 5 Z','#796044',INK,.8);line(c,-6,-22,7,-22,'#fff0ae',1.5);button(c,4,-16,1.8);}
 if(o.shoes===2){path(c,'M-7 -6 Q-2 -11 7 -8 Q20 -7 19 1 Q14 7 -7 4 Z',gradient(c,-8,-10,28,17,'#b7746b','#814c4a'));stroke(c,'M-3 -8 L3 -1 L9 -6','#f4d1ad',2.7);button(c,4,-1,1.6);line(c,-5,5,16,5,'#674b3e',1.5);}
 if(o.shoes===3){path(c,'M-7 -10 L5 -10 L8 -5 Q18 -4 19 2 Q8 7 -9 4 Z',gradient(c,-7,-10,28,18,'#fff6e0','#d3c7a9'));path(c,'M-9 1 Q7 6 20 0 L20 5 Q4 9 -9 5 Z','#8e9b86',INK,.8);for(let i=0;i<3;i++)line(c,-3+i*2,-7+i*2,4+i*2,-7+i*2,'#789386',1);}
 c.restore();}
 c.translate(0,breath);
 // Long ivory ears swing behind the body independently.
 for(const s of [-1,1]){c.save();c.translate(s*26,-216);c.rotate(s*(Math.sin(t*1.6+s*.4)*.018+accent*.03));c.scale(s,1);path(c,'M-6 -8 Q13 -1 20 30 Q28 57 27 77 Q26 91 17 93 Q4 93 2 78 Q1 49 -6 20 Z',gradient(c,0,-9,31,102,'#fff0d6','#e4bc8e','#ffe3bb'));path(c,'M5 10 Q16 30 19 63 Q24 83 17 85 Q8 85 8 66 Q7 36 2 18 Z',gradient(c,4,10,18,75,'#e5bf98','#f2d3ad'),null);stroke(c,'M-1 8 Q8 43 8 69','#fff8df77',1);c.restore();}
 c.save();c.transform(1,0,0,1.28,0,11.2);
 path(c,'M-8 -158 L-9 -147 L-24 -141 Q-30 -123 -22 -112 L-16 -128 L16 -128 L22 -112 Q30 -123 24 -141 L9 -147 L8 -158 Z',gradient(c,-28,-155,56,45,'#fff4da','#dfb88b'));
 // Articulated sleeves and hands with soft elbow bends.
 for(const s of [-1,1]){c.save();c.translate(s*22,-138);c.rotate(s*(Math.sin(t*1.8+.5)*.012+accent*.025));c.scale(s,1);path(c,'M0 5 Q11 6 13 18 L11 33 L14 46 Q17 52 12 57 Q7 58 4 53 L2 40 L0 23 Z',gradient(c,0,5,18,52,'#ffeac8','#dfb383'));stroke(c,'M8 49 L8 54 M11 48 L12 53','#b98961',.6);
 path(c,'M-4 -4 Q6 -9 12 0 Q20 10 17 23 Q12 29 2 26 L-4 15 Z',gradient(c,-5,-6,25,35,'#fff7e4','#e3c298'));path(c,'M1 23 L17 21 L16 28 L3 30 Z','#fdf1d9',INK,.9);stroke(c,'M5 0 Q8 11 6 20 M12 8 L13 18','#d4b58c',.7);button(c,12,25,1.4);c.restore();}
 // Garments: the skirt is gently sheared around the waist instead of bobbing as one block.
 c.save();c.translate(0,-110);c.transform(1,0,sway,1,0,0);c.translate(0,110);
 const dc=o.dress===4?'#e6b64f':o.dress===6?'#88a18a':dressColor;
 let hem=-45;
 if(o.dress===3){const d='M-19 -143 L-16 -111 Q-20 -72 -39 -38 Q-22 -29 0 -31 Q22 -29 39 -38 Q20 -72 16 -111 L19 -143 L9 -148 L0 -136 L-9 -148 Z';fabric(c,d,dc,[-40,-145,80,115]);path(c,'M-15 -111 Q0 -105 15 -111 L15 -106 Q0 -100 -15 -106 Z','#d5bc79',INK,.6);for(let j=0;j<3;j++)for(let i=0;i<3;i++){const xx=(i-1)*(13+j*3),yy=-91+j*20;star(c,xx,yy,2.6,'#fae7ae',.1);ellipse(c,xx+7,yy-5,.7,.7,'#fff3cf');}stroke(c,'M-36 -38 Q0 -24 36 -38','#ead49b',1.7);stitched(c,'M-33 -42 Q0 -30 33 -42','#f4dfb1',.6);hem=-31;}
 else if(o.dress===4){const d='M-19 -149 Q-33 -146 -39 -125 L-33 -115 L-23 -124 L-29 -49 Q0 -37 29 -49 L23 -124 L33 -115 L39 -125 Q33 -146 19 -149 Z';fabric(c,d,dc,[-40,-150,80,108]);path(c,'M-18 -147 Q0 -133 18 -147 L13 -132 L0 -128 L-13 -132 Z','#f9d684');line(c,0,-130,0,-46,'#b5893c',1);for(let i=0;i<4;i++)button(c,4,-120+i*18,2);for(const s of [-1,1]){path(c,`M${s*7} -83 L${s*21} -83 L${s*20} -67 Q${s*14} -63 ${s*8} -67 Z`,'#f1c762');stitched(c,`M${s*9} -80 L${s*10} -68 L${s*18} -68`,'#fff0b6',.6);}stroke(c,'M-23 -51 Q0 -44 23 -51','#fbe1a0',1.3);}
 else if(o.dress===6){const d='M-20 -143 L-17 -107 L-26 -68 Q0 -57 26 -68 L17 -107 L20 -143 L9 -147 L0 -135 L-9 -147 Z';fabric(c,d,dc,[-26,-146,52,85]);fabric(c,'M-23 -66 L-22 -36 L-3 -35 L0 -58 L3 -35 L22 -36 L23 -66 Z','#bc936b',[-24,-67,48,33]);for(const s of [-1,1]){path(c,`M${s*5} -125 L${s*17} -125 L${s*17} -111 L${s*5} -111 Z`,'#aabd9e',INK,.7);button(c,s*11,-120,1.3);stitched(c,`M${s*6} -38 L${s*20} -39`,'#ead6ac',.5);}line(c,-20,-80,20,-80,'#765f43',4);round(c,-5,-84,10,8,1,'#d8ba73');round(c,-2.5,-81.5,5,3,0,'#827153');}
 else{const d='M-19 -143 L-16 -111 L-34 -48 Q-18 -39 0 -40 Q18 -39 34 -48 L16 -111 L19 -143 L11 -145 L9 -130 L-9 -130 L-11 -145 Z';fabric(c,d,dc,[-35,-145,70,108],o.dress===7?1:o.dress===1?2:0);path(c,'M-17 -112 Q0 -108 17 -112 L18 -107 Q0 -102 -18 -107 Z',mix(dc,'#385348',.12),INK,.65);button(c,0,-109,1.8);stroke(c,'M-30 -48 Q0 -37 30 -48',mix(dc,'#fff7d9',.35),1.8);stitched(c,'M-29 -51 Q0 -41 29 -51','#f6efce88',.5);
 if(o.dress===1){const apron='M-12 -127 L12 -127 L13 -108 L24 -56 Q0 -45 -24 -56 L-13 -108 Z';fabric(c,apron,'#f7e9cd',[-25,-128,50,80]);path(c,'M-10 -90 L10 -90 L9 -76 Q0 -72 -9 -76 Z','#f4dfbd',INK,.55);for(let j=0;j<3;j++)for(let i=0;i<3;i++)flower(c,(i-1)*10,-71+j*7,1.4,['#c9907b','#e4b47e','#97ab85'][(i+j)%3]);stitched(c,'M-20 -56 Q0 -48 20 -56','#c6ac81',.6);}
 if(o.dress===2){path(c,'M-22 -145 L0 -126 L22 -145 L19 -132 L0 -116 L-19 -132 Z','#fff6df');stroke(c,'M-18 -141 L0 -125 L18 -141','#88a6b7',.8);path(c,'M-4 -124 L4 -124 L4 -105 L0 -100 L-4 -105 Z','#bd6b60',INK,.7);stroke(c,'M-29 -50 Q0 -40 29 -50','#fff4df',2.2);}
 if(o.dress===5){for(const s of [-1,1]){c.save();c.scale(s,1);fabric(c,'M22 -146 L5 -139 L6 -113 L8 -98 Q19 -96 27 -102 L22 -124 L33 -114 L38 -127 Q33 -142 22 -146 Z','#a66c6c',[5,-147,34,51]);stitched(c,'M9 -135 L12 -103','#d5aa96',.65);for(let j=0;j<3;j++)button(c,8,-129+j*10,1);stroke(c,'M24 -141 L30 -133','#e3b9a2',.7);c.restore();}}
 }
 c.restore();
 path(c,'M-9 -147 L0 -138 L9 -147 L6 -152 L-6 -152 Z','#fff5df');button(c,0,-136,1.2);
 c.restore();
 // Original slender proportions, smaller face and longer torso.
 c.save();c.transform(.9,0,0,.75,0,-63);c.translate(0,-155);c.rotate(Math.sin(t*1.2)*.009+accent*.015);c.translate(0,155);
 ellipse(c,0,-183,31.5,35,gradient(c,-31,-218,61,70,'#fff0d7','#edc899','#ffe6bd'),INK,1.35);
 path(c,'M-30 -190 Q-38 -216 -13 -227 Q4 -239 24 -224 Q36 -217 33 -194 Q28 -202 19 -211 Q7 -198 -6 -198 Q-20 -194 -30 -190 Z',gradient(c,-32,-232,66,40,'#fff0d4','#dab081','#f3d5ae'));
 path(c,'M-32 -213 Q-20 -209 -11 -219 Q-3 -224 4 -223 Q-5 -210 -22 -207 Z','#fff2d7',null);stroke(c,'M-27 -211 Q-19 -209 -10 -216 M-15 -203 Q-2 -203 9 -214 M19 -220 Q27 -213 28 -203','#caa176',.75);
 eyes(c,-184,13,t);for(const s of [-1,1]){stroke(c,`M${s*13-4} -196 Q${s*13} -199 ${s*13+4} -196`,'#b58a61',.85);stroke(c,`M${s*13+s*4} -189 l${s*3} -2`,'#76503c',.7);}
 const ribbon=o.color===0?'#a84f4e':COLORS[(o.color+4)%8];c.save();c.translate(32,-204);c.rotate(Math.sin(t*1.8)*.03+accent*.035);
 fabric(c,'M2 2 Q-10 -12 -4 -22 Q4 -25 8 -9 Q14 -24 21 -16 Q24 -6 10 3 L22 40 L11 35 L7 13 L5 42 L-3 37 L3 3 Z',ribbon,[-7,-22,30,65]);path(c,'M7 7 Q14 19 19 34 L14 30 L8 15 Z','#ffffff20',null);ellipse(c,7,1,4.2,5.1,mix(ribbon,'#6a3338',.15),INK,.8);c.restore();
 if(o.hat===1){ellipse(c,0,-218,39,7,gradient(c,-39,-225,78,14,'#ead39b','#c39959'),INK,1);fabric(c,'M-23 -219 L-20 -236 Q0 -247 22 -235 L25 -219 Z','#e2be7e',[-24,-241,50,25],2);stroke(c,'M-24 -221 Q0 -215 25 -221',ribbon,4);for(let i=0;i<6;i++)stroke(c,`M${-30+i*12} -218 l8 4`,'#ad895744',.7);flower(c,24,-220,5,'#fff2ce');ellipse(c,22,-219,2,3,'#7f9568');}
 else if(o.hat===2){fabric(c,'M-31 -218 Q-29 -240 0 -242 Q24 -244 34 -228 Q36 -220 23 -217 Z','#ad7870',[-31,-242,66,27]);stroke(c,'M-27 -219 Q0 -224 29 -218','#7d5951',2);line(c,5,-240,6,-247,'#7e534a',2.5);stroke(c,'M-17 -235 Q-2 -241 12 -236','#e2b7a044',1.5);}
 else if(o.hat===3){stroke(c,'M-29 -216 Q0 -235 29 -216','#7c9468',2.4);for(let i=0;i<7;i++){const xx=(i-3)*9,yy=-216-Math.cos(xx/31)*9;ellipse(c,xx-3,yy+3,4,2,'#7f9e70');flower(c,xx,yy,4.6,i%2?'#fff0ce':'#d58e87');}}
 c.restore();
 // Accessories sit in the hand and inherit its subtle sway.
 c.save();c.transform(1,0,0,1.28,0,11.2);c.translate(0,Math.sin(t*1.8+.5)*.5);
 if(o.prop===1){for(let i=0;i<5;i++){const xx=42+Math.cos(i*2)*8,yy=-114+Math.sin(i*2)*9;line(c,34,-85,xx,yy,'#738c5b',1.1);ellipse(c,36+i,-98-i*2,3,1.5,'#8b9e6b');flower(c,xx,yy,4.3,['#f7d29d','#cd8a88','#fff0d1'][i%3]);}path(c,'M29 -99 L44 -101 L43 -82 L35 -80 Z',gradient(c,29,-101,17,22,'#edd6ad','#c6a273'));line(c,33,-87,43,-89,'#bc7571',2.1);}
 else if(o.prop===2){c.save();c.translate(34,-92);c.rotate(.12);round(c,-9,-17,24,32,2,'#6f8c8b',INK);round(c,-6,-15,19,28,1,'#91aaa0');line(c,-5,-14,-5,12,'#e8dcb7',1.3);star(c,4,-1,5,'#e8d39b');stitched(c,'M-1 -11 L10 -11 L10 9 L-1 9','#decea5',.5);c.restore();}
 else if(o.prop===3){stroke(c,'M-22 -140 Q-8 -110 33 -81','#836749',3.3);round(c,23,-90,28,28,5,gradient(c,23,-90,28,28,'#c7a474','#a3784b'),INK);path(c,'M24 -89 Q37 -97 50 -89 L49 -79 Q37 -73 25 -79 Z','#d1ae78');round(c,34,-82,6,8,1,'#b99259',INK);button(c,37,-78,1.3);stitched(c,'M27 -73 L27 -66 L47 -66 L47 -73','#ead4a5',.7);}
 else if(o.prop===4){line(c,33,-86,46,-140,'#a68c62',2.2);line(c,33,-86,45,-137,'#e9ce94',.7);c.save();c.translate(47,-145);c.rotate(Math.sin(t*1.6)*.06);star(c,0,0,12,'#cc9e48');star(c,0,-1,9.5,'#f5d995');star(c,-2,-4,3,'#fff4d0');c.restore();if(t>0){for(let i=0;i<3;i++){c.globalAlpha=.25+Math.sin(t*3+i)*.2;star(c,47+Math.sin(t+i*2)*17,-145+Math.cos(t+i*2)*17,1.7,'#fff4ce');}c.globalAlpha=1;}}
 c.restore();c.restore();
}

export function clouds(c,w,h,t=0,offset=0){c.save();for(let i=0;i<7;i++){const x=mod(i*173+t*(2+i%3),w+200)-90,y=40+mod(i*91,Math.max(80,h-100))+offset;const s=.65+(i%3)*.2;c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=.35+(i%3)*.12;path(c,'M-65 9 Q-78 -5 -62 -11 Q-63 -29 -39 -27 Q-33 -48 -12 -41 Q6 -58 26 -38 Q52 -44 58 -20 Q81 -15 75 3 Q71 17 44 18 L-39 18 Q-60 19 -65 9 Z',gradient(c,-70,-45,150,65,'#fffdf2','#dfeddf'),null);stroke(c,'M-52 -14 Q-46 -28 -31 -23 M-15 -39 Q6 -46 21 -31','#ffffff55',2);c.restore();}c.restore();}
function leaf(c,x,y,size,angle,color){c.save();c.translate(x,y);c.rotate(angle);path(c,`M0 0 Q${-size*.9} ${-size*.8} 0 ${-size*1.9} Q${size*.8} ${-size*.8} 0 0 Z`,color,null);line(c,0,0,0,-size*1.5,'#eef2cd22',.7);c.restore();}
function gardenPlant(c,x,y,size,t=0,pot=false){c.save();c.translate(x,y);c.scale(size,size);if(pot){path(c,'M-18 -3 L18 -3 L13 24 Q0 30 -13 24 Z',gradient(c,-18,-3,36,30,'#d4a47e','#a76c50'),INK,.8);round(c,-21,-6,42,8,3,'#d6ac86');line(c,-11,3,-8,20,'#e3bd9666',1);}
 for(let j=0;j<5;j++){const xx=(j-2)*5,yy=-35-(j%3)*11;const bend=Math.sin(t*.8+j)*2;stroke(c,`M0 0 Q${xx*1.5+bend} -20 ${xx+bend} ${yy}`,'#617e59',1.4);for(let i=1;i<4;i++){leaf(c,xx*i/4+bend,yy*i/4,5+(i%2),-.8+j*.4,['#729064','#87a471','#a1b587'][j%3]);leaf(c,xx*i/4+bend,yy*i/4,4.5,.7+j*.3,['#8fa47b','#5e815b','#b1c090'][j%3]);}if(j%2)flower(c,xx+bend,yy,4.3,j===1?'#e0a38f':'#fff0cc');}c.restore();}
function distantVillage(c,x,y,s,palette){c.save();c.translate(x,y);c.scale(s,s);for(let i=0;i<6;i++){const xx=i*36,yy=(i%3)*-10;path(c,`M${xx} ${yy} L${xx} ${yy-29} L${xx+25} ${yy-29} L${xx+25} ${yy} Z`,palette[0],null);path(c,`M${xx-4} ${yy-29} L${xx+13} ${yy-43} L${xx+30} ${yy-29} Z`,palette[1],null);round(c,xx+9,yy-16,7,16,3,palette[2]);round(c,xx+3,yy-25,5,5,1,palette[2]);}c.restore();}
export function wardrobeBackground(c,w,h,style=0,t=0){
 c.save();c.scale(w/560,h/650);const W=560,H=650,night=style===3;
 const colors=[['#c5dcd3','#f4e9c9'],['#e5d9cb','#f8eedb'],['#d9a3a0','#f1d9ad'],['#283e55','#72818a']][style]||['#c5dcd3','#f4e9c9'];
 c.fillStyle=gradient(c,0,0,0,H,...colors);c.fillRect(0,0,W,H);
 if(style===1){
 // A dressing atelier: plaster panels, a tall arched mirror and a sunny window.
 for(let x=0;x<560;x+=112){line(c,x,0,x,535,'#cdbda666',1);line(c,x+5,12,x+5,527,'#fff7e433',1);}
 path(c,'M114 518 L114 188 Q114 48 280 48 Q446 48 446 188 L446 518 Z',gradient(c,120,50,320,480,'#d2bd9a','#a99578'),null);
 path(c,'M123 513 L123 189 Q123 60 280 60 Q437 60 437 189 L437 513 Z','#efe6d3',null);
 path(c,'M132 507 L132 190 Q132 71 280 71 Q428 71 428 190 L428 507 Z',gradient(c,140,80,240,420,'#f6f1df','#c6d6cf'),null);
 c.save();c.clip(new Path2D('M134 507 L134 190 Q134 75 280 75 Q426 75 426 190 L426 507 Z'));path(c,'M170 56 L240 56 L441 470 L391 523 Z','#fffdf04d',null);path(c,'M252 35 L274 35 L464 460 L443 484 Z','#fffdf055',null);c.restore();
 for(let i=0;i<14;i++){const ang=Math.PI+(i/13)*Math.PI;ellipse(c,280+151*Math.cos(ang),190+120*Math.sin(ang),2,2,'#e9d6ad');}
 // Side window and gathered curtains.
 round(c,18,111,76,195,35,'#afc4bc','#d1bc99');round(c,24,119,64,180,30,'#dce9d9');line(c,56,121,56,298,'#cfbfa6',5);line(c,25,210,88,210,'#cfbfa6',5);
 path(c,'M8 100 L38 100 Q31 163 14 220 L4 216 Z',gradient(c,4,100,33,121,'#f3dcc8','#cfac92'),null);path(c,'M75 100 L105 100 L109 216 L97 220 Q81 164 75 100 Z',gradient(c,75,100,33,121,'#ead4bd','#bf9f85'),null);line(c,5,214,18,217,'#ac8663',3);line(c,95,217,109,214,'#ac8663',3);
 // Hanging garments and a woven storage basket at the edge of the room.
 line(c,475,168,549,168,'#a58d68',3);line(c,481,168,481,505,'#b69b73',3);line(c,545,168,545,505,'#b69b73',3);for(let i=0;i<3;i++){const xx=494+i*18;stroke(c,`M${xx} 171 L${xx-8} 184 L${xx+8} 184 Z`,'#a28d6d',1);path(c,`M${xx-8} 185 L${xx+8} 185 L${xx+12} ${290+i*13} Q${xx} ${300+i*13} ${xx-12} ${290+i*13} Z`,['#a7b49d','#c39a97','#d5bc8f'][i],null);stroke(c,`M${xx-3} 190 L${xx-4} ${285+i*13}`,'#fff5df44',1);}
 round(c,461,463,82,63,8,'#bda27b');for(let i=0;i<9;i++)line(c,466,470+i*6,538,470+i*6,'#e1cba5',1);for(let i=0;i<12;i++)line(c,466+i*6,468,466+i*6,521,'#997c5866',1);gardenPlant(c,69,488,.95,t,true);
 c.fillStyle=gradient(c,0,533,0,117,'#d3bea0','#e6d6bb');c.fillRect(0,533,560,117);line(c,0,533,560,533,'#b29a78',3);for(let i=0;i<12;i++)line(c,i*63-70,650,280+(i*63-350)*.5,534,'#baa17d66',1);for(let j=0;j<3;j++)line(c,0,553+j*j*21,560,553+j*j*21,'#baa17d66',1);
 ellipse(c,280,583,149,30,'#bba48722');ellipse(c,280,582,137,25,'#f3e5cd');ellipse(c,280,582,126,20,'#e5d4b4');ellipse(c,280,582,114,16,'#efe3cb');
 }else{
 if(night){for(let i=0;i<62;i++){const xx=mod(i*127+31,560),yy=mod(i*73+15,425);c.globalAlpha=.25+(Math.sin(t*.7+i)+1)*.25;star(c,xx,yy,i%9===0?3.5:1.3,'#ffe9b6',.1); }c.globalAlpha=1;const glow=c.createRadialGradient(429,103,2,429,103,90);glow.addColorStop(0,'#f8e9bc44');glow.addColorStop(1,'#f8e9bc00');ellipse(c,429,103,90,90,glow);ellipse(c,429,103,28,28,'#f7e8c4');ellipse(c,439,95,26,26,'#2f4359');}
 else{const sunX=style===2?405:450,sunY=style===2?237:88;const glow=c.createRadialGradient(sunX,sunY,1,sunX,sunY,160);glow.addColorStop(0,'#fff7cd88');glow.addColorStop(1,'#fff7cd00');ellipse(c,sunX,sunY,160,160,glow);ellipse(c,sunX,sunY,style===2?38:30,style===2?38:30,'#fff0bd');clouds(c,560,300,t*.4,0);}
 for(let layer=0;layer<4;layer++){c.beginPath();c.moveTo(0,650);for(let xx=0;xx<=570;xx+=10){const yy=345+layer*52+Math.sin(xx*.011+layer)*26+Math.sin(xx*.019+layer*3)*9;c.lineTo(xx,yy);}c.lineTo(560,650);c.closePath();c.fillStyle=night?['#4c6470','#4a6970','#3d6165','#345c5b'][layer]:style===2?['#b7aa9b','#a7a28b','#8d9b7b','#82936b'][layer]:['#b4c7ad','#9eb997','#88a77e','#789767'][layer];c.fill();}
 distantVillage(c,64,370,.8,night?['#6f817e','#6c6a61','#edd49b']:['#ded2b1','#bf9378','#9aab91']);
 // Decorative arched gate: edges frame the character, not cover the dress.
 const stone=night?'#6b817d':'#d3d1b5';path(c,'M-4 525 L-4 243 Q-4 66 104 61 L104 83 Q19 98 19 248 L19 525 Z',stone,null);path(c,'M564 525 L564 243 Q564 66 456 61 L456 83 Q541 98 541 248 L541 525 Z',stone,null);for(let i=0;i<8;i++){line(c,0,248+i*32,18,244+i*32,night?'#496963':'#b4b99c',1.2);line(c,542,248+i*32,560,244+i*32,night?'#496963':'#b4b99c',1.2);}
 for(const side of [0,1]){const xx=side?542:17;stroke(c,`M${xx} 450 Q${xx+(side?-23:23)} 299 ${xx} 131`,night?'#65816c':'#789b63',3);for(let i=0;i<14;i++){const yy=140+i*21;leaf(c,xx+Math.sin(i)*9,yy,7+(i%3),side?-.6:.6,night?'#6b8d75':['#87a472','#a3b783','#6e925d'][i%3]);if(i%4===0)flower(c,xx+(side?-13:13),yy,5.5,night?'#d1bc9a':'#f2d8b9');}}
 path(c,'M195 485 Q276 451 345 485 L469 650 L77 650 Z',gradient(c,200,470,0,180,night?'#6c7b70':'#cfc49b',night?'#8e8f7b':'#e7d5ad'),null);for(let j=0;j<6;j++){const yy=500+j*24;stroke(c,`M${205-j*10} ${yy} Q280 ${yy-6} ${340+j*13} ${yy+4}`,night?'#a6a48a33':'#b2a57d44',1.2);}
 gardenPlant(c,58,558,1.2,t,true);gardenPlant(c,498,563,1.25,t+.8,true);for(let i=0;i<35;i++){const xx=mod(i*47+23,560),yy=570+mod(i*19,78);if(xx>130&&xx<430)continue;leaf(c,xx,yy,5,.2+Math.sin(i),night?'#527a64':'#7c9b62');if(i%3===0)flower(c,xx,yy-9,3.6,night?'#d4c7a2':['#ffedc9','#d7a295','#e6c178'][i%3]);}
 if(night){for(let i=0;i<15;i++){const xx=mod(i*47+Math.sin(t*.4+i)*19,560),yy=340+mod(i*31,240)+Math.sin(t*.7+i)*8;c.globalAlpha=.3+(Math.sin(t*1.4+i)+1)*.23;ellipse(c,xx,yy,2,2,'#e9efad');ellipse(c,xx,yy,6,6,'#e9efad13');}c.globalAlpha=1;}else{for(let i=0;i<3;i++){const xx=80+i*170+Math.sin(t*.35+i)*20,yy=220+Math.sin(t*.5+i*2)*26;const wing=2+Math.abs(Math.sin(t*5+i))*3;c.save();c.translate(xx,yy);c.rotate(Math.sin(t+i)*.3);ellipse(c,-wing,0,wing,3,'#f0ddae');ellipse(c,wing,0,wing,3,'#f0ddae');line(c,0,-2,0,3,'#9c9671',.7);c.restore();}}
 }
 // Anchored contact shadow, light dust motes, and a delicate vignette unify the scene.
 ellipse(c,280,581,65,8,night?'#162e3c55':'#555e3d22');for(let i=0;i<13;i++){c.globalAlpha=.13+Math.sin(t*.6+i)*.08;ellipse(c,mod(i*79+Math.sin(t*.2+i)*15,560),mod(i*47-t*3,520),1.6,1.6,'#fff8df');}c.globalAlpha=1;
 const vignette=c.createRadialGradient(280,330,160,280,330,440);vignette.addColorStop(0,'#24372800');vignette.addColorStop(1,night?'#10273533':'#7b6d3d16');c.fillStyle=vignette;c.fillRect(0,0,560,650);c.restore();
}

// Pixel helpers rasterize silhouettes to scan lines; diagonal edges remain intentional pixels.
function px(c,x,y,w,h,color,u=1){c.fillStyle=color;const x0=Math.round(x*u),y0=Math.round(y*u);c.fillRect(x0,y0,Math.round((x+w)*u)-x0,Math.round((y+h)*u)-y0);}
function polygonPixels(c,points,color,u=1){let minY=Math.floor(Math.min(...points.map(p=>p[1]))),maxY=Math.ceil(Math.max(...points.map(p=>p[1])));for(let y=minY;y<maxY;y++){const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+((y+.5-a[1])/(b[1]-a[1]))*(b[0]-a[0]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)px(c,Math.ceil(xs[i]),y,Math.max(1,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,color,u);}}
function pixelLimb(c,points,width,color,u){for(let i=0;i<points.length-1;i++){const [x1,y1]=points[i],[x2,y2]=points[i+1];const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),1);for(let j=0;j<=n;j++)px(c,Math.round(x1+(x2-x1)*j/n)-Math.floor(width/2),Math.round(y1+(y2-y1)*j/n)-Math.floor(width/2),width,width,color,u);}}
// Tori is a compact 34 x 42 logical-pixel character. At game scale .82 a cell
// covers about 3.5 screen pixels: the chunky grid is part of the character design.
const TORI_COLORS={outline:'#5c3e31',hair:'#ad5f40',hairLight:'#d18451',hairDark:'#83452f',skin:'#ffe0ae',skinShade:'#dbad80',ivory:'#fff0cd',tunic:'#ba593d',tunicLight:'#d67b4a',tunicDark:'#91432f',pants:'#4d5553',pantsLight:'#6f7870',eye:'#553a29',iris:'#ad793b',blush:'#e89a76',red:'#b64b40'};
const TORI_STEPS=[[[7,-6],[10,-2]],[[5,-5],[6,-2]],[[1,-5],[0,-2]],[[-3,-6],[-5,-2]],[[-5,-7],[-8,-3]],[[-5,-9],[-6,-6]],[[0,-11],[3,-8]],[[5,-10],[8,-6]]];
export function pixelTori(c,x,feet,t=0,slide=false,air=false,scale=1,opts={}){
 const u=4.3*scale,P=TORI_COLORS,phase=mod(Math.floor(t*clamp((opts.speed||360)/32,10,18)),8),p=(xx,yy,w,h,col)=>px(c,xx,yy,w,h,col,u),poly=(points,col)=>polygonPixels(c,points,col,u);
 c.save();c.translate(Math.round(x),Math.round(feet));c.imageSmoothingEnabled=false;
 if(slide){
  // A separate low pose. The pixel size stays exactly the same while crouching.
  poly([[-7,-7],[-13,-8],[-18,-12],[-20,-10],[-18,-6],[-12,-3],[-6,-3]],P.outline);poly([[-7,-6],[-13,-7],[-18,-10],[-17,-7],[-12,-4],[-7,-4]],P.hair);p(-19,-10,3,3,P.skin);
  poly([[-12,-6],[-5,-10],[5,-9],[10,-5],[7,-2],[-10,-2]],P.outline);poly([[-10,-6],[-4,-8],[4,-7],[7,-5],[6,-3],[-9,-3]],P.tunic);p(-7,-6,5,2,P.tunicLight);p(-3,-6,3,3,P.tunicDark);p(-10,-3,12,3,P.pants);
  p(-17,-1,10,2,P.outline);p(-16,-1,8,1,P.skinShade);p(3,-2,11,3,P.outline);p(4,-2,9,2,P.skin);p(10,-2,3,1,P.ivory);
  pixelLimb(c,[[3,-7],[8,-5],[11,-2]],3,P.outline,u);pixelLimb(c,[[3,-7],[8,-5],[11,-2]],1,P.skin,u);p(3,-8,4,3,P.ivory);
  c.save();c.translate(Math.round(8*u),Math.round(-3*u));drawPixelHead(c,u,t,true);c.restore();c.restore();return;
 }
 const bob=air?0:[0,0,1,1,0,0,1,1][phase];c.translate(0,-Math.round(bob*u));
 // Big cream tail tip and a curved chestnut silhouette, with a two-pose wag.
 const tail=phase<4?0:1;
 poly([[-5,-13],[-11,-15],[-15,-19-tail],[-17,-23-tail],[-20,-21-tail],[-20,-17],[-17,-13],[-12,-10],[-6,-10]],P.outline);
 poly([[-6,-12],[-12,-14],[-16,-18-tail],[-17,-21-tail],[-18,-20-tail],[-18,-17],[-15,-14],[-11,-12],[-6,-11]],P.hair);
 poly([[-17,-22-tail],[-19,-20-tail],[-18,-17],[-16,-16],[-16,-19]],P.skin);p(-18,-20-tail,2,2,P.ivory);p(-12,-14,3,2,P.hairLight);
 const front=air?(opts.vy<0?[[2,-10],[6,-12],[9,-10]]:[[2,-10],[6,-7],[8,-3]]):[[2,-10],...TORI_STEPS[phase]];
 const back=air?[[-2,-10],[-6,-8],[-7,-3]]:[[-2,-10],...TORI_STEPS[(phase+4)%8].map(([xx,yy])=>[xx-3,yy])];
 drawToriLeg(c,u,back,true);drawToriLeg(c,u,front,false);
 // Two broad gathered bloomers; no fine dither or thread noise at this scale.
 poly([[-6,-13],[5,-13],[7,-10],[5,-6],[1,-6],[-1,-8],[-3,-6],[-7,-7],[-8,-10]],P.outline);
 poly([[-6,-12],[-1,-12],[-1,-9],[-3,-7],[-6,-8]],P.pants);poly([[1,-12],[5,-12],[5,-9],[4,-7],[1,-8]],P.pants);p(-5,-9,3,1,P.pantsLight);p(1,-9,3,1,P.pantsLight);
 const swing=[-1,0,1,1,0,-1,-2,-2][phase],farX=-11+swing,farY=air?-21:-18;
 pixelLimb(c,[[-4,-21],[-9,-19],[farX,farY]],3,P.outline,u);pixelLimb(c,[[-4,-21],[-9,-19],[farX,farY]],1,P.skinShade,u);
 p(-8,-22,4,4,P.outline);p(-7,-22,3,3,P.ivory);p(farX-1,farY-1,3,3,P.skin);
 // Broad flared brick-red tunic and the single unmistakable front pocket.
 poly([[-5,-23],[4,-23],[5,-18],[9,-12],[8,-10],[1,-9],[-7,-10],[-9,-12],[-6,-18]],P.outline);
 poly([[-4,-22],[3,-22],[4,-17],[7,-12],[6,-11],[1,-10],[-6,-11],[-7,-12],[-5,-17]],P.tunic);poly([[-2,-21],[2,-21],[2,-17],[5,-12],[0,-11],[-3,-13]],P.tunicLight);p(-6,-12,2,1,P.tunicDark);
 p(-3,-17,6,4,P.outline);p(-2,-16,4,3,P.tunic);p(-2,-17,4,1,P.tunicLight);
 p(-1,-25,4,3,P.skinShade);poly([[-4,-23],[-1,-24],[1,-22],[-1,-20]],P.ivory);poly([[1,-22],[3,-24],[5,-22],[3,-20]],P.skin);
 // The front arm counter-swings against the leading leg in eight clear poses.
 const armX=[10,9,8,6,5,6,8,10][phase],armY=air?-23:[-19,-18,-17,-17,-18,-20,-22,-21][phase];
 pixelLimb(c,[[5,-21],[8,-19],[armX,armY]],3,P.outline,u);pixelLimb(c,[[5,-21],[8,-19],[armX,armY]],1,P.skin,u);
 poly([[4,-23],[7,-22],[9,-20],[8,-18],[5,-19]],P.outline);p(5,-22,3,3,P.ivory);p(6,-19,2,1,P.skinShade);p(armX-1,armY-1,3,3,P.skin);
 c.save();c.translate(Math.round(1*u),Math.round(-24*u));drawPixelHead(c,u,t,false);c.restore();
 drawToriPinwheel(c,u,farX-1,farY-9,t);p(farX-1,farY-1,2,2,P.skin);
 c.restore();
}
function drawToriLeg(c,u,points,far){const P=TORI_COLORS,skin=far?P.skinShade:P.skin;pixelLimb(c,points,3,P.outline,u);pixelLimb(c,points,1,skin,u);const [xx,yy]=points[2];px(c,xx-1,yy,5,3,P.outline,u);px(c,xx,yy,4,2,skin,u);if(!far)px(c,xx,yy,2,1,P.ivory,u);}
function drawToriPinwheel(c,u,x,y,t){const P=TORI_COLORS,p=(xx,yy,w,h,col)=>px(c,xx+x,yy+y,w,h,col,u),poly=(points,col)=>polygonPixels(c,points.map(([xx,yy])=>[xx+x,yy+y]),col,u);
 p(0,0,1,10,P.outline);const phase=mod(Math.floor(t*8),2);
 if(phase===0){poly([[0,0],[0,-4],[3,-3],[2,-1]],P.ivory);poly([[0,0],[4,0],[3,3],[1,2]],P.red);poly([[0,0],[0,4],[-3,3],[-2,1]],P.ivory);poly([[0,0],[-4,0],[-3,-3],[-1,-2]],P.red);}
 else{poly([[0,0],[2,-4],[4,-2],[2,0]],P.ivory);poly([[0,0],[4,2],[2,4],[0,2]],P.red);poly([[0,0],[-2,4],[-4,2],[-2,0]],P.ivory);poly([[0,0],[-4,-2],[-2,-4],[0,-2]],P.red);}p(0,0,1,1,P.outline);
}
function drawPixelHead(c,u,t,duck){const P=TORI_COLORS,qx=x=>duck?Math.round(x*.85):x,qy=y=>duck?Math.round(y*.62):y;
 const p=(x,y,w,h,col)=>px(c,qx(x),qy(y),Math.max(1,qx(x+w)-qx(x)),Math.max(1,qy(y+h)-qy(y)),col,u),poly=(points,col)=>polygonPixels(c,points.map(([x,y])=>[qx(x),qy(y)]),col,u);
 // Left ear points up. The opposite ear folds down, against a broad chestnut bob.
 poly([[-7,-10],[-10,-14],[-10,-17],[-7,-16],[-4,-12]],P.outline);poly([[-8,-15],[-6,-13],[-7,-11],[-9,-14]],P.skin);
 poly([[-8,-10],[-6,-13],[-2,-16],[3,-16],[7,-14],[9,-10],[10,-4],[9,1],[6,3],[-5,3],[-9,1],[-10,-4]],P.outline);
 poly([[-7,-10],[-5,-12],[-1,-15],[3,-15],[6,-13],[8,-9],[9,-4],[8,0],[5,2],[-5,2],[-8,0],[-9,-4]],P.hair);
 poly([[6,-12],[9,-14],[12,-12],[13,-9],[11,-7],[9,-9],[8,-10]],P.outline);poly([[8,-12],[9,-12],[11,-11],[11,-9],[10,-9],[9,-11]],P.hair);p(9,-12,1,1,P.hairLight);
 // Large, almost circular cream face, viewed just enough from the right to run.
 poly([[-4,-9],[0,-11],[5,-10],[7,-7],[7,-2],[5,2],[0,3],[-4,1],[-6,-3],[-6,-6]],P.skinShade);
 poly([[-3,-8],[0,-10],[4,-9],[6,-6],[6,-2],[4,1],[0,2],[-3,0],[-5,-3],[-5,-6]],P.skin);p(-1,-9,4,2,P.ivory);
 // Three large fringe clusters replace dozens of narrow hair and highlight pixels.
 poly([[-8,-10],[-5,-13],[0,-15],[5,-13],[3,-10],[0,-8],[-4,-7],[-5,-3],[-7,1],[-9,-2]],P.hair);
 poly([[-5,-12],[-1,-14],[3,-13],[1,-11],[-2,-10]],P.hairLight);p(-8,-4,2,4,P.hairDark);p(7,-6,2,5,P.hairDark);p(6,0,2,2,P.hairDark);
 const blink=mod(t,4.9)>4.72;
 if(blink){p(-3,-4,2,1,P.eye);p(3,-4,3,1,P.eye);}else{p(-3,-6,2,3,P.eye);p(-3,-6,1,1,P.ivory);p(-2,-4,1,1,P.iris);p(3,-6,3,3,P.eye);p(3,-6,1,1,P.ivory);p(4,-4,1,1,P.iris);}
 p(-4,-1,2,1,P.blush);p(5,-1,2,1,P.blush);p(1,-1,1,1,P.skinShade);p(0,1,3,1,P.hairDark);
}

const forestThemes=[
 {sky:['#80bdc5','#e8e0b2'],mount:['#9fbcb2','#7ca496','#5e8e79'],leaf:['#426e56','#5b865c','#82a268','#b5bb78'],trunk:['#685741','#90714a','#b39562'],grass:['#d1d88d','#96ac61','#58794b'],soil:['#d0ae74','#ae8759','#8c694b'],light:'#fff0ba'},
 {sky:['#78aeb8','#e4d7a5'],mount:['#8ea99f','#719487','#507c67'],leaf:['#365f4b','#537b54','#78955d','#adb271'],trunk:['#605140','#886843','#ac8959'],grass:['#c5cb7b','#8ca25a','#507044'],soil:['#c5a16b','#a57f52','#836047'],light:'#f8df9f'},
 {sky:['#a49cae','#ecc3a0'],mount:['#a39c9c','#8b8e89','#667e70'],leaf:['#425f50','#647750','#8d9158','#bdad6b'],trunk:['#65503f','#8f6c47','#b59061'],grass:['#d3c77f','#a0a65e','#667c4a'],soil:['#c9a476','#ac815e','#876149'],light:'#ffdab0'},
 {sky:['#737c9d','#e1ad9a'],mount:['#8a879b','#727d8c','#536d78'],leaf:['#344f50','#4c6a5a','#758666','#a0a577'],trunk:['#50484a','#796254','#99846b'],grass:['#beb787','#7f9a70','#466b53'],soil:['#ae947a','#8a7363','#66564e'],light:'#f7d1aa'},
 {sky:['#3f5477','#8a8e9b'],mount:['#596d87','#4e697b','#35576a'],leaf:['#254953','#39655e','#598773','#90ab8a'],trunk:['#37474c','#536462','#7d8470'],grass:['#9aae88','#638c74','#345d58'],soil:['#8a8b77','#687464','#475857'],light:'#e6e4b9'},
 {sky:['#273d5e','#6c7a8a'],mount:['#405575','#36576c','#254657'],leaf:['#203d47','#315754','#4d7669','#86a28b'],trunk:['#2e3d43','#4e5b58','#6d7769'],grass:['#95a489','#5b7c6b','#2e514d'],soil:['#778171','#566757','#3f514a'],light:'#e3e6c2'}
];
const treeCache=new Map();
function treeAsset(theme,variant){const key=theme+'-'+variant;if(treeCache.has(key))return treeCache.get(key);const surface=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(174,246):Object.assign(document.createElement('canvas'),{width:174,height:246});const c=surface.getContext('2d'),p=forestThemes[theme],u=3;const r=(x,y,w,h,col)=>px(c,x,y,w,h,col,u);const poly=(pts,col)=>polygonPixels(c,pts,col,u);
 // Irregular trunk and secondary branches anchor each tree.
 poly([[26,81],[25,36],[30,29],[34,35],[32,81]],p.trunk[0]);poly([[28,80],[28,37],[31,31],[31,80]],p.trunk[1]);r(29,49,1,17,p.trunk[2]);poly([[28,52],[17,35],[18,32],[31,47]],p.trunk[0]);poly([[30,45],[42,28],[44,30],[32,50]],p.trunk[0]);
 if(variant%3===0){for(let tier=0;tier<5;tier++){const yy=8+tier*8,half=8+tier*3;poly([[29,yy-8],[29-half,yy+12],[29+half,yy+12]],p.leaf[0]);poly([[28,yy-7],[29-half+2,yy+9],[32,yy+7]],p.leaf[1]);poly([[29,yy-6],[29-half+5,yy+5],[29,yy+3]],p.leaf[2]);for(let j=0;j<4;j++)r(23+j*3,yy+8+(j%2),2,1,p.leaf[3]);}}
 else{const lobes=[[-10,21,13,14],[9,18,14,13],[-18,34,12,13],[18,32,12,12],[0,33,20,17],[-4,10,12,11]];for(const [dx,dy,rx,ry]of lobes){for(let y=-ry;y<=ry;y++){const span=Math.floor(Math.sqrt(Math.max(0,1-y*y/(ry*ry)))*rx);const edge=Math.floor((Math.sin(y*2+dx)+1)*1.1);r(29+dx-span+edge,dy+y,span*2-edge+1,1,p.leaf[0]);}}
 for(let i=0;i<180;i++){const xx=6+mod(i*17,48),yy=4+mod(i*23,45);const centerX=29,centerY=27;const inTree=((xx-centerX)**2/650+(yy-centerY)**2/650)<1;if(inTree&&((xx+yy+i)%7<4))r(xx,yy,2+(i%3),1+(i%2),p.leaf[1+(i%3)]);}
 // Light-dappled upper crowns, with dark cutouts between leaf clusters.
 for(let i=0;i<17;i++){const xx=14+mod(i*11,30),yy=10+mod(i*7,29);r(xx,yy,3,1,p.leaf[2]);r(xx+2,yy+1,2,1,p.leaf[1]);}for(let i=0;i<8;i++)r(14+mod(i*7,30),38+mod(i*5,12),3,2,p.leaf[0]);}
 for(let i=0;i<9;i++)r(25+mod(i*3,8),54+i*3,1,2,p.trunk[0]);r(20,80,21,2,p.leaf[0]);treeCache.set(key,surface);return surface;}
function pixelRock(c,x,y,w,h,colors,u=3){c.save();c.translate(Math.round(x/3)*3,Math.round(y/3)*3);const ww=w/u,hh=h/u;polygonPixels(c,[[0,hh],[1,hh*.6],[ww*.2,hh*.2],[ww*.55,0],[ww*.88,hh*.25],[ww,hh*.8],[ww*.87,hh],[0,hh]],colors[0],u);polygonPixels(c,[[2,hh*.65],[ww*.25,hh*.23],[ww*.55,1],[ww*.75,hh*.25],[ww*.5,hh*.62]],colors[1],u);polygonPixels(c,[[ww*.5,hh*.62],[ww*.75,hh*.25],[ww*.9,hh*.8],[ww*.82,hh-1]],colors[2],u);px(c,ww*.22,hh*.45,ww*.2,1,colors[2],u);px(c,ww*.53,hh*.2,ww*.17,1,colors[1],u);c.restore();}
function pixelWindmill(c,x,y,t,p){const r=(xx,yy,w,h,col)=>px(c,Math.round(xx/3),Math.round(yy/3),Math.max(1,w/3),Math.max(1,h/3),col,3);const poly=(pts,col)=>polygonPixels(c,pts.map(v=>[Math.round(v[0]/3),Math.round(v[1]/3)]),col,3);
 poly([[x-24,y],[x-18,y-114],[x+18,y-114],[x+27,y]],'#c3b898');poly([[x+8,y],[x+5,y-114],[x+18,y-114],[x+27,y]],'#a7a38b');poly([[x-27,y-114],[x,y-143],[x+29,y-114]],'#a66b52');poly([[x-25,y-114],[x,y-140],[x+2,y-114]],'#c68a62');
 for(let i=0;i<6;i++){r(x-16+(i%2)*8,y-108+i*15,12,3,'#a69c81');r(x+2,y-101+i*15,14,3,'#d7c9a7');}r(x-6,y-35,15,35,'#637366');r(x-9,y-78,12,18,'#5d786e');r(x-6,y-76,6,12,'#bdcba8');
 const cx=x,cy=y-95,angle=Math.floor(t*2.5)%24*Math.PI/12;for(let i=0;i<4;i++){const a=angle+i*Math.PI/2;const trans=(xx,yy)=>[cx+Math.cos(a)*xx-Math.sin(a)*yy,cy+Math.sin(a)*xx+Math.cos(a)*yy];poly([trans(1,-2),trans(81,-2),trans(81,2),trans(1,2)],'#776b51');poly([trans(28,-12),trans(78,-12),trans(78,-3),trans(28,-3)],'#e8d7ac');for(let j=0;j<4;j++)poly([trans(30+j*13,-12),trans(33+j*13,-12),trans(33+j*13,-3),trans(30+j*13,-3)],'#beae87');}r(cx-6,cy-6,12,12,'#88704d');r(cx-3,cy-3,6,6,'#e1c68c');}
export function pixelLandscape(c,w,h,distance=0,t=0,level=1){
 const theme=clamp(Math.floor(level)-1,0,5),p=forestThemes[theme];c.save();c.imageSmoothingEnabled=false;
 c.fillStyle=gradient(c,0,0,0,430,p.sky[0],p.sky[1]);c.fillRect(0,0,w,h);
 const r=(x,y,a,b,col)=>px(c,Math.floor(x/3),Math.floor(y/3),Math.max(1,a/3),Math.max(1,b/3),col,3);
 const sunX=w*.78,sunY=theme>3?73:theme>1?129:70;for(let yy=-27;yy<=27;yy+=3){const span=Math.floor(Math.sqrt(27*27-yy*yy)/3)*3;r(sunX-span,sunY+yy,span*2+3,3,p.light);}if(theme>3){for(let yy=-24;yy<24;yy+=3){const span=Math.floor(Math.sqrt(24*24-yy*yy)/3)*3;r(sunX+10-span,sunY-5+yy,span*2+3,3,p.sky[0]);}for(let i=0;i<42;i++){const xx=mod(i*137+17,w),yy=20+mod(i*59,210);if(i%5===0){r(xx-3,yy,9,3,p.light);r(xx,yy-3,3,9,p.light);}else r(xx,yy,3,3,mix(p.sky[0],p.light,.45));}}
 for(let i=0;i<7;i++){const xx=mod(i*217-distance*.07,w+260)-130,yy=60+(i%3)*41;const col=mix(p.sky[1],p.light,.45);r(xx,yy,114,9,col);r(xx+12,yy-9,90,9,col);r(xx+27,yy-18,54,9,col);r(xx+45,yy-24,18,6,col);r(xx+9,yy+9,93,3,mix(col,p.sky[1],.5));}
 // Layered distant mountains carry fine ridges instead of identical bands.
 for(let layer=0;layer<3;layer++){for(let xx=0;xx<w;xx+=6){const wx=xx+distance*(.07+layer*.075),base=272+layer*49;const yy=base-Math.sin(wx*.006+layer*1.5)*44-Math.sin(wx*.013+layer*3)*19-Math.sin(wx*.022)*8;r(xx,yy,6,430-yy,p.mount[layer]);if(layer===0&&mod(xx+distance*.07,54)<6)r(xx,yy+3,6,3,mix(p.mount[0],p.sky[1],.24));}}
 // Tiny village windows and a working, pixel-stepped windmill.
 const villageX=mod(670-distance*.16,w+650)-220;for(let i=0;i<5;i++){const xx=villageX+i*43,yy=315+(i%3)*8;r(xx,yy-29,30,29,theme>3?'#778a83':'#c9c7a5');polygonPixels(c,[[Math.round((xx-3)/3),Math.round((yy-29)/3)],[Math.round((xx+15)/3),Math.round((yy-44)/3)],[Math.round((xx+33)/3),Math.round((yy-29)/3)]],theme>3?'#6e6b67':'#b5815e',3);r(xx+12,yy-16,6,16,theme>3?'#ead394':'#788d75');r(xx+3,yy-22,6,6,theme>3?'#ecdca8':'#a8b69b');}
 pixelWindmill(c,mod(815-distance*.19,w+750)-180,323,t,p);
 // A quiet river, a fence, and alternating trees give independent parallax cues.
 r(0,365,w,9,mix(p.sky[0],p.leaf[2],.45));for(let i=0;i<25;i++){const xx=mod(i*53-distance*.31+t*3,w);r(xx,365+(i%3)*3,15+(i%4)*6,3,mix(p.sky[1],p.light,.3));}
 for(let i=0;i<11;i++){const xx=mod(i*127-distance*.38,w+210)-100;const img=treeAsset(theme,i%3);c.globalAlpha=.65;c.drawImage(img,xx,199+(i%3)*11,111,157);c.globalAlpha=1;}
 for(let i=0;i<6;i++){const xx=mod(i*245-distance*.66,w+300)-150;const img=treeAsset(theme,1+i%3);c.drawImage(img,xx,182+(i%2)*17,174,246);}
 for(let i=0;i<16;i++){const xx=mod(i*81-distance*.79,w+100)-50;r(xx,388,6,38,p.trunk[1]);r(xx+3,388,3,38,p.trunk[2]);r(xx-20,397,104,6,p.trunk[0]);r(xx-20,412,104,3,p.trunk[1]);}
 for(let i=0;i<16;i++){const xx=mod(i*83-distance*.9,w+100)-50;const color=p.leaf[1];for(let yy=0;yy<24;yy+=3){const width=24-Math.abs(yy-12);r(xx-width,414-yy,width*2,3,color);}r(xx-12,397,9,3,p.leaf[2]);r(xx+3,403,9,3,p.leaf[3]);}
 // Ground is aligned to physics at y=430. Grass roots, stones and dirt are separate layers.
 r(0,426,w,6,p.grass[0]);r(0,432,w,12,p.grass[1]);r(0,444,w,h-444,p.soil[1]);r(0,444,w,6,p.grass[2]);r(0,450,w,6,p.soil[0]);
 for(let i=0;i<90;i++){const xx=mod(i*19-distance,w+40)-20,yy=459+mod(i*31,Math.max(3,h-465));r(xx,yy,3+(i%4)*3,3,i%3?p.soil[0]:p.soil[2]);if(i%4===0)r(xx+3,yy-3,3,3,p.soil[2]);}
 for(let i=0;i<42;i++){const xx=mod(i*31-distance,w+40)-20;r(xx,420,3,9,p.grass[1]);r(xx+3,423,3,6,p.grass[2]);if(i%5===0){r(xx-3,414,9,6,p.light);r(xx,414,3,3,'#d6a65e');}if(i%7===0)pixelRock(c,xx,426,18,9,[p.soil[2],p.soil[0],p.soil[1]]);}
 if(theme>=3){c.globalAlpha=.1;r(0,320,w,42,'#c7d4c5');c.globalAlpha=1;for(let i=0;i<14;i++){const xx=mod(i*83-distance*.45,w),yy=245+mod(i*53,165);c.globalAlpha=.25+(Math.sin(t*2+i)+1)*.2;r(xx,yy,3,3,'#edebad');c.globalAlpha=1;}}
 c.restore();
}
export function pixelObstacle(c,o){const x=Math.round(o.x/3)*3,y=Math.round(o.y/3)*3;const r=(xx,yy,w,h,col)=>px(c,Math.round(xx/3),Math.round(yy/3),Math.max(1,w/3),Math.max(1,h/3),col,3);c.save();
 if(o.type==='branch'){
 const width=o.w||100,height=o.h||65;r(x,y+6,width,15,'#544c38');r(x,y+6,width-6,6,'#a08454');r(x+3,y+21,width-6,6,'#6d5d3c');for(let i=0;i<Math.ceil(width/18);i++){r(x+9+i*18,y+12,9,3,'#ba9b64');r(x+6+i*18,y-3,15,9,'#4c7250');r(x+12+i*18,y-9,12,9,'#6d905a');r(x+9+i*18,y+24,6,height-27,'#6f8d54');r(x+15+i*18,y+30,9,9,'#9eae67');r(x+3+i*18,y+42,9,9,'#8b9f60');r(x+9+i*18,y+height-3,6,3,'#c9c789');}
 }else if(o.type==='mushroom'){
 const w=o.w||45,h=o.h||72;pixelRock(c,x+6,y+h-9,w-9,12,['#79553e','#b28550','#926b45']);r(x+w*.36,y+24,w*.30,h-29,'#d3b684');r(x+w*.36,y+24,6,h-29,'#f2dfb0');r(x+w*.58,y+30,3,h-35,'#aa8d65');
 polygonPixels(c,[[x/3,(y+27)/3],[(x+3)/3,(y+15)/3],[(x+12)/3,(y+3)/3],[(x+w*.55)/3,y/3],[(x+w-6)/3,(y+12)/3],[(x+w)/3,(y+30)/3]],'#743c34',3);polygonPixels(c,[[(x+3)/3,(y+21)/3],[(x+9)/3,(y+9)/3],[(x+w*.55)/3,(y+3)/3],[(x+w-9)/3,(y+12)/3],[(x+w-3)/3,(y+24)/3]],'#bb5d46',3);r(x+12,y+6,15,3,'#e29d67');r(x+9,y+15,9,6,'#f4d7a1');r(x+27,y+12,6,6,'#efc894');r(x+30,y+24,9,3,'#dcaa7a');r(x+3,y+27,w-6,6,'#e2bc87');r(x+9,y+30,w-18,3,'#af7e5b');
 }else if(o.type==='stone'){
 pixelRock(c,x,y,o.w||72,o.h||80,['#666c67','#a4aa91','#838b78']);r(x+12,y+6,21,6,'#91a36a');r(x+18,y,15,6,'#b4bc7d');r(x+9,y+12,12,3,'#d0cc93');for(let i=0;i<4;i++)r(x+9+i*12,y+(o.h||80)-6,9,6,'#628053');
 }else{
 const w=o.w||58,h=o.h||54;r(x+6,y,w-12,h,'#725138');r(x+3,y+3,w-6,h-6,'#986b43');r(x,y+12,w,h-24,'#755236');r(x+9,y+3,w-18,6,'#b48651');r(x+w-15,y+6,9,h-12,'#68482f');r(x+w-12,y+12,6,h-24,'#86623d');
 polygonPixels(c,[[(x+6)/3,(y+12)/3],[(x+15)/3,(y+6)/3],[(x+w-18)/3,(y+6)/3],[(x+w-9)/3,(y+15)/3],[(x+w-9)/3,(y+h-15)/3],[(x+w-18)/3,(y+h-6)/3],[(x+15)/3,(y+h-6)/3],[(x+6)/3,(y+h-15)/3]],'#d0a16a',3);
 pixelRock(c,x+12,y+12,w-27,h-24,['#9f734a','#c69a64','#aa8153']);r(x+21,y+18,12,3,'#7c593c');r(x+18,y+21,3,12,'#7c593c');r(x+21,y+33,12,3,'#7c593c');r(x+30,y+24,3,9,'#7c593c');r(x+24,y+24,6,6,'#e5bb7c');r(x+9,y+h-3,w-18,3,'#513f31');for(let i=0;i<3;i++){r(x+w-18+i*3,y+9+i*12,6,3,'#bb8850');}r(x+9,y,18,3,'#879559');r(x+15,y-3,9,3,'#b8bc78');
 }
 c.restore();
}
