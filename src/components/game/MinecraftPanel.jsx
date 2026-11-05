import React from 'react';
export default function MinecraftPanel({title,subtitle,children,wide=false}) {
 return <div className="game-menu-backdrop minecraft-backdrop"><section className={wide?'game-menu minecraft-menu minecraft-menu-wide':'game-menu minecraft-menu'} aria-label={title}><div className="game-eyebrow">VOID WARS</div><h2>{title}</h2>{subtitle&&<p className="minecraft-subtitle">{subtitle}</p>}{children}</section></div>;
}