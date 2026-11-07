import React,{useEffect,useState} from 'react';
export default function StoryDialogue({line,onContinue,paused}){
 const [characters,setCharacters]=useState(0);
 useEffect(()=>setCharacters(0),[line.id]);
 useEffect(()=>{if(paused||line.revealed)return;const timer=setInterval(()=>setCharacters(value=>{if(value>=line.text.length){clearInterval(timer);return value;}return value+1;}),28);return()=>clearInterval(timer);},[line.id,line.text,line.revealed,paused]);
 const text=line.revealed?line.text:line.text.slice(0,characters);
 return <button className="story-dialogue" onClick={onContinue} aria-label={line.speaker+': '+line.text+'; click to continue'}><strong className={line.team==='yellow'?'text-team-yellow':line.team==='red'?'text-team-red':'text-team-gold'}>{line.speaker}</strong><p>{text}<span className="story-type-cursor" aria-hidden="true">▌</span></p><small>CLICK / ENTER TO CONTINUE</small></button>;
}