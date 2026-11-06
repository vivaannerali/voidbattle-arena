// Roll once when the authoritative match roster is created, never on respawn.
export default function ephirisiEncounter(roster,mode,allies=[roster[0].team],force=false){
 const roll=Math.random();
 if(!force&&roll>=.01||roster.some(p=>p.name.toLowerCase()==='ephirisi'))return;
 const candidates=roster.filter((p,index)=>index>0&&!p.human&&!allies.includes(p.team));
 let player=candidates[Math.floor(Math.random()*candidates.length)];
 if(!player&&mode){
  // Never replace a human or exceed a team's normal capacity.
  for(let team=0;team<mode.teams&&!player;team++){
   if(allies.includes(team))continue;
   const members=roster.filter(p=>p.team===team);
   if(members.length>=mode.size)continue;
   let slot=0;while(members.some(p=>p.slot===slot))slot++;
   player={id:'encounter-ephirisi',name:'Ephirisi',team,slot,human:false};
   roster.push(player);
  }
 }
 if(player){player.name='Ephirisi';player.isEphirisi=true;}
}