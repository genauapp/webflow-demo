// PROD

export const ASSETS_BASE_URL = `https://genauapp.github.io/webflow-demo/`
// STAGING
// export const ASSETS_BASE_URL =
//   'https://cdn.jsdelivr.net/gh/chatonode/genau-webflow-demo@4ccb5c4'

/* WORD LEARN/EXERCISE **/


//#region import Json files
import verbdefault1 from '../../json/a1-a2/default/verb.json' with { type: 'json' }
import verbdefault2 from '../../json/a2-b1/default/verb.json' with { type: 'json' }
import verbdefault3 from '../../json/b1-b2/default/verb.json' with { type: 'json' }
import verbdefault4 from '../../json/c1-c2/default/verb.json' with { type: 'json' }
import verbdirty1 from '../../json/a1-a2/dirty/verb.json' with { type: 'json' }
import verbdirty2 from '../../json/a2-b1/dirty/verb.json' with { type: 'json' }
import verbdirty3 from '../../json/b1-b2/dirty/verb.json' with { type: 'json' }
import verbdirty4 from '../../json/c1-c2/dirty/verb.json' with { type: 'json' }
import verbdoctor1 from '../../json/a1-a2/doctor/verb.json' with { type: 'json' }
import verbdoctor2 from '../../json/a2-b1/doctor/verb.json' with { type: 'json' }
import verbdoctor3 from '../../json/b1-b2/doctor/verb.json' with { type: 'json' }
import verbdoctor4 from '../../json/c1-c2/doctor/verb.json' with { type: 'json' }
import verbmusic1 from '../../json/a1-a2/music/verb.json' with { type: 'json' }
import verbmusic2 from '../../json/a2-b1/music/verb.json' with { type: 'json' }
import verbmusic3 from '../../json/b1-b2/music/verb.json' with { type: 'json' }
import verbmusic4 from '../../json/c1-c2/music/verb.json' with { type: 'json' }

import adverbdefault1 from '../../json/a1-a2/default/adverb.json' with { type: 'json' }
import adverbdefault2 from '../../json/a2-b1/default/adverb.json' with { type: 'json' }
import adverbdefault3 from '../../json/b1-b2/default/adverb.json' with { type: 'json' }
import adverbdefault4 from '../../json/c1-c2/default/adverb.json' with { type: 'json' }
import adverbdirty1 from '../../json/a1-a2/dirty/adverb.json' with { type: 'json' }
import adverbdirty2 from '../../json/a2-b1/dirty/adverb.json' with { type: 'json' }
import adverbdirty3 from '../../json/b1-b2/dirty/adverb.json' with { type: 'json' }
import adverbdirty4 from '../../json/c1-c2/dirty/adverb.json' with { type: 'json' }
import adverbdoctor1 from '../../json/a1-a2/doctor/adverb.json' with { type: 'json' }
import adverbdoctor2 from '../../json/a2-b1/doctor/adverb.json' with { type: 'json' }
import adverbdoctor3 from '../../json/b1-b2/doctor/adverb.json' with { type: 'json' }
import adverbdoctor4 from '../../json/c1-c2/doctor/adverb.json' with { type: 'json' }
import adverbmusic1 from '../../json/a1-a2/music/adverb.json' with { type: 'json' }
import adverbmusic2 from '../../json/a2-b1/music/adverb.json' with { type: 'json' }
import adverbmusic3 from '../../json/b1-b2/music/adverb.json' with { type: 'json' }
import adverbmusic4 from '../../json/c1-c2/music/adverb.json' with { type: 'json' }

import adjectivedefault1 from '../../json/a1-a2/default/adjective.json' with { type: 'json' }
import adjectivedefault2 from '../../json/a2-b1/default/adjective.json' with { type: 'json' }
import adjectivedefault3 from '../../json/b1-b2/default/adjective.json' with { type: 'json' }
import adjectivedefault4 from '../../json/c1-c2/default/adjective.json' with { type: 'json' }
import adjectivedirty1 from '../../json/a1-a2/dirty/adjective.json' with { type: 'json' }
import adjectivedirty2 from '../../json/a2-b1/dirty/adjective.json' with { type: 'json' }
import adjectivedirty3 from '../../json/b1-b2/dirty/adjective.json' with { type: 'json' }
import adjectivedirty4 from '../../json/c1-c2/dirty/adjective.json' with { type: 'json' }
import adjectivedoctor1 from '../../json/a1-a2/doctor/adjective.json' with { type: 'json' }
import adjectivedoctor2 from '../../json/a2-b1/doctor/adjective.json' with { type: 'json' }
import adjectivedoctor3 from '../../json/b1-b2/doctor/adjective.json' with { type: 'json' }
import adjectivedoctor4 from '../../json/c1-c2/doctor/adjective.json' with { type: 'json' }
import adjectivemusic1 from '../../json/a1-a2/music/adjective.json' with { type: 'json' }
import adjectivemusic2 from '../../json/a2-b1/music/adjective.json' with { type: 'json' }
import adjectivemusic3 from '../../json/b1-b2/music/adjective.json' with { type: 'json' }
import adjectivemusic4 from '../../json/c1-c2/music/adjective.json' with { type: 'json' }
//#endregion

import vEinburger from '../../json/einburgerungstest/verb.json' with { type: 'json' }
import adjEinburger from '../../json/einburgerungstest/adjective.json' with { type: 'json' }
import advEinburger from '../../json/einburgerungstest/adverb.json' with { type: 'json' }

//#region static json Arrays
export let staticWordLists = {
  b1telcpt1: {
    default: {
      verb: verbdefault1,
      adjective: adjectivedefault1,
      adverb: adverbdefault1
    },
    dirty: {
      verb: verbdirty1,
      adjective: adjectivedirty1,
      adverb: adverbdirty1
    },
    doctor: {
      verb: verbdoctor1,
      adjective: adjectivedoctor1,
      adverb: adverbdoctor1
    },
    music: {
      verb: verbmusic1,
      adjective: adjectivemusic1,
      adverb: adverbmusic1
    }
  },
  b1telcpt2: {
    default: {
      verb: verbdefault2,
      adjective: adjectivedefault2,
      adverb: adverbdefault2
    },
    dirty: {
      verb: verbdirty2,
      adjective: adjectivedirty2,
      adverb: adverbdirty2
    },
    doctor: {
      verb: verbdoctor2,
      adjective: adjectivedoctor2,
      adverb: adverbdoctor2
    },
    music: {
      verb: verbmusic2,
      adjective: adjectivemusic2,
      adverb: adverbmusic2
    }
  },
  b1telcpt3: {
    default: {
      verb: verbdefault3,
      adjective: adjectivedefault3,
      adverb: adverbdefault3
    },
    dirty: {
      verb: verbdirty3,
      adjective: adjectivedirty3,
      adverb: adverbdirty3
    },
    doctor: {
      verb: verbdoctor3,
      adjective: adjectivedoctor3,
      adverb: adverbdoctor3
    },
    music: {
      verb: verbmusic3,
      adjective: adjectivemusic3,
      adverb: adverbmusic3
    }
  },
  b1telcpt4: {
    default: {
      verb: verbdefault4,
      adjective: adjectivedefault4,
      adverb: adverbdefault4
    },
    dirty: {
      verb: verbdirty4,
      adjective: adjectivedirty4,
      adverb: adverbdirty4
    },
    doctor: {
      verb: verbdoctor4,
      adjective: adjectivedoctor4,
      adverb: adverbdoctor4
    },
    music: {
      verb: verbmusic4,
      adjective: adjectivemusic4,
      adverb: adverbmusic4
    }
  },
  einburgerungstest: {
    einburgerungstest: {
      verb: vEinburger,
      adjective: adjEinburger,
      adverb: advEinburger
    }
  }
}
//#endregion
const JSON_URLS_NOUN = {
  b1telcpt1: 
  {
    default: `${ASSETS_BASE_URL}/json/a1-a2/default/noun.json`,
    dirty: `${ASSETS_BASE_URL}/json/a1-a2/dirty/noun.json`,
    doctor: `${ASSETS_BASE_URL}/json/a1-a2/doctor/noun.json`,
    music: `${ASSETS_BASE_URL}/json/a1-a2/music/noun.json`
  },
  b1telcpt2:
  {
    default: `${ASSETS_BASE_URL}/json/a2-b1/default/noun.json`,
    dirty: `${ASSETS_BASE_URL}/json/a2-b1/dirty/noun.json`,
    doctor: `${ASSETS_BASE_URL}/json/a2-b1/doctor/noun.json`,
    music: `${ASSETS_BASE_URL}/json/a2-b1/music/noun.json`
  },
  b1telcpt3:
  {
    default: `${ASSETS_BASE_URL}/json/b1-b2/default/noun.json`,
    dirty: `${ASSETS_BASE_URL}/json/b1-b2/dirty/noun.json`,
    doctor: `${ASSETS_BASE_URL}/json/b1-b2/doctor/noun.json`,
    music: `${ASSETS_BASE_URL}/json/b1-b2/music/noun.json`
  },
  b1telcpt4:
  {
    default: `${ASSETS_BASE_URL}/json/c1-c2/default/noun.json`,
    dirty: `${ASSETS_BASE_URL}/json/c1-c2/dirty/noun.json`,
    doctor: `${ASSETS_BASE_URL}/json/c1-c2/doctor/noun.json`,
    music: `${ASSETS_BASE_URL}/json/c1-c2/music/noun.json`
  },
  einburgerungstest: 
  {
    einburgerungstest:`${ASSETS_BASE_URL}/json/einburgerungstest/noun.json`
  }
}

const JSON_URLS_VERB = {
  b1telcpt1: 
  {
    default: `${ASSETS_BASE_URL}/json/a1-a2/default/verb.json`,
    dirty: `${ASSETS_BASE_URL}/json/a1-a2/dirty/verb.json`,
    doctor: `${ASSETS_BASE_URL}/json/a1-a2/doctor/verb.json`,
    music: `${ASSETS_BASE_URL}/json/a1-a2/music/verb.json`
  },
  b1telcpt2:
  {
    default: `${ASSETS_BASE_URL}/json/a2-b1/default/verb.json`,
    dirty: `${ASSETS_BASE_URL}/json/a2-b1/dirty/verb.json`,
    doctor: `${ASSETS_BASE_URL}/json/a2-b1/doctor/verb.json`,
    music: `${ASSETS_BASE_URL}/json/a2-b1/music/verb.json`
  },
  b1telcpt3:
  {
    default: `${ASSETS_BASE_URL}/json/b1-b2/default/verb.json`,
    dirty: `${ASSETS_BASE_URL}/json/b1-b2/dirty/verb.json`,
    doctor: `${ASSETS_BASE_URL}/json/b1-b2/doctor/verb.json`,
    music: `${ASSETS_BASE_URL}/json/b1-b2/music/verb.json`
  },
  b1telcpt4:
  {
    default: `${ASSETS_BASE_URL}/json/c1-c2/default/verb.json`,
    dirty: `${ASSETS_BASE_URL}/json/c1-c2/dirty/verb.json`,
    doctor: `${ASSETS_BASE_URL}/json/c1-c2/doctor/verb.json`,
    music: `${ASSETS_BASE_URL}/json/c1-c2/music/verb.json`,
  },
  einburgerungstest: 
  {
    einburgerungstest:`${ASSETS_BASE_URL}/json/einburgerungstest/verb.json`
  }
}

const JSON_URLS_ADJECTIVE = {
  b1telcpt1: 
  {
    default: `${ASSETS_BASE_URL}/json/a1-a2/default/adjective.json`,
    dirty: `${ASSETS_BASE_URL}/json/a1-a2/dirty/adjective.json`,
    doctor: `${ASSETS_BASE_URL}/json/a1-a2/doctor/adjective.json`,
    music: `${ASSETS_BASE_URL}/json/a1-a2/music/adjective.json`
  },
  b1telcpt2:
  {
    default: `${ASSETS_BASE_URL}/json/a2-b1/default/adjective.json`,
    dirty: `${ASSETS_BASE_URL}/json/a2-b1/dirty/adjective.json`,
    doctor: `${ASSETS_BASE_URL}/json/a2-b1/doctor/adjective.json`,
    music: `${ASSETS_BASE_URL}/json/a2-b1/music/adjective.json`
  },
  b1telcpt3:
  {
    default: `${ASSETS_BASE_URL}/json/b1-b2/default/adjective.json`,
    dirty: `${ASSETS_BASE_URL}/json/b1-b2/dirty/adjective.json`,
    doctor: `${ASSETS_BASE_URL}/json/b1-b2/doctor/adjective.json`,
    music: `${ASSETS_BASE_URL}/json/b1-b2/music/adjective.json`
  },
  b1telcpt4:
  {
    default: `${ASSETS_BASE_URL}/json/c1-c2/default/adjective.json`,
    dirty: `${ASSETS_BASE_URL}/json/c1-c2/dirty/adjective.json`,
    doctor: `${ASSETS_BASE_URL}/json/c1-c2/doctor/adjective.json`,
    music: `${ASSETS_BASE_URL}/json/c1-c2/music/adjective.json`,
  },
  einburgerungstest: 
  {
    einburgerungstest:`${ASSETS_BASE_URL}/json/einburgerungstest/adjective.json`
  }
}

const JSON_URLS_ADVERB = {
  b1telcpt1: 
  {
    default: `${ASSETS_BASE_URL}/json/a1-a2/default/adverb.json`,
    dirty: `${ASSETS_BASE_URL}/json/a1-a2/dirty/adverb.json`,
    doctor: `${ASSETS_BASE_URL}/json/a1-a2/doctor/adverb.json`,
    music: `${ASSETS_BASE_URL}/json/a1-a2/music/adverb.json`
  },
  b1telcpt2:
  {
    default: `${ASSETS_BASE_URL}/json/a2-b1/default/adverb.json`,
    dirty: `${ASSETS_BASE_URL}/json/a2-b1/dirty/adverb.json`,
    doctor: `${ASSETS_BASE_URL}/json/a2-b1/doctor/adverb.json`,
    music: `${ASSETS_BASE_URL}/json/a2-b1/music/adverb.json`
  },
  b1telcpt3:
  {
    default: `${ASSETS_BASE_URL}/json/b1-b2/default/adverb.json`,
    dirty: `${ASSETS_BASE_URL}/json/b1-b2/dirty/adverb.json`,
    doctor: `${ASSETS_BASE_URL}/json/b1-b2/doctor/adverb.json`,
    music: `${ASSETS_BASE_URL}/json/b1-b2/music/adverb.json`
  },
  b1telcpt4:
  {
    default: `${ASSETS_BASE_URL}/json/c1-c2/default/adverb.json`,
    dirty: `${ASSETS_BASE_URL}/json/c1-c2/dirty/adverb.json`,
    doctor: `${ASSETS_BASE_URL}/json/c1-c2/doctor/adverb.json`,
    music: `${ASSETS_BASE_URL}/json/c1-c2/music/adverb.json`,
  },
  einburgerungstest: 
  {
    einburgerungstest:`${ASSETS_BASE_URL}/json/einburgerungstest/adverb.json`
  }
}

export const JSON_URLS = {
  noun: JSON_URLS_NOUN,
  verb: JSON_URLS_VERB,
  adjective: JSON_URLS_ADJECTIVE,
  adverb: JSON_URLS_ADVERB,
}
