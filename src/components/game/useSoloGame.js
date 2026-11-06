import {useEffect,useRef,useState} from 'react';
import Engine from '@/game/engine';
import { resolveMap } from '@/game/mapCatalog';
export default function useSoloGame(){
 const mount=useRef(null),engine=useRef(null),options=useRef(null),generation=useRef(0),pending=useRef(null);
 const [data,setData]=useState(null),[mode,setMode]=useState('start'),[error,setError]=useState(''),[loadingMap,setLoadingMap]=useState(null);
 useEffect(()=>()=>{generation.current++;clearTimeout(pending.current);engine.current?.dispose();engine.current=null;},[]);
 const start=next=>{const map=resolveMap(next.mapId,next.teamMode),plan={...next,mapId:map.mapId},token=++generation.current;options.current=plan;clearTimeout(pending.current);engine.current?.dispose();engine.current=null;setData(null);setError('');setLoadingMap(map);setMode('loading');requestAnimationFrame(()=>{if(token!==generation.current)return;pending.current=setTimeout(()=>{if(token!==generation.current||!mount.current)return;try{engine.current=new Engine(mount.current,setData,setMode,plan);engine.current.applySettings(plan);plan.attachNetwork?.(engine.current);setLoadingMap(null);engine.current.pointerLock.resume(true);}catch(error){console.error(error);engine.current?.dispose();engine.current=null;mount.current?.replaceChildren();setLoadingMap(null);setError(error.message||'This arena needs WebGL. Enable hardware acceleration or try a desktop browser.');setMode('error');}},0);});};
 const again=()=>start(options.current);
 const resume=()=>error?again():engine.current?.play();
 const quit=()=>{generation.current++;clearTimeout(pending.current);setLoadingMap(null);engine.current?.dispose();engine.current=null;setData(null);setError('');setMode('start');};
 const updateSettings=profile=>{options.current={...options.current,...profile};if(engine.current){engine.current.applySettings(profile);engine.current.match.settings.username=profile.username;engine.current.match.players[0].name=profile.username;engine.current.publish();}};
 return {mount,engine,data,mode,error,loadingMap,start,again,resume,quit,updateSettings};
}