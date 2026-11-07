import React from 'react';
import StoryDialogue from '@/components/story/StoryDialogue';
import GameMatchOverlay from '@/components/game/GameMatchOverlay';
export default function StoryCinematic({story,director,data}){
 const scene=story.scene;if(!scene)return null;
 return <div className="story-cinematic">{data&&scene.kind!=='title'&&<GameMatchOverlay data={{...data,title:null}}/>}{scene.kind!=='title'&&<><div className="story-letterbox story-letterbox-top"/><div className="story-letterbox story-letterbox-bottom"/></>}{scene.kind==='title'&&<div className="story-title-card"><div style={{opacity:Math.max(0,scene.fade)}}><p>{scene.subtitle}</p><h1>{scene.title}</h1></div></div>}{scene.narrator&&<p className="story-narrator">{scene.narrator}</p>}{scene.dialogue&&<StoryDialogue line={scene.dialogue} paused={story.paused} onContinue={()=>director.scenes?.advance()}/>}<div className="story-skip"><span>Hold SPACE to skip</span><i style={{transform:`scaleX(${story.skip})`}}/></div></div>;
}