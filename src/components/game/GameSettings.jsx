import React,{useState} from 'react';
import MinecraftPanel from '@/components/game/MinecraftPanel';
import GameSettingControls from '@/components/game/GameSettingControls';
import { normalizeSettings } from '@/game/gameProfile';
import GameGraphicsControls from '@/components/game/GameGraphicsControls';
export default function GameSettings({profile,onSave,onBack}) {
 const [draft,setDraft]=useState({...profile,...normalizeSettings(profile)}),[error,setError]=useState('');
 const update=(key,value)=>{setDraft(current=>({...current,[key]:value}));setError('');};
 const submit=event=>{event.preventDefault();try{onSave({...draft,username:draft.username.trim()});}catch(error){setError(error.message);}};
 return <MinecraftPanel title="Settings" subtitle="Your username and controls stay on this device."><form className="minecraft-form" onSubmit={submit} noValidate><label htmlFor="settings-username">Username</label><input id="settings-username" value={draft.username} onChange={event=>update('username',event.target.value)} maxLength={16} autoComplete="off" spellCheck={false} aria-invalid={!!error} aria-describedby="settings-name-help settings-error"/><small id="settings-name-help">3–16 letters, numbers or underscores.</small><GameSettingControls draft={draft} onChange={update}/><GameGraphicsControls draft={draft} onChange={update}/><small>Changes apply when saved. Lower render distance reduces graphics work.</small><p id="settings-error" className="game-error" role="alert">{error}</p><button className="minecraft-button minecraft-button-primary" type="submit">Save Settings</button><button className="minecraft-button" type="button" onClick={onBack}>Back</button></form></MinecraftPanel>;
}