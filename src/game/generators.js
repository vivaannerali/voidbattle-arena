import { TEAMS } from '@/game/map';
import DroppedItems from '@/game/droppedItems';
import GeneratorHologram from '@/game/generatorHologram';

export default class Generators {
 constructor(scene,material,texture,match){this.match=match;this.scene=scene;this.drops=new DroppedItems(scene,material);this.entries=[];this.labels=[];
  for(let t=0;t<4;t++){const team=TEAMS[t],sin=Math.sin(team.rotation),cos=Math.cos(team.rotation);for(let r=0;r<2;r++){const localX=r===0?-.26:.26,x=team.x+localX*cos+6.5*sin+.5,z=team.z-localX*sin+6.5*cos+.5;this.entries.push({id:40+r,x,y:17.14,z,team:t,interval:r===0?60:480,remaining:r===0?60:480,cap:r===0?48:16,tier:1,label:null});}}
  for(const p of [[-27,27],[-27,-27],[27,-27],[27,27],[0,-7],[0,7]]){const emerald=this.entries.length>=12,label=new GeneratorHologram(scene,texture,p[0]+.5,20.3,p[1]+.5),interval=emerald?3600:1800;this.entries.push({id:emerald?43:42,x:p[0]+.5,y:17.14,z:p[1]+.5,team:-1,interval,remaining:interval,cap:emerald?2:4,tier:1,label});this.labels.push(label);}
 }
 tick(){for(let i=0;i<this.entries.length;i++){const g=this.entries[i];if(g.remaining>0)g.remaining--;if(g.remaining===0&&this.drops.atGenerator(i)<g.cap){this.drops.spawn(g.id,1,g.x,g.y,g.z,i);g.remaining=g.interval;}}this.drops.pickup(this.match.players);}
 upgrade(id,tier){const seconds=id===42?[30,20,12][tier-1]:[60,40,24][tier-1];for(let i=0;i<this.entries.length;i++){const g=this.entries[i];if(g.id!==id)continue;g.tier=tier;g.interval=seconds*60;g.remaining=Math.min(g.remaining,g.interval);}}
 updateLabels(){for(let i=8;i<this.entries.length;i++){const g=this.entries[i];g.label.update(g.id===42?'DIAMOND':'EMERALD',g.tier,Math.ceil(g.remaining/60),this.drops.atGenerator(i)>=g.cap,g.id===42?0x64e6ef:0x72ec91);}}
 transfer(victim,killer){this.drops.transfer(victim,killer);}
 render(camera,time){this.drops.render(time);for(let i=0;i<this.labels.length;i++)this.labels[i].render(camera);}
 dispose(){this.drops.dispose(this.scene);for(const label of this.labels)label.dispose(this.scene);}
}