import Physics from '@/game/physics';
import { blockHeight } from '@/game/blocks';
import { COMPANIONS } from '@/game/companionItems';
export function companionBody(world,kind){const p=new Physics(world);p.autoRespawn=false;Object.defineProperty(p,'height',{value:COMPANIONS[kind].height});p.speedMultiplier=COMPANIONS[kind].speed;return p;}
export default function companionSpawn(system,i){
 const m=system.match,s=m.players[i.playerIndex],kind=i.blocks[i.slot],def=COMPANIONS[kind],h=i.hit;
 if(!def||!s?.alive||m.phase!=='active')return false;
 if(system.entries.size>=24||Array.from(system.entries.values()).filter(c=>c.owner===s.id).length>=3){i.message('Companion limit reached. Wait for an active companion to expire.');return false;}
 if(!h.valid||h.ny!==1){i.message('Aim at the top of clear ground to summon your companion.');return false;}
 const p=companionBody(m.world,kind),x=h.x+.5,y=h.y+blockHeight(h.id)+.001,z=h.z+.5;
 let blocked=p.collides(x,y,z)||!p.support(x,y,z)||y+def.height>=64;
 for(let level=0;level<Math.ceil(def.height);level++)if(m.overlaps(h.x,Math.floor(y)+level,h.z)||m.interaction.shops?.overlaps(h.x,Math.floor(y)+level,h.z)||m.interaction.upgradesNPCs?.overlaps(h.x,Math.floor(y)+level,h.z))blocked=true;
 if(blocked){i.message('Your companion needs clear ground and enough headroom.');return false;}if(!i.store.consume(i.slot))return false;
 system.add({id:++system.sequence,kind,team:s.team,owner:s.id,health:def.health,x,y,z,yaw:s.body.yaw,anchorX:x,anchorZ:z,due:m.clock+def.lifetime});s.spawnGuard=0;i.message(def.name+' summoned.');return true;
}