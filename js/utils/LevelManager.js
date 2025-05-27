import { CURRENT_CATEGORY_KEY } from "../constants/storageKeys.js";
import LocalStorageManager from "./LocalStorageManager.js";

export default class LevelManager {
    static getCurrentLevel() {
        const pathSegments = window.location.pathname.split('/');
        const level = pathSegments.includes('level') ? pathSegments[pathSegments.length - 1] : null;

        console.log('current level is ' + level); // "a1" ya da null
        return level
    }

    static getCurrentCategory() {
        const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
        console.log('current category is ' + category);

        return category
    }

    static checkIfCategoryIsInCategories(category) {
        const categories = categories[this.getCurrentLevel()]
        return categories.some(cat => cat.nameShort === category)
    }

}