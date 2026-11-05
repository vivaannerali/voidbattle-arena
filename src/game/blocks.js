export const B = Object.freeze({ AIR:0, GRASS:1, DIRT:2, STONE:3, RED:4, BLUE:5, GREEN:6, YELLOW:7, WHITE:8, RED_CLAY:9, BLUE_CLAY:10, GREEN_CLAY:11, YELLOW_CLAY:12, END:13, OAK:14, OBSIDIAN:15, GLASS:16, BED_FOOT:17, BED_HEAD:18 });
export const NAMES = ['', 'Grass', 'Dirt', 'Stone', 'Red wool', 'Blue wool', 'Green wool', 'Yellow wool', 'White wool', 'Red clay', 'Blue clay', 'Green clay', 'Yellow clay', 'End stone', 'Oak planks', 'Obsidian', 'Glass', 'Bed', 'Bed'];
export const TEAM_COLORS = [0xcb4e50,0x4b78bf,0x69a45a,0xe2c34f];
export const SPAWN = Object.freeze({x:0.5,y:17.001,z:52.5});
export const BUILD_HEIGHT = 40;
export const TILE_COUNT = 64;
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
 return id;
}
export function bed(id){return id===B.BED_HEAD || id===B.BED_FOOT;}
export function blockHeight(id){return bed(id) ? 0.5625 : 1;}
export function tileUV(tile,corner){const x=tile%8,y=Math.floor(tile/8); return [(x+(corner===1||corner===2?0.998:0.002))/8,1-(y+(corner<2?0.998:0.002))/8];}