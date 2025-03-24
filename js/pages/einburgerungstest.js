import {
  capitalize,
  getQuestionsByState,
} from '../utils/einbürgerungstestUtils.js'

let selectedState

document.querySelectorAll('.state-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    const selectedState = link.getAttribute('data-option') || 'Berlin'

    document.getElementById('dropdown-header').innerText = selectedState

    console.log(selectedState)
  })
})
