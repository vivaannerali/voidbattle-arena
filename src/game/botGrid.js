import { isLadder } from '@/game/blocks';
export const NAV_MIN=-68,NAV_WIDTH=137,NAV_SIZE=NAV_WIDTH*NAV_WIDTH;
export function gridKey(x,z){return (z-NAV_MIN)*NAV_WIDTH+x-NAV_MIN;}
export function gridX(key){return key%NAV_WIDTH+NAV_MIN;}
export function gridZ(key){return (key/NAV_WIDTH|0)+NAV_MIN;}
export default class BotGrid {
 constructor(world){this.world=world;this.heights=new Int8Array(NAV_SIZE);this.stamps=new Int32Array(NAV_SIZE);this.stamps.fill(-1);}
 height(key){if(key<0||key>=NAV_SIZE)return -1;const revision=this.world.navigationRevision;if(this.stamps[key]===revision)return this.heights[key];const x=gridX(key),z=gridZ(key),w=this.world;let height=17;if(!w.get(x,16,z)){height=w.get(x,17,z)||w.get(x,18,z)?-1:0;}else{while(height<=20&&w.get(x,height,z)&&!isLadder(w.get(x,height,z)))height++;if(height>20||w.get(x,height+1,z))height=-1;}this.stamps[key]=revision;this.heights[key]=height;return height;}
}