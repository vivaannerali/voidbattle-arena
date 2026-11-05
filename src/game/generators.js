import { TEAMS,DIAMOND_ISLANDS,EMERALD_ISLANDS } from '@/game/map';
import DroppedItems from '@/game/droppedItems';
import GeneratorHologram from '@/game/generatorHologram';

export default class Generators {
 constructor(scene,material,texture,match){this.match=match;this.scene=scene;this.drops=new DroppedItems(scene,material);this.entries=[];this.labels=[];
  for(let t=0;t<TEAMS.length;t++){const team=TEAMS[t],sin=Math.sin(team.rotation),cos=Math.cos(team.rotation);for(let r=0;r<2;r++){const localX=r===0?-.26:.26,x=team.x+localX*cos+6.5*sin+.5,z=team.z-localX*sin+6.5*cos+.5;this.entries.push({id:40+r,x,y:17.14,z,team:t,interval:r===0?60:480,remaining:r===0?60:480,cap:r===0?48:16,tier:1,label:null});}}
  for(const [points,emerald] of [[DIAMOND_ISLANDS,false],[EMERALD_ISLANDS,true]])for(const p of points){const label=new GeneratorHologram(scene,texture,p[0]+.5,20.3,p[1]+.5),interval=emerald?3600:1800;this.entries.push({id:emerald?43:42,x:p[0]+.5,y:17.14,z:p[1]+.5,team:-1,interval,remaining:interval,cap:emerald?2:4,tier:1,label});this.labels.push(label);}
 }
 tick(){for(let i=0;i<this.entries.length;i++){const g=this.entries[i];if(g.team>=0&&TEAMS[g.team].active===false)continue;if(g.remaining>0)g.remaining--;if(g.remaining===0&&this.drops.atGenerator(i)<g.cap){this.drops.spawn(g.id,1,g.x,g.y,g.z,i);g.remaining=g.interval;}}this.drops.pickup(this.match.players);}
 upgrade(id,tier){const seconds=id===42?[30,20,12][tier-1]:[60,40,24][tier-1];for(let i=0;i<this.entries.length;i++){const g=this.entries[i];if(g.id!==id||g.team>=0)continue;g.tier=tier;g.interval=seconds*60;g.remaining=Math.min(g.remaining,g.interval);}}
 applyForge(team,tier){const factor=[1,1.5,2,2,3][tier];let emerald=null;for(let i=0;i<this.entries.length;i++){const g=this.entries[i];if(g.team!==team)continue;if(g.id===43){emerald=g;continue;}g.interval=Math.round((g.id===40?60:480)/factor);g.remaining=Math.min(g.remaining,g.interval);}if(tier>=3){const interval=tier===4?2400:3600;if(emerald){emerald.interval=interval;emerald.remaining=Math.min(emerald.remaining,interval);}else{const base=TEAMS[team];this.entries.push({id:43,x:base.x+6.1*Math.sin(base.rotation)+.5,y:17.14,z:base.z+6.1*Math.cos(base.rotation)+.5,team,interval,remaining:interval,cap:2,tier:1,label:null});}}}
 updateLabels(){for(let i=TEAMS.length*2;i<this.entries.length;i++){const g=this.entries[i];if(!g.label)continue;g.label.update(g.id===42?'DIAMOND':'EMERALD',g.tier,Math.ceil(g.remaining/60),this.drops.atGenerator(i)>=g.cap,g.id===42?0x64e6ef:0x72ec91);}}
 transfer(victim,killer){this.drops.transfer(victim,killer);}
 render(camera,time){this.drops.render(time);for(let i=0;i<this.labels.length;i++)this.labels[i].render(camera);}
 dispose(){this.drops.dispose(this.scene);for(const label of this.labels)label.dispose(this.scene);}
}