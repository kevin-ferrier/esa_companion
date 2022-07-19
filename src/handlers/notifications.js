import { getSchedule, getCurrentGame } from "../libs/tools.js";
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
    // todo: refactor into a loop
    if (
      currentGame1 !== undefined &&
      notifyArray.indexOf(currentGame1.id) == -1
    ) {
      sendNotification(currentGame1.game, "1", currentGame1.category);
      await setLocalStorageData(currentGame1.id, true);
      notifyArray.push(currentGame1.id);
    }
    if (
      currentGame2 !== undefined &&
      notifyArray.indexOf(currentGame2.id) == -1
    ) {
      sendNotification(currentGame2.game, "2", currentGame2.category);
      await setLocalStorageData(currentGame2.id, true);
      notifyArray.push(currentGame2.id);
    }
    // save the pushed notifications
    await setLocalStorageData("notifyArray", notifyArray);
  }
}
