import React, { useEffect, useState } from 'react';
import GameMenu from '@/components/game/GameMenu';
import GameUsernameForm from '@/components/game/GameUsernameForm';
import GameSettings from '@/components/game/GameSettings';
import GameSoloSetup from '@/components/game/GameSoloSetup';
import GameSession from '@/components/game/GameSession';
import useSoloGame from '@/components/game/useSoloGame';
import readGameProfile,{saveGameProfile} from '@/game/gameProfile';

export default function Game() {
 const [profile,setProfile]=useState(readGameProfile),[screen,setScreen]=useState(()=>profile.username?'menu':'username'),game=useSoloGame();
 useEffect(()=>{document.title='Void Wars | Bed Wars';},[]);
 const back=()=>setScreen(game.engine.current?'game':'menu');
 const save=next=>{const saved=saveGameProfile(next);setProfile(saved);game.updateSettings(saved);back();};
 const start=options=>{setScreen('game');game.start({...options,...profile});};
 const quit=()=>{game.quit();setScreen('menu');};
 return <main className="game-shell"><div className="game-canvas" ref={game.mount}/><div className="game-interface" style={{'--game-gui-scale':profile.guiScale/100}}>{screen==='username'?<GameUsernameForm profile={profile} onSave={save}/>:screen==='settings'?<GameSettings profile={profile} onSave={save} onBack={back}/>:screen==='solo'?<GameSoloSetup onPlay={start} onBack={()=>setScreen('menu')}/>:screen==='game'?<GameSession game={game} onQuit={quit} onSettings={()=>setScreen('settings')}/>:<GameMenu username={profile.username} onSolo={()=>setScreen('solo')} onSettings={()=>setScreen('settings')}/>}</div></main>;
}