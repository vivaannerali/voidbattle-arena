import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Arcade(g,l){const {fill,local}=g;
 for(let x=-14;x<=14;x++)for(let z=-14;z<=14;z++){g.w.set(x,16,z,x%4===0||z%4===0?B.AQUA:M.METAL);if(Math.abs(x)%8===3&&Math.abs(z)%8===3)fill(x,13,z,x+1,16,z+1,B.AIR);}
 const cabinet=(x,z,color)=>{fill(x-1,17,z,x+1,21,z+2,M.ASPHALT);fill(x-1,22,z,x+1,22,z+2,color);fill(x-1,19,z,x+1,20,z,B.BLUE_GLASS);g.w.set(x,20,z,B.WHITE);fill(x-1,18,z-1,x+1,18,z-1,M.METAL);g.w.set(x,19,z-1,B.RED);};
 for(const [x,z] of [[-11,-9],[11,-9],[-11,9],[11,9]])cabinet(x,z,B.PINK);
 for(const t of l.teams){const put=local(t);for(const x of [-6,6])for(let y=17;y<=25;y++)put(x,y,8,y%3===0?B.AQUA:B.PINK);for(let x=-6;x<=6;x++)put(x,25,8,B.PINK);for(let x=-4;x<=4;x++)for(let y=26;y<=31;y++)if(y===26||y===31||x===-4||x===4||(x+y)%3===0)put(x,y,8,B.AQUA);}
 for(const x of [-14,14])for(let z=-12;z<=12;z++)if(z%3===0)g.w.set(x,17,z,M.LANTERN);
}