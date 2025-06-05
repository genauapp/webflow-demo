import { ASSETS_BASE_URL } from './urls.js'

export const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'einburgerungstest']
export const types = ['noun', 'verb', 'adjective', 'adverb']
export const WordType = {
  NOUN: 'noun',
  VERB: 'verb',
  ADJECTIVE: 'adjective',
  ADVERB: 'adverb',
}
export const MicroQuizType = {
  PREPOSITION: 'prepositon'
}

export const ArtikelColorMap = {
  der: 'blue',
  die: 'red',
  das: 'green',
  default: 'black',
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
    },
    {
      nameShort: 'einkaufen',
      name: 'Einkaufen & Essen',
      nameEng: 'Shopping & Food',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-Shopping&Food.jpg`,
    },
    {
      nameShort: 'gesundheit',
      name: 'Gesundheit',
      nameEng: 'Health',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-Gesundheit.jpg`,
    },
    {
      nameShort: 'behoerden',
      name: 'Behörden & Termin',
      nameEng: 'Official Appointments',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-OfficialAppointments.jpg`,
    },
  ],
  a2: [
    {
      nameShort: 'alltag',
      name: 'Alltag',
      nameEng: 'Daily Life',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.jpg`,
    },
    {
      nameShort: 'freizeit',
      name: 'Freizeit & Konsum',
      nameEng: 'Leisure & Consumption',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Leisure.jpg`,
    },
    {
      nameShort: 'medien',
      name: 'Medien & Kommunikation',
      nameEng: 'Media & Comm.',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Media&Consumption.jpg`,
    },
    {
      nameShort: 'arbeit',
      name: 'Arbeit & Behörden',
      nameEng: 'Work & Authorities',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Work&Authorities.jpg`,
    },
  ],
  b1: [
    {
      nameShort: 'gefuehle',
      name: 'Gefühle & Beziehungen',
      nameEng: 'Emotions & Relationships',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Emotions.jpg`,
    },
    {
      nameShort: 'reisen',
      name: 'Reisen & Verkehr',
      nameEng: 'Travel & Transportation',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Travel&Transportation.jpg`,
    },
    {
      nameShort: 'wohnen',
      name: 'Wohnen & Umwelt',
      nameEng: 'Living & Environment',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Living&Environment.jpg`,
    },
    {
      nameShort: 'slang',
      name: 'German Slang',
      nameEng: 'German Slang',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-German Slang.jpg`,
    },
    {
      nameShort: 'b1telc',
      name: 'B1 TELC EXAM',
      nameEng: 'B1 TELC EXAM',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-TELC.jpg`,
    }
  ],
  b2: [
    {
      nameShort: 'bildung',
      name: 'Wissenschaft & Bildung',
      nameEng: 'Science & Education',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Science&Education.jpg`,
    },
    {
      nameShort: 'kultur',
      name: 'Gesellschaft & Kultur',
      nameEng: 'Society & Culture',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Society&Culture.jpg`,
    },
    {
      nameShort: 'politik',
      name: 'Politik & Umwelt',
      nameEng: 'Politics & Environment',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Politics&Environment.jpg`,
    },
    {
      nameShort: 'technik',
      name: 'Digitalisierung & Technik',
      nameEng: 'Digitalization & Technology',
      imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Digitalization&TEchnology.jpg`,
    },
  ],
  c1: [],
  c2: [],
}
