import moment from "moment";
import { handleNotifications } from "../handlers/notifications.js";
import { initBackgroundTimer } from "../handlers/alarms.js";
import { handleNotificationsClick } from "../handlers/notificationsClick.js";
console.log(`[${moment().format()}]Starting ESA Companion worker.`);

// debug
// chrome.storage.local.clear();
// chrome.storage.sync.clear();

// add the periodic timer
chrome.alarms.onAlarm.addListener(handleNotifications);
chrome.runtime.onInstalled.addListener(initBackgroundTimer);
chrome.notifications.onClicked.addListener(handleNotificationsClick);
