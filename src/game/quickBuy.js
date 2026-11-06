import { QUICK_BUY,SHOP_ITEMS } from '@/game/shopCatalog';
const KEY='ephirisiwars.quick-buy',SLOTS=27;
export function readQuickBuy(){try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved))return Array.from({length:SLOTS},(_,i)=>SHOP_ITEMS.some(item=>item.key===saved[i])?saved[i]:null);}catch{/* An unavailable preference store must not prevent playing. */}return Array.from({length:SLOTS},(_,i)=>QUICK_BUY[i]||null);}
export function saveQuickBuy(slots){try{localStorage.setItem(KEY,JSON.stringify(slots));}catch{/* Preferences still work for this session. */}}