import React from 'react';
import { itemName,itemTile,isSword } from '@/game/equipment';

export default function InventorySlot({index,id,count,atlas,selected,onSelect,onMove,hotbar}) {
 const name=count?itemName(id):'Empty';
 return <button type="button" className={'inventory-slot '+(selected?'inventory-slot-selected':'')} title={name+(count?' ×'+count:'')} aria-label={'Slot '+(index+1)+': '+name+(count?' '+count:'')} draggable={count>0} onDragStart={e=>{e.dataTransfer.setData('text/plain',String(index));e.dataTransfer.effectAllowed='move';onSelect(index);}} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move';}} onDrop={e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from))onMove(from,index);}} onClick={()=>onSelect(index)}>{hotbar&&<small>{index+1}</small>}{count>0&&<><span className="inventory-item-icon" style={{backgroundImage:`url(${atlas})`,backgroundPosition:`${itemTile(id)%8*100/7}% ${Math.floor(itemTile(id)/8)*100/7}%`}}/>{!isSword(id)&&<b>{count}</b>}</>}</button>;
}