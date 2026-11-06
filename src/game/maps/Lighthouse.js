import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Lighthouse(g,l){const {fill,cylinder,local}=g;
 for(let y=17;y<=41;y++)cylinder(0,0,4,y,y,Math.floor((y-17)/5)%2?B.RED:B.WHITE,3);fill(-5,42,-5,5,42,5,M.SPRUCE);fill(-3,43,-3,3,46,3,B.GLASS);fill(-1,43,-1,1,45,1,M.LANTERN);fill(-5,47,-5,5,47,5,B.RED);for(let tier=0;tier<4;tier++)fill(-4+tier,48+tier,-4+tier,4-tier,48+tier,4-tier,B.RED);fill(-1,17,3,1,19,4,B.AIR);
 for(const t of l.teams){const put=local(t);for(const x of [-7,7])for(const z of [-5,0,6])for(let y=12;y<=18;y++)put(x,y,z,M.LOG);for(let x=-7;x<=7;x++)for(let z=5;z<=10;z++)put(x,23,z,(x+8)%4<2?B.RED:B.WHITE);for(const x of [-6,6])for(let y=17;y<=23;y++)put(x,y,8,M.LOG);}
 for(const [x,z] of l.diamonds){fill(x-4,16,z-1,x+4,16,z+1,M.OAK||B.OAK);for(const dx of [-4,4])fill(x+dx,13,z,x+dx,18,z,M.LOG);}
}