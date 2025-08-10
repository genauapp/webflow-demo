import { DeckStatus, JourneyDeckDefinition } from '../../../constants/props.js'

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
    const template = `
      <div class="journey-stage-container ${stage.status}">
        <div class="stage-header-container">
          <div class="stage-header-left">
          <div class="stage-header-deck-overview">
              ${
                stage.status === DeckStatus.UNLOCKED
                  ? '<span class="unlocked">🔓</span>'
                  : ''
              }
              ${
                stage.status === DeckStatus.COMPLETED
                  ? '<span class="checkmark">✓</span>'
                  : ''
              }
              <div class="stage-header-title">${stage.wordType}</div>
              <div class="stage-header-deck-words-count-container">
                <div class="stage-header-deck-words-count">
                  <div class="words-count-label">${stage.wordsCount}</div>
                  <div class="words-count-suffix-label">${
                    ' Word' + stage.wordsCount === 1 ? '' : 's'
                  }</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="stage-footer-container">
            <span class="stage-footer-label">What is it?
              <span class="stage-footer-description-label">${
                JourneyDeckDefinition[stage.wordType] || ''
              }</span>
            </span>
          
            <span class="stage-footer-label">Example: 
              <span class="stage-footer-description-label">${
                stage.description || ''
              }</span>
            </span>
        </div>
      </div>
    `

    //     <div class="stage-footer-icon">
    //   <!-- Placeholder for icon, you can use stage.icon or status-based icon -->
    //   ${
    //     stage.icon ? `<span class="footer-icon">${stage.icon}</span>` : ''
    //   }
    // </div>

    const wrapper = document.createElement('div')
    wrapper.innerHTML = template.trim()
    const stageContainerEl = wrapper.firstElementChild

    applyInteractivity(stageContainerEl, stage, onStageSelected)
    els.container().appendChild(stageContainerEl)
  })
}

export function updateJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return

  journeyState.deckSummaries.forEach((stage) => {
    const stageEl = els
      .container()
      .querySelector(`[data-stage-id="${stage.id}"]`)
    if (!stageEl) return

    // update status class
    stageEl.classList.toggle('journey-stage', true)
    stageEl.classList.toggle(DeckStatus.COMPLETED, false)
    stageEl.className = `journey-stage ${stage.status}`

    // update checkmark
    const existing = stageEl.querySelector('.checkmark')
    if (stage.status === DeckStatus.COMPLETED) {
      if (!existing) stageEl.innerHTML += '<span class="checkmark">✓</span>'
    } else if (existing) {
      existing.remove()
    }

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
