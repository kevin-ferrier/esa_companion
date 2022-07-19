export function sendNotification(gameName, streamNumber, category) {
  const notifId = Math.random();
  chrome.notifications.create(notifId.toString(), {
    type: "basic",
    iconUrl: "esa66.png",
    title: "[stream" + streamNumber + "] New Run Started",
    message: gameName + " (" + category + ")",
    priority: 2,
  });
}
