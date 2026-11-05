import React from 'react';
import { TEAM_NAMES,TEAM_CSS } from '@/game/equipment';
import { timerText } from '@/game/gameEvents';

export default function GameScoreboard({data}) {
 const date=new Intl.DateTimeFormat('en-AU',{day:'2-digit',month:'2-digit',year:'2-digit',timeZone:'Australia/Melbourne'}).format(new Date());
 return <aside className="bedwars-scoreboard"><h2>BED WARS</h2><div className="scoreboard-date">{date}</div><div className="scoreboard-event">{data.nextEvent} in <span>{timerText(data.eventSeconds)}</span></div><div className="scoreboard-teams">{TEAM_NAMES.slice(0,data.beds.length).map((name,i)=><div key={name}><span className={'text-team-'+TEAM_CSS[i]}>{name[0]} {name}:</span><b className={data.beds[i]?'score-bed-alive':data.playersLeft[i]>0?'score-players-left':'score-bed-gone'}>{data.beds[i]?'✓':data.playersLeft[i]>0?data.playersLeft[i]:'✗'}</b>{i===data.localTeam&&<small>YOU</small>}</div>)}</div><div className="scoreboard-stat">Kills: <span>{data.kills}</span></div><div className="scoreboard-stat">Final Kills: <span>{data.finalKills}</span></div><div className="scoreboard-stat">Beds Broken: <span>{data.bedsBroken}</span></div>{data.suddenDeath&&<div className="scoreboard-border">Safe radius: {data.border} blocks</div>}<footer>VOID WARS · {data.teamMode}</footer></aside>;
}