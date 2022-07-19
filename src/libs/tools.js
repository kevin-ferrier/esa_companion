import moment from "moment";
export async function getSchedule(schedNumber) {
  try {
    const stream =
      "https://app.esamarathon.dev/horaro-proxy/v2/esa/schedule/2022-summer" +
      schedNumber;
    // Get schedule for stream
    const res = await fetch(stream, {
      method: "GET",
      mode: "cors",
    });
    const txt = await res.text();
    return JSON.parse(txt).data;
  } catch (error) {
    console.log("Failed to get schedule", error);
  }
}

export function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

function isCurrentgame(game) {
  let now = moment();
  let gameStart = moment(game.scheduled);
  let gameEnd = moment(game.scheduled).add(game.length, "s");
  return !gameStart.isAfter(now) && gameEnd.isAfter(now);
}
export function getCurrentGame(schedule) {
  // get the games from the schedule
  for (let i = 0; i < schedule.length; i++) {
    if (isCurrentgame(schedule[i])) {
      return schedule[i];
    }
  }
  return undefined;
}
