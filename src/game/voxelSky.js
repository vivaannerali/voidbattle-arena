import * as THREE from 'three';
export const HORIZON=0xa3c9e8;
const VERTEX=`varying vec2 screen;void main(){screen=position.xy;gl_Position=vec4(position.xy,1.0,1.0);}`;
const FRAGMENT=`uniform mat4 inverseProjection;uniform mat3 cameraRotation;uniform vec3 horizon;uniform vec3 zenith;uniform vec3 voidColor;varying vec2 screen;
void main(){vec3 ray=normalize(cameraRotation*(inverseProjection*vec4(screen,1.0,1.0)).xyz);float h=ray.y;vec3 color=mix(horizon,zenith,pow(clamp(h,0.0,1.0),0.55));color=mix(color,voidColor,smoothstep(0.0,0.5,-h));vec3 sun=normalize(vec3(-0.34,0.67,-0.65));vec3 side=normalize(cross(sun,vec3(0.0,1.0,0.0)));vec3 up=cross(side,sun);float square=step(abs(dot(ray,side)),0.035)*step(abs(dot(ray,up)),0.035)*step(0.99,dot(ray,sun));color=mix(color,vec3(1.0,0.94,0.74),square);gl_FragColor=vec4(color,1.0);
#include <colorspace_fragment>
}`;
export default class VoxelSky{
 constructor(scene,camera){this.scene=scene;this.rotation=new THREE.Matrix3();this.material=new THREE.ShaderMaterial({depthWrite:false,depthTest:false,fog:false,uniforms:{inverseProjection:{value:camera.projectionMatrixInverse},cameraRotation:{value:this.rotation},horizon:{value:new THREE.Color(HORIZON)},zenith:{value:new THREE.Color(0x4c83d4)},voidColor:{value:new THREE.Color(0x101824)}},vertexShader:VERTEX,fragmentShader:FRAGMENT});this.mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),this.material);this.mesh.frustumCulled=false;this.mesh.renderOrder=-10000;scene.add(this.mesh);
  this.cloudMaterial=new THREE.MeshBasicMaterial({color:0xf2f3f0,transparent:true,opacity:.72,depthWrite:false,fog:true});this.clouds=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),this.cloudMaterial,48);this.clouds.frustumCulled=false;const m=new THREE.Matrix4();for(let i=0;i<48;i++){m.makeScale(15+(i%4)*6,1.5,12+(i%3)*5);m.setPosition((i%8-4)*64,128,(Math.floor(i/8)-3)*64);this.clouds.setMatrixAt(i,m);}scene.add(this.clouds);this.cloudsEnabled=true;this.fancy=true;
 }
 configure(clouds,fancy){this.cloudsEnabled=clouds==='On';if(this.fancy!==fancy){this.fancy=fancy;this.cloudMaterial.transparent=fancy;this.cloudMaterial.opacity=fancy?.72:1;this.cloudMaterial.depthWrite=!fancy;this.cloudMaterial.needsUpdate=true;}}
 render(camera,time,blind){camera.updateMatrixWorld();this.rotation.setFromMatrix4(camera.matrixWorld);this.mesh.visible=!blind;this.clouds.visible=this.cloudsEnabled&&!blind;this.clouds.position.x=(time*.35)%128-64;}
 dispose(){this.scene.remove(this.mesh,this.clouds);this.mesh.geometry.dispose();this.material.dispose();this.clouds.geometry.dispose();this.cloudMaterial.dispose();this.clouds.dispose();}
}