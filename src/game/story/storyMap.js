import { TEAMS,DIAMOND_ISLANDS,EMERALD_ISLANDS } from '@/game/map';
import { TEAM_DEFINITIONS } from '@/game/arenaModes';
import { B } from '@/game/blocks';
import { BED_FOOT_Z,BED_HEAD_Z } from '@/game/bedLayout';
import mapPrimitives from '@/game/mapPrimitives';
export function configureStoryArena(){
 TEAMS.splice(0,TEAMS.length,...TEAM_DEFINITIONS.map((t,index)=>({...t,teamIndex:index,x:index===0||index===3?0:140,z:index===0?-34:index===3?34:140,rotation:index===0?Math.PI:0,active:index===0||index===3})));
 DIAMOND_ISLANDS.splice(0);EMERALD_ISLANDS.splice(0,EMERALD_ISLANDS.length,[0,-5],[0,5]);
 return {id:'yellow-emperor',mapId:'yellow-emperor',name:'The Imperial Divide'};
}
export function buildStoryMap(world){
 const p=mapPrimitives(world);p.island(0,0,12,B.OBSIDIAN);
 for(const team of TEAMS.filter(t=>t.active)){
  p.island(team.x,team.z,11,B.QUARTZ);p.disc(0,team.z,9,16,team.clay,8);
  const set=p.local(team);set(0,17,BED_FOOT_Z,B.BED_FOOT);set(0,17,BED_HEAD_Z,B.BED_HEAD);
  for(const x of [-7,7]){for(let y=17;y<=23;y++)set(x,y,5,B.QUARTZ);set(x,24,5,team.wool);set(x,25,5,B.LANTERN);}
  for(let x=-5;x<=5;x++){set(x,21,9,B.QUARTZ);set(x,22,9,team.wool);}
  for(let x=-5;x<=5;x++)set(x,16,6,B.METAL);
 }
 p.path(0,23,0,10,1,B.YELLOW_CLAY);p.path(0,-23,0,-10,1,B.RED_CLAY);
 p.disc(0,0,5,16,B.QUARTZ);p.disc(0,0,4,16,B.YELLOW_CLAY,3);
 for(const x of [-9,9])for(const z of [-3,3]){p.fill(x,17,z,x,20,z,B.OBSIDIAN);world.set(x,21,z,B.LANTERN);}
 world.buildAll();
}