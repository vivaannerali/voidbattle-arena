import React from 'react';
import { Image } from '@/components/ui/image';
import { findMap } from '@/game/mapCatalog';
import mapPreview from '@/game/mapPreview';
export default function PartyMapVote({state,selfId,onAction}){
 const vote=state.vote;if(state.phase!=='voting'||!vote)return null;
 return <section className="party-panel party-map-vote" aria-label="Map voting"><h2>VOTE FOR THE NEXT MAP <span role="timer">{state.countdown}s</span></h2><p className="party-help">One vote per player. Change it until the timer ends.</p><div className="party-vote-grid">{vote.candidates.map(id=>{const map=findMap(id),count=state.players.filter(player=>vote.ballots[player.id]===id).length,chosen=vote.ballots[selfId]===id;return <button key={id} className={'party-vote-card'+(chosen?' party-vote-chosen':'')} aria-pressed={chosen} onClick={()=>onAction({type:'vote',mapId:id})}><Image src={mapPreview(id)} alt={map.name+' map preview'} fittingType="fit" className="party-vote-picture"/><strong>{map.name}</strong><span>{map.teams} teams · {count} {count===1?'vote':'votes'}</span><small>{chosen?'Your vote':'Click to vote'}</small></button>;})}</div></section>;
}