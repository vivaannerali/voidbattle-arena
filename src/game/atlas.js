import * as THREE from 'three';
import { ATLAS_SIZE } from '@/game/blocks';

export function createAtlas(){
 const canvas=document.createElement('canvas'); canvas.width=canvas.height=ATLAS_SIZE;
 const c=canvas.getContext('2d'); c.imageSmoothingEnabled=false;
 const base=['#689b41','#856344','#709347','#85868a','#b84145','#426fba','#619641','#d9bd40','#dfdfd9','#995350','#5b719a','#658452','#b9a15d','#d8dba4','#b7955f','#292238','#b5dfdf','#b63d42','#c14448','#ad866b','#5c827b','#463e4b','#53d6e1','#4bc486'];
 let seed=38291; const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let t=0;t<24;t++){
  const ox=(t%8)*16,oy=Math.floor(t/8)*16; c.fillStyle=base[t];c.fillRect(ox,oy,16,16);
  for(let p=0;p<110;p++){const x=random()*16|0,y=random()*16|0;c.fillStyle=random()>.5?'rgba(255,255,255,.09)':'rgba(0,0,0,.10)';c.fillRect(ox+x,oy+y,t===15?3:1,t===15?2:1);}
  if(t===2){c.fillStyle='#856344';c.fillRect(ox,oy+5,16,11);for(let x=0;x<16;x++){c.fillStyle=x%3?'#689b41':'#5b8c38';c.fillRect(ox+x,oy,1,4+(x*7%4));}}
  if(t>=4&&t<=8){for(let y=0;y<16;y+=2)for(let x=0;x<16;x+=2){c.fillStyle=(x+y)%4?'#ffffff0b':'#00000012';c.fillRect(ox+x,oy+y,1,1);}}
  if(t===14){c.fillStyle='#634729';for(let y=3;y<16;y+=4)c.fillRect(ox,oy+y,16,1);c.fillRect(ox+6,oy,1,3);c.fillRect(ox+12,oy+4,1,3);c.fillRect(ox+3,oy+8,1,3);}
  if(t===16){c.clearRect(ox,oy,16,16);c.strokeStyle='#b7e3e5';c.lineWidth=1;c.strokeRect(ox+.5,oy+.5,15,15);c.fillStyle='#d3f3f0';for(let p=2;p<12;p++){c.fillRect(ox+p,oy+14-p,1,1);if(p<7)c.fillRect(ox+p+4,oy+14-p,1,1);}}
  if(t===17||t===18){c.fillStyle='#775535';c.fillRect(ox,oy+12,16,4);c.fillStyle='#7f292d';c.fillRect(ox,oy+10,16,2);if(t===18){c.fillStyle='#eee8d9';c.fillRect(ox+1,oy+1,14,6);c.fillStyle='#d6d0c5';c.fillRect(ox+1,oy+6,14,1);}}
  if(t===19){c.fillStyle='#3e2d25';c.fillRect(ox,oy,16,4);c.fillStyle='#e4d0ad';c.fillRect(ox+3,oy+6,3,2);c.fillRect(ox+10,oy+6,3,2);c.fillStyle='#343a31';c.fillRect(ox+4,oy+6,2,2);c.fillRect(ox+10,oy+6,2,2);c.fillStyle='#8e6045';c.fillRect(ox+7,oy+8,3,4);}
 }
 for(let stage=0;stage<10;stage++){const t=32+stage,ox=t%8*16,oy=(t/8|0)*16;c.clearRect(ox,oy,16,16);c.strokeStyle='#151719';c.lineWidth=1;for(let j=0;j<stage+2;j++){c.beginPath();c.moveTo(ox+8,oy+8);let x=8,y=8;for(let n=0;n<4;n++){x+=(random()-.5)*7;y+=(random()-.5)*7;c.lineTo(ox+Math.max(0,Math.min(15,x|0)),oy+Math.max(0,Math.min(15,y|0)));}c.stroke();}}
 for(let i=0;i<2;i++){const t=24+i,ox=t%8*16,oy=(t/8|0)*16;c.fillStyle='#273432';c.fillRect(ox,oy,16,16);c.font='bold 5px monospace';c.textAlign='center';c.fillStyle=i?'#94ddcf':'#f1d48d';c.fillText(i?'TEAM':'ITEM',ox+8,oy+6);c.fillText(i?'UPGR.':'SHOP',ox+8,oy+12);}
 const texture=new THREE.CanvasTexture(canvas);texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;texture.generateMipmaps=false;texture.colorSpace=THREE.SRGBColorSpace;
 return {texture,url:canvas.toDataURL()};
}