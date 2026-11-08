import * as THREE from 'three';
const curve=points=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.25);
export default class StoryScenes {
 constructor(director,steps,done){this.d=director;this.steps=steps;this.done=done;this.index=-1;this.position=new THREE.Vector3();this.target=new THREE.Vector3();this.sequence=0;this.next();}
 next(){this.index++;this.age=0;this.lineIndex=0;this.revealed=false;this.sequence++;this.step=this.steps[this.index];if(!this.step){this.done();return;}if(this.step.path){this.path=curve(this.step.path);this.look=curve(this.step.look);}for(const walk of this.step.walks||[])this.d.actors.walk(walk.index,walk.points);this.say();}
 say(){const line=this.step?.lines?.[this.lineIndex];if(line?.important)this.d.say(line.speaker==='EPHIRISI'?0:line.speaker==='LARP108'?2:1,line.text);}
 advance(){if(this.step?.kind!=='dialogue')return;const line=this.step.lines[this.lineIndex];if(!this.revealed&&this.age<line.text.length/36){this.revealed=true;return;}this.lineIndex++;this.age=0;this.revealed=false;this.sequence++;if(this.lineIndex>=this.step.lines.length)this.next();else this.say();}
 update(dt){if(!this.step)return;this.age+=dt;if(this.step.kind==='dialogue'){const line=this.step.lines[this.lineIndex];if(this.age>Math.max(14,line.text.length/20+8)){this.revealed=true;this.advance();}}else if(this.age>=Math.min(20,this.step.duration||6))this.next();}
 render(camera){if(!this.step)return;if(this.step.kind==='shot'){const f=Math.max(0,Math.min(1,this.age/this.step.duration)),t=f*f*(3-2*f);this.path.getPoint(t,this.position);this.look.getPoint(t,this.target);}camera.position.copy(this.position);camera.lookAt(this.target);}
 snapshot(){const s=this.step;if(!s)return null;return {kind:s.kind,narrator:s.narrator,title:s.title,subtitle:s.subtitle,fade:s.kind==='title'?Math.min(1,this.age/.8,(s.duration-this.age)/.8):1,dialogue:s.kind==='dialogue'?{...s.lines[this.lineIndex],id:this.sequence,revealed:this.revealed}:null};}
 skip(){this.index=this.steps.length;this.step=null;this.done();}
}