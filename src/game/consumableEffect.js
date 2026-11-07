export default function consumableEffect(player,id){
 const e=player.effects;
 if(id===77){e.absorption=Math.max(e.absorption,4);e.absorptionTicks=7200;e.regenerationTicks=300;}
 if(id===78)e.speedTicks=Math.max(e.speedTicks,2700);
 if(id===79)e.jumpPotionTicks=Math.max(e.jumpPotionTicks,2700);
 if(id===80){e.invisibilityTicks=Math.max(e.invisibilityTicks,1800);e.revealTicks=0;}
 if(id===81)e.milkTicks=Math.max(e.milkTicks,1800);
}