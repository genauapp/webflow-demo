import { ASSETS_BASE_URL } from "./urls.js"

export const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'einburgerungstest']
export const types = ['noun', 'verb', 'adjective', 'adverb']
export const categories = {
    a1: [{
        nameShort: "alltag",
        name: "Alltag",
        nameEng: "Daily Life",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.png`,
    }, {
        nameShort: "einkaufen",
        name: "Einkaufen & Essen",
        nameEng: "Shopping & Food",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-Shopping&Food.png`,
    }, {
        nameShort: "gesundheit",
        name: "Gesundheit",
        nameEng: "Health",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-Gesundheit.png`,
    }, {
        nameShort: "behoerden",
        name: "Behörden & Termin",
        nameEng: "Official Appointments",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-OfficialAppointments.png`,
    }],
    a2: [{
        nameShort: "alltag",
        name: "Alltag",
        nameEng: "Daily Life",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A1-DailyLife.png`,
    }, {
        nameShort: "freizeit",
        name: "Freizeit & Konsum",
        nameEng: "Leisure & Consumption",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Leisure.png`,
    }, {
        nameShort: "medien",
        name: "Medien & Kommunikation",
        nameEng: "Media & Communication",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Media&Consumption.png`,
    }, {
        nameShort: "arbeit",
        name: "Arbeit & Behörden",
        nameEng: "Work & Authorities",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/A2-Work&Authorities.png`,
    }],
    b1: [{
        nameShort: "gefuehle",
        name: "Gefühle & Beziehungen",
        nameEng: "Emotions & Relationships",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Emotions.png`,
    }, {
        nameShort: "reisen",
        name: "Reisen & Verkehr",
        nameEng: "Travel & Transportation",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Travel&Transportation.png`,
    }, {
        nameShort: "wohnen",
        name: "Wohnen & Umwelt",
        nameEng: "Living & Environment",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-Living&Environment.png`,
    }, {
        nameShort: "slang",
        name: "German Slang",
        nameEng: "German Slang",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B1-German Slang.png`,
    }],
    b2: [{
        nameShort: "bildung",
        name: "Wissenschaft & Bildung",
        nameEng: "Science & Education",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Science&Education.png`,
    }, {
        nameShort: "kultur",
        name: "Gesellschaft & Kultur",
        nameEng: "Society & Culture",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Society&Culture.png`,
    }, {
        nameShort: "politik",
        name: "Politik & Umwelt",
        nameEng: "Politics & Environment",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Politics&Environment.png`,
    }, {
        nameShort: "technik",
        name: "Digitalisierung & Technik",
        nameEng: "Digitalization & Technology",
        imgUrl: `${ASSETS_BASE_URL}/assets/images/decks/B2-Digitalization&TEchnology.png`,
    }],
    c1: [],
    c2: []
}