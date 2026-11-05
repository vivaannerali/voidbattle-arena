import { NAMES,tileFor } from '@/game/blocks';
export const SWORDS=[{id:32,name:'Wooden sword',damage:4,color:0x9f794b},{id:33,name:'Stone sword',damage:5,color:0x999f9f},{id:34,name:'Iron sword',damage:6,color:0xd9e0e2},{id:35,name:'Diamond sword',damage:7,color:0x58d9cf}];
export const ARMOUR=[{name:'None',points:0},{name:'Leather',points:7},{name:'Chainmail',points:12},{name:'Iron',points:15},{name:'Diamond',points:20}];
export function isSword(id){return id>=32&&id<=35;}
export function itemName(id){if(id>=50&&id<=58)return ['Wooden pickaxe','Iron pickaxe','Golden pickaxe','Diamond pickaxe','Wooden axe','Stone axe','Iron axe','Diamond axe','Shears'][id-50];if(id>=60&&id<=63)return ['Chainmail armor','Iron armor','Diamond armor','Quick Buy'][id-60];if(id===36)return 'Knockback stick';return id>=40&&id<=43?['Iron ingot','Gold ingot','Diamond','Emerald'][id-40]:isSword(id)?SWORDS[id-32].name:NAMES[id]||'';}
export function itemTile(id){if(id>=64&&id<=72)return 83+id-64;if(id>=50&&id<=58)return 70+id-50;if(id>=60&&id<=63)return 79+id-60;if(id===36)return 69;return id>=40&&id<=43?44+id-40:isSword(id)?26+id-32:tileFor(id,2);}
export function damageFor(id){return isSword(id)?SWORDS[id-32].damage:1;}
export const TEAM_NAMES=['Red','Blue','Green','Yellow'];
export const TEAM_CSS=['red','blue','green','yellow'];