import { DeckStatus } from '../../../constants/props.js'

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
  if (stage.status === DeckStatus.UNLOCKED) {
    stageEl.classList.add('interactive')
    stageEl.onclick = () => onStageSelected(stage.id)
  } else {
    stageEl.classList.remove('interactive')
  }
}

export function renderJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return
  els.container().innerHTML = ''

  journeyState.deckSummaries.forEach((stage) => {
    const stageEl = document.createElement('div')
    stageEl.className = `journey-stage ${stage.status}`
    stageEl.textContent = `${stage.wordType} Deck`

    if (stage._status === DeckStatus.COMPLETED) {
      stageEl.innerHTML += '<span class="checkmark">✓</span>'
    }

    applyInteractivity(stageEl, stage, onStageSelected)
    els.container().appendChild(stageEl)
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
