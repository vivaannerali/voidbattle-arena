import React from 'react';
import { canForceEphirisi } from '@/game/ephirisiAccess';
export default function PartyEphirisiToggle({state,selfId,onAction}){
 const own=state.players.find(p=>p.id===selfId);
 if(!canForceEphirisi(own?.username))return null;
 return <label className="party-toggle"><input type="checkbox" checked={own.forceEphirisi===true} disabled={state.phase!=='lobby'} onChange={e=>onAction({type:'force-ephirisi',enabled:e.target.checked})}/>Force Ephirisi to join</label>;
}