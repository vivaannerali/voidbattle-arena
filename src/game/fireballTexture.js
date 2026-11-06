export default function fireballTexture(c){
 const x=125%8*16,y=Math.floor(125/8)*16;c.clearRect(x,y,16,16);
 const rows=['                ','         o      ','      o oo      ','    ooyyoo      ','   ooywwyoo     ','  ooywwwyooo    ','  oywwyyyroo    ',' ooywyyrrrro    ',' ooyyyrrrrro    ',' ooyyrrkkrro    ','  oyrrkkkrro    ','  oorrkkkro     ','   oorrkro      ','    oorro       ','     oo         ','                '];
 const colors={o:'#ed6819',y:'#ffbc28',w:'#fff5bb',r:'#ad3520',k:'#482c2a'};
 rows.forEach((row,dy)=>{for(let dx=0;dx<row.length;dx++)if(colors[row[dx]]){c.fillStyle=colors[row[dx]];c.fillRect(x+dx,y+dy,1,1);}});
}