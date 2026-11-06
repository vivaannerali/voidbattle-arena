// Resource production multipliers shared by both team-count versions of each map.
export const MAP_GENERATOR_SPEEDS=Object.freeze({
 gelato:1.5,arcade:1.5,cascade:1.5,lighthouse:1.5,
 airshow:1,speedway:1,classic:1,
 acropolis:.75,amazon:.75,cliffside:.75,glacier:.75,orbit:.75
});
export default function mapGeneratorSpeed(mapId){return MAP_GENERATOR_SPEEDS[mapId]||1;}