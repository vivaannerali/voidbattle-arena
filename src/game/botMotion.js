import { gridKey,gridX,gridZ,NAV_MIN } from '@/game/botGrid';
import botBridging from '@/game/botBridging';
import { TEAMS } from '@/game/map';
export class BotInput {
 constructor(){this.clear();}
 clear(){this.forward=this.backward=this.left=this.right=this.jump=this.sneak=this.sprint=false;}
 down(code){return code==='KeyW'?this.forward:code==='KeyS'?this.backward:code==='KeyA'?this.left:code==='KeyD'?this.right:code==='Space'?this.jump:code==='ShiftLeft'?this.sneak:code==='ControlLeft'?this.sprint:false;}
}
function safe(bot,x,z,maxDrop=3){const ix=Math.floor(x),iz=Math.floor(z),p=bot.player.body;if(ix<NAV_MIN||ix>68||iz<NAV_MIN||iz>68)return false;const h=bot.director.grid.height(gridKey(ix,iz),p.y);return h>0&&h>=p.y-maxDrop-.05&&h<=p.y+1.05;}
export function guardBotEdges(bot,maxDrop=3){const p=bot.player.body,i=bot.input,f=(i.forward?1:0)-(i.backward?1:0),s=(i.right?1:0)-(i.left?1:0);if(!f&&!s)return;let dx=Math.cos(p.yaw)*s-Math.sin(p.yaw)*f,dz=-Math.sin(p.yaw)*s-Math.cos(p.yaw)*f;const length=Math.hypot(dx,dz)||1;if(safe(bot,p.x+dx/length*.48,p.z+dz/length*.48,maxDrop))return;i.sneak=true;i.sprint=false;i.left=i.right=false;dx=-Math.sin(p.yaw)*f;dz=-Math.cos(p.yaw)*f;if(!safe(bot,p.x+dx*.48,p.z+dz*.48,maxDrop)){i.forward=i.backward=i.jump=false;}}
export function followBotPath(bot){
 const nav=bot.nav,p=bot.player.body,i=bot.input;if(nav.searching||nav.failed||nav.cursor>=nav.length)return false;
 let key=nav.path[nav.cursor],x=gridX(key)+.5,z=gridZ(key)+.5;
 if(Math.hypot(x-p.x,z-p.z)<.28&&Math.abs(p.y-nav.pathHeights[nav.cursor])<.25){nav.cursor++;if(nav.cursor>=nav.length)return false;key=nav.path[nav.cursor];x=gridX(key)+.5;z=gridZ(key)+.5;}
 let height=bot.director.grid.height(key,nav.pathHeights[nav.cursor]);const dx=x-p.x,dz=z-p.z,distance=Math.hypot(dx,dz);
 if(height<0||height>p.y+1.05||height>0&&(Math.abs(height-nav.pathHeights[nav.cursor])>.1||p.grounded&&p.y-height>3.05)){nav.cancel();nav.failed=true;return false;}
 const heading=Math.atan2(-dx,-dz);p.yaw=heading;p.pitch=-.12;
 if(height===0||bot.bridgeStep?.x===Math.floor(x)&&bot.bridgeStep?.z===Math.floor(z)){
  if(p.y<nav.pathHeights[nav.cursor]-1.05){nav.cancel();nav.failed=true;return false;}
  p.yaw=heading+Math.PI;p.pitch=-1.15;
  if(!botBridging(bot,Math.floor(x),Math.floor(z)))return true;
  height=bot.director.grid.height(key,nav.pathHeights[nav.cursor]);
 }
 const floor=Math.floor(p.y-.01),w=bot.match.world;
 const bridging=w.editable(Math.floor(p.x),floor,Math.floor(p.z))||w.editable(Math.floor(x),Math.floor(height-.01),Math.floor(z));
 const narrow=bridging&&[[1,0],[-1,0],[0,1],[0,-1]].filter(([ox,oz])=>!w.get(Math.floor(x)+ox,Math.floor(height-.01),Math.floor(z)+oz)).length>=2;
 i.jump=height>p.y+.3&&p.grounded;i.sneak=narrow&&(bot.difficulty.bridge>17||!p.grounded||height>p.y+.3);i.sprint=!narrow&&distance>.8;
 if(narrow){p.yaw=heading+Math.PI;p.pitch=-1.12;i.backward=true;bot.player.heldTool=TEAMS[bot.player.team].wool;}else i.forward=true;
 guardBotEdges(bot);return true;
}