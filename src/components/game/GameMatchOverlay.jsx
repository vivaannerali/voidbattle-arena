import React,{useEffect,useRef} from 'react';

export default function GameMatchOverlay({data}) {
  const log=useRef(null);useEffect(()=>{if(data.chatOpen&&log.current)log.current.scrollTop=log.current.scrollHeight;},[data.chatOpen,data.chat.length]);
  return <><div className={'game-damage-flash '+(data.hitFlash?'is-hit':'')}/>{data.title&&<div className={'game-match-title text-team-'+data.title.color} style={{opacity:data.title.opacity}}><h2>{data.title.main}</h2><p>{data.title.sub}</p></div>}<div ref={log} className={'game-chat '+(data.chatOpen?'game-chat-open':'')} role="log" aria-label="Match chat">{data.chat.map(line=><div key={line.id} className={'game-chat-line text-team-'+line.color} style={{opacity:line.opacity}}>{line.text}</div>)}</div></>;
}