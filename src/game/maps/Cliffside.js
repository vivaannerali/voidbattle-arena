import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Cliffside(g,l){const {fill,ball,local}=g;
 for(const t of l.teams){const put=local(t);for(let x=-9;x<=9;x++)for(let z=8;z<=13;z++)for(let y=14;y<=29-Math.abs(x);y++)put(x,y,z,M.BRICK);for(const x of [-6,6])for(let y=17;y<=24;y++)put(x,y,7,M.SPRUCE);for(let x=-6;x<=6;x++)put(x,24,7,M.SPRUCE);for(let x=-3;x<=3;x++)for(let y=17;y<=21;y++)for(let z=8;z<=12;z++)put(x,y,z,B.AIR);for(const x of [-5,5])put(x,21,6,M.LANTERN);}
 for(let x=-11;x<=11;x++)for(let y=20;y<=40;y++){const dx=x,dy=y-30,r=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),tooth=Math.floor((angle+Math.PI)*8/Math.PI)%2===0;if(r>=6&&r<=(tooth?10:8)||r<2||Math.abs(dx)<1&&r<7||Math.abs(dy)<1&&r<7)fill(x,y,-1,x,y,1,B.RED);}
 fill(-2,17,-2,2,19,2,M.METAL);for(const [x,z] of [[-10,-10],[10,10]]){ball(x,18,z,5,4,4,M.BRICK);fill(x-3,17,z-1,x+3,18,z+1,M.SPRUCE);}
}