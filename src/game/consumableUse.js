import { extraItem } from '@/game/extraItems';
export default function consumableUse(interaction){
 const i=interaction,id=i.blocks[i.slot],item=extraItem(id),player=i.combat?.players[i.playerIndex];
 if(!item||item.type!=='consumable'||!i.inventory[i.slot]||!player?.alive){i.useTicks=0;i.useLatch=false;return false;}
 if(i.useSlot!==i.slot||i.useId!==id){i.useTicks=0;i.useLatch=false;i.useSlot=i.slot;i.useId=id;}
 if(!i.input.right){i.useTicks=0;i.useLatch=false;return true;}
 if(i.useLatch)return true;
 i.useTicks=(i.useTicks||0)+1;i.swingTime=.08;
 if(i.useTicks===1)i.message(id===77?'Eating Golden Apple…':'Drinking '+item.name+'…');
 if(i.useTicks<96)return true;
 i.useTicks=0;i.useLatch=true;if(!i.store.consume(i.slot))return true;
 const e=player.effects;
 if(id===77){e.absorption=Math.max(e.absorption,4);e.absorptionTicks=7200;e.regenerationTicks=300;}
 if(id===78)e.speedTicks=Math.max(e.speedTicks,2700);
 if(id===79)e.jumpPotionTicks=Math.max(e.jumpPotionTicks,2700);
 if(id===80){e.invisibilityTicks=Math.max(e.invisibilityTicks,1800);e.revealTicks=0;}
 if(id===81)e.milkTicks=Math.max(e.milkTicks,1800);
 i.message(item.name+' activated.');i.hudDirty=true;return true;
}