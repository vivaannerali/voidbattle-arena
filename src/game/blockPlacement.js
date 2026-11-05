import { BUILD_HEIGHT,isBlock,bed } from '@/game/blocks';
export default function canPlaceBlock(world,body,match,x,y,z,id){
 if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(z)||y<0||y>=BUILD_HEIGHT||!world.valid(x,y,z)||!isBlock(id)||bed(id)||world.get(x,y,z))return false;
 if(body.overlaps(x,y,z)||match?.overlaps(x,y,z)||match?.interaction.shops?.overlaps(x,y,z)||match?.interaction.upgradesNPCs?.overlaps(x,y,z))return false;
 return !!(world.get(x+1,y,z)||world.get(x-1,y,z)||world.get(x,y+1,z)||world.get(x,y-1,z)||world.get(x,y,z+1)||world.get(x,y,z-1));
}