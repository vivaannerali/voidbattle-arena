import { BotInput } from '@/game/botMotion';
export default class StoryActors {
 constructor(engine){this.e=engine;this.paths=new Map();for(const player of engine.match.players.slice(1))player.control=new BotInput();}
 walk(index,points){const p=this.e.match.players[index].body;this.paths.set(index,{points,cursor:0,stuck:0,x:p.x,z:p.z});}
 tick(){for(let index=1;index<this.e.match.players.length;index++){const s=this.e.match.players[index],p=s.body,input=s.control;input.clear();const path=this.paths.get(index),point=path?.points[path.cursor];if(!point)continue;const dx=point[0]-p.x,dz=point[2]-p.z;if(Math.hypot(dx,dz)<.25){path.cursor++;continue;}p.yaw=Math.atan2(-dx,-dz);input.forward=true;input.sneak=true;input.jump=point[1]>p.y+.4&&p.grounded;}}
 update(dt){for(const [index,path] of this.paths){const p=this.e.match.players[index].body,point=path.points[path.cursor];if(!point)continue;if(Math.hypot(p.x-path.x,p.z-path.z)>.1){path.stuck=0;path.x=p.x;path.z=p.z;}else path.stuck+=dt;if(path.stuck>=3){p.spawn(...point);path.cursor++;path.stuck=0;}}}
 stop(){this.paths.clear();for(const player of this.e.match.players.slice(1))player.control.clear();}
}