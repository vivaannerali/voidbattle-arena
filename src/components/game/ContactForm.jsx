import React,{useState} from 'react';
import { base44 } from '@/api/base44Client';
export default function ContactForm(){
 const [busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState('');
 const submit=async event=>{
  event.preventDefault();if(busy)return;
  const form=event.currentTarget,values=new FormData(form);
  const message={name:values.get('name').trim(),email:values.get('email').trim(),topic:values.get('topic'),description:values.get('description').trim()};
  if(!message.name||!message.description){setError('Please enter your name and message.');return;}
  setBusy(true);setError('');
  try{await base44.entities.ContactMessage.create(message);setSent(true);form.reset();}
  catch{setError('Your message could not be saved. Please try again.');}
  finally{setBusy(false);}
 };
 if(sent)return <p role="status">Your message has been saved for the game creator to review. Thank you for getting in touch.</p>;
 return <form className="public-contact-form" onSubmit={submit}>
  <label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" required maxLength={100} disabled={busy}/></label>
  <label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={busy}/></label>
  <label htmlFor="contact-topic">Topic<select id="contact-topic" name="topic" disabled={busy}><option>Bug report</option><option>Feedback</option><option>General question</option></select></label>
  <label htmlFor="contact-message">Message<textarea id="contact-message" name="description" required maxLength={4000} disabled={busy}/></label>
  {error&&<p className="public-contact-error" role="alert">{error}</p>}
  <button className="minecraft-button minecraft-button-primary" disabled={busy} type="submit">{busy?'Saving message…':'Send message'}</button>
 </form>;
}