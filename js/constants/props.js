import { ASSETS_BASE_URL } from './urls.js'

export const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'einburgerungstest']
export const types = ['noun', 'verb', 'adjective', 'adverb']
export const WordType = {
  NOUN: 'noun',
  VERB: 'verb',
  ADJECTIVE: 'adjective',
  ADVERB: 'adverb',
}

export const NavigationMode = Object.freeze({
  LEARN: 'learn',
  EXERCISE: 'exercise',
})

export const ExerciseType = Object.freeze({
  VOCABULARY: 'vocabulary',
  GRAMMAR: 'grammar',
})

export const ExerciseTypeSettingsMap = Object.freeze({
  [ExerciseType.VOCABULARY]: {
    description:
      "Vocabulary type of exercises. 'english' properties of other words in the list are selected as 'wrong' answers",
    optionsCount: null, // so 2-3-4 is going to work
  },
  [ExerciseType.GRAMMAR]: {
    description:
      "Grammar fill in the blank 'example' element in the exercise. 'german' properties of other words in the list are selected as 'wrong' answers",
    optionsCount: 3,
  },
})

export const ArtikelColorMap = {
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

export const WordSource = {
  NORMAL_PROMPT: 'normal-prompt',
  ASSISTANT: 'assistant',
  INTERNAL: 'internal',
}

export const categories = {
  a1: [
    {
      nameShort: 'alltag',
      name: 'Alltag',
      nameEng: 'Daily Life',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'einkaufen',
      name: 'Einkaufen & Essen',
      nameEng: 'Shopping & Food',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-Shopping&Food.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'gesundheit',
      name: 'Gesundheit',
      nameEng: 'Health',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-Gesundheit.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'behoerden',
      name: 'Behörden & Termin',
      nameEng: 'Official Appointments',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-OfficialAppointments.jpg`,
      type: 'regular',
    },
    {
      id: 'mc-prep-a1-01',
      nameShort: 'preposition',
      name: 'Prepositions Micro Quiz',
      nameEng: 'Micro Quiz - Prepositions',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-OfficialAppointments.jpg`,
      type: 'micro-quiz',
    },
  ],
  a2: [
    {
      nameShort: 'alltag',
      name: 'Alltag',
      nameEng: 'Daily Life',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'freizeit',
      name: 'Freizeit & Konsum',
      nameEng: 'Leisure & Consumption',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Leisure.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'medien',
      name: 'Medien & Kommunikation',
      nameEng: 'Media & Comm.',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Media&Consumption.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'arbeit',
      name: 'Arbeit & Behörden',
      nameEng: 'Work & Authorities',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Work&Authorities.jpg`,
      type: 'regular',
    },
  ],
  b1: [
    {
      nameShort: 'gefuehle',
      name: 'Gefühle & Beziehungen',
      nameEng: 'Emotions & Relationships',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Emotions.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'reisen',
      name: 'Reisen & Verkehr',
      nameEng: 'Travel & Transportation',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Travel&Transportation.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'wohnen',
      name: 'Wohnen & Umwelt',
      nameEng: 'Living & Environment',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Living&Environment.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'slang',
      name: 'German Slang',
      nameEng: 'German Slang',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-German Slang.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'b1telc',
      name: 'B1 TELC EXAM',
      nameEng: 'B1 TELC EXAM',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-TELC.jpg`,
      type: 'regular',
    },
  ],
  b2: [
    {
      nameShort: 'bildung',
      name: 'Wissenschaft & Bildung',
      nameEng: 'Science & Education',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Science&Education.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'kultur',
      name: 'Gesellschaft & Kultur',
      nameEng: 'Society & Culture',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Society&Culture.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'politik',
      name: 'Politik & Umwelt',
      nameEng: 'Politics & Environment',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Politics&Environment.jpg`,
      type: 'regular',
    },
    {
      nameShort: 'technik',
      name: 'Digitalisierung & Technik',
      nameEng: 'Digitalization & Technology',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Digitalization&TEchnology.jpg`,
      type: 'regular',
    },
  ],
  c1: [],
  c2: [],
}
