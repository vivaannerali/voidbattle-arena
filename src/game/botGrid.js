import { isLadder,blockHeight,BUILD_HEIGHT } from '@/game/blocks';
export const NAV_MIN=-68,NAV_WIDTH=137,NAV_SIZE=NAV_WIDTH*NAV_WIDTH;
export function gridKey(x,z){return (z-NAV_MIN)*NAV_WIDTH+x-NAV_MIN;}
export function gridX(key){return key%NAV_WIDTH+NAV_MIN;}
export function gridZ(key){return (key/NAV_WIDTH|0)+NAV_MIN;}
export default class BotGrid {
 constructor(world){this.world=world;this.heights=new Float32Array(NAV_SIZE);this.references=new Float32Array(NAV_SIZE);this.stamps=new Int32Array(NAV_SIZE);this.stamps.fill(-1);}
 clearAt(key,height){const x=gridX(key),z=gridZ(key);for(let y=Math.floor(height+.00001);y<=Math.floor(height+1.8-.00001);y++){const id=this.world.get(x,y,z);if(id&&!isLadder(id)&&y+blockHeight(id)>height+.00001)return false;}return true;}
 height(key,reference=17){if(key<0||key>=NAV_SIZE)return -1;reference=Math.round(reference*100)/100;const x=gridX(key),z=gridZ(key),w=this.world,revision=w.columnVersions[(z+256)*512+x+256];if(this.stamps[key]===revision&&this.references[key]===Math.fround(reference))return this.heights[key];
  let height=-1,best=Infinity;for(let y=Math.min(BUILD_HEIGHT-1,Math.floor(reference+1));y>=Math.max(0,Math.floor(reference-4));y--){const id=w.get(x,y,z);if(!id||isLadder(id))continue;const top=y+blockHeight(id),delta=top-reference;if(delta>1.001||delta< -3.001||!this.clearAt(key,top))continue;const score=Math.abs(delta)+(delta<0?.15:0);if(score<best){height=top;best=score;}}
  // Empty, unobstructed columns can be bridged at the incoming route's height.
  if(height<0&&this.clearAt(key,Math.ceil(reference-.001))&&!w.get(x,Math.ceil(reference-.001)-1,z))height=0;
  this.stamps[key]=revision;this.references[key]=reference;this.heights[key]=height;return height;
 }
}