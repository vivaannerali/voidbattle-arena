import { gridKey,gridX,gridZ,NAV_MIN } from '@/game/botGrid';
// Small, periodically refreshed ground-only search; never spends bridge blocks in a duel.
export default function botHighGround(bot,target,index){
 const p=bot.player.body,grid=bot.director.grid,clock=bot.match.clock;
 let state=bot.highGround;
 if(!state||state.enemy!==index||clock>=state.next||Math.hypot(state.tx-target.x,state.tz-target.z)>1.5){
  state=bot.highGround={enemy:index,next:clock+24+bot.index%7,tx:target.x,tz:target.z,path:[],cursor:0};
  const start=gridKey(Math.floor(p.x),Math.floor(p.z)),height=grid.height(start,p.y);if(height<=0)return null;
  const nodes=[{key:start,height,parent:-1,depth:0}],seen=new Set([start]);let best=0,bestScore=score(p.x,p.z,height,0);
  function score(x,z,h,depth){const distance=Math.hypot(x-target.x,z-target.z);if(distance<1.5||distance>5||h-target.y>1.5||target.y-h>3||!bot.match.lineClear(x,h+1.4,z,target.x,target.y+1,target.z))return -Infinity;return Math.min(h-target.y,1.3)*4-Math.abs(distance-2.4)*.7-depth*.3;}
  for(let cursor=0;cursor<nodes.length&&nodes.length<65;cursor++){
   const node=nodes[cursor];if(node.depth>=4)continue;const x=gridX(node.key),z=gridZ(node.key);
   for(let d=0;d<4&&nodes.length<65;d++){const nx=x+(d===0?1:d===1?-1:0),nz=z+(d===2?1:d===3?-1:0);if(nx<NAV_MIN||nx>68||nz<NAV_MIN||nz>68)continue;
    const key=gridKey(nx,nz);if(seen.has(key))continue;const h=grid.height(key,node.height);if(h<=0||h-node.height>1.001||node.height-h>1.001||h>node.height+.3&&!grid.clearAt(node.key,h))continue;
    seen.add(key);const candidate={key,height:h,parent:cursor,depth:node.depth+1};nodes.push(candidate);const value=score(nx+.5,nz+.5,h,candidate.depth);if(value>bestScore+.25){bestScore=value;best=nodes.length-1;}
   }
  }
  while(best>0){state.path.push(nodes[best]);best=nodes[best].parent;}state.path.reverse();
 }
 state.floor=grid.height(gridKey(Math.floor(p.x),Math.floor(p.z)),p.y);
 while(state.cursor<state.path.length){const point=state.path[state.cursor],x=gridX(point.key)+.5,z=gridZ(point.key)+.5;if(Math.hypot(x-p.x,z-p.z)<.25&&Math.abs(p.y-point.height)<.2){state.cursor++;continue;}
  const height=grid.height(point.key,p.y);if(height<=0||Math.abs(height-point.height)>.1){state.next=0;return null;}return {x,z,height};
 }
 return state.floor>target.y+.4?{hold:true}:null;
}