import { B,tileFor } from '@/game/blocks';
const ICE={edge:'#eaffff',light:'#b9f6ff',blue:'#77b9ef',shadow:'#777ed0',dark:'#344b83'};
function tile(c,id,draw){const x=id%8*16,y=Math.floor(id/8)*16;c.save();c.translate(x,y);draw((color,x,y,w=1,h=1)=>{c.fillStyle=color;c.fillRect(x,y,w,h);});c.restore();}
function sprite(c,id,rows,colors){tile(c,id,r=>{c.clearRect(0,0,16,16);rows.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(colors[row[x]])r(colors[row[x]],x,y);});});}
export default function icyPvpTextures(c){
 // Original pixel artwork, using the supplied preview only as a palette reference.
 const blade=['                ','            h   ','           hwl  ','          hwlb  ','         hwlb   ','        hwlb    ','       hwlb     ','   h  hwlb      ','   wlhwlb  h    ','    wwlb  hl    ','     llb hls    ','     gsslls     ','    gks ss      ','   gks          ','   ks           ','                '];
 for(let tier=0;tier<4;tier++)sprite(c,26+tier,blade,{h:tier===3?ICE.edge:'#f3f6ff',w:['#e8bc7d','#c9d6e8','#f4fcff',ICE.light][tier],l:['#b78b50','#9eaac3','#b8d7e9',ICE.blue][tier],b:['#72532f','#65738e','#7895b8',ICE.shadow][tier],s:ICE.dark,g:'#d6a252',k:'#694835'});
 sprite(c,78,['                ','  wh        hw  ','  wlh      hlw  ','   wlh    hlw   ','    wlh  hlw    ','     wlhhlw     ','      wllw      ','      slls      ','     rrsrrr     ','    ror  ror    ','   roor  roor   ','   ror    ror   ','    rr    rr    ','                ','                ','                '],{w:ICE.edge,h:ICE.light,l:ICE.blue,s:ICE.dark,r:'#b53926',o:'#ed7950'});
 sprite(c,46,['                ','      hhh       ','     hwwwh      ','    hwwllwh     ','   hwwllllwh    ','  hwwllblllwh   ','  hwwllblllwh   ','   hwlbbllwh    ','    hllblwh     ','     hllwh      ','      hlh       ','       h        ','                ','                ','                ','                '],{h:ICE.edge,w:ICE.light,l:ICE.blue,b:ICE.shadow});
 for(const id of [79,80,81])tile(c,id,r=>{c.clearRect(0,0,16,16);const base=id===79?'#9aaac8':id===80?'#d1e7f4':ICE.blue;r(ICE.dark,2,2,12,12);r(base,3,3,3,5);r(base,10,3,3,5);r(base,5,5,6,8);r(ICE.edge,3,3,3,1);r(ICE.edge,10,3,3,1);r(ICE.light,5,7,2,5);r(ICE.shadow,9,8,2,5);r(ICE.dark,6,5,4,2);r(ICE.edge,6,7,4,1);});
 for(const id of [B.RED,B.BLUE,B.GREEN,B.YELLOW,B.AQUA,B.WHITE,B.PINK,B.GREY])tile(c,tileFor(id,2),r=>{r('#ffffff38',0,0,16,1);r('#ffffff24',0,1,1,14);r('#1c285b55',0,15,16,1);r('#1c285b38',15,1,1,14);for(let y=3;y<14;y+=4)for(let x=2;x<14;x+=4){r('#ffffff12',x,y,2,1);r('#17244912',x+1,y+1,2,1);}});
 tile(c,3,r=>{r('#aebdd0',0,0,16,16);r('#dce8f1',0,0,16,2);for(const [x,y,w,h] of [[2,4,6,4],[10,3,4,5],[1,10,5,4],[8,10,6,4]]){r('#9baac2',x,y,w,h);r('#c8d7e5',x,y,w,1);}});
 tile(c,14,r=>{r('#cb9f63',0,0,16,16);for(let y=0;y<16;y+=4){r('#f3d296',0,y,16,1);r('#9d743f',0,y+3,16,1);r('#a87d49',y%8?5:11,y+1,1,2);}});
 tile(c,13,r=>{r('#efe7bf',0,0,16,16);for(const [x,y] of [[2,3],[10,2],[6,8],[12,12],[1,12]]){r('#ccc59d',x,y,3,2);r('#fff5d9',x,y,3,1);}});
 tile(c,15,r=>{r('#24233e',0,0,16,16);for(const [x,y] of [[1,2],[8,7],[3,12]]){r('#51436d',x,y,6,2);r('#78669d',x,y,4,1);}});
 // Keep team colors, protected scenery and all collision geometry unchanged.
 tile(c,tileFor(B.WHITE,2),r=>{r('#ccedff35',2,2,12,12);});
}