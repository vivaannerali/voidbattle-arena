import { B } from '@/game/blocks';
import { BED_FOOT_Z,BED_HEAD_Z } from '@/game/bedLayout';
import { M } from '@/game/mapMaterials';
import mapPrimitives from '@/game/mapPrimitives';
import classicArena from '@/game/classicArena';
import Gelato from '@/game/maps/Gelato';
import Acropolis from '@/game/maps/Acropolis';
import Airshow from '@/game/maps/Airshow';
import Amazon from '@/game/maps/Amazon';
import Arcade from '@/game/maps/Arcade';
import Cascade from '@/game/maps/Cascade';
import Cliffside from '@/game/maps/Cliffside';
import Glacier from '@/game/maps/Glacier';
import Lighthouse from '@/game/maps/Lighthouse';
import Orbit from '@/game/maps/Orbit';
import Speedway from '@/game/maps/Speedway';
const BUILDERS={gelato:Gelato,acropolis:Acropolis,airshow:Airshow,amazon:Amazon,arcade:Arcade,cascade:Cascade,cliffside:Cliffside,glacier:Glacier,lighthouse:Lighthouse,orbit:Orbit,speedway:Speedway};
export default function buildArena(w,layout){if(layout.map.id==='classic'){classicArena(w,layout);return;}const g=mapPrimitives(w),{map,teams,diamonds,emeralds}=layout,floor=M[map.floor]||B[map.floor]||B.STONE;
 for(const t of teams){g.island(t.x,t.z,9,floor);const put=g.local(t);for(let x=-5;x<=5;x++)for(let z=-3;z<=8;z++)put(x,16,z,floor);for(let x=-5;x<=5;x++)for(let z=-5;z<=-4;z++)put(x,16,z,t.wool);}
 for(const [x,z] of diamonds)g.island(x,z,5,map.id==='glacier'?M.ICE:M.QUARTZ);g.island(0,0,map.mid,floor);BUILDERS[map.id](g,layout);
 // Fixed-height, unobstructed service and spawn zones preserve existing combat,
 // navigation, respawns, NPC reach and generator contracts on every theme.
 for(const t of teams){const put=g.local(t);for(let x=-4;x<=4;x++)for(let z=-3;z<=2;z++){put(x,16,z,floor);for(let y=17;y<=20;y++)put(x,y,z,B.AIR);}for(let x=-5;x<=5;x++)for(let z=5;z<=7;z++){put(x,16,z,floor);for(let y=17;y<=20;y++)put(x,y,z,B.AIR);}for(let x=-2;x<=2;x++)for(let z=3;z<=5;z++){put(x,16,z,floor);for(let y=17;y<=20;y++)put(x,y,z,B.AIR);}if(t.active!==false){put(0,17,BED_FOOT_Z,B.BED_FOOT);put(0,17,BED_HEAD_Z,B.BED_HEAD);}put(-5,21,7,t.wool);put(5,21,7,t.wool);}
 for(const [x,z] of [...diamonds,...emeralds]){g.fill(x-1,16,z-1,x+1,16,z+1,diamonds.some(p=>p[0]===x&&p[1]===z)?M.QUARTZ:M.LANTERN);g.fill(x-1,17,z-1,x+1,20,z+1,B.AIR);}
 // A clear ground-level emerald corridor, including through landmark interiors.
 g.fill(-1,16,emeralds[0][1],1,16,emeralds[1][1],floor);g.fill(-1,17,emeralds[0][1],1,20,emeralds[1][1],B.AIR);
}