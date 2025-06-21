import { CURRENT_CATEGORY_KEY } from '../constants/storageKeys.js'
import LocalStorageManager from './LocalStorageManager.js'
import { PACK_SUMMARIES_BY_LEVEL } from '../constants/props.js'

export default class LevelManager {
  static getCurrentLevel() {
    const pathSegments = window.location.pathname.split('/')
    const level = pathSegments.includes('level')
      ? pathSegments[pathSegments.length - 1]
      : null
    return level
  }

  static getCurrentCategory() {
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
    return category
  }

  static checkIfCategoryIsInCategories(category) {
    const packSummaries = PACK_SUMMARIES_BY_LEVEL[this.getCurrentLevel()]
    return packSummaries.some((packSummary) => packSummary.category === category)
  }
}
