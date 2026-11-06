import { TEAM_MODES,EIGHT_BASES,FOUR_BASES,EIGHT_DIAMONDS,FOUR_DIAMONDS,TEAM_DEFINITIONS } from '@/game/arenaModes';
export const MAP_THEMES=[
 {id:'gelato',name:'Gelato',tag:'Featured Summer',radius:46,mid:16,floor:'PASTEL',description:'Pastel scoops, waffle cones and a compact dessert platter. 20-block direct bridges to mid.',colors:['#ffd4df','#8cebdc','#ddaa6b']},
 {id:'acropolis',name:'Acropolis',radius:56,mid:17,floor:'BRICK',description:'Quartz citadel, high outer terraces and a stepped central temple.',colors:['#f3f2df','#979dac','#cebd91']},
 {id:'airshow',name:'Airshow',radius:45,mid:12,floor:'QUARTZ',description:'Checkered airfield tents and a giant suspended stunt plane.',colors:['#ff5262','#edf4fa','#577fa7']},
 {id:'amazon',name:'Amazon',radius:53,mid:18,floor:'MOSS',description:'Giant jungle trees, climbing vines and linked canopy paths.',colors:['#40b867','#345632','#99663b']},
 {id:'arcade',name:'Arcade',radius:49,mid:17,floor:'METAL',description:'Neon cabinets and an 8-bit grid with real void holes.',colors:['#bf52ff','#35e3ec','#27304a']},
 {id:'cascade',name:'Cascade',radius:49,mid:15,floor:'QUARTZ',description:'Tiered glass waterfalls, aqueducts and walkable stairways to mid.',colors:['#5acbf7','#edfaf9','#76a6d5']},
 {id:'cliffside',name:'Cliffside',radius:54,mid:18,floor:'STONE',description:'Hidden mining docks, mountain facades and a crimson mechanical cog.',colors:['#525a6a','#ad4853','#a47b51']},
 {id:'glacier',name:'Glacier',radius:51,mid:16,floor:'SNOW',description:'Full-block snow and packed ice, spruce docks and frozen spires.',colors:['#dcfbff','#83d5ef','#655141']},
 {id:'lighthouse',name:'Lighthouse',radius:42,mid:13,floor:'OAK',description:'Short coastal routes, beachside docks and a red-and-white beacon.',colors:['#ff6267','#fff5e1','#74cdd9']},
 {id:'orbit',name:'Orbit',radius:58,mid:20,floor:'METAL',description:'Long-distance orbital rings, iron frames and glowing station lights.',colors:['#8e9cae','#65f4f1','#29344e']},
 {id:'speedway',name:'Speedway',radius:54,mid:17,floor:'ASPHALT',description:'Continuous racing lanes and red-and-white rumble strips.',colors:['#252b39','#fc5962','#f8f8ef']},
 {id:'classic',name:'Classic Arena',radius:58,mid:15,floor:'GRASS',description:'The original arena layout.',colors:['#689b41','#85868a','#b7955f']}
];
export const MAPS=MAP_THEMES.flatMap(theme=>[8,4].map(teams=>({...theme,teams,mapId:theme.id+'-'+teams,modes:teams===8?['Solos','Duos']:['Trios','Squads']})));
export const mapsForMode=mode=>MAPS.filter(map=>map.teams===(TEAM_MODES[mode]||TEAM_MODES.Solos).teams);
export const findMap=id=>MAPS.find(map=>map.mapId===id);
const choose=items=>items[crypto.getRandomValues(new Uint32Array(1))[0]%items.length];
export function resolveMap(id,mode='Solos'){const maps=mapsForMode(mode);return maps.find(map=>map.mapId===id)||choose(maps.filter(map=>map.id!=='classic'));}
export function voteCandidates(mode){const pool=mapsForMode(mode).filter(map=>map.id!=='classic'),result=[];while(result.length<3){const map=choose(pool);result.push(map.mapId);pool.splice(pool.indexOf(map),1);}return result;}
export function mapLayout(map){const mode=map.teams===8?'Solos':'Squads',classic=map.id==='classic',scale=map.radius/(map.teams===8?58:51);let bases=(map.teams===8?EIGHT_BASES:FOUR_BASES).map(([x,z,r])=>[Math.round(x*scale),Math.round(z*scale),r]);
 if(map.id==='gelato'&&map.teams===8)bases=[[-19,46,0],[20,46,0],[-46,20,-Math.PI/2],[-46,-19,-Math.PI/2],[20,-46,Math.PI],[-19,-46,Math.PI],[46,-19,Math.PI/2],[46,20,Math.PI/2]];
 const diamonds=(map.teams===8?EIGHT_DIAMONDS:FOUR_DIAMONDS).map(([x,z])=>[Math.round(x*scale),Math.round(z*scale)]);
 if(map.id==='gelato')diamonds.splice(0,diamonds.length,...(map.teams===8?[[0,28],[-28,28],[-28,0],[-28,-28],[0,-28],[28,-28],[28,0],[28,28]]:[[-27,27],[-27,-27],[27,-27],[27,27]]));
 if(classic){bases=map.teams===8?EIGHT_BASES:FOUR_BASES;diamonds.splice(0,diamonds.length,...(map.teams===8?EIGHT_DIAMONDS:FOUR_DIAMONDS));}
 return {map,mode,teams:bases.map(([x,z,rotation],i)=>({...TEAM_DEFINITIONS[i],x,z,rotation})),diamonds,emeralds:map.id==='orbit'?[[0,-14],[0,14]]:[[0,-7],[0,7]]};
}