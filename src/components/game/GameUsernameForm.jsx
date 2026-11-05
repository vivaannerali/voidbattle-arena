import React,{useState} from 'react';
import MinecraftPanel from '@/components/game/MinecraftPanel';
export default function GameUsernameForm({profile,onSave}) {
 const [username,setUsername]=useState(''),[error,setError]=useState('');
 const submit=event=>{event.preventDefault();try{onSave({...profile,username:username.trim()});}catch(error){setError(error.message);}};
 return <MinecraftPanel title="Choose your username" subtitle="No email. No password. Just your name."><form className="minecraft-form" onSubmit={submit} noValidate><label htmlFor="first-username">Username</label><input id="first-username" value={username} onChange={event=>{setUsername(event.target.value);setError('');}} minLength={3} maxLength={16} pattern="[A-Za-z0-9_]{3,16}" autoFocus autoComplete="off" spellCheck={false} aria-describedby="username-help username-error" aria-invalid={!!error}/><small id="username-help">3–16 letters, numbers or underscores. Saved on this device.</small><p id="username-error" className="game-error" role="alert">{error}</p><button className="minecraft-button minecraft-button-primary" type="submit">Continue</button></form></MinecraftPanel>;
}