import React from 'react';
import '@/components/game/itemEffects.css';
export default function GameHealth({health,absorption=0}){
 const heartClass=(value,i)=>value>=i*2+2?'':value>i*2?'heart-half':'heart-empty';
 return <div className="game-hearts" aria-label={Math.ceil(health)+' of 20 health'+(absorption>0?', '+Math.ceil(absorption)+' absorption health':'')}>
  {Array.from({length:10},(_,i)=><span className={heartClass(health,i)} key={i}>♥</span>)}
  {Array.from({length:Math.ceil(absorption/2)},(_,i)=><span className={'heart-absorption '+heartClass(absorption,i)} key={'absorb-'+i}>♥</span>)}
 </div>;
}