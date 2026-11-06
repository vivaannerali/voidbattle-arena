import { EXTRA_ITEMS } from '@/game/extraItems';
import rangedTextures from '@/game/rangedTextures';
import utilityTextures from '@/game/utilityTextures';
export default function extraItemTextures(c){
 for(const item of EXTRA_ITEMS){const ox=item.tile%8*16,oy=Math.floor(item.tile/8)*16;
  const r=(color,x,y,w=1,h=1)=>{c.fillStyle=color;c.fillRect(ox+x,oy+y,w,h);};c.clearRect(ox,oy,16,16);
  if(item.id>=87){utilityTextures(item.id,r);continue;}
  if(item.id>=82){rangedTextures(item.id,r);continue;}
  if(item.id===76){for(let n=0;n<8;n++){r('#23344e',3+n,12-n,3,3);r('#b48653',4+n,12-n,1,2);}r('#26354a',7,1,8,7);r('#879fb7',8,2,6,5);r('#d7f0ff',8,2,6,2);r('#54718e',11,5,3,2);r('#c0daeb',7,3,1,3);continue;}
  if(item.id===77){r('#26344a',7,1,2,4);r('#8cba57',9,1,3,2);r('#8c642b',3,5,10,8);r('#f6c94b',2,6,12,5);r('#ffe281',4,4,3,2);r('#ffe281',9,4,3,2);r('#f3b63c',4,11,8,3);r('#fff5bf',4,6,2,4);r('#cc8c30',11,8,2,4);continue;}
  const liquid={78:'#7fc7ee',79:'#7def9b',80:'#b7a1ed',81:'#f2f6ff'}[item.id];
  r('#26344a',5,1,6,5);r('#9b7650',6,1,4,2);r('#d5eeff',6,3,4,3);r('#26344a',4,6,8,8);r('#26344a',3,8,10,4);r('#97b5cf',5,6,6,7);r('#b9dbef',4,8,8,4);r(liquid,5,9,6,4);r(liquid,4,9,8,2);r('#f1ffff',5,7,1,4);r('#59718c',6,13,4,1);
 }
}