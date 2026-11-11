(()=>{'use strict';
const gameLinks=['jump','dress','run'];
function friendGame(index){const link=document.querySelector('#friend-game'),game=gameLinks[index];link.hidden=!game;if(game){link.href=`play/#/${game}`;link.textContent=['구름 점프 ↗','옷장 열기 ↗','바람 달리기 ↗'][index];}}
document.addEventListener('moru:friend',e=>friendGame(e.detail));friendGame(0);
document.addEventListener('moru:entered',e=>{if(e.detail==='games'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo('.play-tile',{y:40,opacity:0},{y:0,opacity:1,duration:.7,stagger:.1,ease:'power3.out',clearProps:'transform,opacity'});});
})();
