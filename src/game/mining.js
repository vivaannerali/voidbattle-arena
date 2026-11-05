import { B,bed,isGlass,isLadder,isWool,isClay } from '@/game/blocks';
export function miningSeconds(block,tool){if(bed(block))return .65;const pick=tool>=50&&tool<=53?tool-50:-1,axe=tool>=54&&tool<=57?tool-54:-1;
 if(isWool(block))return tool===58?.12:.9;
 if(block===B.OAK)return axe>=0?[1.3,.75,.45,.25][axe]:3;
 if(block===B.OBSIDIAN)return pick>=0?[35,20,30,4][pick]:50;
 if(block===B.END)return pick>=0?[1.8,.95,.7,.5][pick]:6;
 if(isClay(block))return pick>=0?[1.2,.7,.4,.3][pick]:2.5;
 if(isGlass(block))return .3;if(isLadder(block))return axe>=0?.15:.4;return pick>=0?.4:1.5;
}