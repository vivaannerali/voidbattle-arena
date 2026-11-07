import { modePrice } from '@/game/modeRules';
export default function botUtilityShopping(bot){
 const s=bot.player,i=s.inventory,iron=i.total(40),gold=i.total(41),emerald=i.total(43),role=(bot.index+bot.trip)%4;
 const tntCost=modePrice(4,8,bot.match.settings.teamMode),armed=i.total(74)||i.total(75)||i.total(89);
 if(gold>=3&&s.health<=14&&!i.total(77)&&!s.effects.regenerationTicks)return 'golden_apple';
 if(emerald>=2&&!i.total(80)&&!i.total(88)&&!s.effects.invisibilityTicks){if(role===0)return 'invisibility_potion';if(role===1)return 'bridge_egg';}
 if(emerald>=1&&role===2&&!i.total(78)&&!s.effects.speedTicks)return 'speed_potion';
 if(!armed){
  if(role%2===0&&gold>=tntCost)return 'tnt';
  if(iron>=40)return role===3?'wind_charge':'fireball';
  if(gold>=tntCost)return 'tnt';
 }
 if(gold>=3&&!i.total(77)&&!s.effects.absorptionTicks)return 'golden_apple';
 if(role===0&&gold>=4&&i.total(74)&&!i.total(81)&&!s.effects.milkTicks)return 'magic_milk';
 return null;
}