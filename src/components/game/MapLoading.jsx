import React from 'react';
import { Image } from '@/components/ui/image';
import mapPreview from '@/game/mapPreview';
import '@/components/game/mapSelection.css';
export default function MapLoading({map}){
 if(!map)return null;
 return <div className="map-loading" role="status" aria-live="polite"><section><p className="game-eyebrow">BUILDING ARENA</p><h2>{map.name}</h2><Image src={mapPreview(map.mapId)} alt={map.name+' '+map.teams+'-team voxel map preview'} fittingType="fit" className="map-loading-picture"/><p>{map.teams} teams · {map.tag||'Original map'}</p><div className="map-loading-bar" aria-hidden="true"/><p className="map-loading-tip">Tip: Sneak at the edge of blocks to bridge safely!</p></section></div>;
}