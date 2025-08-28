import {
  DeckStatus,
  JourneyDeckDefinition,
  JourneyDeckExample,
} from '../../../constants/props.js'
import StringUtils from '../../../utils/StringUtils.js'

let els = {}

function initElements() {
  els = {
    container: () => document.getElementById('pack-journey-map-card-body'),
  }
}

// reusable interactivity helper
function applyInteractivity(stageEl, stage, onStageSelected) {
  stageEl.dataset.stageId = stage.id
  // remove any old click handler
  stageEl.onclick = null
  // if (stage.status === DeckStatus.UNLOCKED) {
  stageEl.classList.add('interactive')
  stageEl.onclick = () => onStageSelected(stage.id)
  // } else {
  //   stageEl.classList.remove('interactive')
  // }
}

export function renderJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return
  els.container().innerHTML = ''

  journeyState.deckSummaries.forEach((stage) => {
    // Template for the card, similar to Webflow design
    const deckIconMap = {
      [DeckStatus.COMPLETED]:
        'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867edb032e5761a11df21f8_Deck-Done-Icon.svg',
      [DeckStatus.UNLOCKED]:
        'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867f1777c967e660b340f8e_Deck-Active-Icon.svg',
      [DeckStatus.LOCKED]:
        'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867f1c82efe8066bdf2d453_Deck-Locked-Icon.svg',
    }
    const playIconMap = {
      [DeckStatus.COMPLETED]:
        'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867ef69a8a0407343d6b8a9_Play-Done-Icon.svg',
      [DeckStatus.UNLOCKED]:
        'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867f16a21d27d8f10520c30_Play-Active-Icon.svg',
      [DeckStatus.LOCKED]: '',
    }
    const template = `
      <a href="#" class="journey-stage-container w-inline-block ${
        stage.status
      }">
        <div class="w-layout-hflex stage-header-container">
          <div class="w-layout-hflex stage-header-left">
            <img src="${deckIconMap[stage.status] || ''}" loading="lazy" alt="">
            <div class="w-layout-vflex stage-header-deck-overview">
              <h1 class="stage-header-title heading-42">${StringUtils.capitalize(
                stage.wordType
              )}</h1>
              <div id="Word_Count_Badge" class="w-layout-hflex stage-header-deck-words-count-container noimage">
                <div class="w-layout-hflex stage-header-deck-words-count">
                  <div id="Word_Count_Text" class="words-count-label">${
                    stage.wordsCount
                  }</div>
                  <div id="Word_Count_Text" class="words-count-suffix-label">Words</div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-layout-hflex stage-header-right">
            ${
              playIconMap[stage.status]
                ? `<img src="${
                    playIconMap[stage.status]
                  }" loading="lazy" alt="">`
                : ''
            }
          </div>
        </div>
        <div class="w-layout-hflex stage-footer-container">
          <div class="stage-footer-label">What is it?&nbsp;<span class="stage-footer-description-label">${
            JourneyDeckDefinition[stage.wordType] || ''
          }</span></div>
            <div class="stage-footer-label">Example:&nbsp;<span class="stage-footer-description-label">${
              JourneyDeckExample[stage.wordType] || ''
            }</span></div>
          </div>
          </a>
          `

    // todo: deck example
    // <div class="stage-footer-label">Example: &nbsp;<span class="stage-footer-description-label">${stage.description || ''}</span></div>

    const wrapper = document.createElement('div')
    wrapper.innerHTML = template.trim()
    const stageContainerEl = wrapper.firstElementChild

    applyInteractivity(stageContainerEl, stage, onStageSelected)
    els.container().appendChild(stageContainerEl)
  })
}

export function updateJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return

  const deckIconMap = {
    [DeckStatus.COMPLETED]:
      'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867edb032e5761a11df21f8_Deck-Done-Icon.svg',
    [DeckStatus.UNLOCKED]:
      'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867f1777c967e660b340f8e_Deck-Active-Icon.svg',
    [DeckStatus.LOCKED]:
      'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867f1c82efe8066bdf2d453_Deck-Locked-Icon.svg',
  }
  const playIconMap = {
    [DeckStatus.COMPLETED]:
      'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867ef69a8a0407343d6b8a9_Play-Done-Icon.svg',
    [DeckStatus.UNLOCKED]:
      'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/6867f16a21d27d8f10520c30_Play-Active-Icon.svg',
    [DeckStatus.LOCKED]: '',
  }
  journeyState.deckSummaries.forEach((stage) => {
    const stageEl = els
      .container()
      .querySelector(`[data-stage-id="${stage.id}"]`)
    if (!stageEl) return

    // update status class and href
    stageEl.className = `journey-stage-container w-inline-block ${stage.status}`
    stageEl.setAttribute('href', '#')

    // update deck icon
    const deckIcon = stageEl.querySelector('.stage-header-left img')
    if (deckIcon) deckIcon.src = deckIconMap[stage.status] || ''

    // update word type
    const wordTypeEl = stageEl.querySelector('.stage-header-title')
    if (wordTypeEl)
      wordTypeEl.textContent = StringUtils.capitalize(stage.wordType)

    // update word count
    const wordCountEl = stageEl.querySelector('.words-count-label')
    if (wordCountEl) wordCountEl.textContent = stage.wordsCount

    // update play icon
    const playIcon = stageEl.querySelector('.stage-header-right img')
    if (playIcon) {
      if (playIconMap[stage.status]) {
        playIcon.src = playIconMap[stage.status]
        playIcon.style.display = ''
      } else {
        playIcon.style.display = 'none'
      }
    }

    // update footer description
    const footerDescEl = stageEl.querySelector(
      '.stage-footer-description-label'
    )
    if (footerDescEl)
      footerDescEl.textContent = JourneyDeckDefinition[stage.wordType] || ''

    // update footer example (if present)
    const footerExampleEl = stageEl.querySelector(
      '.stage-footer-label + .stage-footer-label .stage-footer-description-label'
    )
    if (footerExampleEl) footerExampleEl.textContent = stage.description || ''

    applyInteractivity(stageEl, stage, onStageSelected)
  })
}

export function mountJourneyMapCardBody(journeyState, onStageSelected) {
  initElements()
  renderJourneyMap(journeyState, onStageSelected)
}

export function unmountJourneyMapCardBody() {
  if (els.container) els.container().innerHTML = ''
}
