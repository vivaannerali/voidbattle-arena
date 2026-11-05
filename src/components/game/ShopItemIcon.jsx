import React from 'react';
import { itemTile } from '@/game/equipment';

export default function ShopItemIcon({id,atlas}) {const tile=itemTile(id);return <span className="shop-item-icon" aria-hidden="true" style={{backgroundImage:`url(${atlas})`,backgroundPosition:`${tile%8*100/7}% ${Math.floor(tile/8)*100/15}%`}}/>;}