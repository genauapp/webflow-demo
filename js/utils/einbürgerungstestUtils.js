export const getQuestionsByState = (questions, state) => {
  if (
    questions === null ||
    questions.length === 0 ||
    state === null ||
    state.trim().length === 0
  ) {
    return []
  }

  const questionsByState = questions.filter(
    (question) => question.state === state
  )

  return questionsByState
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
