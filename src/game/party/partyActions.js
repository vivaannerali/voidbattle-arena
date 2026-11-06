import { TEAM_MODES } from '@/game/arenaModes';
import { balanceTeams,reconcileParty,startProblem } from '@/game/party/partyRules';
import { mapsForMode } from '@/game/mapCatalog';
import { beginMapVote,castMapVote } from '@/game/party/mapVoting';
import maskChatText from '@/game/maskChatText';
import { canForceEphirisi } from '@/game/ephirisiAccess';
export default function partyAction(session,id,action){const state=session.state,p=state?.players.find(p=>p.id===id);if(!p||!action||typeof action.type!=='string')return;
 if(action.type==='chat'){const text=typeof action.text==='string'?maskChatText(action.text.trim().slice(0,180)):'';if(!text||Date.now()-(p.lastChat||0)<500)return;p.lastChat=Date.now();state.messages.push({id:crypto.randomUUID(),username:p.username,text});state.messages=state.messages.slice(-60);session.sync();return;}
 if(action.type==='back'){if(session.canReturn)session.returnToLobby();return;}
 if(action.type==='vote'){castMapVote(session,id,action.mapId);return;}
  if(state.phase!=='lobby')return;
 if(action.type==='force-ephirisi'){if(!canForceEphirisi(p.username)||typeof action.enabled!=='boolean')return;p.forceEphirisi=action.enabled;state.players.forEach(member=>{member.ready=false;});}
 else if(action.type==='ready')p.ready=!p.ready;
 else if(action.type==='team'&&state.settings.type==='pvp'){const mode=TEAM_MODES[state.settings.teamMode],team=action.team;if(!Number.isInteger(team)||team<0||team>=mode.teams||state.players.filter(p=>p.team===team).length>=mode.size)return;p.team=team;state.players.forEach(p=>{p.ready=false;});}
 else if(p.host&&action.type==='settings'){const s=state.settings,a=action.value||{};if(a.type==='bots'||a.type==='pvp'){s.type=a.type;s.fillBots=a.type==='bots';s.automatic=true;}if(TEAM_MODES[a.teamMode]){s.teamMode=a.teamMode;s.automatic=false;}if(typeof a.fillBots==='boolean')s.fillBots=a.fillBots;if(['Easy','Normal','Hard'].includes(a.difficulty))s.difficulty=a.difficulty;if(a.mapId==='random'||mapsForMode(s.teamMode,state.players).some(map=>map.mapId===a.mapId))s.mapId=a.mapId;if(typeof a.mapVoting==='boolean')s.mapVoting=a.mapVoting;reconcileParty(state);if(a.type==='pvp'||a.teamMode&&s.type==='pvp')balanceTeams(state.players,s.teamMode);}
 else if(p.host&&(action.type==='randomise'||action.type==='balance')){balanceTeams(state.players,state.settings.teamMode,action.type==='randomise');state.players.forEach(p=>{p.ready=false;});}
 else if(p.host&&action.type==='kick'){const target=state.players.find(p=>p.id===action.id&&!p.host);if(target)session.kick(target.id);return;}
 else if(p.host&&action.type==='start'){if(!startProblem(state)){if(state.settings.mapVoting)beginMapVote(session);else session.countdown();}return;}
 else return;session.sync();}