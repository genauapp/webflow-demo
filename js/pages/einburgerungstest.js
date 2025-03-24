import {
  capitalize,
  getQuestionsByState,
} from '../utils/einbürgerungstestUtils.js'

let selectedState

document.querySelectorAll('.dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    const selectedState = link.getAttribute('data-option') || 'berlin'

    document.getElementById('dropdown-header').innerText =
      capitalize(selectedState)

    console.log(selectedState)
  })
})
