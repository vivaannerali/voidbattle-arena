import pixelSpriteGeometry from '@/game/pixelSpriteGeometry';
export function swordGeometry(tier){return pixelSpriteGeometry(26+Math.max(0,Math.min(3,tier)));}