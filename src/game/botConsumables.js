import { TEAMS } from '@/game/map';
import consumableEffect from '@/game/consumableEffect';
export default function botConsumables(bot){
 const m=bot.match,s=bot.player,p=s.body,e=s.effects,i=s.inventory;
 if(!p.grounded)return false;
 let distance=Infinity;
 for(const other of m.players)if(other.alive&&!m.allied(s.team,other.team)&&(!other.effects.invisibilityTicks||other.effects.revealTicks))distance=Math.min(distance,Math.hypot(other.body.x-p.x,other.body.z-p.z));
 if(bot.consuming&&(distance<5||s.health<bot.consuming.health||!i.total(bot.consuming.id))){bot.consuming=null;bot.consumeAt=m.clock+90;}
 if(distance<5||m.clock<(bot.consumeAt||0))return false;
 if(!bot.consuming){
  const base=TEAMS[bot.enemyTeam],raid=bot.action==='attack'&&base?Math.hypot(p.x-base.x,p.z-base.z):Infinity;
  const id=i.total(77)&&!e.regenerationTicks&&(s.health<=14||distance<16&&!e.absorptionTicks)?77:
   raid>12&&raid<28&&i.total(81)&&!e.milkTicks?81:
   raid>12&&raid<30&&i.total(80)&&!e.invisibilityTicks?80:
   bot.action==='attack'&&i.total(78)&&!e.speedTicks?78:0;
  if(!id)return false;
  bot.consuming={id,left:96,health:s.health};
 }
 const use=bot.consuming;s.heldTool=use.id;s.swingTicks=2;bot.input.sneak=true;
 if(--use.left<=0){if(i.spend(use.id,1))consumableEffect(s,use.id);bot.consuming=null;bot.consumeAt=m.clock+90;bot.nextThink=0;}
 bot.lastWorkAt=m.clock;return true;
}