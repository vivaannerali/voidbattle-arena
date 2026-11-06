// Local-only reply data. Add lines here; every personality receives every bank.
export const PERSONALITIES=['tryhard','joker','newPlayer','quiet'];
const BANKS={
 greeting:['hey','hi team','yo','hey whats up','sup','hello there','yo lets play','hey lets get this win'],
 goodbye:['gg','good game','gg well played','later team','see ya','that was a good round','ggs everyone','take care'],
 wellbeing:['im at {location} rn','just collecting blocks','doing alright, you','trying not to fall off','watching our bed','getting ready to move','{kills} kills so far, still trying','{minutes} minutes in and still going'],
 compliment:['thanks, nice plays from you too','appreciate it','good teamwork','thanks lets keep going','you helped with that','ty that worked out','nice one team','thanks, we got this'],
 insult:['save the roasting for after the game','my blocks have feelings too','fair, watch the next play','im working on it lol','you can roast me if we win','less typing more bridging','the void is my real rival','lets settle it with a good push'],
 identity:['lol just here to win','focus the game bro','im the one carrying too much wool','just your block teammate','here for the bed wars','mystery player, obvious wool addiction','im on team dont fall off','lets talk strategy instead'],
 strategy:['{bedStatus}, lets plan around that','{threat} is the biggest threat, they have {players} players left','diamonds are on the outer generator islands','emeralds are at mid','im at {location}, regroup here','i have {iron} iron, wanna buy wool?','should i rush {target}?','{nearbyEnemies} enemies nearby, protect home then take diamonds'],
 command:['on it','bet','okay omw','got it, doing that','heading there now','yep, for the next minute','ill handle that','okay, changing plans'],
 resources:['bringing {amount} {resource}','got some {resource}, coming over','okay ill drop {amount} when im close','sharing {amount} {resource}, hold up','on my way with {resource}','ill drop some beside you','coming to you with {amount} {resource}','yep, bringing what i can spare'],
 delivered:['left {amount} {resource} beside you','dropped the {resource}, grab it','{amount} {resource} on the ground for you','resources are beside you now','dropped what i could spare','there you go, {amount} {resource}','check beside you for the {resource}','done, grab the {resource}'],
 broke:['im broke rn','no {resource} on me sorry','need to collect some first','got none to spare yet','my pockets are empty','sorry used my {resource} already','nothing on me right now','check the generator, im out'],
 denied:['cant do that from the other team','we are on different teams lol','ask your teammate for that','not on your team, nice try','ill stick with my own team','wrong team for that command','cant help the other side with that','my team needs me here'],
 unavailable:['cant do that one','that item isnt in this shop','not sure what you mean, try naming the item','i cant buy that here','pick something from the item shop','that target isnt available','cant rush my own team','need a different target for that'],
 callout:['bed!! on my way','coming back to defend','checking home now','ill look for them','okay watching that side','fall back, im coming','checking for an invisible player','on it, protect the bed'],
 laughing:['lol','haha','lmao','that timing','okay that was funny','i saw that lol','bruh haha','lol fair'],
 apology:['np','all good','happens','dont worry about it','we reset and go again','youre fine','no stress','its okay, keep going'],
 thanks:['np','yw','got you','anytime','teamwork','no problem','all good','happy to help'],
 yes:['okay doing that','bet, lets do it','got it, going now','alright im on it','okay, agreed','yes lets go','sounds good','okay moving'],
 no:['okay staying here','fair, different plan then','alright cancelling that','okay not doing that','got it, holding off','no worries','okay lets regroup instead','fine by me, ill wait'],
 fallback:['huh','what','lol ok','idk man','focus the game','true','not sure what you mean','say that again?'],
 eventStart:['lets get this win','protect the bed first','collect then move','good luck team','ill get some blocks','ready when you are','watch the bridges','lets work together'],
 eventBed:['{bedStatus}','bed gone, careful now','no more respawns for that team','watch your next fight','that changes the plan','time to play safe','keep an eye on home','stay together now'],
 eventKill:['nice, got one','one down, regrouping','that was close','back to collecting','push worked out','okay onto the next play','still watching the bridge','good fight'],
 eventDeath:['{killer} keeps killing me bruh','the void got me again','need a better angle next time','resetting my plan','that did not go to plan','nice hit, ill give them that','got caught out there','{deaths} deaths, still trying'],
 followup:['wait','nvm','one sec','watch the bridge','careful though','stay close','actually hold up','lets see']
};
// Eight alternate mannerisms per personality, not a network or model call.
const STYLE={
 tryhard:['{line}','{line}.','{line}, stay focused','{line}, watch home','{line}, keep moving','{line}, play safe','{line}, team first','{line}, lets win'],
 joker:['{line} lol','{line} lmao','{line}, block business','{line} haha','{line}, the void is watching','{line}, trust the wool','{line}, certified block moment','{line} :p'],
 newPlayer:['{line}, still learning','{line}, hope thats right','{line}, am i doing this right','{line}, trying my best','{line}, okay?','{line}, tell me if i mess up','{line}, learning as i go','{line}, lets try it'],
 quiet:['{line}','{line}.','{line}, ok','{line}, yep','{line}, got it','{line}, sure','{line}, alright','{line}, noted']
};
export const BOT_CHAT_LINES=Object.fromEntries(PERSONALITIES.map(personality=>[personality,Object.fromEntries(Object.entries(BANKS).map(([intent,lines])=>[intent,lines.map((line,i)=>STYLE[personality][i%8].replace('{line}',line))]))]));
export const BOT_FOLLOWUPS=BANKS.followup;