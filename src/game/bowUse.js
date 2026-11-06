import { ARROW,BOWS,isBow } from '@/game/rangedItems';
export default function bowUse(i){
 const s=i.combat?.players[i.playerIndex],id=i.blocks[i.slot];if(!s)return false;
 const clear=i.input.clearVersion||0;
 if(i.bowSlot!==i.slot||s.bowId!==id||i.bowClearVersion!==clear){s.bowTicks=0;i.bowWarned=false;i.bowSlot=i.slot;i.bowClearVersion=clear;}
 s.bowId=isBow(id)?id:0;
 if(!isBow(id)||!i.inventory[i.slot]||!s.alive){s.bowTicks=0;return false;}
 if(!i.input.active){s.bowTicks=0;return true;}
 const bow=BOWS[id];
 if(!i.input.right){if(!bow.automatic&&s.bowTicks>=6)i.combat.arrows.launch(i.playerIndex,id,Math.min(1,s.bowTicks/60));s.bowTicks=0;i.bowWarned=false;return true;}
 if(!i.store.total(ARROW)){s.bowTicks=0;if(!i.bowWarned){i.message('You need arrows. Buy 8 for 2 Gold in Ranged.');i.bowWarned=true;}return true;}
 s.bowTicks=Math.min(60,(s.bowTicks||0)+1);
 if(bow.automatic&&s.bowTicks>=6){i.combat.arrows.launch(i.playerIndex,id,1);s.bowTicks=0;}
 return true;
}