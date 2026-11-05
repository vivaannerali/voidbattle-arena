import * as THREE from 'three';
import { TEAMS } from '@/game/map';
import GeneratorHologram from '@/game/generatorHologram';
const shopPositions=()=>TEAMS.map(team=>({x:team.x-4*Math.cos(team.rotation)+6*Math.sin(team.rotation)+.5,y:17,z:team.z+4*Math.sin(team.rotation)+6*Math.cos(team.rotation)+.5}));

const upgradePositions=()=>TEAMS.map(team=>({x:team.x+4*Math.cos(team.rotation)+6*Math.sin(team.rotation)+.5,y:17,z:team.z-4*Math.sin(team.rotation)+6*Math.cos(team.rotation)+.5}));
// Both existing villagers reuse one interaction and billboard implementation.
export default class ShopNPCs {
 constructor(scene,texture,kind='items'){this.positions=kind==='upgrades'?upgradePositions():shopPositions();this.targetDistance=Infinity;this.scene=scene;this.ray=new THREE.Ray();this.box=new THREE.Box3();this.point=new THREE.Vector3();this.labels=this.positions.map(p=>{const label=new GeneratorHologram(scene,texture,p.x,20.4,p.z);label.setLines(kind==='upgrades'?'TEAM UPGRADES':'ITEM SHOP','RIGHT CLICK','',0x55ffff);return label;});}
 target(player,block){const cp=Math.cos(player.pitch);this.ray.origin.set(player.x,player.y+player.eyeHeight,player.z);this.ray.direction.set(-Math.sin(player.yaw)*cp,Math.sin(player.pitch),-Math.cos(player.yaw)*cp);let distance=block.valid?Math.min(4.5,block.distance):4.5,target=-1;for(let i=0;i<this.positions.length;i++){const p=this.positions[i];this.box.min.set(p.x-.44,p.y,p.z-.44);this.box.max.set(p.x+.44,p.y+1.96,p.z+.44);if(this.ray.intersectBox(this.box,this.point)){const d=this.ray.origin.distanceTo(this.point);if(d<distance){distance=d;target=i;}}}this.targetDistance=target>=0?distance:Infinity;return target;}
 inReach(player,team){const p=this.positions[team];return !!p&&Math.hypot(player.x-p.x,player.y-p.y,player.z-p.z)<=5;}
 overlaps(x,y,z){for(let i=0;i<this.positions.length;i++){const p=this.positions[i];if(x+1>p.x-.4&&x<p.x+.4&&z+1>p.z-.4&&z<p.z+.4&&y+1>p.y&&y<p.y+2)return true;}return false;}
 render(camera){for(let i=0;i<this.positions.length;i++)this.labels[i].render(camera);}
 dispose(){for(const label of this.labels)label.dispose(this.scene);}
}