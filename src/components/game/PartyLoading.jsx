import React from 'react';
export default function PartyLoading({onQuit}){
 return <div className="game-menu-backdrop"><section className="game-menu minecraft-menu" role="status" aria-live="polite"><h2>Preparing party match</h2><p className="minecraft-subtitle">Waiting for every player to load the arena and synchronize their starting position.</p><button className="minecraft-button" onClick={onQuit}>Leave party</button></section></div>;
}