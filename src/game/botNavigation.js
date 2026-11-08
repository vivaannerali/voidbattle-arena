import { NAV_SIZE,NAV_WIDTH,NAV_MIN,gridKey,gridX,gridZ } from '@/game/botGrid';
// Incremental weighted A*. All work buffers are allocated once per bot.
export default class BotNavigation {
 constructor(grid){this.grid=grid;this.g=new Float32Array(NAV_SIZE);this.f=new Float32Array(NAV_SIZE);this.parent=new Int32Array(NAV_SIZE);this.bridges=new Uint16Array(NAV_SIZE);this.seen=new Uint16Array(NAV_SIZE);this.closed=new Uint16Array(NAV_SIZE);this.position=new Int32Array(NAV_SIZE);this.heap=new Int32Array(NAV_SIZE);this.path=new Int32Array(512);this.levels=new Float32Array(NAV_SIZE);this.pathHeights=new Float32Array(512);this.stamp=0;this.cancel();}
 cancel(){this.searching=false;this.failed=false;this.length=0;this.cursor=0;this.heapSize=0;}
 begin(x,z,tx,tz,bridge,height=17){this.cancel();x=Math.max(NAV_MIN,Math.min(68,Math.floor(x)));z=Math.max(NAV_MIN,Math.min(68,Math.floor(z)));tx=Math.max(NAV_MIN,Math.min(68,Math.floor(tx)));tz=Math.max(NAV_MIN,Math.min(68,Math.floor(tz)));this.start=gridKey(x,z);this.goal=gridKey(tx,tz);this.tx=tx;this.tz=tz;this.bridge=Math.max(0,Math.floor(bridge));this.bridges[this.start]=0;const startHeight=this.grid.height(this.start,height);this.levels[this.start]=startHeight>0?startHeight:Math.ceil(height-.001);this.expanded=0;if(++this.stamp>=65535){this.seen.fill(0);this.closed.fill(0);this.stamp=1;}this.g[this.start]=0;this.parent[this.start]=-1;this.seen[this.start]=this.stamp;this.f[this.start]=0;this.position[this.start]=-1;this.push(this.start);this.searching=true;}
 push(key){let i=this.position[key];if(i<0)i=this.heapSize++;while(i>0){const parent=(i-1)>>1,p=this.heap[parent];if(this.f[p]<=this.f[key])break;this.heap[i]=p;this.position[p]=i;i=parent;}this.heap[i]=key;this.position[key]=i;}
 pop(){const result=this.heap[0],last=this.heap[--this.heapSize];this.position[result]=-1;if(this.heapSize){let i=0;while(i*2+1<this.heapSize){let child=i*2+1;if(child+1<this.heapSize&&this.f[this.heap[child+1]]<this.f[this.heap[child]])child++;if(this.f[last]<=this.f[this.heap[child]])break;this.heap[i]=this.heap[child];this.position[this.heap[i]]=i;i=child;}this.heap[i]=last;this.position[last]=i;}return result;}
 step(budget=96){for(let count=0;count<budget&&this.searching;count++){
  if(!this.heapSize||++this.expanded>6500){this.searching=false;this.failed=true;return;}const key=this.pop();if(key===this.goal){this.finish(key);return;}this.closed[key]=this.stamp;
  const x=gridX(key),z=gridZ(key),h=this.levels[key];
  for(let d=0;d<8;d++){const dx=d<4?(d===0?1:d===1?-1:0):(d<6?1:-1),dz=d<4?(d===2?1:d===3?-1:0):(d%2?1:-1),nx=x+dx,nz=z+dz;if(nx<NAV_MIN||nx>68||nz<NAV_MIN||nz>68)continue;
   const next=gridKey(nx,nz);if(this.closed[next]===this.stamp)continue;const height=this.grid.height(next,h),needed=this.bridges[key]+(height===0?1:0),nh=height||Math.ceil(h-.001);
   if(height<0||needed>this.bridge||nh-h>1.001||h-nh>3.001||nh>h+.3&&!this.grid.clearAt(key,nh))continue;
   if(d>=4){if(!height)continue;const sideX=this.grid.height(gridKey(nx,z),h),sideZ=this.grid.height(gridKey(x,nz),h);if(sideX<=0||sideZ<=0||sideX>Math.min(h,nh)+.001||sideZ>Math.min(h,nh)+.001)continue;}
   const previous=this.parent[key],turn=previous>=0&&(x-gridX(previous)!==dx||z-gridZ(previous)!==dz)?.08:0;
   const cost=this.g[key]+(height===0?3.5:d>=4?Math.SQRT2:1)+Math.abs(nh-h)*.7+turn;if(this.seen[next]===this.stamp&&cost>=this.g[next])continue;
   if(this.seen[next]!==this.stamp){this.position[next]=-1;this.seen[next]=this.stamp;}this.g[next]=cost;this.bridges[next]=needed;this.levels[next]=nh;this.parent[next]=key;
   const ax=Math.abs(nx-this.tx),az=Math.abs(nz-this.tz);this.f[next]=cost+1.1*(Math.max(ax,az)+(Math.SQRT2-1)*Math.min(ax,az));this.push(next);
  }
 }}
 finish(key){this.searching=false;let length=0;while(key!==this.start&&key>=0&&length<this.path.length){this.pathHeights[length]=this.levels[key];this.path[length++]=key;key=this.parent[key];}if(key!==this.start){this.failed=true;return;}for(let a=0,b=length-1;a<b;a++,b--){const n=this.path[a];this.path[a]=this.path[b];this.path[b]=n;const h=this.pathHeights[a];this.pathHeights[a]=this.pathHeights[b];this.pathHeights[b]=h;}this.length=length;this.cursor=0;}
}