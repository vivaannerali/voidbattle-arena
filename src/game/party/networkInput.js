const CODES={KeyW:0,KeyA:1,KeyS:2,KeyD:3,Space:4,ShiftLeft:5,ShiftRight:6,ControlLeft:7};
export default class NetworkInput {
 constructor(){this.keys=new Uint8Array(8);this.active=false;this.sprint=false;this.left=false;this.right=false;this.attackPresses=0;this.rightPressed=0;this.lastAt=0;}
 down(code){return this.keys[CODES[code]]===1;}
 clear(){this.keys.fill(0);this.left=this.right=this.sprint=false;this.attackPresses=this.rightPressed=0;}
 apply(data,body,interaction){if(!Array.isArray(data.keys)||data.keys.length!==8||!Number.isFinite(data.yaw)||!Number.isFinite(data.pitch))return;this.lastAt=performance.now();this.active=!!data.active;for(let i=0;i<8;i++)this.keys[i]=this.active&&data.keys[i]?1:0;this.left=this.active&&!!data.left;this.right=this.active&&!!data.right;this.sprint=this.active&&!!data.sprint;this.attackPresses=Math.min(4,this.attackPresses+(this.active?Math.min(2,Math.max(0,Math.floor(data.attacks)||0)):0));this.rightPressed=this.active&&data.rightPressed?1:0;body.yaw=data.yaw%(Math.PI*2);body.pitch=Math.max(-Math.PI/2+.001,Math.min(Math.PI/2-.001,data.pitch));if(Number.isInteger(data.slot)&&data.slot>=0&&data.slot<9)interaction.slot=data.slot;}
}