import { ARMOUR } from '@/game/equipment';
import { SHOP_ITEMS,resolveOffer,CURRENCY_NAMES } from '@/game/shopCatalog';

export default class ItemShop {
 constructor(match){this.match=match;}
 offers(){return SHOP_ITEMS.map(entry=>resolveOffer(entry,this.match.players[0]));}
 purchase(key,shift=false){if(!this.match.canPlay())return {ok:false,message:'You cannot shop while spectating.'};const entry=SHOP_ITEMS.find(item=>item.key===key);if(!entry)return {ok:false,message:'Item unavailable.'};const player=this.match.players[0],offer=resolveOffer(entry,player),inv=player.inventory,gear=player.gear;
  if(offer.owned)return {ok:false,message:'You already own this upgrade or better!'};
  const available=inv.total(offer.currency);if(available<offer.cost)return {ok:false,message:"You don't have enough "+CURRENCY_NAMES[offer.currency]+'!'};
  if(offer.type==='armor'){inv.spend(offer.currency,offer.cost);gear.armourTier=offer.tier;player.armour=ARMOUR[offer.tier].points;return {ok:true,message:'Purchased '+offer.name+'!'};}
  const ids=inv.ids.slice(),counts=inv.counts.slice(),maxBundles=shift&&offer.type==='block'?Math.min(Math.floor(64/offer.quantity),Math.floor(available/offer.cost)):1;
  for(let bundles=maxBundles;bundles>=1;bundles--){inv.ids.set(ids);inv.counts.set(counts);let preferred=-1;
   if(offer.type==='sword'||offer.type==='pickaxe'||offer.type==='axe')for(let i=0;i<36;i++){const id=inv.ids[i],replace=offer.type==='sword'?id>=32&&id<=35:offer.type==='pickaxe'?id>=50&&id<=53:id>=54&&id<=57;if(replace&&inv.counts[i]){if(preferred<0)preferred=i;inv.ids[i]=0;inv.counts[i]=0;}}
   if(!inv.spend(offer.currency,offer.cost*bundles))continue;const amount=offer.quantity*bundles;let remaining=amount;if(preferred>=0&&!inv.counts[preferred]){inv.ids[preferred]=offer.id;inv.counts[preferred]=1;remaining--;}if(remaining>0)remaining=inv.add(offer.id,remaining);
   if(remaining)continue;if(offer.type==='pickaxe'||offer.type==='axe')gear[offer.type+'Tier']=offer.tier;if(offer.type==='shears')gear.shears=true;if(offer.type==='sword')player.sword=offer.id;inv.revision++;return {ok:true,message:'Purchased '+amount+' × '+offer.name+'!'};
  }
  inv.ids.set(ids);inv.counts.set(counts);inv.revision++;return {ok:false,message:'Your inventory is full!'};
 }
}