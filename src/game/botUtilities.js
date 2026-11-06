import { basePoint } from '@/game/botConstruction';
import { BED_FOOT_Z } from '@/game/bedLayout';
import { bed } from '@/game/blocks';
import { gridKey } from '@/game/botGrid';
import voxelRaycast from '@/game/voxelRaycast';
export function botUtilityKey(bot){const i=bot.player.inventory;if(bot.index%3===0&&i.total(74)<1)return 'tnt';if(bot.index%3===1&&!i.total(36))return 'knockback_stick';if(bot.index%3===2&&!i.total(75))return 'fireball';return null;}
export function avoidBotTnt(bot){const p=bot.player.body;for(const b of bot.match.tnt.entries.values()){
 if(Math.hypot(p.x-b.x,p.y+.9-b.y,p.z-b.z)>4.8)continue;
 const dx=p.x-b.x,dz=p.z-b.z,length=Math.hypot(dx,dz)||1;
 for(let step=4;step>=1;step--){const x=p.x+dx/length*step,z=p.z+dz/length*step,height=bot.director.grid.height(gridKey(Math.floor(x),Math.floor(z)));if(height<=0||Math.abs(height-p.y)>1.1)continue;bot.target=-1;bot.go('blast-retreat',x,z);return true;}
 bot.target=-1;bot.nav.cancel();bot.action='blast-wait';return true;
 }if(bot.action==='blast-retreat'||bot.action==='blast-wait')bot.action='idle';return false;}
export function tryBotTnt(bot){const m=bot.match,p=bot.player.body,team=bot.enemyTeam;if(bot.action!=='attack'||team<0||!m.beds[team]||!bot.player.inventory.total(74)||m.clock<(bot.utilityAt||0)||bot.target>=0&&Math.hypot(m.players[bot.target].body.x-p.x,m.players[bot.target].body.z-p.z)<2.5)return false;
 const point=basePoint(team,0,BED_FOOT_Z),dx=point.x-p.x,dy=17.28-p.y-p.eyeHeight,dz=point.z-p.z,length=Math.hypot(dx,dy,dz);if(length>6||length<.01)return false;
 const hit=voxelRaycast(m.world,p.x,p.y+p.eyeHeight,p.z,dx/length,dy/length,dz/length,4.5,bot.mineHit);if(!hit.valid||bed(hit.id)||!m.world.editable(hit.x,hit.y,hit.z))return false;
 if(!m.tnt.prime(bot.index,hit.x,hit.y+1,hit.z))return false;bot.utilityAt=m.clock+600;bot.player.heldTool=74;bot.mineProgress=0;avoidBotTnt(bot);return true;
}
export function botCombatWeapon(bot,target){const p=target.body,w=bot.match.world;if(bot.player.inventory.total(36)&&p.grounded){const x=Math.floor(p.x),y=Math.floor(p.y-.1),z=Math.floor(p.z);if([[2,0],[-2,0],[0,2],[0,-2]].some(([dx,dz])=>!w.get(x+dx,y,z+dz)))return 36;}return bot.player.sword;}