export default class LevelManager {
    static getCurrentLevel() {
        const pathSegments = window.location.pathname.split('/');
        const level = pathSegments.includes('level') ? pathSegments[pathSegments.length - 1] : null;

        console.log('current level is ' + level); // "a1" ya da null
        return level
    }
}