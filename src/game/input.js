const CODES={KeyW:0,KeyA:1,KeyS:2,KeyD:3,Space:4,ShiftLeft:5,ShiftRight:6,ControlLeft:7};
export default class Input {
 constructor(canvas,player,onLock,onSlot,onDebug,onInventory,onTab){this.canvas=canvas;this.keys=new Uint8Array(8);this.active=false;this.left=false;this.right=false;this.rightPressed=0;this.attackPresses=0;this.sprint=false;this.lastW=-9999;this.sensitivity=.002;this.handlers=[];this.inventoryOpen=false;this.tabHeld=false;
  this.listen(document,'pointerlockchange',()=>{this.active=document.pointerLockElement===canvas;if(!this.active)this.clear();onLock(this.active);});
  this.listen(document,'keydown',e=>{if(e.defaultPrevented)return;if(this.chatOpen){if(e.code==='Escape'&&!e.repeat){e.preventDefault();this.closeGui?.();}return;}if(e.code==='KeyT'&&!e.repeat&&this.active){e.preventDefault();this.onChat?.();return;}if(e.code==='KeyE'&&!e.repeat&&(this.active||this.inventoryOpen)){e.preventDefault();onInventory();return;}if(e.code==='Escape'&&!e.repeat&&(this.inventoryOpen||this.hasGui?.())){e.preventDefault();(this.closeGui||onInventory)();return;}if(e.code==='Tab'&&(this.active||this.inventoryOpen)){e.preventDefault();this.tabHeld=true;onTab();return;}if(e.code==='F3'){e.preventDefault();onDebug();return;}if(!this.active)return;if(e.code==='Escape'){e.preventDefault();document.exitPointerLock();return;}if(e.code in CODES){e.preventDefault();this.keys[CODES[e.code]]=1;}if(e.code==='KeyW'&&!e.repeat){const now=performance.now();if(now-this.lastW<270)this.sprint=true;this.lastW=now;}if(e.code.startsWith('Digit')){const n=Number(e.code.slice(5));if(n>=1&&n<=9)onSlot(n-1,false);}});
  this.listen(document,'keyup',e=>{if(e.code==='Tab'){e.preventDefault();this.tabHeld=false;onTab();}if(e.code in CODES)this.keys[CODES[e.code]]=0;});
  this.listen(document,'mousemove',e=>{if(!this.active)return;player.yaw-=e.movementX*this.sensitivity;player.pitch=Math.max(-Math.PI/2+.001,Math.min(Math.PI/2-.001,player.pitch-e.movementY*this.sensitivity));});
  this.listen(canvas,'mousedown',e=>{if(!this.active)return;if(e.button===0){this.left=true;this.attackPresses=Math.min(32,this.attackPresses+1);}if(e.button===2){this.right=true;this.rightPressed=1;}});
  this.listen(document,'mouseup',e=>{if(e.button===0)this.left=false;if(e.button===2)this.right=false;});
  this.listen(canvas,'wheel',e=>{if(!this.active)return;e.preventDefault();onSlot(e.deltaY>0?1:-1,true);},{passive:false});
  this.listen(document,'pointerlockerror',()=>this.onLockError?.());this.listen(canvas,'contextmenu',e=>e.preventDefault());this.listen(window,'blur',()=>{this.clear();if(this.active)document.exitPointerLock();});
 }
 listen(target,event,fn,options){target.addEventListener(event,fn,options);this.handlers.push([target,event,fn,options]);}
 down(code){return this.keys[CODES[code]]===1;}
 clear(){this.keys.fill(0);this.left=this.right=this.sprint=false;this.attackPresses=0;this.rightPressed=0;this.tabHeld=false;}
 lock(){return this.canvas.requestPointerLock();}
 dispose(){for(const h of this.handlers)h[0].removeEventListener(h[1],h[2],h[3]);if(this.active)document.exitPointerLock();}
}