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
 const save=next=>{setProfile(saveGameProfile(next));setScreen('menu');};
 const start=options=>{setScreen('game');game.start({...options,...profile});};
 const quit=()=>{game.quit();setScreen('menu');};
 return <main className="game-shell"><div className="game-canvas" ref={game.mount}/>{screen==='username'?<GameUsernameForm profile={profile} onSave={save}/>:screen==='settings'?<GameSettings profile={profile} onSave={save} onBack={()=>setScreen('menu')}/>:screen==='solo'?<GameSoloSetup onPlay={start} onBack={()=>setScreen('menu')}/>:screen==='game'?<GameSession game={game} onQuit={quit}/>:<GameMenu username={profile.username} onSolo={()=>setScreen('solo')} onSettings={()=>setScreen('settings')}/>}</main>;
}