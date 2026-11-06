import React from 'react';
import GameHUD from '@/components/game/GameHUD';
import GameResults from '@/components/game/GameResults';
import GameInventory from '@/components/game/GameInventory';
import GameShop from '@/components/game/GameShop';
import GameTeamUpgrades from '@/components/game/GameTeamUpgrades';
import GamePauseMenu from '@/components/game/GamePauseMenu';
import GameClickResume from '@/components/game/GameClickResume';
import GameChatInput from '@/components/game/GameChatInput';
import '@/components/game/gameRefinements.css';
export default function GameSession({game,onQuit,onSettings,onLobby}) {
 const {data,mode}=game,engine=game.engine.current;
 const move=(from,to)=>{if(engine.network?.role==='guest')engine.network.command('move',{from,to});else{engine.interaction.store.move(from,to);engine.publish();}};
 let overlay=null;
 if(mode==='results'&&data)overlay=<GameResults data={data} onAgain={onLobby||game.again} onSpectate={game.resume} onQuit={onQuit}/>;
 else if(mode==='upgrades'&&data)overlay=<GameTeamUpgrades data={data} onBuy={key=>engine.buyUpgrade(key)} onMove={move} onClose={()=>engine.closeGui()}/>;
 else if(mode==='shop'&&data)overlay=<GameShop data={data} onBuy={(key,shift)=>engine.buyItem(key,shift)} onMove={move} onClose={()=>engine.closeGui()}/>;
 else if(mode==='inventory'&&data)overlay=<GameInventory data={data} onMove={move} onClose={()=>engine.toggleInventory()}/>;
 else if(mode==='chat')overlay=<GameChatInput onSend={text=>engine.sendChat(text)} onClose={()=>engine.closeGui()}/>;
  else if(mode==='click-resume')overlay=<GameClickResume onResume={game.resume}/>;
 else if(mode!=='playing')overlay=<GamePauseMenu party={!!onLobby} mode={mode} error={game.error} onResume={game.resume} onQuit={onQuit} onSettings={onSettings}/>;
 return <>{data&&<GameHUD data={data} onSlot={slot=>engine?.interaction.select(slot,false)}/>}<div className="game-vignette"/>{overlay}</>;
}