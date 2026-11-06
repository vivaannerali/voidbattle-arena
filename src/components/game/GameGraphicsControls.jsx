import React from 'react';
const OPTIONS=[
  {key:'textureStyle',label:'Texture Style',values:['Clean PvP','Classic']},
  {key:'graphics',label:'Graphics',values:['Fancy','Fast']},
 {key:'particles',label:'Particles',values:['All','Decreased','Minimal']},
 {key:'clouds',label:'Clouds',values:['On','Off']},
 {key:'viewBobbing',label:'View bobbing',values:['On','Off']}
];
export default function GameGraphicsControls({draft,onChange}){
 return <fieldset className="game-graphics-controls"><legend>Graphics</legend>{OPTIONS.map(option=><label key={option.key} htmlFor={'graphics-'+option.key}><span>{option.label}</span><select id={'graphics-'+option.key} value={draft[option.key]} onChange={event=>onChange(option.key,event.target.value)}>{option.values.map(value=><option key={value} value={value}>{value}</option>)}</select></label>)}<small>Fancy automatically switches to Fast after 5 seconds below 55 FPS during play.</small></fieldset>;
}