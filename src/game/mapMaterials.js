export const MAP_MATERIALS=[
 ['QUARTZ',104,48,'#edf3ee','quartz'],['BRICK',105,49,'#9499a3','brick'],['MOSS',106,50,'#57884c','moss'],['LEAVES',107,51,'#369b57','leaves'],
 ['LOG',108,52,'#966639','log'],['SNOW',109,53,'#f1fbff','snow'],['ICE',110,54,'#84d6ef','ice'],['DIORITE',111,55,'#ccd3d7','stone'],
 ['SPRUCE',112,56,'#6c4d35','oak'],['LANTERN',113,57,'#b6ffef','lantern'],['METAL',114,58,'#8795a7','metal'],['ASPHALT',115,59,'#252b37','asphalt'],
 ['WAFFLE',116,60,'#dfab68','waffle'],['PASTEL',117,61,'#ffc9e2','pastel'],['PEACH',118,62,'#ffdb9c','pastel'],['BARS',119,63,'#c2cdd7','bars']
];
export const M=Object.fromEntries(MAP_MATERIALS.map(([name,id])=>[name,id]));
export function drawMapMaterials(c,clean){for(const [,id,tile,color,kind] of MAP_MATERIALS){const ox=tile%8*16,oy=(tile/8|0)*16;c.clearRect(ox,oy,16,16);c.fillStyle=color;c.fillRect(ox,oy,16,16);
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){let a=0;if(!clean)a=((x*13+y*7+id)%9-4)*.012;
 if(kind==='brick'&&(y%8===7||x%8===(y<8?3:7)))a=-.16;
 if(kind==='log'&&x%5===0||kind==='oak'&&y%5===4)a=-.14;
 if(kind==='waffle'&&((x+y)%8===0||(x-y+16)%8===0))a=-.19;
 if(kind==='leaves'&&(x*3+y*7)%17===0||kind==='moss'&&(x+y*3)%23===0)a=-.1;
 if(kind==='metal'&&(x===0||y===0)||kind==='asphalt'&&(x===0&&y===0))a=-.09;
 if(kind==='ice'&&(x+y===9||x+y===21))a=.19;
 if(kind==='lantern')a=x<2||y<2||x>13||y>13?-.2:.14;
 if(a){c.fillStyle=a>0?`rgba(255,255,255,${a})`:`rgba(0,0,0,${-a})`;c.fillRect(ox+x,oy+y,1,1);}}
 if(kind==='bars'){c.clearRect(ox,oy,16,16);c.fillStyle=color;for(const x of [2,7,12])c.fillRect(ox+x,oy,2,16);for(const y of [3,12])c.fillRect(ox,oy+y,16,2);}
 }}