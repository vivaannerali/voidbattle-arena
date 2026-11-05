import { NAMES,tileFor } from '@/game/blocks';
export const SWORDS=[{id:32,name:'Wooden sword',damage:4,color:0x9f794b},{id:33,name:'Stone sword',damage:5,color:0x999f9f},{id:34,name:'Iron sword',damage:6,color:0xd9e0e2},{id:35,name:'Diamond sword',damage:7,color:0x58d9cf}];
export const ARMOUR=[{name:'None',points:0},{name:'Leather',points:7},{name:'Chainmail',points:12},{name:'Iron',points:15},{name:'Diamond',points:20}];
export function isSword(id){return id>=32&&id<=35;}
export function itemName(id){return id>=40&&id<=43?['Iron ingot','Gold ingot','Diamond','Emerald'][id-40]:isSword(id)?SWORDS[id-32].name:NAMES[id]||'';}
export function itemTile(id){return id>=40&&id<=43?44+id-40:isSword(id)?26+id-32:tileFor(id,2);}
export function damageFor(id){return isSword(id)?SWORDS[id-32].damage:1;}
export const PLAYER_NAMES=['You','BlueDummy','GreenDummy','YellowDummy'];
export const TEAM_NAMES=['Red','Blue','Green','Yellow'];
export const TEAM_CSS=['red','blue','green','yellow'];