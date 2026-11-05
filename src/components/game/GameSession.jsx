import React from 'react';
import GameHUD from '@/components/game/GameHUD';
import GameResults from '@/components/game/GameResults';
import GameInventory from '@/components/game/GameInventory';
import GameShop from '@/components/game/GameShop';
import GameTeamUpgrades from '@/components/game/GameTeamUpgrades';
import GamePauseMenu from '@/components/game/GamePauseMenu';
export default function GameSession({game,onQuit}) {
 const {data,mode}=game,engine=game.engine.current;
 const move=(from,to)=>{engine.interaction.store.move(from,to);engine.publish();};
 let overlay=null;
 if(mode==='results'&&data)overlay=<GameResults data={data} onAgain={game.again} onSpectate={game.resume} onQuit={onQuit}/>;
 else if(mode==='upgrades'&&data)overlay=<GameTeamUpgrades data={data} onBuy={key=>engine.buyUpgrade(key)} onMove={move} onClose={game.resume}/>;
 else if(mode==='shop'&&data)overlay=<GameShop data={data} onBuy={(key,shift)=>engine.buyItem(key,shift)} onMove={move} onClose={game.resume}/>;
 else if(mode==='inventory'&&data)overlay=<GameInventory data={data} onMove={move} onClose={()=>engine.toggleInventory()}/>;
 else if(mode!=='playing')overlay=<GamePauseMenu mode={mode} error={game.error} onResume={game.resume} onQuit={onQuit}/>;
 return <>{data&&<GameHUD data={data} onSlot={slot=>engine?.interaction.select(slot,false)}/>}<div className="game-vignette"/>{overlay}</>;
}