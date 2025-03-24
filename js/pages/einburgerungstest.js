import {
  capitalize,
  getQuestionsByState,
} from '../utils/einbürgerungstestUtils.js'

import questionsJson from '../json/einbürgerungstest' with { type: 'json' }

let currentState

const questions = []

const loadQuestionsJson = async () => {
  return getQuestionsByState(questionsJson, currentState)
}

document.querySelectorAll('.state-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    // event.preventDefault()
    const currentState = link.getAttribute('data-option')

    document.getElementById('dropdown-header').innerText = currentState

    console.log(currentState)

    await loadQuestionsJson()
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  currentState = "Berlin"

  const loadedQuestions = await loadQuestionsJson()

  questions = [...loadedQuestions]

  console.log(questions)
})
