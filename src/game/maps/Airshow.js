import { B } from '@/game/blocks';
import { M } from '@/game/mapMaterials';
export default function Airshow(g,l){const {fill,local}=g;
 for(const t of l.teams){const put=local(t);for(const x of [-6,6])for(const z of [3,9])for(let y=17;y<=22;y++)put(x,y,z,M.LOG);for(let x=-7;x<=7;x++)for(let z=2;z<=10;z++)put(x,23+Math.max(0,3-Math.abs(x)/2|0),z,(Math.floor((x+7)/2)+Math.floor(z/2))%2?B.RED:B.WHITE);}
 fill(-12,26,-2,12,28,2,B.RED);fill(-7,27,-4,5,28,4,B.RED);fill(-3,28,-14,2,29,14,B.WHITE);fill(-2,30,-2,2,32,2,B.BLUE_GLASS);fill(8,29,-7,11,29,7,B.RED);fill(9,30,-1,11,34,1,B.RED);fill(-14,27,-1,-13,29,1,M.METAL);fill(-15,22,0,-15,34,0,M.SPRUCE);fill(-15,28,-6,-15,28,6,M.SPRUCE);
 for(let z=-10;z<=10;z++)for(let x=-10;x<=10;x++)g.w.set(x,16,z,Math.abs(x)<2&&(z+12)%5<3?B.WHITE:M.ASPHALT);
 for(const [x,z] of l.diamonds){fill(x-4,17,z+3,x+4,17,z+4,B.RED);fill(x-3,18,z+3,x-3,20,z+3,M.LOG);fill(x+3,18,z+3,x+3,20,z+3,M.LOG);}
}