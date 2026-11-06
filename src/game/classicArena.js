import { B } from '@/game/blocks';
import { BED_FOOT_Z,BED_HEAD_Z } from '@/game/bedLayout';
import mapPrimitives from '@/game/mapPrimitives';
export default function classicArena(w,l){const {fill}=mapPrimitives(w),TEAMS=l.teams;
 const island=(cx,cz,r,top)=>{for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++){if(Math.abs(x)+Math.abs(z)>r*1.7)continue;w.set(cx+x,16,cz+z,top);w.set(cx+x,15,cz+z,B.DIRT);if(Math.abs(x)+Math.abs(z)<r*1.5)w.set(cx+x,14,cz+z,B.STONE);if(Math.abs(x)+Math.abs(z)<r)w.set(cx+x,13,cz+z,B.STONE);}};
 for(const t of TEAMS){island(t.x,t.z,9,B.GRASS);if(t.active===false)continue;const sin=Math.round(Math.sin(t.rotation)),cos=Math.round(Math.cos(t.rotation)),put=(x,y,z,id)=>w.set(t.x+x*cos+z*sin,y,t.z-x*sin+z*cos,id);
 for(let x=-5;x<=5;x++)for(let z=-3;z<=7;z++)put(x,16,z,B.OAK);for(let x=-6;x<=6;x++)for(let z=-4;z<=-2;z++)put(x,16,z,t.clay);
 for(let y=17;y<=21;y++)for(const x of [-6,6])for(const z of [4,8])put(x,y,z,t.clay);for(let x=-7;x<=7;x++)for(let z=3;z<=9;z++)put(x,22,z,B.OAK);
 for(let x=-6;x<=6;x++)for(let y=17;y<=20;y++)put(x,y,8,y===20?t.clay:B.STONE);put(0,17,BED_FOOT_Z,B.BED_FOOT);put(0,17,BED_HEAD_Z,B.BED_HEAD);
 for(let x=-1;x<=1;x++)for(let z=6;z<=7;z++)put(x,16,z,B.STONE);put(-5,23,5,t.wool);put(-5,24,5,t.wool);put(-4,24,5,t.wool);put(-3,24,5,t.wool);}
 for(const [x,z] of l.diamonds){island(x,z,5,B.END);fill(x-1,16,z-1,x+1,16,z+1,B.STONE);for(const d of [-1,1])fill(x+d*4,17,z-1,x+d*4,19,z+1,B.END);}
 island(0,0,15,B.GRASS);fill(-5,16,-12,5,16,12,B.STONE);fill(-12,16,-5,12,16,5,B.STONE);
 for(const z of [-7,7]){fill(-1,16,z-1,1,16,z+1,B.END);for(const x of [-4,4])fill(x,17,z,x,21,z,B.END);fill(-4,22,z,4,22,z,B.END);}
 for(const [x,z] of [[-10,-10],[-10,10],[10,-10],[10,10]]){fill(x,17,z,x,20,z,B.END);fill(x-1,21,z-1,x+1,21,z+1,B.OAK);}
}