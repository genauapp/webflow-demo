import { ASSETS_BASE_URL } from './urls.js'

export const WordLevelList = Object.freeze(['A1', 'A2', 'B1', 'B2'])
export const WordTypeList = Object.freeze([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
])
export const WordType = {
  NOUN: 'noun',
  VERB: 'verb',
  ADJECTIVE: 'adjective',
  ADVERB: 'adverb',
  PREPOSITION: 'preposition',
}

export const PackType = Object.freeze({
  JOURNEY: 'JOURNEY',
  MICRO_QUIZ: 'MICRO_QUIZ',
})

export const DeckStatus = Object.freeze({
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
  COMPLETED: 'COMPLETED',
})

export const JourneyDeckDefinition = Object.freeze({
  [WordType.NOUN]: 'Names of people, places, things, or ideas',
  [WordType.VERB]: 'Words that describe actions or states.',
  [WordType.ADJECTIVE]:
    'Words that describe how, when, or where something happens.',
  [WordType.ADVERB]: 'Words that describe nouns.',
  [WordType.PREPOSITION]:
    'Words that show relationships between a noun or pronoun and other words in a sentence.',
})

export const JourneyDeckExample = Object.freeze({
  [WordType.NOUN]: 'der Tisch (the table), die Stadt (the city)',
  [WordType.VERB]: 'laufen (to run), sprechen (to speak)',
  [WordType.ADJECTIVE]: 'groß (big), schnell (fast)',
  [WordType.ADVERB]: 'schnell (quickly), gestern (yesterday)',
  [WordType.PREPOSITION]: 'mit (with), durch (through)',
})

export const NavigationMode = Object.freeze({
  LEARN: 'learn',
  EXERCISE: 'exercise',
})

export const ExerciseType = Object.freeze({
  VOCABULARY: 'VOCABULARY', // english word with one correct, many wrong answer options
  GRAMMAR: 'GRAMMAR', // fill in the blanks
  ARTICLE: 'ARTICLE', // article prefix der/die/das
  // ARTICLE_ENDING: 'article-ending', // article ending rule
  // TRUE_FALSE: 'true-false', // 70% correct - 30% wrong answer
})

export const ExerciseStreakTarget = Object.freeze({
  1: 'ONE',
  3: 'THREE',
  5: 'FIVE',
})

export const ExerciseTypeSettingsMap = Object.freeze({
  [ExerciseType.VOCABULARY]: {
    description:
      "Vocabulary type of exercises. 'english' properties of other 'german' words in the list are selected as 'wrong' answers",
    // optionsCount: null, // so 2-3-4 is going to work
    optionsCount: 3,
  },
  [ExerciseType.GRAMMAR]: {
    description:
      "Grammar fill in the blank 'example' element in the exercise. 'german' properties of other words in the list are selected as 'wrong' answers",
    optionsCount: 3,
  },
  [ExerciseType.ARTICLE]: {
    description:
      "'die'/'der'/'das' for nouns in the exercise; one is correct, others are wrong. other articles that are not equal to word's 'article' property are selected as 'wrong' answers",
    optionsCount: 3,
  },
})

export const NounArticleColorMap = {
  der: 'blue',
  die: 'red',
  das: 'green',
  default: 'black',
}

export const PrepositionCaseColorMap = {
  nominative: '#000000',
  accusative: '#E94DEC',
  dative: '#7ACC20',
  genitive: '#A259FF',
  dual: '#F9731F',
}
export const ALL_VERB_CASES = ['reflexive', 'separable', 'accusative', 'dative']

// todo: sync here with back-end as GENAU/NAU_V1/NAU_V1_1
export const WordSource = {
  NORMAL_PROMPT: 'normal-prompt',
  ASSISTANT: 'assistant',
  INTERNAL: 'internal',
}

export const PACK_SUMMARIES_BY_LEVEL = Object.freeze({
  a1: [
    {
      id: 'reg-0001',
      type: 'journey',
      level: 'a1',
      category: 'alltag',
      name: 'Alltag',
      name_eng: 'Daily Life',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0001',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0002',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0003',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0004',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0002',
      type: 'journey',
      level: 'a1',
      category: 'einkaufen',
      name: 'Einkaufen & Essen',
      name_eng: 'Shopping & Food',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A1-Shopping&Food.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0005',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0006',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0007',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0008',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0003',
      type: 'journey',
      level: 'a1',
      category: 'gesundheit',
      name: 'Gesundheit',
      name_eng: 'Health',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A1-Gesundheit.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0009',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0010',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0011',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0012',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0004',
      type: 'journey',
      level: 'a1',
      category: 'behoerden',
      name: 'Behörden & Termin',
      name_eng: 'Official Appointments',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A1-OfficialAppointments.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0013',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0014',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0015',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0016',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'mq-0001', // same as file/folder name!
      type: 'micro-quiz',
      level: 'a1',
      category: 'preposition',
      name: 'Präpositions',
      name_eng: 'Prepositions',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A1-MQ-Prepositions-Grammar.svg`,
      deck_summaries: [
        {
          deck_id: 'deck-0069',
          word_type: 'preposition',
          exercise_type: 'grammar',
          status: 'unlocked',
        },
      ],
    },
  ],
  a2: [
    {
      id: 'reg-0005',
      type: 'journey',
      level: 'a2',
      category: 'alltag',
      name: 'Alltag',
      name_eng: 'Daily Life',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0017',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0018',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0019',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0020',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0006',
      type: 'journey',
      level: 'a2',
      category: 'freizeit',
      name: 'Freizeit & Konsum',
      name_eng: 'Leisure & Consumption',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A2-Leisure.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0021',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0022',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0023',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0024',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0007',
      type: 'journey',
      level: 'a2',
      category: 'medien',
      name: 'Medien & Kommunikation',
      name_eng: 'Media & Comm.',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A2-Media&Consumption.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0025',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0026',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0027',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0028',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0008',
      type: 'journey',
      level: 'a2',
      category: 'arbeit',
      name: 'Arbeit & Behörden',
      name_eng: 'Work & Authorities',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A2-Work&Authorities.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0029',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0030',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0031',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0032',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'mq-0002', // same as file/folder name!
      type: 'micro-quiz',
      level: 'a2',
      deck_summaries: [
        {
          deck_id: 'deck-0070',
          word_type: 'preposition',
          exercise_type: 'grammar',
          status: 'unlocked',
        },
      ],
      category: 'preposition',
      name: 'Präpositions',
      name_eng: 'Prepositions',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/A2-MQ-Prepositions-Grammar.svg`,
    },
  ],
  b1: [
    {
      id: 'reg-0009',
      type: 'journey',
      level: 'b1',
      category: 'gefuehle',
      name: 'Gefühle & Beziehungen',
      name_eng: 'Emotions & Relationships',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B1-Emotions.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0033',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0034',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0035',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0036',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0010',
      type: 'journey',
      level: 'b1',
      category: 'reisen',
      name: 'Reisen & Verkehr',
      name_eng: 'Travel & Transportation',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B1-Travel&Transportation.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0037',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0038',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0039',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0040',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0011',
      type: 'journey',
      level: 'b1',
      category: 'wohnen',
      name: 'Wohnen & Umwelt',
      name_eng: 'Living & Environment',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B1-Living&Environment.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0041',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0042',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0043',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0044',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0012',
      type: 'journey',
      level: 'b1',
      category: 'slang',
      name: 'German Slang',
      name_eng: 'German Slang',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B1-German Slang.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0045',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0046',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0047',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0048',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0013',
      type: 'journey',
      level: 'b1',
      category: 'b1telc',
      name: 'B1 TELC EXAM',
      name_eng: 'B1 TELC EXAM',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B1-TELC.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0049',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0050',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0051',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0052',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
  ],
  b2: [
    {
      id: 'reg-0014',
      type: 'journey',
      level: 'b2',
      category: 'bildung',
      name: 'Wissenschaft & Bildung',
      name_eng: 'Science & Education',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B2-Science&Education.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0053',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0054',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0055',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0056',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0015',
      type: 'journey',
      level: 'b2',
      category: 'kultur',
      name: 'Gesellschaft & Kultur',
      name_eng: 'Society & Culture',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B2-Society&Culture.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0057',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0058',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0059',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0060',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0016',
      type: 'journey',
      level: 'b2',
      category: 'politik',
      name: 'Politik & Umwelt',
      name_eng: 'Politics & Environment',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B2-Politics&Environment.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0061',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0062',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0063',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0064',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
    {
      id: 'reg-0017',
      type: 'journey',
      level: 'b2',
      category: 'technik',
      name: 'Digitalisierung & Technik',
      name_eng: 'Digitalization & Technology',
      img_url: `${ASSETS_BASE_URL}/assets/images/decks/B2-Digitalization&TEchnology.jpg`,
      deck_summaries: [
        {
          deck_id: 'deck-0065',
          word_type: 'noun',
          exercise_type: 'article',
          status: 'unlocked',
        },
        {
          deck_id: 'deck-0066',
          word_type: 'verb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0067',
          word_type: 'adjective',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
        {
          deck_id: 'deck-0068',
          word_type: 'adverb',
          exercise_type: 'vocabulary',
          status: 'locked',
        },
      ],
    },
  ],
  c1: [],
  c2: [],
})
