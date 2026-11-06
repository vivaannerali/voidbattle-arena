export default function playerDamage(player,damage){
 const amount=Math.max(0,damage),absorbed=Math.min(player.effects.absorption||0,amount);
 player.effects.absorption=Math.max(0,(player.effects.absorption||0)-absorbed);
 player.health=Math.max(0,player.health-(amount-absorbed));
}