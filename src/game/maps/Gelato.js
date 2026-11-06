import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Gelato(g,l){const {fill,local,ball,disc}=g;
 fill(-20,15,-16,20,16,16,M.PEACH);fill(-16,15,-20,16,16,20,M.PEACH);
 for(let x=-15;x<=15;x++)for(let z=-15;z<=15;z++)g.w.set(x,16,z,(x+z)%7===0?M.PASTEL:M.QUARTZ);
 for(const t of l.teams){const put=local(t);for(let z=3;z<=10;z++)for(let x=-7;x<=7;x++)if(z>=8||Math.abs(x)>=6)put(x,22,z,M.WAFFLE);for(const x of [-6,6])for(let y=17;y<=22;y++)put(x,y,8,M.WAFFLE);
 const s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation)),cx=t.x+10*s,cz=t.z+10*c;for(let y=22;y<=27;y++){const r=Math.max(1,Math.floor((y-20)/2));disc(cx,cz,r,y,M.WAFFLE);}ball(cx,29,cz,5,4,5,t.teamIndex%2?M.PASTEL:M.PEACH);ball(cx,33,cz,2,2,2,B.WHITE);g.w.set(cx,35,cz,B.RED);}
 for(const [x,z] of [[-11,-11],[11,11]]){fill(x-2,17,z-2,x+2,18,z+2,M.WAFFLE);ball(x,21,z,3,3,3,M.PASTEL);g.w.set(x,24,z,B.RED);}
}