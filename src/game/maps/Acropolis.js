import { M } from '@/game/mapMaterials';
export default function Acropolis(g,l){const {fill,disc,local}=g;
 for(let y=17;y<=20;y++)disc(0,0,Math.max(3,14-(y-17)*3),y,M.QUARTZ);
 for(const x of [-9,9])for(const z of [-10,10]){fill(x-1,17,z-1,x+1,18,z+1,M.QUARTZ);fill(x,19,z,x,27,z,M.QUARTZ);fill(x-1,28,z-1,x+1,28,z+1,M.QUARTZ);}
 fill(-11,29,-12,11,29,12,M.BRICK);for(let tier=0;tier<4;tier++)fill(-12+tier,30+tier,-13+tier,12-tier,30+tier,13-tier,M.QUARTZ);
 for(const t of l.teams){const put=local(t);for(const x of [-7,7]){for(let z=1;z<=9;z++)for(let y=17;y<=16+Math.min(6,z);y++)put(x,y,z,M.BRICK);for(let y=23;y<=29;y++)put(x,y,9,M.QUARTZ);}for(let x=-8;x<=8;x++)for(let z=8;z<=10;z++)put(x,30,z,M.QUARTZ);}
 for(const [x,z] of l.diamonds){fill(x-3,17,z+3,x-3,23,z+3,M.QUARTZ);fill(x+3,17,z+3,x+3,21,z+3,M.QUARTZ);fill(x-4,24,z+2,x-2,24,z+4,M.BRICK);}
}