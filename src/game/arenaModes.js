import { B } from '@/game/blocks';
export const TEAM_MODES=Object.freeze({Solos:{teams:8,size:1},Duos:{teams:8,size:2},Trios:{teams:4,size:3},Squads:{teams:4,size:4}});
export const TEAM_DEFINITIONS=[
 {name:'RED',wool:B.RED,clay:B.RED_CLAY,glass:B.RED_GLASS},
 {name:'BLUE',wool:B.BLUE,clay:B.BLUE_CLAY,glass:B.BLUE_GLASS},
 {name:'GREEN',wool:B.GREEN,clay:B.GREEN_CLAY,glass:B.GREEN_GLASS},
 {name:'YELLOW',wool:B.YELLOW,clay:B.YELLOW_CLAY,glass:B.YELLOW_GLASS},
 {name:'AQUA',wool:B.AQUA,clay:B.AQUA_CLAY,glass:B.AQUA_GLASS},
 {name:'WHITE',wool:B.WHITE,clay:B.WHITE_CLAY,glass:B.WHITE_GLASS},
 {name:'PINK',wool:B.PINK,clay:B.PINK_CLAY,glass:B.PINK_GLASS},
 {name:'GREY',wool:B.GREY,clay:B.GREY_CLAY,glass:B.GREY_GLASS}
];
export const FOUR_BASES=[[0,51,0],[-51,0,-Math.PI/2],[0,-51,Math.PI],[51,0,Math.PI/2]];
export const EIGHT_BASES=[[0,58,0],[-41,41,-Math.PI/2],[-58,0,-Math.PI/2],[-41,-41,Math.PI],[0,-58,Math.PI],[41,-41,Math.PI/2],[58,0,Math.PI/2],[41,41,0]];
export const FOUR_DIAMONDS=[[-27,27],[-27,-27],[27,-27],[27,27]];
export const EIGHT_DIAMONDS=[[-18,43],[-43,18],[-43,-18],[-18,-43],[18,-43],[43,-18],[43,18],[18,43]];