import { useEffect,useRef,useState } from 'react';
import Engine from '@/game/engine';
import StoryDirector from '@/game/story/StoryDirector';
import { STORY_ROSTER,STORY_DIFFICULTIES } from '@/game/story/storyCatalog';
export default function useStorySession(profile){
 const mount=useRef(null),engine=useRef(null),generation=useRef(0);
 const [data,setData]=useState(null),[mode,setMode]=useState('start'),[error,setError]=useState('');
 const stop=()=>{generation.current++;engine.current?.dispose();engine.current=null;setData(null);setMode('start');};
 useEffect(()=>()=>{generation.current++;engine.current?.dispose();},[]);
 const start=(difficulty='Normal',checkpoint=null,chapter=checkpoint?.chapter||'prologue')=>{stop();const token=generation.current;setError('');setMode('loading');requestAnimationFrame(()=>{if(token!==generation.current||!mount.current)return;try{
  const plan={...profile,story:true,username:'EPHIRISI',teamMode:'Duos',activeTeams:[0,3],partyRoster:STORY_ROSTER,localId:'emperor',difficulty:STORY_DIFFICULTIES[difficulty].bot,botChat:'Off',renderDistance:8,graphics:'Fast',particles:'Decreased',clouds:'Off',viewBobbing:'Off'};
  const e=new Engine(mount.current,setData,next=>{setMode(next);engine.current?.story?.menu(next);},plan);engine.current=e;e.story=new StoryDirector(e,difficulty,checkpoint,chapter);setMode('playing');e.publish();
 }catch(problem){engine.current?.dispose();engine.current=null;mount.current?.replaceChildren();setError(problem.message||'Enable hardware acceleration to enter the story.');setMode('error');}});};
 return {mount,engine,data,mode,error,start,stop};
}