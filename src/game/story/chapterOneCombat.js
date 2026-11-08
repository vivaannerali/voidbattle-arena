import { botCombat } from '@/game/botCombat';
import { spawnChapterGuardian,safeChapterSpawn } from '@/game/story/chapterOneSetup';
export default function tickChapterCombat(c){
 const d=c.d,m=d.e.match,a=m.players[1],p=a.body,brain=a.bot,input=a.control;input.clear();
 if(c.ending){input.sneak=true;p.pitch=-.65;a.hitAge=a.regen=0;return;}if(d.stage!=='gameplay')return;
 p.speedMultiplier=c.phase==='rage'?c.balance.rage:1;
 if(m.clock<c.stunnedUntil)return;
 const distance=Math.hypot(p.x-.5,p.z-34.5),rush=m.clock>=c.nextBedAttempt&&(m.clock%600<180||distance<2.2);
 if(rush&&distance<2.2){c.bedProgress=Math.min(1,c.bedProgress+1/300);a.swingTicks=12;p.yaw=Math.atan2(p.x-.5,p.z-34.5);p.pitch=-.7;
  if(c.bedProgress>=1){c.interrupt();safeChapterSpawn(p,3.5,29.5);d.e.interaction.message('The Emperor’s bed is protected. AKD23 is repelled!');}return;
 }
 c.bedProgress=0;
 if(!rush&&botCombat(brain,0))return;
 const target=rush?{x:1.8,z:34.5}:m.players[0].body,dx=target.x-p.x,dz=target.z-p.z,length=Math.hypot(dx,dz)||1;
 p.yaw=Math.atan2(-dx,-dz);input.forward=length>.8;input.sprint=true;const nx=p.x+dx/length*.6,nz=p.z+dz/length*.6;
 input.jump=p.grounded&&p.collides(nx,p.y,nz)&&!p.collides(nx,p.y+1,nz);brain.guardEdges();
}
export function recoverChapterBoss(c,dt){
 const d=c.d,m=d.e.match,a=m.players[1],p=a.body;if(p.y<0){safeChapterSpawn(p,3.5,29.5);c.stuck=0;}
 const player=m.players[0].body,moving=!c.bedProgress&&m.clock>=c.stunnedUntil&&Math.hypot(player.x-p.x,player.z-p.z)>2.2;
 if(Math.hypot(p.x-c.stuckX,p.z-c.stuckZ)>.1||!moving){c.stuck=0;c.stuckX=p.x;c.stuckZ=p.z;}else c.stuck+=dt;
 if(c.stuck>=3){const nearby=Math.hypot(player.x,player.z-34)<10;safeChapterSpawn(p,nearby?player.x+2.5:3.5,nearby?player.z-2:29.5);c.stuck=0;}
 if(c.guardian?.health>0&&!m.companions.entries.has(c.guardian.id))spawnChapterGuardian(c,c.guardian.health);
 if(c.guardian){const g=c.guardian,b=g.body,blocked=g.move&&Math.hypot(b.x-b.px,b.z-b.pz)<.001;g.storyStuck=blocked?(g.storyStuck||0)+dt:0;if(b.y<0||g.storyStuck>=3){safeChapterSpawn(b,-3.5,29.5);g.storyStuck=0;}}
 if(d.elapsed-c.lastProgress>=60){d.hint=c.phase==='guardian'?'Strike the golem before AKD23. Stay just outside its short reach, sidestep its launch attack, and hold right-click with a Golden Apple to heal.':'AKD23 is faster now. Strike him to interrupt bed breaking; strafe, then hit between his attacks. Return to Yellow island if he cannot reach you.';
  if(d.elapsed>=c.recoveryAt){d.cacheResources();c.recoveryAt=d.elapsed+60;}
 }
}