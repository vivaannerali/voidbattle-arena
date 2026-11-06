import React, { useState } from 'react';
import { SHOP_CATEGORIES } from '@/game/shopCatalog';
import { readQuickBuy,saveQuickBuy } from '@/game/quickBuy';
import GameShopTabs from '@/components/game/GameShopTabs';
import ShopOfferSlot from '@/components/game/ShopOfferSlot';
import ShopTooltip from '@/components/game/ShopTooltip';
import ShopPlayerInventory from '@/components/game/ShopPlayerInventory';

export default function GameShop({data,onBuy,onMove,onClose}) {
 const [category,setCategory]=useState('quick'),[hover,setHover]=useState(null),[result,setResult]=useState(null),[quick,setQuick]=useState(readQuickBuy),[pending,setPending]=useState(null);
 const title=SHOP_CATEGORIES.find(tab=>tab.key===category).name;
 const offers=category==='quick'?quick.map(key=>data.shopOffers.find(offer=>offer.key===key)):data.shopOffers.filter(offer=>offer.category===category);
 const buy=async(key,shift)=>{setHover(null);if(shift){setPending(key);setCategory('quick');setResult({message:'Choose a Quick Buy slot. No resources will be spent.'});return;}setResult({message:'Purchasing…'});setResult(await onBuy(key,false));};
 const favourite=index=>{const next=quick.map(key=>key===pending?null:key);next[index]=pending;setQuick(next);saveQuickBuy(next);setPending(null);setResult({ok:true,message:'Quick Buy updated.'});setHover(null);};
 return <div className="game-inventory-backdrop game-shop-backdrop"><section className="game-inventory game-shop" role="dialog" aria-modal="true" aria-label="Item shop">
  <header><h2>Item Shop · {title}</h2><button onClick={onClose} aria-label="Close shop">Esc <span>×</span></button></header>
  <div className="inventory-resource-totals">{['Iron','Gold','Diamonds','Emeralds'].map((name,i)=><span key={name} className={'resource-color-'+i}>{name} <b>{data.resources[i]}</b></span>)}</div>
  <GameShopTabs category={category} onChange={value=>{setCategory(value);setHover(null);setPending(null);setResult(null);}} atlas={data.atlas} team={data.localTeam}/>
  <div className={'inventory-grid shop-offers '+(pending?'shop-choosing-favourite':'')} role="tabpanel" aria-label={pending?'Choose a Quick Buy slot':title}>
   {Array.from({length:36},(_,i)=>offers[i]?<ShopOfferSlot key={i} offer={offers[i]} atlas={data.atlas} onBuy={(key,shift)=>pending?favourite(i):buy(key,shift)} onHover={(offer,x,y)=>setHover({offer,x,y})} onLeave={()=>setHover(null)}/>:pending&&i<27?<button key={i} className="inventory-slot shop-favourite-choice" aria-label={'Set Quick Buy slot '+(i+1)} onClick={()=>favourite(i)}/>:<div key={i} className="inventory-slot shop-empty-slot" aria-hidden="true"/>)}
  </div>
  <div className={'shop-purchase-result '+(result?.ok?'shop-purchase-success':'shop-purchase-error')} role="status">{result?.message||'Click to purchase · Shift-click to edit Quick Buy'}{pending&&<button onClick={()=>{setPending(null);setResult(null);}}>Cancel</button>}</div>
  <ShopPlayerInventory data={data} onMove={onMove}/><footer>Armor and shears are permanent. Picks and axes lose one tier on death.<br/>The match continues while shopping.</footer>
 </section><ShopTooltip hover={hover?{...hover,offer:data.shopOffers.find(offer=>offer.key===hover.offer.key)||hover.offer}:null} resources={data.resources}/></div>;
}