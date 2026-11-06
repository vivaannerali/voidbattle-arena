import { UTILITY_ITEMS } from '@/game/utilityItems';
import { popupTower,zapBlocks } from '@/game/utilityStructures';
export default function utilityUse(i){
 const id=i.blocks[i.slot];if(id<87||id>91)return false;
 const s=i.combat?.players[i.playerIndex],version=i.input.clearVersion||0;
 if(i.utilityId!==id||i.utilityVersion!==version){i.utilityLatch=false;i.utilityId=id;i.utilityVersion=version;}
 if(!i.input.right){i.utilityLatch=false;return true;}
 if(i.utilityLatch||!i.input.active||!s?.alive||i.combat.phase!=='active'||!i.inventory[i.slot])return true;i.utilityLatch=true;
 if(i.combat.clock<(s.utilityAt||0)){i.message('Utility ready in '+Math.ceil((s.utilityAt-i.combat.clock)/60)+'s.');return true;}
 const success=id===90?popupTower(i):id===91?zapBlocks(i):i.combat.utilities.launch(i);
 if(success){s.utilityAt=i.combat.clock+(id===91?180:30);i.swingTime=.25;i.hudDirty=true;if(id<90)i.message(UTILITY_ITEMS.find(item=>item.id===id).name+' thrown.');}
 return true;
}