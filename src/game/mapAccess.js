// Usernames are device-set in this account-free game, not verified identities.
const GELATO_USERNAMES=new Set(['Larp108','AKD23']);
export function canUseGelato(players=[]){return players.some(player=>player.human!==false&&GELATO_USERNAMES.has(player.username??player.name));}
export function canUseMap(map,players=[]){return map.id!=='gelato'||canUseGelato(players);}