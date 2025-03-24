import {
  capitalize,
  getQuestionsByState,
} from '../utils/einburgerungstestUtils.js'

import questionsJson from '../json/einbürgerungstest.json' with { type: 'json' }

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
  // set initial state
  currentState = "Berlin"

  const loadedQuestions = await loadQuestionsJson()

  // set initial questions
  questions = [...loadedQuestions]

  console.log(questions)
})
