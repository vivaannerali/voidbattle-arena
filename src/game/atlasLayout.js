export const ATLAS_ROWS=19,TILE_PIXELS=16,TILE_STRIDE=20,ATLAS_WIDTH=160,ATLAS_HEIGHT=ATLAS_ROWS*TILE_STRIDE;
export const atlasPosition=tile=>`${tile%8*100/7}% ${Math.floor(tile/8)*100/(ATLAS_ROWS-1)}%`;
export const atlasU=(tile,pixel)=>((tile%8)*TILE_STRIDE+2+pixel)/ATLAS_WIDTH;
export const atlasV=(tile,pixel)=>1-(Math.floor(tile/8)*TILE_STRIDE+2+pixel)/ATLAS_HEIGHT;
export function packAtlas(source){
 const raw=source.getContext('2d').getImageData(0,0,128,ATLAS_ROWS*16).data,canvas=document.createElement('canvas');canvas.width=ATLAS_WIDTH;canvas.height=ATLAS_HEIGHT;
 const context=canvas.getContext('2d'),image=context.createImageData(ATLAS_WIDTH,ATLAS_HEIGHT),out=image.data;
 for(let tile=0;tile<ATLAS_ROWS*8;tile++)for(let y=-2;y<18;y++)for(let x=-2;x<18;x++){
  const sx=tile%8*16+Math.max(0,Math.min(15,x)),sy=Math.floor(tile/8)*16+Math.max(0,Math.min(15,y)),a=(sy*128+sx)*4,b=((Math.floor(tile/8)*20+y+2)*160+tile%8*20+x+2)*4;
  out[b]=raw[a];out[b+1]=raw[a+1];out[b+2]=raw[a+2];out[b+3]=raw[a+3];
 }
 context.putImageData(image,0,0);return {canvas,pixels:raw};
}