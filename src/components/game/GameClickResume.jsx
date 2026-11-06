import React from 'react';
export default function GameClickResume({onResume}) {
 return <div className="game-click-resume"><button className="minecraft-button" onClick={onResume} autoFocus>Click to resume</button></div>;
}