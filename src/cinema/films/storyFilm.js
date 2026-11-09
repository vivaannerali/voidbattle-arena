import { STORY_TITLE, STORY_CHAPTERS } from '@/game/story/storyCatalog';

export default {
  id: 'story-mode', marquee: 'RISE OF THE YELLOW EMPEROR', title: STORY_TITLE,
  tagline: 'The Story Mode cinematic adaptation.', hero: 'Ephirisi', rival: 'AKD23',
  score: 'worldcup', accent: '#ffd45f', accent2: '#c07bff',
  shots: [
    ['arrival', "Right, here's where the Yellow Emperor story starts. A few islands, a few teams. It's about to get messy.", 'quiet'],
    ['vow', "That's Ephirisi. The Yellow Emperor. AKD23 and Larp108 are over on the other side. They aren't exactly welcoming him.", 'tense'],
    ['forge', "First, he needs a sword. Can't do much without one. So, yeah... back to the forge.", 'quiet'],
    ['bridge', "He's crossing now. This is Chapter One. For the team. Mind you, getting over there's the easy bit.", 'tense'],
    ['guardian', "See that Dream Defender? AKD23's right behind it. He's not letting Ephirisi through without a fight.", 'gasp'],
    ['duel', "The Defender's down. Now AKD23's charging in himself. Ephirisi isn't moving. Oh, this'll hurt.", 'hype'],
    ['fall', "AKD23's down. He's... listen. Larp, avenge me. Yeah. Larp108's heard him. That's not good.", 'quiet'],
    ['vow', `Anyway, that isn't the end of it. After Chapter One, there's ${STORY_CHAPTERS.slice(2, 6).map(chapter => chapter.name).join('. Then ')}. Larp108's still out there.`, 'tense'],
  ],
};