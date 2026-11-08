import React from 'react';
import PublicNavigation from '@/components/game/PublicNavigation';
import ContactForm from '@/components/game/ContactForm';
import '@/components/game/party.css';
import '@/components/game/publicPages.css';
export default function Contact(){
 return <div className="public-page"><div className="public-page-inner"><PublicNavigation/><main>
  <h1>Contact the Ephirisi Wars Creator</h1>
  <p>Use this form to report a problem, suggest an improvement, or ask a question about the browser game. For a bug report, include the game mode, what happened, and the steps that led to it.</p>
  <p>Your message and contact details are saved privately for the game creator to review. Do not include passwords, party codes, or other sensitive information. This form does not send an automatic email, and a response time is not guaranteed.</p>
  <ContactForm/>
 </main><footer><PublicNavigation/></footer></div></div>;
}