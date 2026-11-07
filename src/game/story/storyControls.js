export default function storyControls(d){
 const down=event=>{
  if(event.code==='Escape'&&!event.repeat){event.preventDefault();event.stopImmediatePropagation();if(d.e.inventoryOpen||d.e.shopTeam>=0||d.e.upgradeTeam>=0||d.e.chatOpen)d.e.closeGui();else if(d.paused)d.resume();else d.pause();return;}
  if(d.paused)return;
  if(d.stage==='cinematic'&&['Space','Enter'].includes(event.code)){event.preventDefault();event.stopImmediatePropagation();if(event.code==='Space')d.skipHeld=true;else if(!event.repeat)d.scenes?.advance();}
 };
 const up=event=>{if(event.code==='Space'){d.skipHeld=false;d.skipAge=0;}};
 const blur=()=>{d.skipHeld=false;d.pause();},hidden=()=>{if(document.hidden)blur();};
 document.addEventListener('keydown',down,true);document.addEventListener('keyup',up,true);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',hidden);
 return()=>{document.removeEventListener('keydown',down,true);document.removeEventListener('keyup',up,true);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',hidden);};
}