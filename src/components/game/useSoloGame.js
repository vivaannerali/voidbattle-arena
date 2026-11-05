import {useEffect,useRef,useState} from 'react';
import Engine from '@/game/engine';
export default function useSoloGame(){
 const mount=useRef(null),engine=useRef(null),options=useRef(null);
 const [data,setData]=useState(null),[mode,setMode]=useState('start'),[error,setError]=useState('');
 useEffect(()=>()=>{engine.current?.dispose();engine.current=null;},[]);
 const start=next=>{options.current=next;engine.current?.dispose();engine.current=null;setData(null);setError('');setMode('start');try{engine.current=new Engine(mount.current,setData,setMode,next);engine.current.setFov(next.fov);engine.current.setSensitivity(next.sensitivity);engine.current.play();}catch(error){console.error(error);engine.current?.dispose();engine.current=null;mount.current?.replaceChildren();setError(error.message||'This arena needs WebGL. Enable hardware acceleration or try a desktop browser.');setMode('error');}};
 const again=()=>start(options.current);
 const resume=()=>error?again():engine.current?.play();
 const quit=()=>{engine.current?.dispose();engine.current=null;setData(null);setError('');setMode('start');};
 return {mount,engine,data,mode,error,start,again,resume,quit};
}