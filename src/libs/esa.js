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
