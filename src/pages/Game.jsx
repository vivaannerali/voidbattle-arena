import React, { useEffect, useRef, useState } from 'react';
import Engine from '@/game/engine';
import GameMenu from '@/components/game/GameMenu';
import GameHUD from '@/components/game/GameHUD';
import GameResults from '@/components/game/GameResults';
import GameInventory from '@/components/game/GameInventory';
import GameShop from '@/components/game/GameShop';
import GameTeamUpgrades from '@/components/game/GameTeamUpgrades';

export default function Game() {
 const mount=useRef(null),engine=useRef(null);
 const [data,setData]=useState(null),[mode,setMode]=useState('loading'),[fov,setFov]=useState(70),[sensitivity,setSensitivity]=useState(50),[error,setError]=useState(''),[armour,setArmour]=useState(1);
 useEffect(()=>{document.title='Void Wars | Game';try{engine.current=new Engine(mount.current,setData,setMode);setMode('start');}catch(e){setError('This arena needs WebGL. Enable hardware acceleration or try a desktop browser.');console.error(e);}return()=>engine.current?.dispose();},[]);
 const changeFov=value=>{setFov(value);engine.current?.setFov(value);};
 const changeSensitivity=value=>{setSensitivity(value);engine.current?.setSensitivity(value);};
 const changeArmour=value=>{setArmour(value);engine.current?.match.setArmour(value);};
 const playAgain=()=>{engine.current?.dispose();setMode('loading');engine.current=new Engine(mount.current,setData,setMode);engine.current.setFov(fov);engine.current.setSensitivity(sensitivity);engine.current.match.setArmour(armour);engine.current.play();};
 return <main className="game-shell"><div className="game-canvas" ref={mount}/>{data&&<GameHUD data={data} onSlot={slot=>engine.current.interaction.select(slot,false)}/>}<div className="game-vignette"/>{error?<div className="game-menu"><h2>Unable to start</h2><p>{error}</p></div>:mode==='loading'?<div className="game-menu"><div className="game-eyebrow">BUILDING YOUR WORLD</div><h1>VOID<span>WARS</span></h1><p>Preparing the islands…</p></div>:mode==='results'&&data?<GameResults data={data} onAgain={playAgain} onSpectate={()=>engine.current?.play()}/>:mode==='upgrades'&&data?<GameTeamUpgrades data={data} onBuy={key=>engine.current.buyUpgrade(key)} onMove={(from,to)=>{engine.current.interaction.store.move(from,to);engine.current.publish();}} onClose={()=>engine.current?.play()}/>:mode==='shop'&&data?<GameShop data={data} onBuy={(key,shift)=>engine.current.buyItem(key,shift)} onMove={(from,to)=>{engine.current.interaction.store.move(from,to);engine.current.publish();}} onClose={()=>engine.current?.play()}/>:mode==='inventory'&&data?<GameInventory data={data} onMove={(from,to)=>{engine.current.interaction.store.move(from,to);engine.current.publish();}} onClose={()=>engine.current?.toggleInventory()}/>:mode!=='playing'&&<GameMenu mode={mode} onPlay={()=>engine.current?.play()} fov={fov} setFov={changeFov} sensitivity={sensitivity} setSensitivity={changeSensitivity} armour={armour} setArmour={changeArmour}/>}</main>;
}