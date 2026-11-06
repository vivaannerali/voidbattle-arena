import { TEAM_NAMES } from '@/game/equipment';
import { SHOP_ITEMS } from '@/game/shopCatalog';
const SPELLINGS={u:'you',ur:'your',r:'are',pls:'please',plz:'please',wat:'what',wut:'what',omw:'on my way',mid:'mid',diamons:'diamonds',ems:'emeralds',dias:'diamonds',grey:'gray',cyan:'aqua'};
export function cleanMessage(text){return text.normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9_\s]/g,' ').split(/\s+/).filter(Boolean).map(word=>SPELLINGS[word]||word).join(' ');}
const LEET={a:'[a@4]',i:'[i1!]',o:'[o0]',s:'[s$5]',t:'[t7]',e:'[e3]'};
const FILTER=new RegExp('\\b('+['fuck','shit','bitch','asshole','bastard','stfu','kys','retard','nigg','fagg'].map(word=>word.split('').map(letter=>LEET[letter]||letter).join('[\\W_]*')).join('|')+')\\w*\\b','gi');
export function filterMessage(text){return text.normalize('NFKC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g,'').replace(FILTER,'***').trim().slice(0,200);}
export function detectIntent(text){const t=cleanMessage(text),has=pattern=>pattern.test(t);const colour=TEAM_NAMES.findIndex(name=>new RegExp('\\b'+name.toLowerCase().replace('grey','gray')+'\\b').test(t));
 if(has(/\b(are you (a |an )?bot|you (a |an )?bot|who are you|how old|where are you from|real person|are you human)\b/))return {intent:'identity'};
 if(t==='bed'||has(/\b(someone|enemy|enemies|they|red|blue|green|yellow|aqua|white|pink|gray)\b.*\b(at (our |the )?bed|rushing|invis|invisible|at (our |the )?base)|\b(our bed|base) (is )?(under attack|getting rushed)|\bbed ?(help|under attack)\b/))return {intent:'callout',type:'defend',team:colour,urgent:true};
 if(has(/\b(give|drop|share|spare|need|can i have)\b/) && has(/\b(iron|gold|diamonds?|emeralds?)\b/)){const resource=t.match(/\b(iron|gold|diamonds?|emeralds?)\b/)[0].replace(/s$/,'');return {intent:'resources',type:'share',resource,id:{iron:40,gold:41,diamond:42,emerald:43}[resource],amount:t.match(/\b\d+\b/)?Math.min(32,Math.max(1,Number(t.match(/\b\d+\b/)[0]))):0};}
 if(has(/\b(what should we do|what do we do|who (do|should) we rush|where (are|is|do i find) (the )?(diamonds|emeralds)|whats (the |our )?plan|strategy)\b/))return {intent:'strategy'};
 if(has(/\b(defend|protect|guard)\b.*\b(bed|base)\b/))return {intent:'command',type:'defend'};
 if(has(/\brush\b/))return {intent:'command',type:'rush',team:colour};
 if(has(/\b(go|take|get|collect|grab|head|goto)\b.*\bdiamonds?\b/))return {intent:'command',type:'diamond'};
 if(has(/\b(go|take|get|collect|grab|head|goto)\b.*\bemeralds?\b/))return {intent:'command',type:'emerald'};
 if(has(/\bfollow me\b/))return {intent:'command',type:'follow'};
 if(has(/\b(help me|need help|help us|help please)\b/))return {intent:'command',type:'help',urgent:true};
 if(has(/\b(come|go|meet|head|goto)\b.*\b(mid|middle|center|centre)\b/))return {intent:'command',type:'mid'};
 if(has(/\bbuy\b/)){const aliases={wood:'oak',planks:'oak',endstone:'end_stone',armor:'iron_armor',armour:'iron_armor',blocks:'wool',clay:'clay',glass:'glass',sword:'stone_sword',pick:'pickaxe'};const item=SHOP_ITEMS.slice().sort((a,b)=>(b.name||b.key).length-(a.name||a.key).length).find(entry=>t.includes(cleanMessage(entry.name||entry.key.replaceAll('_',' ')))||t.includes(entry.key.replaceAll('_',' ')));const alias=Object.keys(aliases).find(word=>new RegExp('\\b'+word+'\\b').test(t));return {intent:'command',type:'buy',key:item?.key||aliases[alias]};}
 if(has(/\b(you are bad|your bad|you bad|noob|trash|ez|you suck|bad bot)\b/))return {intent:'insult'};
 if(has(/\b(nice|good job|you are good|your good|you good|gj|well played|great play)\b/))return {intent:'compliment'};
 if(has(/\b(bye|goodbye|gg|ggs|good game|see ya|later)\b/))return {intent:'goodbye'};
 if(has(/\b(how are you|hows it going|wyd|what are you doing|how you doing)\b/))return {intent:'wellbeing'};
 if(has(/\b(sorry|my bad|mb|apologies)\b/))return {intent:'apology'};
 if(has(/\b(thanks|thank you|ty|thx|tysm)\b/))return {intent:'thanks'};
 if(has(/\b(lol|lmao|haha|rofl|hehe)\b/))return {intent:'laughing'};
 if(has(/^(yes|yeah|yep|yea|sure|okay|ok|bet|do it|please do)\b/))return {intent:'yes'};
 if(has(/^(no|nope|nah|dont|stop|cancel)\b/))return {intent:'no'};
 if(has(/\b(hi|hello|hey|sup|yo)\b/))return {intent:'greeting'};
 return {intent:'fallback'};
}