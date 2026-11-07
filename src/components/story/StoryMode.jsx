import React,{useState} from 'react';
import useStorySession from '@/components/story/useStorySession';
import StoryChapterSelect from '@/components/story/StoryChapterSelect';
import StorySession from '@/components/story/StorySession';
import '@/components/game/gameRefinements.css';
import '@/components/game/icyPack.css';
import '@/components/story/story.css';
export default function StoryMode({profile,onQuit}){
 const game=useStorySession(profile),[playing,setPlaying]=useState(false);
 const chapters=()=>{game.stop();setPlaying(false);};
 const quit=()=>{game.stop();onQuit();};
 return <main className="game-shell story-mode"><div className="game-canvas" ref={game.mount}/><div className="game-interface" style={{'--game-gui-scale':profile.guiScale/100}}>{playing?<StorySession game={game} onChapters={chapters} onQuit={quit}/>:<StoryChapterSelect onStart={(difficulty,checkpoint)=>{setPlaying(true);game.start(difficulty,checkpoint);}} onQuit={quit}/>}</div></main>;
}