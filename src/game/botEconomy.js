import ItemShop from '@/game/itemShop';
import { SHOP_ITEMS,resolveOffer } from '@/game/shopCatalog';
import { TEAM_UPGRADES,TRAP_COSTS } from '@/game/teamUpgradeCatalog';
import { TEAMS } from '@/game/map';
import { modePrice,upgradeCosts } from '@/game/modeRules';
export default class BotEconomy {
 constructor(match){this.match=match;this.shop=new ItemShop(match);}
 purchaseKey(bot){const p=bot.player,i=p.inventory,g=p.gear,wool=i.total(TEAMS[p.team].wool),iron=i.total(40),gold=i.total(41),emerald=i.total(43),cell=bot.building?bot.defenceCell():null;
  if(cell&&i.total(cell.id)<1)return cell.id===TEAMS[p.team].wool?'wool':'clay';
  if(emerald>=6&&g.armourTier<4)return 'diamond_armor';if(emerald>=modePrice(4,3,this.match.settings.teamMode)&&p.sword<35)return 'diamond_sword';if(gold>=12&&g.armourTier<3)return 'iron_armor';if(gold>=7&&p.sword<34)return 'iron_sword';
  if(wool<64)return 'wool';if(p.sword<33)return 'stone_sword';if(g.pickaxeTier<0)return 'pickaxe';if(iron>=24&&g.armourTier<2)return 'chainmail';if(iron>=20&&!g.shears)return 'shears';if(iron>=10&&g.pickaxeTier<1)return 'pickaxe';if(iron>=10&&g.axeTier<0)return 'axe';return null;
 }
 affordable(bot,key){if(!key)return false;const entry=SHOP_ITEMS.find(item=>item.key===key),offer=resolveOffer(entry,bot.player,this.match.settings.teamMode);return !offer.owned&&bot.player.inventory.total(offer.currency)>=offer.cost;}
 ready(bot){const p=bot.player;return p.inventory.total(TEAMS[p.team].wool)>=48&&p.sword>=33&&p.gear.pickaxeTier>=0;}
 buy(bot){if(!this.match.interaction.shops.inReach(bot.player.body,bot.player.team))return false;const key=this.purchaseKey(bot);if(!this.affordable(bot,key))return false;return this.shop.purchase(key,key==='wool',bot.index).ok;}
 upgradeKey(bot){const state=this.match.teamUpgrades.teams[bot.player.team],diamonds=bot.player.inventory.total(42),cost=key=>{const def=TEAM_UPGRADES.find(entry=>entry.key===key);return upgradeCosts(def,this.match.settings.teamMode)[state[key]]??Infinity;};if(!state.sharpness&&diamonds>=cost('sharpness'))return 'sharpness';if(!state.protection&&diamonds>=cost('protection'))return 'protection';if(this.match.beds[bot.player.team]&&!state.trapCount&&diamonds>=TRAP_COSTS[0])return 'fatigue_trap';if(diamonds>=cost('protection'))return 'protection';if(diamonds>=cost('haste'))return 'haste';if(diamonds>=cost('heal'))return 'heal';if(!state.trapCount&&diamonds>=TRAP_COSTS[0])return 'fatigue_trap';if(diamonds>=cost('feather'))return 'feather';if(diamonds>=cost('forge'))return 'forge';return null;}
}