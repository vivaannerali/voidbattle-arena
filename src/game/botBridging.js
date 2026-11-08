import { TEAMS } from '@/game/map';
import { placeBotBlock } from '@/game/botConstruction';
import { gridKey } from '@/game/botGrid';
export default function botBridging(bot,x,z){
 const p=bot.player.body,m=bot.match,w=m.world,id=TEAMS[bot.player.team].wool;
 const planned=bot.nav.pathHeights[bot.nav.cursor]||Math.ceil(p.y-.001),floor=Math.round(planned)-1;
 if(!p.grounded||Math.abs(planned-p.y)>1.05||Math.hypot(x+.5-p.x,z+.5-p.z)>1.6)return false;
 const existing=bot.director.grid.height(gridKey(x,z),p.y);if(existing>0&&Math.abs(existing-planned)<.1){bot.bridgeStep=null;return true;}
 if(!bot.player.inventory.total(id)){const home=bot.director.generators[bot.player.team];bot.nav.cancel();bot.go('return',home.x,home.z);return false;}
 bot.bridgeStep={x,z,floor,top:floor};bot.input.sneak=true;bot.player.heldTool=id;
 if(m.clock<bot.placeAt)return false;
 if(!w.get(x,floor,z)&&placeBotBlock(bot,x,floor,z,id)){bot.placeAt=m.clock+bot.difficulty.bridge;bot.lastWorkAt=m.clock;bot.bridgeStep=null;return true;}
 return false;
}