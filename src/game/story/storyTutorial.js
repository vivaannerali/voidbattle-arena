export function startStoryTutorial(d,resume=null){
 const e=d.e,m=e.match,s=m.players[0];d.stage='gameplay';d.scenes=null;d.actors.stop();s.body.spawn(.5,17.001,34.5);s.body.yaw=Math.PI;s.body.pitch=-.12;d.lastHealth=s.health;
 if(d.difficulty==='Story'){s.effects.absorption=10;s.effects.absorptionTicks=2147483647;}
 d.cacheResources();
 if(resume?.moment==='shop'||resume?.moment==='forge')d.checkpoint.restore(resume);else d.checkpoint.capture('forge');
 d.e.onMenu('click-resume');d.pause();
}
export function tickStoryTutorial(d,dt){
 const e=d.e,m=e.match,s=m.players[0],p=s.body;d.objectiveAge+=dt;
 if(s.health<d.lastHealth)d.damage+=d.lastHealth-s.health;d.lastHealth=s.health;
 if(p.y<0){d.deaths++;d.checkpoint.restore();d.cacheResources();e.interaction.message('The void returns you to your checkpoint.');return;}
 if(!d.collected&&(s.inventory.total(40)>0||s.inventory.total(41)>0)){d.collected=true;d.objectiveAge=0;d.checkpoint.capture('shop');m.chat.add(0,'The forge burns. Now, a sword and armour.','all');}
 if(d.collected&&s.sword>=33&&s.gear.armourTier>=2){d.finish();return;}
 d.target=d.collected?{...e.shopNPCs.positions[3],label:'ITEM SHOP'}:{x:.5,z:40.5,label:'IMPERIAL FORGE'};
 d.objective=d.collected?'Buy a sword and permanent armour':'Collect iron and gold at the Imperial Forge';
 if(d.objectiveAge>=60){d.hint=d.collected?'Right-click the outlined villager. Buy a Stone Sword in Melee and Chainmail or Iron Armour in Armor. E closes your inventory.':'Follow the gold marker behind your spawn. Walk over the iron and gold to pick them up.';if(d.objectiveAge>=(d.resupplyAt||60)){d.cacheResources();d.resupplyAt=d.objectiveAge+60;}}
}