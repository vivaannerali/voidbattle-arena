import React from 'react';
import GameHotbar from '@/components/game/GameHotbar';
import GameMatchOverlay from '@/components/game/GameMatchOverlay';
import GameScoreboard from '@/components/game/GameScoreboard';
import GamePlayerList from '@/components/game/GamePlayerList';

export default function GameHUD({data,onSlot}) {
 if(!data)return null;
 return <div className="game-hud"><header className="game-topbar"><div className="game-brand">V<span>W</span><i/> <small>LOCAL COMBAT PRACTICE</small></div><div className="game-top-controls"><kbd>E</kbd> Inventory <span>·</span> <kbd>TAB</kbd> Players <span>·</span> <kbd>F3</kbd> Debug <span>·</span> <kbd>ESC</kbd> Pause</div></header><GameScoreboard data={data}/><GamePlayerList data={data}/><div className="game-crosshair"><span/><span/></div>{data.notice&&<div className="game-notice">{data.notice}</div>}<div className="game-target-name">{data.target}{data.protected&&<small>MAP BLOCK · PROTECTED</small>}</div><GameHotbar data={data} onSlot={onSlot}/><footer className="game-bottom-caption"><span>RED ISLAND <i/> BUILD LIMIT Y {data.buildHeight}</span><span>Java-inspired movement · Original voxel arena</span></footer>{data.debug&&<pre className="game-debug">VOID WARS / Three.js{ '\n'}{data.fps} FPS · fixed 60 TPS{ '\n'}XYZ: {data.x} / {data.y} / {data.z}{ '\n'}Facing: {data.facing} ({data.yaw}°){ '\n'}Chunks: {data.chunks} · Draw calls: {data.drawCalls}{ '\n'}16×16×16 · face-patched chunk meshes{ '\n'}Respawns: {data.deaths}</pre>}<GameMatchOverlay data={data}/><div className="game-mobile-note">A keyboard and mouse are required to play.</div></div>;
}