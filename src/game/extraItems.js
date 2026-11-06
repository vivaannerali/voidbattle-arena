import { RANGED_ITEMS } from '@/game/rangedItems';
import { UTILITY_ITEMS } from '@/game/utilityItems';
export const MACE=76;
export const EXTRA_ITEMS=[
 {key:'mace',name:'The Mace',category:'melee',type:'weapon',id:MACE,tile:128,quantity:1,cost:3,currency:43,description:'6 base damage, plus 0.25 damage per block fallen. Holding it prevents landing fall damage. Lost on death.'},
 {key:'golden_apple',name:'Golden Apple',category:'utility',type:'consumable',id:77,tile:129,quantity:1,cost:3,currency:41,description:'Hold right-click to eat. Grants 2 absorption hearts for 2 minutes and Regeneration II for 5 seconds.'},
 {key:'speed_potion',name:'Speed II Potion',category:'potions',type:'consumable',id:78,tile:130,quantity:1,cost:1,currency:43,description:'Hold right-click to drink. Move 40% faster for 45 seconds.'},
 {key:'jump_potion',name:'Jump V Potion',category:'potions',type:'consumable',id:79,tile:131,quantity:1,cost:1,currency:43,description:'Hold right-click to drink. Jump approximately 4 blocks high for 45 seconds.'},
 {key:'invisibility_potion',name:'Invisibility Potion',category:'potions',type:'consumable',id:80,tile:132,quantity:1,cost:2,currency:43,description:'Hold right-click to drink. Hide your body and name for 30 seconds. Your held item remains visible; alarm traps reveal you.'},
 {key:'magic_milk',name:'Magic Milk',category:'utility',type:'consumable',id:81,tile:133,quantity:1,cost:4,currency:41,description:'Hold right-click to drink. Ignore enemy base traps for 30 seconds without using up their trap queue.'},
 ...RANGED_ITEMS,
 ...UTILITY_ITEMS
];
export const extraItem=id=>EXTRA_ITEMS.find(item=>item.id===id);