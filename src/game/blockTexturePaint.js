export const TEAM_PAINT=['#b64b52','#4b71b5','#61944b','#d7b64b','#51b9c1','#dddcd1','#d180ad','#838791'];
export function pixelHash(x,y,t){let h=Math.imul(x+38291+t*137,374761393)^Math.imul(y+91,668265263);h=Math.imul(h^(h>>>13),1274126177);return (h^(h>>>16))>>>0;}
export function palette(hex,contrast=1){const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return [-.18,-.10,-.035,.025,.085,.14].map(v=>{const channel=c=>Math.max(0,Math.min(255,Math.round(c+v*255*contrast)));return `rgb(${channel(r)} ${channel(g)} ${channel(b)})`;});}
export function tilePainter(context,tile){const ox=tile%8*16,oy=Math.floor(tile/8)*16;context.clearRect(ox,oy,16,16);return (x,y,color)=>{context.fillStyle=color;context.fillRect(ox+x,oy+y,1,1);};}
export function paintTile(context,tile,kind,color){
 const put=tilePainter(context,tile),shades=palette(color,kind==='clay'?.23:kind==='wool'?.35:.6),grass=palette('#638e40',.6),purple=palette('#493458',.5);
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){
  const h=pixelHash(x,y,tile),n=h%6;let ink=shades[n];
  if(kind==='grass-side'&&y<3+pixelHash(x,0,2)%4)ink=grass[n];
  if(kind==='wool'&&(x+y)%7===0)ink=shades[(x-y+32)%4<2?1:4];
  if(kind==='oak'){if(y%4===3)ink=shades[0];else if((x+pixelHash(Math.floor(x/4),Math.floor(y/4),14)%5)%9<4)ink=shades[2];if(y%4===1&&(x===2+(Math.floor(y/4)*5)%11))ink=shades[0];}
  if(kind==='end'){const pit=pixelHash(Math.floor(x/3),Math.floor(y/3),13)%5===0;if(pit&&x%3<2&&y%3<2)ink=shades[x%3===0?0:1];}
  if(kind==='obsidian'&&(x+2*y+pixelHash(Math.floor(y/4),0,15)%4)%13<2)ink=purple[n];
  if(kind==='stone'&&(x+pixelHash(Math.floor(y/4),0,3)%5)%12===0&&y%4<3)ink=shades[1];
  if(kind==='glass'){if(x>0&&x<15&&y>0&&y<15&&!(x+y===15&&x>3&&x<11)&&!(x+y===19&&x>8&&x<13))continue;ink=(x===0||y===0)?'#e7f3f2':shades[n];}
  if(kind==='ladder'){if(!(x===3||x===4||x===11||x===12||y%4===2&&x>3&&x<12||y%4===3&&x>3&&x<12))continue;ink=shades[(x===3||y%4===2)?4:n];}
  put(x,y,ink);
 }
}