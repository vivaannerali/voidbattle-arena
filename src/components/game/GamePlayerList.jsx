import React from 'react';
import { TEAM_NAMES,TEAM_CSS } from '@/game/equipment';

export default function GamePlayerList({data}) {
 if(!data.tabHeld)return null;
 return <section className="game-player-list" aria-label="Players grouped by team"><header>BED WARS <span>LOCAL PRACTICE · {data.players.length} PLAYERS</span></header><div className="player-list-groups">{TEAM_NAMES.map((team,i)=><div className="player-team-group" key={team}><h3 className={'text-team-'+TEAM_CSS[i]}>{team} Team</h3>{data.players.filter(player=>player.team===i).map(player=><div key={player.name}><span className={'text-team-'+TEAM_CSS[i]}>{player.name}</span>{i===0&&<small>YOU</small>}<b>{player.final?'Spectator':!player.alive?'Respawning':Math.ceil(player.health)+' ♥'}</b></div>)}</div>)}</div><footer>Hold TAB to view · Original local voxel arena</footer></section>;
}