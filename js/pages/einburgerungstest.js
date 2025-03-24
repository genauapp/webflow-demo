import {
  capitalize,
  getQuestionsByState,
} from '../utils/einburgerungstestUtils.js'

import questionsJson from '../../json/einburgerungstest/questions.json' with { type: 'json' }

// Global Variables
let currentState
let showLearnAnswers
let questions

const loadQuestions = async () => {
  questions = [...getQuestionsByState(questionsJson, currentState)]
}

const setLearnTabElements = (questionIndex, numberOfQuestions, questionDescription, questionAnswers, questionCorrectAnswer) => {

  document.getElementById('learn-question-index').innerText = questionIndex
  document.getElementById('learn-questions-length').innerText = numberOfQuestions

  document.getElementById('learn-current-question-index-label').innerText = `Aufgabe ${questionIndex}`
  document.getElementById('learn-current-question-description-label').innerText = questionDescription

  questionAnswers.forEach((questionAnswer, i) => {
    const answerElement = document.getElementById(`learn-current-question-answer-${i+1}`)
    answerElement.innerText = questionAnswer

    if (showLearnAnswers && questionAnswer === questionCorrectAnswer) {
      answerElement.style.backgroundColor === '#0cac92'
    }
  })
}

document.querySelectorAll('.toggle-option-show-hide-correct-answer').forEach((toggleOption) => {
  toggleOption.addEventListener('click', () => {
    if (toggleOption.id === "Off" && toggleOption.classList.contains("active")) {
      console.log("hiding learn answers...")
      showLearnAnswers = false
    } else if (toggleOption.id === "On" && toggleOption.classList.contains("active")) {
      console.log("showing learn answers...")
      showLearnAnswers = true
    }
  })
})

document.querySelectorAll('.state-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    currentState = link.getAttribute('data-option')

    document.getElementById('dropdown-header').innerText = currentState

    console.log(currentState)

    await loadQuestions()
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  // set initial state
  currentState = "Berlin"
  showLearnAnswers = false

  await loadQuestions()

  console.log(questions)

  const firstQuestion = questions[0]

  // show initial question
  setLearnTabElements(1, questions.length, firstQuestion.question, firstQuestion.answers, firstQuestion.correct_answer)


})
