export const ARROW=82;
export const isBow=id=>id>=83&&id<=86;
export const BOWS={83:{damage:6,punch:3.8},84:{damage:8,punch:3.8},85:{damage:6,punch:12},86:{damage:4,punch:3.8,automatic:true,durability:120}};
export const RANGED_ITEMS=[
 {key:'arrows',name:'Arrow',category:'ranged',type:'ammo',id:ARROW,tile:134,quantity:8,cost:2,currency:41,description:'8 arrows. Each shot from any bow consumes one arrow.'},
 {key:'bow',name:'Bow',category:'ranged',type:'bow',id:83,tile:135,quantity:1,cost:12,currency:41,description:'Hold right-click to draw, release to fire. Full charge takes 1 second. Requires arrows. Lost on death.'},
 {key:'power_bow',name:'Power I Bow',category:'ranged',type:'bow',id:84,tile:136,quantity:1,cost:24,currency:41,description:'Charged arrows deal increased damage. Hold right-click to draw, release to fire. Requires arrows. Lost on death.'},
 {key:'punch_bow',name:'Punch I Bow',category:'ranged',type:'bow',id:85,tile:137,quantity:1,cost:6,currency:43,description:'Arrows deal massive directional knockback. Hold right-click to draw, release to fire. Requires arrows. Lost on death.'},
 {key:'machine_gun_bow',name:'Machine Gun Bow',category:'ranged',type:'bow',id:86,tile:138,quantity:1,cost:8,currency:43,description:'Hold right-click to fire 10 arrows per second. Each shot consumes an arrow and one of 120 durability. Breaks when worn out. Lost on death.'}
];