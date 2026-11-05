import { B,tileFor } from '@/game/blocks';
import { TEAM_PAINT,palette,pixelHash,tilePainter,paintTile } from '@/game/blockTexturePaint';
export default function drawBlockTextures(c){
 for(const [tile,kind,color] of [[0,'grass','#6b9744'],[1,'dirt','#896748'],[2,'grass-side','#896748'],[3,'stone','#85868a'],[13,'end','#d9d6a4'],[14,'oak','#b18a55'],[15,'obsidian','#211b2e'],[16,'glass','#bad7dc'],[68,'ladder','#b18a55']])paintTile(c,tile,kind,color);
 const wool=[B.RED,B.BLUE,B.GREEN,B.YELLOW,B.AQUA,B.WHITE,B.PINK,B.GREY],clay=[B.RED_CLAY,B.BLUE_CLAY,B.GREEN_CLAY,B.YELLOW_CLAY,B.AQUA_CLAY,B.WHITE_CLAY,B.PINK_CLAY,B.GREY_CLAY],glass=[B.RED_GLASS,B.BLUE_GLASS,B.GREEN_GLASS,B.YELLOW_GLASS,B.AQUA_GLASS,B.WHITE_GLASS,B.PINK_GLASS,B.GREY_GLASS];
 for(let team=0;team<8;team++){
  paintTile(c,tileFor(wool[team],2),'wool',TEAM_PAINT[team]);paintTile(c,tileFor(clay[team],2),'clay',TEAM_PAINT[team]);paintTile(c,tileFor(glass[team],2),'glass',TEAM_PAINT[team]);
  for(let head=0;head<2;head++){const tile=104+team*2+head,put=tilePainter(c,tile),blanket=palette(TEAM_PAINT[team],.3),pillow=palette('#e9e6d8',.22);for(let y=0;y<16;y++)for(let x=0;x<16;x++){let ink=blanket[pixelHash(x,y,tile)%6];if(head&&y<7)ink=pillow[pixelHash(x,y,tile)%6];if(head&&y===7)ink=pillow[0];if(x===0||x===15)ink=blanket[1];put(x,y,ink);}}
 }
 const side=tilePainter(c,120),wood=palette('#a27b4c',.4),linen=palette('#ddd6c5',.2);
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){const shade=pixelHash(x,y,120)%6;if(y<8)side(x,y,linen[shade]);else if(y<11||x<3||x>12)side(x,y,wood[shade]);}
 paintTile(c,122,'oak','#8e6942');
 // Default bed icons use the same original red blanket and pillow artwork.
 for(let head=0;head<2;head++)c.drawImage(c.canvas,(104+head)%8*16,Math.floor((104+head)/8)*16,16,16,(17+head)%8*16,Math.floor((17+head)/8)*16,16,16);
}