import { isLadder,blockHeight,BUILD_HEIGHT } from '@/game/blocks';
export const NAV_MIN=-68,NAV_WIDTH=137,NAV_SIZE=NAV_WIDTH*NAV_WIDTH;
export function gridKey(x,z){return (z-NAV_MIN)*NAV_WIDTH+x-NAV_MIN;}
export function gridX(key){return key%NAV_WIDTH+NAV_MIN;}
export function gridZ(key){return (key/NAV_WIDTH|0)+NAV_MIN;}
export default class BotGrid {
 constructor(world){this.world=world;this.heights=new Float32Array(NAV_SIZE);this.stamps=new Int32Array(NAV_SIZE);this.stamps.fill(-1);}
 height(key){if(key<0||key>=NAV_SIZE)return -1;const x=gridX(key),z=gridZ(key),w=this.world,revision=w.columnVersions[(z+256)*512+x+256];if(this.stamps[key]===revision)return this.heights[key];
  let floor=16;while(floor>=14&&(!w.get(x,floor,z)||isLadder(w.get(x,floor,z))))floor--;
  let height=0;if(floor>=14){while(floor<BUILD_HEIGHT&&w.get(x,floor+1,z)&&!isLadder(w.get(x,floor+1,z))&&blockHeight(w.get(x,floor,z))===1)floor++;height=floor+blockHeight(w.get(x,floor,z));for(let y=Math.floor(height+.00001);y<=Math.floor(height+1.8-.00001);y++){const id=w.get(x,y,z);if(id&&!isLadder(id)&&y+blockHeight(id)>height+.00001){height=-1;break;}}}else if(w.get(x,17,z)||w.get(x,18,z))height=-1;
  this.stamps[key]=revision;this.heights[key]=height;return height;
 }
}