import React, { useState } from 'react';
import InventorySlot from '@/components/game/InventorySlot';

export default function GameInventory({data,onMove,onClose}) {
 const [selected,setSelected]=useState(-1);
 const select=index=>{if(selected>=0&&selected!==index){onMove(selected,index);setSelected(-1);}else setSelected(data.inventoryAll[index]>0?index:-1);};
 const move=(from,to)=>{onMove(from,to);setSelected(-1);};
 const slot=index=><InventorySlot key={index} index={index} id={data.itemsAll[index]} count={data.inventoryAll[index]} atlas={data.atlas} selected={selected===index} onSelect={select} onMove={move} hotbar={index<9}/>;
 return <div className="game-inventory-backdrop"><section className="game-inventory" role="dialog" aria-modal="true" aria-label="Player inventory"><header><h2>Inventory</h2><button onClick={onClose} aria-label="Close inventory">E / Esc <span>×</span></button></header><div className="inventory-resource-totals">{['Iron','Gold','Diamonds','Emeralds'].map((label,i)=><span key={label} className={'resource-color-'+i}>{label} <b>{data.resources[i]}</b></span>)}</div><div className="inventory-grid">{Array.from({length:27},(_,i)=>slot(i+9))}</div><h3>Hotbar</h3><div className="inventory-grid inventory-hotbar">{Array.from({length:9},(_,i)=>slot(i))}</div><footer>Drag to move, merge or swap stacks. Click a stack, then a destination.<br/>Stacks hold up to 64. The match continues while this is open.</footer></section></div>;
}