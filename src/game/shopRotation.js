import { localDay,localMidnight } from '@/game/shopRotationTime';
export const ROTATING_ITEM_KEYS=['block_zapper','machine_gun_bow','wind_charge','mace'];
export const ROTATION_SCHEDULE={timeZone:'Australia/Melbourne',anchorDate:'2026-11-02',groups:[
 ['block_zapper','machine_gun_bow','wind_charge'],
 ['mace','block_zapper','machine_gun_bow'],
 ['wind_charge','mace','block_zapper'],
 ['machine_gun_bow','wind_charge','mace']
]};
export function rotationFor(schedule,now=Date.now()){
 if(!schedule)return {scheduled:false,keys:[...ROTATING_ITEM_KEYS],week:0,nextReset:null,now};
 const groups=schedule.groups.filter(group=>group.length),anchor=Date.parse(schedule.anchorDate)/86400000;
 if(!groups.length||!Number.isFinite(anchor))throw new Error('The rotating shop needs a valid weekly anchor and item groups.');
 const day=localDay(now,schedule.timeZone),week=Math.floor((day-anchor)/7),index=((week%groups.length)+groups.length)%groups.length,monday=anchor+week*7;
 return {scheduled:true,keys:groups[index],week:index+1,timeZone:schedule.timeZone,startAt:localMidnight(monday,schedule.timeZone),nextReset:localMidnight(monday+7,schedule.timeZone),now};
}
let cached=null;
export default function shopRotation(){const now=Date.now();if(!cached||now<cached.startAt||now>=cached.nextReset)cached=rotationFor(ROTATION_SCHEDULE,now);return {...cached,now};}