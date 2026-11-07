import React,{useEffect,useMemo,useState} from 'react';
import GameSettings from '@/components/game/GameSettings';
import GameSession from '@/components/game/GameSession';
import PartyStart from '@/components/game/PartyStart';
import PartyLobby from '@/components/game/PartyLobby';
import useSoloGame from '@/components/game/useSoloGame';
import usePartySession from '@/components/game/usePartySession';
import readGameProfile,{saveGameProfile,validUsername} from '@/game/gameProfile';
import HostPartyGame from '@/game/party/hostPartyGame';
import GuestPartyGame from '@/game/party/guestPartyGame';
import partyTextures from '@/game/party/partyTextures';
import '@/components/game/party.css';
import StoryMode from '@/components/story/StoryMode';

export default function Game(){
 const [profile,setProfile]=useState(readGameProfile),[name,setName]=useState(profile.username),[code,setCode]=useState(''),[screen,setScreen]=useState('start'),game=useSoloGame(),textures=useMemo(partyTextures,[]);
 const party=usePartySession({state:state=>{setCode(state.code);if(state.phase==='lobby'||state.phase==='countdown'||state.phase==='voting')setScreen(current=>current==='settings'?current:'lobby');},game:(options,connection)=>{setScreen('game');game.start({...profile,...options,attachNetwork:engine=>options.networkRole==='host'?new HostPartyGame(engine,connection):new GuestPartyGame(engine,connection)});},packet:(packet,id)=>game.engine.current?.network?.receive(packet,id),lobby:()=>{game.quit();setScreen('lobby');},exit:()=>{game.quit();setScreen('start');}});
 useEffect(()=>{document.title='Void Wars | Party Bed Wars';},[]);
 const changeName=value=>{setName(value);if(validUsername(value)){try{setProfile(saveGameProfile({...profile,username:value}));}catch(error){party.setError(error.message);}}};
 const back=()=>{setScreen(game.engine.current?'game':party.state?'lobby':'start');game.engine.current?.closeGui();};
 useEffect(()=>{if(screen!=='settings')return;const close=event=>{if(event.code==='Escape'&&!event.repeat){event.preventDefault();event.stopImmediatePropagation();back();}};document.addEventListener('keydown',close,true);return()=>document.removeEventListener('keydown',close,true);},[screen]);
 const save=next=>{const saved=saveGameProfile(next,{allowBlank:true});setProfile(saved);game.updateSettings(saved);back();};
 if(screen==='story')return <StoryMode profile={profile} onQuit={()=>setScreen('start')}/>;
 return <main className="game-shell party-shell" style={textures}><div className="game-canvas" ref={game.mount}/><div className="game-interface" style={{'--game-gui-scale':profile.guiScale/100}}>{screen==='settings'?<GameSettings profile={profile} onSave={save} onBack={back} hideUsername/>:screen==='game'?<GameSession game={game} onQuit={party.leave} onSettings={()=>setScreen('settings')} onLobby={()=>party.action({type:'back'})}/>:<div className="party-surface">{screen==='lobby'&&party.state?<PartyLobby state={party.state} selfId={party.selfId} onAction={party.action} onLeave={party.leave} onSettings={()=>setScreen('settings')}/>:<PartyStart username={name} onName={changeName} code={code} onCode={setCode} onCreate={()=>party.create(name)} onJoin={()=>party.join(name,code)} onSettings={()=>setScreen('settings')} onStory={()=>setScreen('story')} busy={party.busy} error={party.error}/>}</div>}</div></main>;
}