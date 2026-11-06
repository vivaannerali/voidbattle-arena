import { upgradeCosts } from '@/game/modeRules';
export const ROMAN=['I','II','III','IV'];
export const FORGE_NAMES=['Iron Forge','Golden Forge','Emerald Forge','Molten Forge'];
export const TEAM_UPGRADES=[
 {key:'sharpness',name:'Sharpened Swords',id:64,costs:[8],smallCosts:[4],description:'Sharpness I: +1.25 damage on all team swords and axes, including newly purchased weapons.'},
 {key:'protection',name:'Reinforced Armor',id:65,costs:[5,10,20,30],smallCosts:[2,4,8,16],description:'Protection on every teammate: an extra 16% damage reduction per tier, after armor.'},
 {key:'haste',name:'Maniac Miner',id:66,costs:[4,6],smallCosts:[2,4],description:'Haste: +20% mining speed per tier for every teammate.'},
 {key:'forge',name:'Forge',id:67,costs:[4,8,12,16],smallCosts:[2,4,6,8],description:'Upgrade your base resource generators.'},
 {key:'heal',name:'Heal Pool',id:68,costs:[3],smallCosts:[1],description:'Regeneration I: heal half a heart every 2.5 seconds within 10 blocks of your base.'},
 {key:'feather',name:'Cushioned Boots',id:73,costs:[2,4],smallCosts:[1,2],description:'Feather Falling reduces landing damage by 12% per tier. Permanent for the whole team.'}
];
export const TRAPS=[
 {key:'blind_trap',name:'Blindness Trap',id:69,description:'Blindness and Slowness I for 8 seconds on the enemy who enters your base.'},
 {key:'counter_trap',name:'Counter-Offensive',id:70,description:'Speed II and Jump Boost II for your living teammates for 15 seconds.'},
 {key:'alarm_trap',name:'Reveal Trap',id:71,description:'Removes enemy invisibility at your base and reveals intruders for 10 seconds.'},
 {key:'fatigue_trap',name:'Miner Fatigue',id:72,description:'Mining Fatigue I for 10 seconds on the enemy who enters your base.'}
];
export const TRAP_COSTS=[1,2,4];
const FORGE_DESCRIPTIONS=['1.5× iron and gold generation.','2× iron and gold generation.','2× iron/gold; adds an emerald every 60 seconds at base.','3× iron/gold; an emerald every 40 seconds at base.'];
export function purchasedUpgradeName(index,level){const def=TEAM_UPGRADES[index];if(!def)return TRAPS[index-TEAM_UPGRADES.length]?.name||'';if(def.key==='forge')return FORGE_NAMES[level-1];return def.name+(def.costs.length>1?' '+ROMAN[level-1]:'');}
export function teamOffers(state,mode='Solos'){return [...TEAM_UPGRADES.map((def,index)=>{const costs=upgradeCosts(def,mode),level=state[def.key],next=Math.min(costs.length,level+1);return {...def,index,type:'team_upgrade',quantity:1,currency:42,cost:costs[next-1],owned:level>=def.costs.length,name:purchasedUpgradeName(index,next),description:(def.key==='forge'?FORGE_DESCRIPTIONS[next-1]:def.description)+' Current tier: '+(level?ROMAN[level-1]:'none')+'. Shared by the whole team.'};}),...TRAPS.map((def,index)=>({...def,index:TEAM_UPGRADES.length+index,type:'trap',quantity:1,currency:42,cost:TRAP_COSTS[Math.min(2,state.trapCount)],owned:false,blocked:state.trapCount>=3,unavailableReason:'Trap queue is full (3/3)!',description:def.description+' FIFO queue, maximum 3 traps. 20-second trigger cooldown.'}))];}