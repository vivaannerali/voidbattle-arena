import { ARMOUR } from '@/game/equipment';
import { SHOP_ITEMS,resolveOffer,CURRENCY_NAMES } from '@/game/shopCatalog';
import purchaseInventory from '@/game/purchaseInventory';

export default class ItemShop {
 constructor(match){this.match=match;}
 success(index,offer,entry){this.match.emit(10,index,SHOP_ITEMS.indexOf(entry),offer.id);return {ok:true,message:'You purchased '+offer.name};}
 offers(){return SHOP_ITEMS.map(entry=>resolveOffer(entry,this.match.players[0],this.match.settings.teamMode));}
 purchase(key,shift=false,playerIndex=0,shopTeam=this.match.players[playerIndex]?.team){
  const player=this.match.players[playerIndex];if(this.match.phase!=='active'||!player?.alive)return {ok:false,message:'You cannot shop while spectating.'};
  if(!this.match.interaction.shops?.inReach(player.body,shopTeam))return {ok:false,message:'Move closer to the Item Shop.'};
  const entry=SHOP_ITEMS.find(item=>item.key===key);if(!entry)return {ok:false,message:'Item unavailable.'};
  const offer=resolveOffer(entry,player,this.match.settings.teamMode),inv=player.inventory,gear=player.gear;
  if(offer.owned)return {ok:false,message:'You already own this upgrade or better!'};
  if(inv.total(offer.currency)<offer.cost)return {ok:false,message:"You don't have enough "+CURRENCY_NAMES[offer.currency]+'!'};
  if(offer.type==='armor'){if(!inv.spend(offer.currency,offer.cost))return {ok:false,message:'Not enough resources.'};gear.armourTier=offer.tier;player.armour=ARMOUR[offer.tier].points;return this.success(playerIndex,offer,entry);}
  const bundles=purchaseInventory(inv,offer,shift);if(!bundles)return {ok:false,message:'Your inventory is full!'};
  if(offer.type==='pickaxe'||offer.type==='axe')gear[offer.type+'Tier']=offer.tier;if(offer.type==='shears')gear.shears=true;if(offer.type==='sword')player.sword=offer.id;if(offer.id===86)player.machineBowUses=0;
  return this.success(playerIndex,offer,entry);
 }
}