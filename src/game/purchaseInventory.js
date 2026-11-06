import Inventory from '@/game/inventory';
export default function purchaseInventory(inventory,offer,shift){
 if(!Number.isInteger(offer.cost)||offer.cost<=0||!Number.isInteger(offer.quantity)||offer.quantity<=0)return 0;
 const staged=new Inventory(),max=shift&&offer.type==='block'?Math.min(Math.floor(64/offer.quantity),Math.floor(inventory.total(offer.currency)/offer.cost)):1;
 for(let bundles=max;bundles>0;bundles--){
  staged.ids.set(inventory.ids);staged.counts.set(inventory.counts);let preferred=-1;
  if(offer.type==='sword'||offer.type==='pickaxe'||offer.type==='axe')for(let i=0;i<36;i++){
   const id=staged.ids[i],replace=offer.type==='sword'?id>=32&&id<=35:offer.type==='pickaxe'?id>=50&&id<=53:id>=54&&id<=57;
   if(replace&&staged.counts[i]){if(preferred<0)preferred=i;staged.ids[i]=staged.counts[i]=0;}
  }
  if(!staged.spend(offer.currency,offer.cost*bundles))continue;
  let amount=offer.quantity*bundles;if(preferred>=0){staged.ids[preferred]=offer.id;staged.counts[preferred]=1;amount--;}
  if(amount>0&&staged.add(offer.id,amount))continue;
  if(preferred<0&&!inventory.total(offer.id)){const target={sword:0,block:1,pickaxe:2,axe:3,shears:4,stick:5}[offer.type],at=staged.ids.findIndex((id,i)=>id===offer.id&&staged.counts[i]>0);if(target!==undefined&&at>=0&&at!==target){const id=staged.ids[target],count=staged.counts[target];staged.ids[target]=staged.ids[at];staged.counts[target]=staged.counts[at];staged.ids[at]=id;staged.counts[at]=count;}}
  inventory.ids.set(staged.ids);inventory.counts.set(staged.counts);inventory.revision++;return bundles;
 }return 0;
}