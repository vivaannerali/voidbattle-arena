import { TEAMS,teamAtBed } from '@/game/map';
import canPlaceBlock from '@/game/blockPlacement';
import voxelRaycast from '@/game/voxelRaycast';
import { B,bed,isWool } from '@/game/blocks';
import { miningSeconds } from '@/game/mining';
import { BED_SHIFT,BED_FOOT_Z } from '@/game/bedLayout';
export function basePoint(team,x,z){const t=TEAMS[team],s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation));return {x:t.x+x*c+z*s+.5,z:t.z-x*s+z*c+.5};}
export function defencePlan(team){const cells=[],add=(x,y,z,id)=>{const p=basePoint(team,x,z-BED_SHIFT);cells.push({x:Math.floor(p.x),y,z:Math.floor(p.z),id});};const t=TEAMS[team];for(const x of [-1,1])for(const z of [4,5])add(x,17,z,t.wool);add(0,17,3,t.wool);add(0,17,6,t.wool);add(0,18,4,t.wool);add(0,18,5,t.wool);for(const x of [-2,2])for(let z=3;z<=6;z++)add(x,17,z,t.clay);for(const z of [2,7])for(let x=-1;x<=1;x++)add(x,17,z,t.clay);add(0,19,4,t.clay);add(0,19,5,t.clay);return {cells,cursor:0};}
export function placeBotBlock(bot,x,y,z,id){const m=bot.match,w=m.world,p=bot.player.body;if(!bot.player.alive||m.phase!=='active'||Math.hypot(p.x-x-.5,p.y-y,p.z-z-.5)>4.5||!canPlaceBlock(w,p,m,x,y,z,id)||!bot.player.inventory.spend(id,1))return false;w.set(x,y,z,id,true);bot.player.swingTicks=12;return true;}
export function nextDefence(bot){const plan=bot.director.defences[bot.player.team];for(let n=0;n<plan.cells.length;n++){const index=(plan.cursor+n)%plan.cells.length,cell=plan.cells[index];if(bot.match.world.get(cell.x,cell.y,cell.z))continue;plan.cursor=index;return cell;}return null;}
export function buildDefence(bot){const cell=nextDefence(bot);if(!cell)return false;const p=bot.player.body;if(Math.hypot(p.x-cell.x-.5,p.z-cell.z-.5)>3.5)return false;if(bot.match.clock<bot.placeAt)return true;if(placeBotBlock(bot,cell.x,cell.y,cell.z,cell.id)){bot.placeAt=bot.match.clock+bot.difficulty.bridge;bot.director.defences[bot.player.team].cursor++;}return true;}
export function mineEnemyBed(bot,team){
 const m=bot.match,p=bot.player.body,t=TEAMS[team];if(!t||m.allied(team,bot.player.team)||!m.beds[team])return false;
 const point=basePoint(team,0,BED_FOOT_Z),dx=point.x-p.x,dy=17.28-p.y-p.eyeHeight,dz=point.z-p.z,length=Math.hypot(dx,dy,dz);
 if(length>6||length<.001)return false;
 const hit=voxelRaycast(m.world,p.x,p.y+p.eyeHeight,p.z,dx/length,dy/length,dz/length,Math.min(length,4.45),bot.mineHit);
 if(!hit.valid||!bed(hit.id)&&!m.world.editable(hit.x,hit.y,hit.z)||bed(hit.id)&&teamAtBed(hit.x,hit.z)!==team)return false;
 const {x,y,z,id}=hit;if(x!==bot.mineX||y!==bot.mineY||z!==bot.mineZ||id!==bot.mineId){bot.mineX=x;bot.mineY=y;bot.mineZ=z;bot.mineId=id;bot.mineProgress=0;}
 const gear=bot.player.gear,tool=isWool(id)&&gear.shears?58:id===B.OAK&&gear.axeTier>=0?54+gear.axeTier:gear.pickaxeTier>=0?50+gear.pickaxeTier:32;
 bot.mineProgress+=m.teamUpgrades.miningRate(bot.index)/(60*miningSeconds(id,tool));p.yaw=Math.atan2(-dx,-dz);p.pitch=Math.atan2(dy,Math.hypot(dx,dz));bot.player.swingTicks=12;
 if(bot.mineProgress>=1){if(bed(id))m.destroyBed(team,bot.index);else{m.world.set(x,y,z,0);bot.player.inventory.add(id,1);}bot.mineProgress=0;}return true;
}