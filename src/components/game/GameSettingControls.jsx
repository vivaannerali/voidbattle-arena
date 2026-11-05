import React from 'react';
const SETTINGS=[
 {key:'sensitivity',label:'Mouse sensitivity',min:10,max:100,step:1,unit:'%'},
 {key:'fov',label:'Field of view',min:50,max:110,step:1,unit:'°'},
 {key:'renderDistance',label:'Render distance',min:2,max:12,step:1,unit:' chunks'},
 {key:'guiScale',label:'GUI scale',min:75,max:150,step:5,unit:'%'}
];
export default function GameSettingControls({draft,onChange}){
 return <>{SETTINGS.map(setting=><React.Fragment key={setting.key}><label htmlFor={'settings-'+setting.key}>{setting.label}: {draft[setting.key]}{setting.unit}</label><input id={'settings-'+setting.key} type="range" min={setting.min} max={setting.max} step={setting.step} value={draft[setting.key]} onChange={event=>onChange(setting.key,Number(event.target.value))}/></React.Fragment>)}</>;
}