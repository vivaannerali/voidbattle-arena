import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Cascade(g,l){const {fill,disc,path,local}=g;
 for(const r of [7,12]){disc(0,0,r,21+(r===7?5:0),M.QUARTZ,r-2);for(let y=17;y<=25;y++)for(const [x,z] of [[r,0],[-r,0],[0,r],[0,-r]])fill(x,y,z,x+1,y,z+1,B.BLUE_GLASS);}
 for(const t of l.teams){const put=local(t),s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation)),ax=t.x-8*s,az=t.z-8*c,bx=Math.round(t.x*.24),bz=Math.round(t.z*.24);path(ax,az,bx,bz,1,M.QUARTZ,t=>16+Math.max(0,Math.floor(Math.sin(t*Math.PI)*4)));for(let x=-6;x<=6;x++)put(x,25,8,M.QUARTZ);for(const x of [-6,6])for(let y=17;y<=24;y++)put(x,y,8,B.BLUE_GLASS);}
 for(const [x,z] of l.diamonds){fill(x-3,17,z+3,x-3,26,z+3,M.QUARTZ);fill(x+3,17,z+3,x+3,26,z+3,M.QUARTZ);fill(x-3,26,z+3,x+3,27,z+3,M.QUARTZ);fill(x-1,17,z+3,x+1,25,z+3,B.BLUE_GLASS);}
}