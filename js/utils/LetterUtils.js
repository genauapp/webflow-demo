export default class WordUtils {
  static replaceUmlauts = (str) => {
    const umlautMap = {
      ä: 'ae',
      ö: 'oe',
      ü: 'ue',
      ß: 'ss',
      Ä: 'Ae',
      Ö: 'Oe',
      Ü: 'Ue',
    }
    return str.replace(/[äöüßÄÖÜ]/g, (match) => umlautMap[match])
  }
}
