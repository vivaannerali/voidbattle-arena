import { TEAMS } from '@/game/map';
import { placeBotBlock } from '@/game/botConstruction';
import { gridKey } from '@/game/botGrid';
export default function botBridging(bot,x,z){
 const p=bot.player.body,m=bot.match,w=m.world,id=TEAMS[bot.player.team].wool;
 bot.bridgeStyle??={steps:0,climb:Math.random()<.65,every:4+Math.floor(Math.random()*4)};
 const style=bot.bridgeStyle;
 if(!p.grounded||p.y<16.9||Math.hypot(x+.5-p.x,z+.5-p.z)>1.6)return false;
 if(!bot.player.inventory.total(id)){const home=bot.director.generators[bot.player.team];bot.nav.cancel();bot.go('return',home.x,home.z);return false;}
 if(!bot.bridgeStep||bot.bridgeStep.x!==x||bot.bridgeStep.z!==z){
  const floor=Math.floor(p.y-.01),remaining=bot.nav.length-bot.nav.cursor;
  const rise=bot.action==='attack'&&style.climb&&floor<19&&remaining>5&&style.steps%style.every===0;
  bot.bridgeStep={x,z,floor,top:floor+(rise?1:0)};
 }
 const step=bot.bridgeStep;
 bot.input.sneak=true;bot.player.heldTool=id;
 if(m.clock<bot.placeAt)return false;
 const y=w.get(x,step.floor,z)?step.top:step.floor;
 if(!w.get(x,y,z)&&placeBotBlock(bot,x,y,z,id)){
  bot.placeAt=m.clock+bot.difficulty.bridge+Math.floor(Math.random()*7);
  bot.lastWorkAt=m.clock;
 }
 if(!w.get(x,step.top,z))return false;
 if(bot.director.grid.height(gridKey(x,z))>0){style.steps++;bot.bridgeStep=null;return true;}
 return false;
}