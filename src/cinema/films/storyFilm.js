import { STORY_TITLE, STORY_CHAPTERS } from '@/game/story/storyCatalog';

export default {
  id: 'story-mode', marquee: 'RISE OF THE YELLOW EMPEROR', title: STORY_TITLE,
  tagline: 'The Story Mode cinematic adaptation.', hero: 'Ephirisi', rival: 'AKD23',
  score: 'worldcup', accent: '#ffd45f', accent2: '#c07bff',
  shots: [
    ['arrival', 'There are battles that decide the fate of kingdoms. This is the story of the Yellow Emperor.', 'quiet'],
    ['vow', 'Ephirisi. The Yellow Emperor. Across the divide stand AKD23 and Larp108.', 'tense'],
    ['forge', 'Every empire begins somewhere. First, the forge. Then, a blade.', 'quiet'],
    ['bridge', 'The Emperor crosses the void. The first chapter begins: For the team.', 'tense'],
    ['guardian', 'AKD23 stands behind the Dream Defender. A warrior. A guardian. A promise.', 'gasp'],
    ['duel', 'The Dream Defender falls. AKD23 charges. The Yellow Emperor does not yield.', 'hype'],
    ['fall', 'AKD23 has fallen. Larp... avenge me. The revenge has now become personal.', 'quiet'],
    ['vow', `The story continues beyond Chapter One: ${STORY_CHAPTERS.slice(2, 6).map(chapter => chapter.name).join('. ')}.`, 'tense'],
  ],
};