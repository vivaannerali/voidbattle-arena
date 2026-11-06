import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Glacier(g,l){const {fill,disc,local}=g;
 disc(0,0,12,16,M.ICE);for(const [x,z] of [[-18,-7],[18,-7],[-18,7],[18,7]])for(let y=20;y<=33;y++){const r=Math.max(0,3-Math.floor((y-20)/4));fill(x-r,y,z-r,x+r,y,z+r,y%5===0?M.SNOW:M.ICE);}
 for(const t of l.teams){const put=local(t);for(let x=-7;x<=7;x++)for(let z=5;z<=10;z++)put(x,23,z,M.SNOW);for(const x of [-6,6])for(let y=17;y<=22;y++)put(x,y,8,M.SPRUCE);for(let x=-7;x<=7;x++)for(let z=-5;z<=3;z++)if((x+z)%7===0)put(x,16,z,M.ICE);}
 for(const [x,z] of l.diamonds){for(let y=4;y<14;y++){const r=Math.min(3,Math.floor((y-3)/3));fill(x-r,y,z-r,x+r,y,z+r,M.ICE);}for(const dx of [-4,4])fill(x+dx,17,z+2,x+dx,20,z+2,M.DIORITE);}
 for(const [x,z] of l.emeralds){fill(x-1,16,z-1,x+1,16,z+1,B.WHITE);}
}