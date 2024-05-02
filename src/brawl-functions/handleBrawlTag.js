const { getDatabase, ref, get, child, update } = require("firebase/database");
const db = getDatabase();

async function checkTag(userID) {
  try {
    const snapshot = await get(child(ref(db), 'brawlTag'));
    const fetchData = snapshot.val();
    return fetchData[userID];
  } catch (error) {
    console.error(error);
    return;
  }
}

function writeTag(key, vaalue) {
    update(ref(db, 'brawlTag'), {[key]: vaalue})
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { checkTag, writeTag };