import React from 'react';
import { itemTile } from '@/game/equipment';
import { atlasPosition } from '@/game/atlasLayout';

export default function ShopItemIcon({id,atlas}) {const tile=itemTile(id);return <span className="shop-item-icon" aria-hidden="true" style={{backgroundImage:`url(${atlas})`,backgroundPosition:atlasPosition(tile)}}/>;}