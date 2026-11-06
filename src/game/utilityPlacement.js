import { BUILD_HEIGHT } from '@/game/blocks';
export default function utilityPlacement(match,x,y,z){
 const w=match.world;
 return y>=0&&y<BUILD_HEIGHT&&w.valid(x,y,z)&&!w.get(x,y,z)&&!match.overlaps(x,y,z)&&!match.interaction.shops?.overlaps(x,y,z)&&!match.interaction.upgradesNPCs?.overlaps(x,y,z);
}