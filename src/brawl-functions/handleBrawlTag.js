const fs = require('fs');

function fetchBrawlTags() {
  try {
    const data = fs.readFileSync('./JSON/tag.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Errore nella lettura del file:', err);
    return {};
  }
}

function checkTag(inputString) {
  const mappings = fetchBrawlTags();
  return mappings[inputString] || null;
}

function writeTag(chiave, valore) {
  try {
    const mappings = fetchBrawlTags();
    mappings[chiave] = valore;
    fs.writeFileSync('./JSON/tag.json', JSON.stringify(mappings, null, 2));
  } catch (err) {
    console.error('Errore nell\'aggiunta della corrispondenza:', err);
  }
}

module.exports = { checkTag, writeTag };