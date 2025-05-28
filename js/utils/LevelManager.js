import { CURRENT_CATEGORY_KEY } from "../constants/storageKeys.js";
import LocalStorageManager from "./LocalStorageManager.js";
import { categories } from "../constants/props.js";

export default class LevelManager {
    static getCurrentLevel() {
        const pathSegments = window.location.pathname.split('/');
        const level = pathSegments.includes('level') ? pathSegments[pathSegments.length - 1] : null;
        return level
    }

    static getCurrentCategory() {
        const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
        return category
    }

    static checkIfCategoryIsInCategories(category) {
        const levelCategories = categories[this.getCurrentLevel()]
        return levelCategories.some(cat => cat.nameShort === category)
    }

}