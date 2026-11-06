import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Speedway(g,l){const {path,fill,local}=g;
 const lane=(ax,az,bx,bz)=>{path(ax,az,bx,bz,3,B.WHITE);path(ax,az,bx,bz,2,M.ASPHALT);const n=Math.max(Math.abs(bx-ax),Math.abs(bz-az));for(let i=0;i<=n;i+=4){const x=Math.round(ax+(bx-ax)*i/n),z=Math.round(az+(bz-az)*i/n);if(Math.abs(bx-ax)>Math.abs(bz-az)){g.w.set(x,16,z-3,B.RED);g.w.set(x,16,z+3,B.RED);}else{g.w.set(x-3,16,z,B.RED);g.w.set(x+3,16,z,B.RED);}}};
 l.diamonds.forEach(([x,z],i)=>{const next=l.diamonds[(i+1)%l.diamonds.length];lane(x,z,next[0],next[1]);});
 for(const [x,z] of l.diamonds.filter((_,i)=>i%2===0))lane(x,z,0,Math.sign(z)*7);lane(0,-7,0,7);
 for(const t of l.teams){const put=local(t);for(const x of [-6,6])for(let y=17;y<=23;y++)put(x,y,8,M.METAL);for(let x=-7;x<=7;x++)for(let z=4;z<=10;z++)put(x,24,z,(x+z)%2?B.RED:B.WHITE);for(let x=-5;x<=5;x++)for(let z=-4;z<=-2;z++)put(x,16,z,(x+z)%2?B.WHITE:M.ASPHALT);}
 for(const x of [-11,11]){fill(x,17,0,x,24,0,M.METAL);fill(x-1,25,-2,x+1,25,2,M.LANTERN);}fill(-11,24,0,11,24,0,M.METAL);
}