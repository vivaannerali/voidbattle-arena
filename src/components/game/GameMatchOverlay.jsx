import React from 'react';

export default function GameMatchOverlay({data}) {
 return <><div className={'game-damage-flash '+(data.hitFlash?'is-hit':'')}/>{data.title&&<div className={'game-match-title text-team-'+data.title.color} style={{opacity:data.title.opacity}}><h2>{data.title.main}</h2><p>{data.title.sub}</p></div>}<div className="game-chat" role="log" aria-label="Match chat">{data.chat.map(line=><div key={line.id} className={'game-chat-line text-team-'+line.color} style={{opacity:line.opacity}}>{line.text}</div>)}</div></>;
}