import * as THREE from 'three';
import bearSkin from '@/game/bearSkin';
const cache=[];
const palettes=[
 ['#17191d','#151619','#151619','#17191d','#191a1e','#111216','#141519','#151619'],
 ['#e9b394','#75402c','#633520','#eff0e8','#e6e8df','#e9b394','#287936','#75402c'],
 ['#c0d83a','#b7cd32','#b5cd31','#c0d83a','#b9d139','#bfd63a','#b7cf32','#b8d132'],
 ['#e4b394','#673c2c','#623c2d','#6b2028','#5a2027','#17191f','#17191f','#b92928'],
 ['#111216','#141519','#17181c','#121318','#141519','#121318','#383a40','#141519'],
 ['#c89b74','#272321','#282322','#16181b','#17191d','#181a1e','#17181b','#121316']
];
function drawSkin(index){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=16;const c=canvas.getContext('2d');
 const r=(t,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(t*16+x,y,w,h);};
 palettes[index-1].forEach((color,t)=>{r(t,color,0,0,16,16);r(t,'#00000014',0,0,2,16);r(t,'#ffffff12',2,0,12,2);});
 if(index===1){
  r(0,'#a51920',2,2,12,12);r(0,'#e53530',3,3,4,6);r(0,'#f5f1e4',3,5,3,2);r(0,'#f5f1e4',10,5,3,2);r(0,'#111216',5,10,7,3);
  r(3,'#b6121d',7,5,2,7);r(3,'#e51c23',6,7,4,3);r(6,'#24262c',3,8,10,2);
 }else if(index===2){
  r(0,'#6a3826',0,0,16,5);r(0,'#6a3826',13,4,3,6);r(0,'#302521',3,6,2,2);r(0,'#302521',11,6,2,2);r(0,'#956a55',6,11,5,1);
  r(3,'#c6ccc7',7,0,2,16);for(let y=3;y<15;y+=4)r(3,'#747c73',7,y,1,1);r(3,'#243926',0,14,16,2);r(3,'#d8b640',7,14,2,2);r(5,'#eff0e8',0,0,16,5);r(6,'#563b25',0,13,16,3);
 }else if(index===3){
  r(0,'#151a17',3,6,2,2);r(0,'#151a17',11,6,2,2);r(0,'#202718',5,10,7,3);r(0,'#fffce7',5,10,7,1);r(0,'#b44334',7,12,4,1);
 }else if(index===4){
  r(0,'#673c2c',0,0,16,4);r(0,'#fbf5e8',0,0,16,2);r(0,'#f5f7ee',3,5,4,5);r(0,'#f5f7ee',10,5,4,5);r(0,'#3385ce',5,6,2,4);r(0,'#3385ce',10,6,2,4);r(0,'#8c5b43',7,12,3,1);
  r(3,'#18191e',0,5,16,11);r(3,'#f0eee5',4,5,2,2);r(3,'#f0eee5',6,7,4,2);r(3,'#f0eee5',10,5,2,2);r(6,'#b9886d',2,8,4,2);r(6,'#b72b2b',0,13,16,3);r(6,'#f7f3e8',1,14,14,1);r(7,'#fff8ed',0,12,16,4);
 }else if(index===5){
  r(0,'#34353a',2,1,3,3);r(0,'#34353a',11,1,3,3);r(0,'#edece4',2,8,2,2);r(0,'#edece4',12,8,2,2);r(0,'#edece4',5,11,2,2);r(0,'#edece4',9,11,2,2);
  r(3,'#a21a21',4,1,2,15);r(3,'#a21a21',10,1,2,15);r(3,'#d5a326',11,3,3,2);r(5,'#d5a326',0,13,16,2);for(let y=0;y<16;y+=5){r(6,'#17181c',0,y,16,2);r(6,'#676970',2,y,2,3);}
 }else{
  r(0,'#25251f',0,0,16,4);r(0,'#e6ead9',2,6,3,2);r(0,'#e6ead9',11,6,3,2);r(0,'#427940',3,6,2,2);r(0,'#427940',11,6,2,2);r(0,'#664c38',6,11,5,1);
  r(3,'#f2f0e6',5,0,6,7);r(3,'#d21e26',7,1,2,10);r(3,'#d21e26',6,10,4,2);r(5,'#eaece2',0,13,16,2);r(6,'#a3232c',4,14,7,1);r(7,'#eaece2',0,11,16,2);
 }
 const texture=new THREE.CanvasTexture(canvas);texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;texture.generateMipmaps=false;texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export default function playerSkins(name){
 // A shuffled-looking name hash keeps every peer and every respawn consistent.
 let hash=2166136261;for(const ch of name.toLowerCase()){hash^=ch.charCodeAt(0);hash=Math.imul(hash,16777619);}hash^=hash>>>16;hash=Math.imul(hash,0x45d9f3b);hash^=hash>>>16;
 const index=(hash>>>0)%7;return {texture:cache[index]||(cache[index]=index?drawSkin(index):bearSkin()),bear:index===0,hat:index===4||index===6};
}