import React from 'react';
export default function GameShopRotation({rotation}){
 if(!rotation)return null;
 const minutes=Math.max(0,Math.ceil((rotation.nextReset-rotation.now)/60000)),days=Math.floor(minutes/1440),hours=Math.floor(minutes%1440/60);
 return <div className="shop-purchase-result" role="status">Rotation {rotation.week} · {rotation.keys.length} items<br/>Monday 00:00 Melbourne · Resets in {days}d {hours}h {minutes%60}m</div>;
}