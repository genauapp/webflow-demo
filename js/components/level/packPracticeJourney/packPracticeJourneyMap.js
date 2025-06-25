// packPracticeJourneyMap.js
let els = {}

function initElements() {
  els = {
    container: document.getElementById('pack-practice-journey-map-container'),
  }
}

function renderJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return

  els.container.innerHTML = ''

  journeyState.stages.forEach((stage) => {
    const stageEl = document.createElement('div')
    stageEl.className = `journey-stage ${stage.status}`
    stageEl.dataset.stageId = stage.id
    stageEl.textContent = stage.id

    if (stage.completed) {
      stageEl.innerHTML += '<span class="checkmark">✓</span>'
    }

    if (stage.status === 'unlocked') {
      stageEl.addEventListener('click', () => onStageSelected(stage.id))
      stageEl.classList.add('interactive')
    }

    els.container.appendChild(stageEl)
  })
}

export function updateJourneyMap(journeyState) {
  if (!els.container) return

  journeyState.stages.forEach((stage) => {
    const stageEl = els.container.querySelector(`[data-stage-id="${stage.id}"]`)
    if (!stageEl) return

    // Update status classes
    stageEl.className = `journey-stage ${stage.status}`
    if (stage.status === 'unlocked') {
      stageEl.classList.add('interactive')
    }

    // Update completion marker
    const checkmark = stageEl.querySelector('.checkmark')
    if (stage.completed && !checkmark) {
      stageEl.innerHTML += '<span class="checkmark">✓</span>'
    } else if (!stage.completed && checkmark) {
      stageEl.removeChild(checkmark)
    }
  })
}

export function initPackPracticeJourneyMap(journeyState, onStageSelected) {
  initElements()
  renderJourneyMap(journeyState, onStageSelected)
}

export function unmountPackPracticeJourneyMap() {
  if (els.container) els.container.innerHTML = ''
}
