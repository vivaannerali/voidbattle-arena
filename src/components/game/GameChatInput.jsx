import React,{useEffect,useRef,useState} from 'react';
import '@/components/game/botChat.css';
export default function GameChatInput({onSend,onClose}){
 const [text,setText]=useState(''),[error,setError]=useState(''),[sending,setSending]=useState(false),input=useRef(null);
 useEffect(()=>{input.current?.focus();},[]);
 const submit=async event=>{event.preventDefault();if(sending||!text.trim())return;setSending(true);try{const result=await onSend(text);if(result.ok)onClose();else setError(result.message);}catch{setError('Message could not be sent. Try again.');}finally{setSending(false);}};
 return <form className="game-chat-input" onSubmit={submit} onKeyDown={event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();onClose();}}} aria-label="In-game chat"><label htmlFor="game-chat-message">{text.trimStart().startsWith('!')?'ALL CHAT':'TEAM CHAT'} <span>Enter to send · Esc to close · ! for all</span></label><input id="game-chat-message" ref={input} value={text} onChange={event=>{setText(event.target.value);setError('');}} maxLength={200} autoComplete="off" spellCheck={false} disabled={sending} placeholder="Message your team…"/><button type="submit" disabled={sending||!text.trim()}>Send</button>{error&&<p role="alert">{error}</p>}</form>;
}