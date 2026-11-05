import React from 'react';
import MinecraftPanel from '@/components/game/MinecraftPanel';

export default function GameMenu({username,onSolo,onSettings}) {
 return <MinecraftPanel title="VOID WARS" subtitle="A block-built battle above the void."><p className="minecraft-player-name">Playing as <strong>{username}</strong></p><button className="minecraft-button minecraft-button-primary" onClick={onSolo}>Play Solo vs Bots</button><button className="minecraft-button" onClick={onSettings}>Settings</button><p className="minecraft-note">Offline gameplay · No account needed</p></MinecraftPanel>;
}