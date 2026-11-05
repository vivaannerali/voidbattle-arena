import { TEAM_COLORS } from '@/game/blocks';
import GeneratorHologram from '@/game/generatorHologram';
export default function botNameTag(name,team,texture){const tag=new GeneratorHologram(null,texture,0,0,0);tag.setLines(name.toUpperCase(),'','',TEAM_COLORS[team]);tag.mesh.scale.setScalar(1.25);return {geometry:tag.geometry,material:tag.material,mesh:tag.mesh};}