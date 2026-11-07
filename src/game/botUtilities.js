import { gridKey } from '@/game/botGrid';
export { default as botUtilityKey } from '@/game/botUtilityShopping';
export { default as tryBotTnt } from '@/game/botTntTactics';
export function avoidBotTnt(bot){const p=bot.player.body,m=bot.match;for(const b of m.tnt.entries.values()){
 const distance=Math.hypot(p.x-b.x,p.y+.9-b.y,p.z-b.z);if(distance>5.2)continue;
 if(bot.action==='blast-retreat'&&Math.hypot(bot.goalX-b.x,bot.goalZ-b.z)>distance+.5&&!bot.nav.failed)return true;
 let best=null,score=distance;
 for(let n=0;n<8;n++){const angle=n*Math.PI/4,x=p.x+Math.cos(angle)*3.5,z=p.z+Math.sin(angle)*3.5,height=bot.director.grid.height(gridKey(Math.floor(x),Math.floor(z))),away=Math.hypot(x-b.x,z-b.z);if(height<=0||Math.abs(height-p.y)>1.1||away<=score)continue;score=away;best={x,z};}
 bot.target=-1;bot.consuming=null;
 if(best){bot.go('blast-retreat',best.x,best.z);return true;}
 bot.nav.cancel();bot.action='blast-wait';return true;
 }if(bot.action==='blast-retreat'||bot.action==='blast-wait'){bot.action='idle';bot.nextThink=0;}return false;}

export function botCombatWeapon(bot,target){const p=target.body,w=bot.match.world;if(bot.player.inventory.total(36)&&p.grounded){const x=Math.floor(p.x),y=Math.floor(p.y-.1),z=Math.floor(p.z);if([[2,0],[-2,0],[0,2],[0,-2]].some(([dx,dz])=>!w.get(x+dx,y,z+dz)))return 36;}return bot.player.sword;}