import { TEAMS,teamAtBed } from '@/game/map';
import canPlaceBlock from '@/game/blockPlacement';
import voxelRaycast from '@/game/voxelRaycast';
import { B,bed,isWool } from '@/game/blocks';
import { miningSeconds } from '@/game/mining';
import { BED_FOOT_Z } from '@/game/bedLayout';
export { default as defencePlan } from '@/game/botDefencePlans';
export function basePoint(team,x,z){const t=TEAMS[team],s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation));return {x:t.x+x*c+z*s+.5,z:t.z-x*s+z*c+.5};}
export function placeBotBlock(bot,x,y,z,id){const m=bot.match,w=m.world,p=bot.player.body;if(!bot.player.alive||m.phase!=='active'||Math.hypot(p.x-x-.5,p.y-y,p.z-z-.5)>4.5||!canPlaceBlock(w,p,m,x,y,z,id)||!bot.player.inventory.spend(id,1))return false;w.set(x,y,z,id,true);bot.player.swingTicks=12;return true;}
export function nextDefence(bot){const plan=bot.director.defences[bot.player.team],elapsed=bot.match.timeline?.elapsed||0;for(let index=0;index<plan.cells.length;index++){const cell=plan.cells[index];if(elapsed<cell.availableAt||bot.match.world.get(cell.x,cell.y,cell.z))continue;plan.cursor=index;return cell;}return null;}
export function buildDefence(bot){const cell=nextDefence(bot);if(!cell)return false;const p=bot.player.body,dx=cell.x+.5-p.x,dz=cell.z+.5-p.z;if(Math.hypot(dx,dz)>3.5)return false;p.yaw=Math.atan2(-dx,-dz);p.pitch=Math.atan2(cell.y+.5-p.y-p.eyeHeight,Math.hypot(dx,dz));bot.player.heldTool=cell.id;if(bot.match.clock<bot.placeAt)return true;if(placeBotBlock(bot,cell.x,cell.y,cell.z,cell.id))bot.placeAt=bot.match.clock+Math.max(14,bot.difficulty.bridge)+Math.floor(Math.random()*12);return true;}
export function mineEnemyBed(bot,team){
 const m=bot.match,p=bot.player.body,t=TEAMS[team];if(!t||m.allied(team,bot.player.team)||!m.beds[team])return false;
 const point=basePoint(team,0,BED_FOOT_Z),dx=point.x-p.x,dy=17.28-p.y-p.eyeHeight,dz=point.z-p.z,length=Math.hypot(dx,dy,dz);
 if(length>6||length<.001)return false;
 const hit=voxelRaycast(m.world,p.x,p.y+p.eyeHeight,p.z,dx/length,dy/length,dz/length,Math.min(length,4.45),bot.mineHit);
 if(!hit.valid||!bed(hit.id)&&!m.world.editable(hit.x,hit.y,hit.z)||bed(hit.id)&&teamAtBed(hit.x,hit.z)!==team)return false;
 const {x,y,z,id}=hit;if(x!==bot.mineX||y!==bot.mineY||z!==bot.mineZ||id!==bot.mineId){bot.mineX=x;bot.mineY=y;bot.mineZ=z;bot.mineId=id;bot.mineProgress=0;}
 const gear=bot.player.gear,tool=isWool(id)&&gear.shears?58:id===B.OAK&&gear.axeTier>=0?54+gear.axeTier:gear.pickaxeTier>=0?50+gear.pickaxeTier:32;
 bot.player.heldTool=tool;bot.mineProgress+=m.teamUpgrades.miningRate(bot.index)/(60*miningSeconds(id,tool));p.yaw=Math.atan2(-dx,-dz);p.pitch=Math.atan2(dy,Math.hypot(dx,dz));bot.player.swingTicks=12;
 if(bot.mineProgress>=1){if(bed(id))m.destroyBed(team,bot.index);else{m.world.set(x,y,z,0);bot.player.inventory.add(id,1);}bot.mineProgress=0;}return true;
}