import {
  capitalize,
  getQuestionsByState,
} from '../utils/einburgerungstestUtils.js'

import questionsJson from '../../json/einburgerungstest/questions.json' with { type: 'json' }

let currentState

let questions

const loadQuestions = async () => {
  questions = [...getQuestionsByState(questionsJson, currentState)]
}

document.querySelectorAll('.state-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    const currentState = link.getAttribute('data-option')

    document.getElementById('dropdown-header').innerText = currentState

    console.log(currentState)

    await loadQuestions()
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  // set initial state
  currentState = "Berlin"

  await loadQuestions()

  console.log(questions)
})
