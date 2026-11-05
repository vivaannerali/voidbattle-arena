export const B = Object.freeze({ AIR:0, GRASS:1, DIRT:2, STONE:3, RED:4, BLUE:5, GREEN:6, YELLOW:7, WHITE:8, RED_CLAY:9, BLUE_CLAY:10, GREEN_CLAY:11, YELLOW_CLAY:12, END:13, OAK:14, OBSIDIAN:15, GLASS:16, BED_FOOT:17, BED_HEAD:18, RED_GLASS:19, BLUE_GLASS:20, GREEN_GLASS:21, YELLOW_GLASS:22, LADDER:23, LADDER_WEST:24, LADDER_SOUTH:25, LADDER_NORTH:26, AQUA:27, PINK:28, GREY:29, AQUA_CLAY:96, WHITE_CLAY:97, PINK_CLAY:98, GREY_CLAY:99, AQUA_GLASS:100, WHITE_GLASS:101, PINK_GLASS:102, GREY_GLASS:103 });
export const NAMES = ['', 'Grass', 'Dirt', 'Stone', 'Red wool', 'Blue wool', 'Green wool', 'Yellow wool', 'White wool', 'Red clay', 'Blue clay', 'Green clay', 'Yellow clay', 'End stone', 'Oak planks', 'Obsidian', 'Glass', 'Bed', 'Bed', 'Red blast-proof glass', 'Blue blast-proof glass', 'Green blast-proof glass', 'Yellow blast-proof glass', 'Ladder', 'Ladder', 'Ladder', 'Ladder'];
Object.assign(NAMES,{27:'Aqua wool',28:'Pink wool',29:'Grey wool',96:'Aqua clay',97:'White clay',98:'Pink clay',99:'Grey clay',100:'Aqua blast-proof glass',101:'White blast-proof glass',102:'Pink blast-proof glass',103:'Grey blast-proof glass'});
export const TEAM_COLORS = [0xcb4e50,0x4b78bf,0x69a45a,0xe2c34f,0x55ced6,0xeeeae4,0xdf83b7,0x999da5];
export function isBlock(id){return id>=1&&id<=29||id>=96&&id<=103;}
export function isWool(id){return id>=B.RED&&id<=B.WHITE||id>=B.AQUA&&id<=B.GREY;}
export function isClay(id){return id>=B.RED_CLAY&&id<=B.YELLOW_CLAY||id>=B.AQUA_CLAY&&id<=B.GREY_CLAY;}
export const SPAWN = Object.freeze({x:0.5,y:17.001,z:52.5});
export const BUILD_HEIGHT = 40;
export const TILE_COUNT = 128;
export const ATLAS_SIZE = 128;
export const DIRS = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
export const CORNERS = [
 [1,0,1, 1,0,0, 1,1,0, 1,1,1], [0,0,0, 0,0,1, 0,1,1, 0,1,0],
 [0,1,1, 1,1,1, 1,1,0, 0,1,0], [0,0,0, 1,0,0, 1,0,1, 0,0,1],
 [0,0,1, 1,0,1, 1,1,1, 0,1,1], [1,0,0, 0,0,0, 0,1,0, 1,1,0]
];
export const TRI = [0,1,2,0,2,3];
export const SHADE = [0.80,0.80,1,0.48,0.68,0.68];
export function tileFor(id,face) {
 if(id===B.GRASS) return face===2 ? 0 : face===3 ? 1 : 2;
 if(id===B.DIRT) return 1;
 if(id===B.STONE) return 3;
 if(id>=B.RED_GLASS&&id<=B.YELLOW_GLASS)return 64+id-B.RED_GLASS;
 if(id>=B.AQUA&&id<=B.GREY)return 92+id-B.AQUA;
 if(isLadder(id))return 68;
 return id;
}
export function bed(id){return id===B.BED_HEAD || id===B.BED_FOOT;}
export function blockHeight(id){return bed(id) ? 0.5625 : 1;}
export function isGlass(id){return id===B.GLASS||(id>=B.RED_GLASS&&id<=B.YELLOW_GLASS)||(id>=B.AQUA_GLASS&&id<=B.GREY_GLASS);}
export function isLadder(id){return id>=B.LADDER&&id<=B.LADDER_NORTH;}
export function blockX(id,x){return id===B.LADDER?x*.08:id===B.LADDER_WEST?.92+x*.08:x;}
export function blockZ(id,z){return id===B.LADDER_SOUTH?z*.08:id===B.LADDER_NORTH?.92+z*.08:z;}
export function tileUV(tile,corner){const x=tile%8,y=Math.floor(tile/8); return [(x+(corner===1||corner===2?0.998:0.002))/8,1-(y+(corner<2?0.998:0.002))/16];}