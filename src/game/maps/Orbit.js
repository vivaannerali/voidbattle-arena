import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Orbit(g,l){const {disc,fill,local}=g;
 disc(0,0,20,16,M.METAL,15);disc(0,0,11,16,M.QUARTZ);fill(-2,16,-19,2,16,19,M.METAL);fill(-19,16,-2,19,16,2,M.METAL);
 for(const [x,z] of [[-16,0],[16,0],[0,-16],[0,16]]){fill(x-1,17,z-1,x+1,28,z+1,M.BARS);fill(x-2,29,z-2,x+2,29,z+2,M.LANTERN);}
 for(const t of l.teams){const put=local(t);for(const x of [-6,6])for(let y=17;y<=25;y++)put(x,y,8,M.METAL);for(let x=-6;x<=6;x++){put(x,25,8,x%3===0?M.LANTERN:M.METAL);for(let z=4;z<=9;z++)put(x,24,z,M.METAL);}for(let x=-5;x<=5;x++)put(x,17,-5,M.LANTERN);for(const x of [-8,8])for(let z=-3;z<=7;z++)put(x,17,z,M.BARS);}
 for(const [x,z] of l.diamonds){disc(x,z,5,16,M.METAL,3);for(const dx of [-3,3])fill(x+dx,17,z+3,x+dx,21,z+3,M.LANTERN);}
 fill(-1,18,-1,1,31,1,M.BARS);for(let r=2;r<=7;r++)disc(0,0,r,32,M.METAL,Math.max(0,r-1));fill(-2,33,-2,2,33,2,M.LANTERN);
}