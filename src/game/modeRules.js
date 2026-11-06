export function largeTeamMode(mode){return mode==='Trios'||mode==='Squads';}
export function modePrice(small,large,mode){return largeTeamMode(mode)?large:small;}
export function upgradeCosts(def,mode){return largeTeamMode(mode)?def.costs:def.smallCosts||def.costs;}