import { B } from '@/game/blocks';
export default function mapPrimitives(w){
 const fill=(x1,y1,z1,x2,y2,z2,id)=>{for(let x=Math.round(x1);x<=Math.round(x2);x++)for(let z=Math.round(z1);z<=Math.round(z2);z++)for(let y=Math.round(y1);y<=Math.round(y2);y++)w.set(x,y,z,id);};
 const disc=(cx,cz,r,y,id,inner=0)=>{for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++)if(x*x+z*z<=r*r&&x*x+z*z>=inner*inner)w.set(cx+x,y,cz+z,id);};
 const island=(cx,cz,r,top=B.GRASS)=>{disc(cx,cz,r,16,top);disc(cx,cz,r-1,15,B.STONE);disc(cx,cz,r-3,14,B.STONE);disc(cx,cz,Math.max(1,r-5),13,B.STONE);};
 const ball=(cx,cy,cz,rx,ry,rz,id)=>{for(let x=-rx;x<=rx;x++)for(let y=-ry;y<=ry;y++)for(let z=-rz;z<=rz;z++)if(x*x/(rx*rx)+y*y/(ry*ry)+z*z/(rz*rz)<=1)w.set(cx+x,cy+y,cz+z,id);};
 const path=(ax,az,bx,bz,width,id,y=16)=>{const n=Math.max(Math.abs(bx-ax),Math.abs(bz-az));for(let i=0;i<=n;i++){const t=n?i/n:0,x=Math.round(ax+(bx-ax)*t),z=Math.round(az+(bz-az)*t),h=typeof y==='function'?y(t):y;fill(x-width,h,z-width,x+width,h,z+width,id);}};
 const local=t=>{const s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation));return (x,y,z,id)=>w.set(t.x+x*c+z*s,y,t.z-x*s+z*c,id);};
 const cylinder=(cx,cz,r,y1,y2,id,inner=0)=>{for(let y=y1;y<=y2;y++)disc(cx,cz,r,y,id,inner);};
 return {w,fill,disc,island,ball,path,local,cylinder};
}