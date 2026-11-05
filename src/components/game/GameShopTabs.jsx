import React from 'react';
import { SHOP_CATEGORIES } from '@/game/shopCatalog';
import ShopItemIcon from '@/components/game/ShopItemIcon';

export default function GameShopTabs({category,onChange,atlas,team}) {return <div className="inventory-grid shop-tabs" role="tablist" aria-label="Shop categories">{SHOP_CATEGORIES.map(tab=><button key={tab.key} className={'inventory-slot shop-tab '+(category===tab.key?'shop-tab-active':'')} onClick={()=>onChange(tab.key)} title={tab.name} aria-label={tab.name} aria-selected={category===tab.key} role="tab"><ShopItemIcon id={tab.key==='blocks'?tab.icon+team:tab.icon} atlas={atlas}/></button>)}{Array.from({length:4},(_,i)=><div className="shop-category-spacer" key={i} aria-hidden="true"/>)}</div>;}