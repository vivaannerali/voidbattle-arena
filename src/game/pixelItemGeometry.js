import { itemTile } from '@/game/equipment';
import pixelSpriteGeometry from '@/game/pixelSpriteGeometry';
export default function pixelItemGeometry(id){return pixelSpriteGeometry(itemTile(id));}