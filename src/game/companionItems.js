export const COMPANION_ITEMS=[
 {key:'bed_bug',name:'Bed Bug Spawn Egg',category:'utility',type:'utility',id:94,tile:144,quantity:1,cost:40,currency:40,description:'Right-click clear ground to summon a fast silverfish that attacks nearby enemies for 15 seconds. 8 health, 2 attack damage. Maximum 3 active companions per player.'},
 {key:'dream_defender',name:'Dream Defender',category:'utility',type:'utility',id:95,tile:145,quantity:1,cost:120,currency:40,description:'Right-click clear ground to summon an iron golem that guards its deployment area for 4 minutes. 100 health, 8 attack damage. Maximum 3 active companions per player.'}
];
export const COMPANIONS={
 94:{name:'Bed Bug',health:8,height:.4,speed:1.05,damage:2,reach:1.25,cooldown:30,lifetime:900,leash:20},
 95:{name:'Dream Defender',health:100,height:2.4,speed:.48,damage:8,reach:2.25,cooldown:60,lifetime:14400,leash:12}
};