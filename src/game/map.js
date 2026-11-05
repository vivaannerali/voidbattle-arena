import { B, SPAWN } from '@/game/blocks';
export const TEAMS=[{name:'RED',x:0,z:51,rotation:0,wool:B.RED,clay:B.RED_CLAY},{name:'BLUE',x:-51,z:0,rotation:-Math.PI/2,wool:B.BLUE,clay:B.BLUE_CLAY},{name:'GREEN',x:0,z:-51,rotation:Math.PI,wool:B.GREEN,clay:B.GREEN_CLAY},{name:'YELLOW',x:51,z:0,rotation:Math.PI/2,wool:B.YELLOW,clay:B.YELLOW_CLAY}];
export function makeMap(w){
 function fill(x1,y1,z1,x2,y2,z2,id){for(let x=x1;x<=x2;x++)for(let z=z1;z<=z2;z++)for(let y=y1;y<=y2;y++)w.set(x,y,z,id);}
 function island(cx,cz,r,top){for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++){if(Math.abs(x)+Math.abs(z)>r*1.7)continue;w.set(cx+x,16,cz+z,top);w.set(cx+x,15,cz+z,B.DIRT);if(Math.abs(x)+Math.abs(z)<r*1.5)w.set(cx+x,14,cz+z,B.STONE);if(Math.abs(x)+Math.abs(z)<r)w.set(cx+x,13,cz+z,B.STONE);}}
 for(const t of TEAMS){island(t.x,t.z,9,B.GRASS);const sin=Math.round(Math.sin(t.rotation)),cos=Math.round(Math.cos(t.rotation));const pos=(x,z)=>[t.x+x*cos+z*sin,t.z-x*sin+z*cos];const put=(x,y,z,id)=>{const p=pos(x,z);w.set(p[0],y,p[1],id);};
  for(let x=-5;x<=5;x++)for(let z=-3;z<=7;z++)put(x,16,z,B.OAK);
  for(let x=-6;x<=6;x++)for(let z=-4;z<=-2;z++)put(x,16,z,t.clay);
  for(let y=17;y<=21;y++)for(const x of [-6,6])for(const z of [4,8])put(x,y,z,t.clay);
  for(let x=-7;x<=7;x++)for(let z=3;z<=9;z++)put(x,22,z,B.OAK);
  for(let x=-6;x<=6;x++)for(let y=17;y<=20;y++)put(x,y,8,y===20?t.clay:B.STONE);
  put(0,17,4,B.BED_FOOT);put(0,17,5,B.BED_HEAD);
  for(let x=-1;x<=1;x++)for(let z=6;z<=7;z++)put(x,16,z,B.STONE);
  put(-5,23,5,t.wool);put(-5,24,5,t.wool);put(-4,24,5,t.wool);put(-3,24,5,t.wool);
 }
 for(const p of [[-27,27],[-27,-27],[27,-27],[27,27]]){island(p[0],p[1],5,B.END);fill(p[0]-1,16,p[1]-1,p[0]+1,16,p[1]+1,B.STONE);for(const d of [-1,1])fill(p[0]+d*4,17,p[1]-1,p[0]+d*4,19,p[1]+1,B.END);}
 island(0,0,15,B.GRASS);fill(-5,16,-12,5,16,12,B.STONE);fill(-12,16,-5,12,16,5,B.STONE);
 for(const z of [-7,7]){fill(-1,16,z-1,1,16,z+1,B.END);for(const x of [-4,4])fill(x,17,z,x,21,z,B.END);fill(-4,22,z,4,22,z,B.END);}
 for(const p of [[-10,-10],[-10,10],[10,-10],[10,10]]){fill(p[0],17,p[1],p[0],20,p[1],B.END);fill(p[0]-1,21,p[1]-1,p[0]+1,21,p[1]+1,B.OAK);}
 w.buildAll();return SPAWN;
}