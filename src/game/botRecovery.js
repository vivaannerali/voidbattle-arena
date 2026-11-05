import { TEAMS } from '@/game/map';
import { placeBotBlock } from '@/game/botConstruction';
export default function attemptClutch(bot){
 const p=bot.player.body,m=bot.match;
 if(p.grounded||p.vy>=-.5||p.y<14||p.y>39||bot.difficulty.bridge>17||m.clock<bot.placeAt||p.support(p.x,p.y,p.z))return false;
 const id=TEAMS[bot.player.team].wool;if(!bot.player.inventory.total(id))return false;
 if(!placeBotBlock(bot,Math.floor(p.x),Math.floor(p.y)-1,Math.floor(p.z),id))return false;
 bot.placeAt=m.clock+bot.difficulty.bridge;bot.lastWorkAt=m.clock;bot.nav.cancel();bot.action='idle';bot.nextThink=0;return true;
}