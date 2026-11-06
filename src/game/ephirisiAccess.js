// These are device-set game usernames, not verified account identities.
export function canForceEphirisi(username){return username==='Larp108'||username==='AKD23';}
export function forceEphirisiEnabled(players){return players.some(p=>canForceEphirisi(p.username)&&p.forceEphirisi===true);}
export function ephirisiHasSpace(state,mode){
 const allies=state.settings.type==='bots'?state.players.map(p=>p.team):[state.players[0].team];
 return Array.from({length:mode.teams},(_,team)=>team).some(team=>!allies.includes(team)&&state.players.filter(p=>p.team===team).length<mode.size);
}