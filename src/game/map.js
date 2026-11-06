import { B, SPAWN } from '@/game/blocks';
import { mapLayout,resolveMap } from '@/game/mapCatalog';
import buildArena from '@/game/buildArena';
export const TEAMS=[],DIAMOND_ISLANDS=[],EMERALD_ISLANDS=[];
let arena;
export function configureArena(mode='Solos',activeTeams=null,mapId='classic-8'){arena=mapLayout(resolveMap(mapId,mode));TEAMS.splice(0,TEAMS.length,...arena.teams.map((team,index)=>({...team,active:!activeTeams||activeTeams.includes(index)})));DIAMOND_ISLANDS.splice(0,DIAMOND_ISLANDS.length,...arena.diamonds);EMERALD_ISLANDS.splice(0,EMERALD_ISLANDS.length,...arena.emeralds);arena.teams=TEAMS;return arena.map;}
export function teamAtBed(x,z){for(let i=0;i<TEAMS.length;i++){const t=TEAMS[i],s=Math.round(Math.sin(t.rotation)),c=Math.round(Math.cos(t.rotation));for(let n=4;n<=5;n++)if(x===t.x+n*s&&z===t.z+n*c)return i;}return -1;}
configureArena();
export function makeMap(w){buildArena(w,arena);w.buildAll();return SPAWN;}