import React, { useState } from 'react';
import ShopOfferSlot from '@/components/game/ShopOfferSlot';
import ShopTooltip from '@/components/game/ShopTooltip';
import ShopPlayerInventory from '@/components/game/ShopPlayerInventory';
import UpgradeTrapQueue from '@/components/game/UpgradeTrapQueue';
const SLOTS=[1,2,3,4,5,10,11,12,13];

export default function GameTeamUpgrades({data,onBuy,onMove,onClose}) {
 const [hover,setHover]=useState(null),[result,setResult]=useState(null),upgrades=data.upgrades;
 const buy=async key=>{setResult({message:'Purchasing…'});setHover(null);setResult(await onBuy(key));};
 return <div className="game-inventory-backdrop"><section className="game-inventory game-shop game-team-upgrades" role="dialog" aria-modal="true" aria-label="Team upgrades"><header><h2>{upgrades.teamName} Team Upgrades</h2><button onClick={onClose} aria-label="Close team upgrades">Esc <span>×</span></button></header><div className="inventory-resource-totals"><span className="resource-color-2">Diamonds <b>{data.resources[2]}</b></span><span>Permanent · Shared with your team</span></div><div className="inventory-grid shop-offers" aria-label="Available upgrades and traps">{Array.from({length:18},(_,slot)=>{const index=SLOTS.indexOf(slot),offer=data.upgradeOffers[index];return offer?<ShopOfferSlot key={slot} offer={offer} atlas={data.atlas} onBuy={buy} onHover={(item,x,y)=>setHover({offer:item,x,y})} onLeave={()=>setHover(null)}/>:<div className="inventory-slot shop-empty-slot" key={slot} aria-hidden="true"/>;})}</div><div className={'shop-purchase-result '+(result?.ok?'shop-purchase-success':'shop-purchase-error')} role="status">{result?.message||'Top row: upgrades · Bottom row: traps'}</div><UpgradeTrapQueue upgrades={upgrades} atlas={data.atlas}/><ShopPlayerInventory data={data} onMove={onMove}/><footer>Paid from your diamonds. Benefits apply to every teammate, even after respawning.<br/>Forge: {upgrades.forgeName}. The match continues while this is open.</footer></section><ShopTooltip hover={hover?{...hover,offer:data.upgradeOffers.find(offer=>offer.key===hover.offer.key)||hover.offer}:null} resources={data.resources}/></div>;
}