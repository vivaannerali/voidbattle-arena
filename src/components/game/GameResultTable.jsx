import React from 'react';
import { TEAM_NAMES,TEAM_CSS } from '@/game/equipment';
export default function GameResultTable({players}) {
 return <div className="game-results-table-wrap"><table className="game-results-table"><caption>Every player's match statistics</caption><thead><tr><th>Player</th><th>Kills</th><th>Final kills</th><th>Beds</th></tr></thead><tbody>{players.map(player=><tr key={player.id||player.name}><th scope="row"><span className={'text-team-'+TEAM_CSS[player.team]}>{player.name}{player.local?' (you)':''}</span><small>{TEAM_NAMES[player.team]}</small></th><td>{player.kills}</td><td>{player.finalKills}</td><td>{player.bedsBroken}</td></tr>)}</tbody></table></div>;
}