import { DeckStatus } from '../../../constants/props'

let els = {}

function initElements() {
  els = {
    container: document.getElementById('pack-journey-map-card-body'),
  }
}

function renderJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return

  els.container.innerHTML = ''

  const deckSummaries = journeyState.deckSummaries

  deckSummaries.forEach((stage) => {
    const stageEl = document.createElement('div')
    stageEl.className = `journey-stage ${stage.status}`
    stageEl.dataset.stageId = stage.id
    stageEl.textContent = stage.word_type

    if (stage.status === DeckStatus.COMPLETED) {
      stageEl.innerHTML += '<span class="checkmark">✓</span>'
    }

    if (stage.status === DeckStatus.UNLOCKED) {
      stageEl.addEventListener('click', () => onStageSelected(stage.id))
      stageEl.classList.add('interactive')
    }

    els.container.appendChild(stageEl)
  })
}

export function updateJourneyMap(journeyState) {
  if (!els.container) return

  const deckSummaries = journeyState.deckSummaries

  deckSummaries.forEach((stage) => {
    const stageEl = els.container.querySelector(`[data-stage-id="${stage.id}"]`)
    if (!stageEl) return

    // Update status classes
    stageEl.className = `journey-stage ${stage.status}`
    if (stage.status === DeckStatus.UNLOCKED) {
      stageEl.classList.add('interactive')
    }

    // Update completion marker
    const checkmark = stageEl.querySelector('.checkmark')
    if (stage.status === DeckStatus.COMPLETED && !checkmark) {
      stageEl.innerHTML += '<span class="checkmark">✓</span>'
    } else if (!(stage.status === DeckStatus.COMPLETED) && checkmark) {
      stageEl.removeChild(checkmark)
    }
  })
}

export function initJourneyMapCardBody(journeyState, onStageSelected) {
  initElements()
  renderJourneyMap(journeyState, onStageSelected)
}

export function unmountJourneyMapCardBody() {
  if (els.container) els.container.innerHTML = ''
}
