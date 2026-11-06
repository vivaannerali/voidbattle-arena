import BotNavigation from '@/game/botNavigation';
import attemptClutch from '@/game/botRecovery';
import { BotInput,guardBotEdges,followBotPath } from '@/game/botMotion';
import { nearestEnemy,botCombat } from '@/game/botCombat';
import { basePoint,nextDefence,buildDefence,mineEnemyBed } from '@/game/botConstruction';
import { gridKey } from '@/game/botGrid';
import { TEAMS } from '@/game/map';
import { BED_SHIFT } from '@/game/bedLayout';
import { tickBotOrder,buyChatOrder } from '@/game/botChatOrders';
export default class BotBrain {
 constructor(director,index){this.director=director;this.match=director.match;this.index=index;this.player=this.match.players[index];this.difficulty=director.difficulty;this.input=new BotInput();this.nav=new BotNavigation(director.grid);this.action='idle';this.goalX=this.goalZ=999;this.nextThink=index*3;this.placeAt=this.attackAt=0;this.mineX=this.mineY=this.mineZ=-999;this.mineProgress=0;this.mineId=0;this.mineHit={valid:false};this.target=-1;this.enemyTeam=-1;this.trip=0;this.lastGemAt=-9999;this.waitUntil=0;this.aimOffset=0;this.wasAlive=true;this.stuckTicks=0;this.lastX=this.player.body.x;this.lastZ=this.player.body.z;this.lastPlan=0;this.recoverUntil=0;this.lastWorkAt=0;}
 get building(){return !!this.match.beds[this.player.team]&&(this.director.builders[this.player.team]===this.index||this.chatOrder?.type==='defend')&&!!this.defenceCell();}
 defenceCell(){return nextDefence(this);}
 guardEdges(){guardBotEdges(this);}
 go(action,x,z){const previous=this.action,same=previous===action&&Math.hypot(this.goalX-x,this.goalZ-z)<.8;if(same&&(this.nav.searching||this.nav.cursor<this.nav.length||Math.hypot(this.player.body.x-x,this.player.body.z-z)<.75))return;if(previous===action&&this.nav.searching&&this.match.clock-this.lastPlan<90)return;this.action=action;this.goalX=x;this.goalZ=z;this.lastPlan=this.match.clock;this.nav.begin(this.player.body.x,this.player.body.z,x,z,this.player.inventory.total(TEAMS[this.player.team].wool));}
 atGoal(radius=.85){return Math.hypot(this.player.body.x-this.goalX,this.player.body.z-this.goalZ)<radius;}
 recover(){this.nav.cancel();this.mineProgress=0;this.stuckTicks=0;this.trip++;this.recoverUntil=this.match.clock+90;const p=this.player.body,grid=this.director.grid;for(let n=0;n<4;n++){const d=(n+this.trip)%4,x=Math.floor(p.x)+(d===0?2:d===1?-2:0),z=Math.floor(p.z)+(d===2?2:d===3?-2:0);if(x< -68||x>68||z< -68||z>68||grid.height(gridKey(x,z))<=0)continue;this.go('recover',x+.5,z+.5);return;}this.action='idle';}
 buildGoal(){const cell=this.defenceCell();if(!cell)return;const p=this.player.body;let bx=cell.x+.5,bz=cell.z+.5,best=Infinity;for(let n=0;n<4;n++){const d=(n+this.trip)%4,x=cell.x+(d===0?2:d===1?-2:0),z=cell.z+(d===2?2:d===3?-2:0),height=this.director.grid.height(gridKey(x,z));if(height<=0||height>19)continue;const distance=Math.hypot(p.x-x-.5,p.z-z-.5);if(distance<best){best=distance;bx=x+.5;bz=z+.5;}}this.go('build',bx,bz);}
 think(){const m=this.match,p=this.player,body=p.body,eco=this.director.economy,home=this.director.baseCenters[p.team],atHome=Math.hypot(body.x-home.x,body.z-home.z)<11;this.aimOffset=(Math.random()-.5)*2*this.difficulty.aim;
  this.target=nearestEnemy(this,8);if(this.target>=0){const enemy=m.players[this.target].body;if(!m.lineClear(body.x,body.y+1.4,body.z,enemy.x,enemy.y+1,enemy.z))this.target=-1;}
  const threat=m.beds[p.team]?nearestEnemy(this,12,p.team):-1;if(threat>=0){const enemy=m.players[threat].body;this.go('defend',enemy.x,enemy.z);if(Math.hypot(enemy.x-body.x,enemy.z-body.z)<8)this.target=threat;return;}if(this.action==='defend')this.action='idle';if(this.target>=0)return;
  if(tickBotOrder(this))return;
  if(this.action==='recover'&&m.clock<this.recoverUntil)return;if(this.action==='recover')this.action='idle';if(this.nav.failed){this.recover();return;}
  if(this.building){const cell=this.defenceCell();if(p.inventory.total(cell.id)>0){this.buildGoal();return;}const key=eco.purchaseKey(this),point=eco.affordable(this,key)?this.director.shops[p.team]:this.director.generators[p.team];this.go(eco.affordable(this,key)?'shop':'collect',point.x,point.z);return;}
  if(this.action==='build')this.action='idle';
  if(atHome&&eco.upgradeKey(this)){const point=this.director.upgrades[p.team];this.go('upgrade',point.x,point.z);return;}
  if(this.action==='return'&&!atHome){const point=this.director.generators[p.team];this.go('return',point.x,point.z);return;}if(this.action==='return')this.action='idle';
  if((atHome||this.action==='collect'||this.action==='shop'||this.action==='idle')&&(!eco.ready(this)||eco.affordable(this,eco.purchaseKey(this)))){const key=eco.purchaseKey(this),affordable=eco.affordable(this,key),point=affordable?this.director.shops[p.team]:this.director.generators[p.team];this.go(affordable?'shop':'collect',point.x,point.z);return;}
  if(p.inventory.total(TEAMS[p.team].wool)<8||eco.upgradeKey(this)&&!atHome&&this.action!=='diamond'){const point=this.director.generators[p.team];this.go('return',point.x,point.z);return;}
  if(this.action==='collect'||this.action==='shop'||this.action==='upgrade')this.action='idle';
  if(this.action==='diamond'||this.action==='emerald'){if(this.atGoal(1.1)){if(!this.waitUntil)this.waitUntil=m.clock+480;const id=this.action==='diamond'?42:43;if(p.inventory.total(id)>=2||m.clock>=this.waitUntil){this.lastGemAt=m.clock;this.trip++;this.waitUntil=0;const point=this.director.generators[p.team];this.go('return',point.x,point.z);}}return;}
  if(this.action==='attack'&&(!m.beds[this.enemyTeam]||this.nav.failed))this.action='idle';if(this.action==='hunt'){const enemy=nearestEnemy(this);if(enemy<0)return;this.go('hunt',m.players[enemy].body.x,m.players[enemy].body.z);return;}
  if(this.action==='idle'){this.enemyTeam=this.director.nearestTeam(this);if(this.enemyTeam<0){this.action='hunt';return;}if(m.timeline.elapsed>=120*60&&m.clock-this.lastGemAt>3600&&(this.trip+p.slot)%3!==2){const emerald=m.timeline.elapsed>150*60&&(this.trip+p.slot)%3===1,point=this.director.resourcePoint(this,emerald);this.waitUntil=0;this.go(emerald?'emerald':'diamond',point.x,point.z);return;}const point=basePoint(this.enemyTeam,0,1-BED_SHIFT);this.go('attack',point.x,point.z);}
 }
 tick(){this.input.clear();const m=this.match,p=this.player;if(!p.alive){this.wasAlive=false;this.nav.cancel();return;}if(!this.wasAlive){this.wasAlive=true;this.action='idle';this.nextThink=0;this.lastX=p.body.x;this.lastZ=p.body.z;this.stuckTicks=0;this.waitUntil=0;}attemptClutch(this);if(m.clock>=this.nextThink){this.nextThink=m.clock+this.difficulty.reaction;this.think();}let working=false;
  if(this.target>=0&&botCombat(this,this.target))working=true;
  else if(this.action==='chat-shop'&&this.atGoal(1.2)){if(m.clock>=this.placeAt){this.placeAt=m.clock+this.difficulty.reaction;buyChatOrder(this);}working=true;}
  else if(this.action==='shop'&&this.atGoal(1.2)){if(m.clock>=this.placeAt){this.placeAt=m.clock+this.difficulty.reaction;if(!this.director.economy.buy(this)){this.action='idle';this.nextThink=0;}}working=true;}
  else if(this.action==='upgrade'&&this.atGoal(1.2)){const key=this.director.economy.upgradeKey(this);if(key&&m.interaction.upgradesNPCs.inReach(p.body,p.team))m.teamUpgrades.purchase(this.index,key);this.action='idle';this.nextThink=m.clock+this.difficulty.reaction;working=true;}
  else if(this.action==='build'&&buildDefence(this))working=true;
  else if(this.action==='attack'&&m.beds[this.enemyTeam]&&mineEnemyBed(this,this.enemyTeam))working=true;
  else working=followBotPath(this);
  if(m.clock%30===this.index%30){const moved=Math.hypot(p.body.x-this.lastX,p.body.z-this.lastZ);this.lastX=p.body.x;this.lastZ=p.body.z;const waiting=this.action==='guard'&&!this.nav.searching&&this.nav.cursor>=this.nav.length||this.atGoal(1.1)&&(this.action==='collect'||this.action==='diamond'||this.action==='emerald'||this.action==='shop'||this.action==='upgrade'),progress=moved>=.12||m.clock-this.lastWorkAt<30;this.stuckTicks=!progress&&!waiting&&!this.nav.searching&&this.action!=='idle'?this.stuckTicks+30:0;if(this.stuckTicks>=180||this.nav.failed)this.recover();}if(working&&p.swingTicks>0)this.lastWorkAt=m.clock;
 }
}