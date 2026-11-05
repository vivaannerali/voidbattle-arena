import { ARMOUR } from '@/game/equipment';

export default class Loadout {
 constructor(inventory){this.inventory=inventory;this.armourTier=1;this.pickaxeTier=-1;this.axeTier=-1;this.shears=false;}
 die(){this.inventory.ids.fill(0);this.inventory.counts.fill(0);this.inventory.revision++;if(this.pickaxeTier>=0)this.pickaxeTier=Math.max(0,this.pickaxeTier-1);if(this.axeTier>=0)this.axeTier=Math.max(0,this.axeTier-1);}
 respawn(player){this.inventory.add(32,1);if(this.pickaxeTier>=0)this.inventory.add(50+this.pickaxeTier,1);if(this.axeTier>=0)this.inventory.add(54+this.axeTier,1);if(this.shears)this.inventory.add(58,1);player.armour=ARMOUR[this.armourTier].points;player.sword=32;}
}