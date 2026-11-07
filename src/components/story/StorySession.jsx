import React from 'react';
import StoryCinematic from '@/components/story/StoryCinematic';
import StoryGameplayHUD from '@/components/story/StoryGameplayHUD';
import StoryPause from '@/components/story/StoryPause';
import StoryPrologueResults from '@/components/story/StoryPrologueResults';
import GameShop from '@/components/game/GameShop';
import GameInventory from '@/components/game/GameInventory';
import GameTeamUpgrades from '@/components/game/GameTeamUpgrades';
import GameChatInput from '@/components/game/GameChatInput';
export default function StorySession({game,onChapters,onQuit}){
 const {data,mode,error}=game,e=game.engine.current,story=data?.story,d=e?.story;
 if(mode==='loading'||!story&&!error)return <div className="story-modal-backdrop"><section className="story-loading" role="status">BUILDING THE IMPERIAL DIVIDE...</section></div>;
 if(error)return <div className="story-modal-backdrop"><section className="minecraft-menu story-modal"><h2>Unable to enter the story</h2><p role="alert">{error}</p><button className="minecraft-button" onClick={onChapters}>CHAPTER SELECT</button></section></div>;
 const move=(from,to)=>{e.interaction.store.move(from,to);e.publish();};
 return <><div className={data.textureStyle==='Clean PvP'?'game-pack-icy':'game-pack-classic'}>{story.stage==='cinematic'?<StoryCinematic story={story} director={d} data={data}/>:<StoryGameplayHUD data={data} engine={e}/>}</div>{story.stage==='complete'?<StoryPrologueResults story={story} onReplay={()=>game.start(story.difficulty)} onChapters={onChapters} onQuit={onQuit}/>:story.paused||story.stage==='failed'?<StoryPause failed={story.stage==='failed'} director={d} onChapters={onChapters} onQuit={onQuit}/>:<>{mode==='shop'&&<GameShop data={data} onBuy={(key,shift)=>e.buyItem(key,shift)} onMove={move} onClose={()=>e.closeGui()}/>} {mode==='inventory'&&<GameInventory data={data} onMove={move} onClose={()=>e.toggleInventory()}/>} {mode==='upgrades'&&<GameTeamUpgrades data={data} onBuy={key=>e.buyUpgrade(key)} onMove={move} onClose={()=>e.closeGui()}/>} {mode==='chat'&&<GameChatInput onSend={text=>e.sendChat(text)} onClose={()=>e.closeGui()}/>}</>}</>;
}