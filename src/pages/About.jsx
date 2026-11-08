import React from 'react';
import PublicNavigation from '@/components/game/PublicNavigation';
import '@/components/game/party.css';
import '@/components/game/publicPages.css';
export default function About(){
 return <div className="public-page"><div className="public-page-inner"><PublicNavigation/><main>
  <h1>About Ephirisi Wars: Browser Bed Wars</h1>
  <p>Ephirisi Wars, also known in the game as Void Wars, is a browser-based, three-dimensional voxel arena game. Players explore floating islands, collect resources, build bridges, protect their team's bed, and battle opposing teams above the void. It combines block-building decisions with movement and close-range combat. The game runs in a web browser rather than requiring a separate game installation.</p>
  <h2>Who the game is for</h2>
  <p>The game is for players who enjoy block-built worlds, competitive team strategy, and learning through practice. A newcomer can start by understanding movement, safe bridging, and bed protection. More experienced players can experiment with resource routes, equipment purchases, and coordinated attacks. Party lobbies let friends gather using a short code, while bot opponents provide another way to experience the arena. A username is used for play, without requiring a game account.</p>
  <h2>How a Bed Wars match works</h2>
  <p>Your bed is central to your team's survival. While it remains intact, defeated teammates can respawn. Once it is destroyed, subsequent defeats can eliminate players from the match. Resource generators supply materials for the item shop and team upgrades. Players must decide when to invest in defenses, improve their equipment, or leave their island to challenge an opponent. Bridges create routes between islands, but narrow paths also make movement and positioning especially important.</p>
  <p>Different tools and utility items support different tactics. Blocks help you cross gaps and cover a bed, while weapons support combat. Spending every resource on an attack can leave a base vulnerable, so successful play balances pressure with protection. Falling into the void is a danger even when no enemy is nearby.</p>
  <h2>Who builds Ephirisi Wars</h2>
  <p>Ephirisi Wars is an independent browser-game project built and maintained by its creator using Base44 and a custom three-dimensional game engine. The project includes original pixel-style assets, local bot behavior, and a developing Story Mode. It is not an official Minecraft or Hypixel product. Players can use the Contact page to report bugs, share feedback, or ask questions about the game.</p>
 </main><footer><PublicNavigation/></footer></div></div>;
}