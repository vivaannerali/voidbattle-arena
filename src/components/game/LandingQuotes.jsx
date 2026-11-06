import React from 'react';
import '@/components/game/landingQuotes.css';
const QUOTES=[
 'wheres ur bed blue',
 'you had me waiting a loooong time to do that man',
 'pro tip: when you invis someone, dont dangle your sword out',
 'bed gone soon chaps',
 'ty man you too mind hopping in the void for me',
 'come fight at mid :D',
 'you probably have like 50 golems',
 'just saying, when its sudden death, im gonna have the advantage',
 'wait theres an achivement for killing a dragon'
];
export default function LandingQuotes(){
 return <aside className="landing-quotes" aria-label="Quotes by Ephirisi">{[QUOTES.slice(0,5),QUOTES.slice(5)].map((quotes,wing)=><div key={wing} className="landing-quotes-wing">{quotes.map((text,index)=><figure key={text} className="landing-quote" style={{'--quote-delay':`${-(index*1.7+wing*2)}s`}}><blockquote>“{text}”</blockquote><figcaption>— Ephirisi</figcaption></figure>)}</div>)}</aside>;
}