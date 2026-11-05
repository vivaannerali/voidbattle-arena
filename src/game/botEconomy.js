import ItemShop from '@/game/itemShop';
import { SHOP_ITEMS,resolveOffer } from '@/game/shopCatalog';
import { TEAM_UPGRADES,TRAP_COSTS } from '@/game/teamUpgradeCatalog';
import { TEAMS } from '@/game/map';
export default class BotEconomy {
 constructor(match){this.match=match;this.shop=new ItemShop(match);}
 purchaseKey(bot){const p=bot.player,i=p.inventory,g=p.gear,wool=i.total(TEAMS[p.team].wool),iron=i.total(40),gold=i.total(41),emerald=i.total(43),cell=bot.building?bot.defenceCell():null;
  if(cell&&i.total(cell.id)<1)return cell.id===TEAMS[p.team].wool?'wool':'clay';
  if(emerald>=6&&g.armourTier<4)return 'diamond_armor';if(emerald>=4&&p.sword<35)return 'diamond_sword';if(gold>=12&&g.armourTier<3)return 'iron_armor';if(gold>=7&&p.sword<34)return 'iron_sword';
  if(wool<64)return 'wool';if(p.sword<33)return 'stone_sword';if(g.pickaxeTier<0)return 'pickaxe';if(iron>=24&&g.armourTier<2)return 'chainmail';if(iron>=20&&!g.shears)return 'shears';if(iron>=10&&g.pickaxeTier<1)return 'pickaxe';if(iron>=10&&g.axeTier<0)return 'axe';return null;
 }
 affordable(bot,key){if(!key)return false;const entry=SHOP_ITEMS.find(item=>item.key===key),offer=resolveOffer(entry,bot.player);return !offer.owned&&bot.player.inventory.total(offer.currency)>=offer.cost;}
 ready(bot){const p=bot.player;return p.inventory.total(TEAMS[p.team].wool)>=48&&p.sword>=33&&p.gear.pickaxeTier>=0;}
 buy(bot){const key=this.purchaseKey(bot);if(!this.affordable(bot,key))return false;return this.shop.purchase(key,key==='wool',bot.index).ok;}
 upgradeKey(bot){const state=this.match.teamUpgrades.teams[bot.player.team],diamonds=bot.player.inventory.total(42);if(state.forge===0&&diamonds>=4)return 'forge';if(state.protection<4&&diamonds>=TEAM_UPGRADES[1].costs[state.protection])return 'protection';if(!state.sharpness&&diamonds>=8)return 'sharpness';if(state.haste<2&&diamonds>=TEAM_UPGRADES[2].costs[state.haste])return 'haste';if(!state.heal&&diamonds>=3)return 'heal';if(!state.trapCount&&diamonds>=TRAP_COSTS[0])return 'fatigue_trap';if(state.forge<4&&diamonds>=TEAM_UPGRADES[3].costs[state.forge])return 'forge';return null;}
}