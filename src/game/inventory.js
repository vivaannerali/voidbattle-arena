import { isSword } from '@/game/equipment';
export const RESOURCE_IDS=[40,41,42,43];
export function isResource(id){return id>=40&&id<=43;}
export function stackLimit(id){return isSword(id)?1:64;}

// Slot 0–8 is the hotbar; 9–35 is the three-row inventory. Never React state.
export default class Inventory {
 constructor(starter=false){this.ids=new Uint8Array(36);this.counts=new Uint16Array(36);this.hotbarIds=this.ids.subarray(0,9);this.hotbarCounts=this.counts.subarray(0,9);this.revision=0;if(starter)for(let i=1;i<=4;i++){this.ids[i]=31+i;this.counts[i]=1;}}
 add(id,amount){if(!id||amount<=0)return amount;const cap=stackLimit(id);for(let i=0;i<36&&amount>0;i++){if(this.ids[i]!==id||this.counts[i]>=cap)continue;const n=Math.min(amount,cap-this.counts[i]);this.counts[i]+=n;amount-=n;this.revision++;}for(let i=0;i<36&&amount>0;i++){if(this.counts[i])continue;const n=Math.min(cap,amount);this.ids[i]=id;this.counts[i]=n;amount-=n;this.revision++;}return amount;}
 total(id){let amount=0;for(let i=0;i<36;i++)if(this.ids[i]===id)amount+=this.counts[i];return amount;}
 move(from,to){if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=36||to<0||to>=36||from===to||!this.counts[from])return;const id=this.ids[from],amount=this.counts[from];if(this.ids[to]===id&&this.counts[to]){const n=Math.min(amount,stackLimit(id)-this.counts[to]);this.counts[to]+=n;this.counts[from]-=n;if(!this.counts[from])this.ids[from]=0;}else{this.ids[from]=this.ids[to];this.counts[from]=this.counts[to];this.ids[to]=id;this.counts[to]=amount;}this.revision++;}
 consume(slot,amount=1){if(this.counts[slot]<amount)return false;this.counts[slot]-=amount;if(!this.counts[slot])this.ids[slot]=0;this.revision++;return true;}
}