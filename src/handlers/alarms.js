export function initBackgroundTimer() {
  chrome.alarms.get("alarm", (a) => {
    if (!a) {
      chrome.alarms.create("alarm", { periodInMinutes: 1 });
    }
  });
}
