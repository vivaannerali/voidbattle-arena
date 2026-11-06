import React from 'react';
import { Zap,ArrowUp,Eye,EyeOff,Heart,Pickaxe,Shield,Sword,Feather,Hourglass } from 'lucide-react';
import { ROMAN } from '@/game/teamUpgradeCatalog';
const TEMPORARY=[['blindness','Blindness',EyeOff,true],['slowness','Slowness',Hourglass,true],['speed','Speed II',Zap],['jump','Jump Boost II',ArrowUp],['invisibility','Invisibility',EyeOff],['fatigue','Mining Fatigue I',Pickaxe,true],['reveal','Revealed',Eye,true]];
export default function GameTeamEffects({data}) {
 const u=data.upgrades,e=data.effects;if(!u||!e)return null;
 const bonuses=[['Sharpness I',Sword,u.sharpness],['Protection '+ROMAN[u.protection-1],Shield,u.protection],['Haste '+ROMAN[u.haste-1],Pickaxe,u.haste],['Regeneration I',Heart,u.healActive],['Feather Falling '+ROMAN[u.feather-1],Feather,u.feather]];
 return <><div className="game-team-effects" aria-label="Active bonuses and effects">
  {bonuses.map(([label,Icon,active])=>active?<span className="game-effect-row" key={label}><Icon size={16}/>{label}<small>∞</small></span>:null)}
  {TEMPORARY.map(([key,label,Icon,negative])=>e[key]>0?<span className={'game-effect-row '+(negative?'game-effect-negative':'')} key={key}><Icon size={16}/>{label}<small>{e[key]}s</small></span>:null)}
 </div></>;
}