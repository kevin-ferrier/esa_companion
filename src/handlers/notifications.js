import { getSchedule, getCurrentGame } from "../libs/esa.js";
import {
  getLocalStorageData,
  getSyncStorageData,
  setLocalStorageData,
  setSyncStorageData,
} from "../libs/storage";
import { sendNotification } from "../libs/notifications.js";

// Check notifications background check
// eslint-disable-next-line
export async function handleNotifications(a) {
  console.log("Checking for notifcations...");
  let stream1 = await getSchedule(1);
  let stream2 = await getSchedule(2);
  let notifyAll = await getSyncStorageData("notifyAll");
  let notifyArray = await getLocalStorageData("notifyArray");

  // init undefined values
  if (notifyArray === undefined) {
    notifyArray = [];
    await setLocalStorageData("notifyArray", notifyArray);
  }
  if (notifyAll === undefined) {
    notifyAll = true;
    await setSyncStorageData("notifyAll", true);
  }
  if (notifyAll) {
    // get the current game for stream 1 and 2
    const currentGame1 = getCurrentGame(stream1);
    const currentGame2 = getCurrentGame(stream2);

    const games = [currentGame1, currentGame2];
    for (let i = 0; i < games.length; i++) {
      let current = games[i];
      let streamNumber = i + 1;
      if (current !== undefined && notifyArray.indexOf(current.id) == -1) {
        sendNotification(
          current.game,
          streamNumber.toString(),
          current.category
        );
        notifyArray.push(current.id);
      }
    }
    // save the pushed notifications
    await setLocalStorageData("notifyArray", notifyArray);
  }
}
