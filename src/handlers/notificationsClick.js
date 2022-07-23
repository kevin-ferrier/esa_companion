export async function handleNotificationsClick(params) {
  console.log(`Notification clicked: ${params}`);
  // TODO: get the schedule number to open the proper stream
  chrome.tabs.create({
    url: "https://www.twitch.tv/esamarathon",
  });
}
