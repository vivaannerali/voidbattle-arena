import { B } from '@/game/blocks';
import { TEAMS } from '@/game/map';
import { modePrice } from '@/game/modeRules';
export const SHOP_CATEGORIES=[{key:'quick',name:'Quick Buy',icon:63},{key:'blocks',name:'Blocks',icon:B.RED},{key:'melee',name:'Melee',icon:33},{key:'armor',name:'Armor',icon:61},{key:'tools',name:'Tools',icon:50}];
export const SHOP_ITEMS=[
 {key:'wool',name:'Wool',category:'blocks',type:'block',id:B.RED,quantity:16,cost:4,currency:40,team:true},
 {key:'clay',name:'Hardened Clay',category:'blocks',type:'block',id:B.RED_CLAY,quantity:16,cost:12,currency:40,team:true},
 {key:'glass',name:'Blast-Proof Glass',category:'blocks',type:'block',id:19,quantity:4,cost:12,currency:40,team:true},
 {key:'end_stone',name:'End Stone',category:'blocks',type:'block',id:B.END,quantity:12,cost:24,currency:40},
 {key:'ladder',name:'Ladder',category:'blocks',type:'block',id:23,quantity:8,cost:4,currency:40},
 {key:'oak',name:'Oak Planks',category:'blocks',type:'block',id:B.OAK,quantity:16,cost:4,currency:41},
 {key:'obsidian',name:'Obsidian',category:'blocks',type:'block',id:B.OBSIDIAN,quantity:4,cost:4,currency:43},
 {key:'stone_sword',name:'Stone Sword',category:'melee',type:'sword',id:33,quantity:1,cost:10,currency:40},
 {key:'iron_sword',name:'Iron Sword',category:'melee',type:'sword',id:34,quantity:1,cost:7,currency:41},
 {key:'diamond_sword',name:'Diamond Sword',category:'melee',type:'sword',id:35,quantity:1,cost:4,currency:43},
 {key:'knockback_stick',name:'Knockback Stick',category:'melee',type:'stick',id:36,quantity:1,cost:5,currency:41,description:'Knockback I. Launch enemies away.'},
 {key:'chainmail',name:'Permanent Chainmail Armor',category:'armor',type:'armor',id:60,tier:2,quantity:1,cost:24,currency:40},
 {key:'iron_armor',name:'Permanent Iron Armor',category:'armor',type:'armor',id:61,tier:3,quantity:1,cost:12,currency:41},
 {key:'diamond_armor',name:'Permanent Diamond Armor',category:'armor',type:'armor',id:62,tier:4,quantity:1,cost:6,currency:43},
 {key:'shears',name:'Permanent Shears',category:'tools',type:'shears',id:58,quantity:1,cost:20,currency:40,description:'Fast wool mining. Kept after death.'},
 {key:'pickaxe',category:'tools',type:'pickaxe',id:50,quantity:1},
 {key:'axe',category:'tools',type:'axe',id:54,quantity:1}
];
export const QUICK_BUY=['wool','stone_sword','iron_sword','chainmail','shears','pickaxe','axe','end_stone','oak','glass','ladder','clay','obsidian','knockback_stick'];
export const CURRENCY_NAMES={40:'Iron',41:'Gold',42:'Diamond',43:'Emerald'};
export function resolveOffer(entry,player,mode='Solos'){const offer={...entry,owned:false},gear=player.gear;if(entry.key==='diamond_sword')offer.cost=modePrice(4,3,mode);if(entry.team){const team=TEAMS[player.team];offer.id=entry.key==='wool'?team.wool:entry.key==='clay'?team.clay:team.glass;}
 if(entry.type==='pickaxe'||entry.type==='axe'){const tier=gear[entry.type+'Tier'],next=Math.min(3,tier+1);offer.tier=next;offer.id=entry.id+next;offer.name=(entry.type==='pickaxe'?['Wooden','Iron','Golden','Diamond']:['Wooden','Stone','Iron','Diamond'])[next]+' '+(entry.type==='pickaxe'?'Pickaxe':'Axe');offer.cost=[10,10,3,6][next];offer.currency=next<2?40:41;offer.owned=tier===3;offer.tierLabel=['I','II','III','IV'][next];offer.description=(entry.type==='pickaxe'?['Efficiency I.','Efficiency II.','Efficiency III.','Efficiency III.']:['Efficiency I.','Efficiency I.','Efficiency II.','Efficiency III.'])[next]+' Drops one tier on death, never below Tier I.';}
 else if(entry.type==='armor'){offer.owned=gear.armourTier>=entry.tier;offer.description='Permanent upgrade. Kept after death.';}else if(entry.type==='shears')offer.owned=gear.shears;
 else if(entry.type==='sword'){for(let i=0;i<36;i++)if(player.inventory.counts[i]&&player.inventory.ids[i]>=entry.id&&player.inventory.ids[i]<=35)offer.owned=true;offer.description='Replaces your current sword. Lost on death.';}else if(entry.type==='stick')offer.owned=player.inventory.total(36)>0;
 if(entry.type==='block')offer.description=entry.team?'Automatically matches your team.':entry.key==='ladder'?'Place on a wall. Hold W to climb.':'Place blocks with right-click.';
 return offer;
}