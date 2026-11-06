import { M } from '@/game/mapMaterials';
import { B } from '@/game/blocks';
export default function Amazon(g,l){const {fill,ball,path,local}=g;
 const tree=(x,z,r=5)=>{fill(x-1,17,z-1,x+1,29,z+1,M.LOG);ball(x,31,z,r,4,r,M.LEAVES);for(const dx of [-r+1,r-1])for(let y=21;y<31;y++)g.w.set(x+dx,y,z,B.GREEN_GLASS);};
 for(const [x,z] of [[-11,-10],[11,-10],[-11,10],[11,10]])tree(x,z,6);
 for(const [x,z] of l.diamonds){path(x,z,0,Math.sign(z)*7,1,M.MOSS);tree(x+3,z+2,4);}
 for(const t of l.teams){const put=local(t),s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation));tree(t.x+10*s,t.z+10*c,6);for(let x=-6;x<=6;x++)for(let z=4;z<=9;z++)put(x,23,z,M.LEAVES);for(const x of [-6,6])for(let y=17;y<23;y++)put(x,y,8,M.LOG);}
 for(const [ax,az,bx,bz] of [[-11,-10,11,-10],[-11,10,11,10],[-11,-10,-11,10],[11,-10,11,10]])path(ax,az,bx,bz,1,M.LOG,27);
}