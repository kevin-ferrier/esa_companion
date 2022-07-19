<template>
  <NavBar @settings="settingsDisplayed = !settingsDisplayed"></NavBar>
  <div class="main_app pt-3" v-if="!settingsDisplayed">
    <!-- stream select -->
    <div class="flex items-center justify-center mb-2">
      <div
        class="inline-flex shadow-md hover:shadow-lg focus:shadow-lg w-full mx-2"
        role="group"
      >
        <button
          @click="setSchedule(1)"
          type="button"
          class="w-full rounded-l inline-block px-6 py-2.5 bg-violet-900 text-white font-medium text-xs leading-tight uppercase hover:bg-violet-700 focus:bg-violet-700 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
          :class="{ 'bg-violet-800': selected === 1 }"
        >
          Stream1
        </button>
        <button
          @click="setSchedule(2)"
          type="button"
          class="w-full rounded-r inline-block px-6 py-2.5 bg-violet-900 text-white font-medium text-xs leading-tight uppercase hover:bg-violet-700 focus:bg-violet-700 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
          :class="{ 'bg-violet-800': selected === 2 }"
        >
          Stream2
        </button>
      </div>
    </div>
    <!-- search -->
    <div class="flex justify-center">
      <div class="mb-3 w-full px-2">
        <input
          type="search"
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="searchGame"
          placeholder="Search game"
          v-model="filter"
        />
      </div>
    </div>
    <!-- schedule -->
    <div v-if="selected == 1">
      <ul v-for="item in schedule1" :key="item.id">
        <game-card
          :item="item"
          stream="1"
          v-show="filtered(item.game, item.scheduled, item.length)"
        ></game-card>
      </ul>
    </div>
    <div v-else>
      <ul v-for="item in schedule2" :key="item.id">
        <game-card
          :item="item"
          stream="2"
          v-show="filtered(item.game, item.scheduled, item.length)"
        ></game-card>
      </ul>
    </div>
  </div>
  <!-- Settings page -->
  <div class="main_app pt-3" v-else>
    <div class="form-check flex items-center">
      <label class="text-xl py-3 px-3">Display past games</label>
      <input
        class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-violet-600 checked:border-violet-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
        type="checkbox"
        v-model="displayOldGames"
        id="flexCheckDefault3"
      />
    </div>
    <div class="form-check flex items-center">
      <label class="text-xl py-3 px-3">Notify new game starting</label>
      <input
        class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-violet-600 checked:border-violet-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
        type="checkbox"
        v-model="notifyAll"
        id="flexCheckDefault3"
      />
    </div>
    <div class="flex">
      <button
        @click="saveSettings()"
        type="button"
        class="w-full inline-block px-6 py-2.5 mx-3 bg-violet-900 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Save
      </button>
      <button
        @click="settingsDisplayed = !settingsDisplayed"
        type="button"
        class="w-full inline-block px-6 py-2.5 mx-3 bg-purple-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-300 hover:shadow-lg focus:bg-purple-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-300 active:shadow-lg transition duration-150 ease-in-out"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import NavBar from "../components/navbar.vue";
import GameCard from "../components/gameCard.vue";
export default {
  name: "popupView",
  components: {
    NavBar,
    GameCard,
  },
  data() {
    return {
      msg: "popup",
      schedule1: [],
      schedule2: [],
      selected: 1,
      filter: "",
      settingsDisplayed: false,
      notifyAll: false,
      displayOldGames: true,
    };
  },
  methods: {
    filtered(title, scheduled, length) {
      // check if we display old games
      if (!this.displayOldGames && this.isPastGame(scheduled, length)) {
        return false;
      }
      // filter with the searchbox
      if (this.filter !== "") {
        return title.toLowerCase().includes(this.filter.toLowerCase());
      } else {
        return true;
      }
    },
    isPastGame(scheduled, length) {
      var now = moment();
      var gameStart = moment(scheduled);
      var gameEnd = moment(scheduled).add(length, "s");
      if (gameStart.isAfter(now) || gameEnd.isAfter(now)) {
        // upcoming game or current
        return false;
      } else {
        // previous game
        return true;
      }
    },
    async getSchedule() {
      this.schedule = "updating";
      try {
        // const localhost = "http://localhost:8000/";
        const stream1 =
          "https://app.esamarathon.dev/horaro-proxy/v2/esa/schedule/2022-summer1";
        const stream2 =
          "https://app.esamarathon.dev/horaro-proxy/v2/esa/schedule/2022-summer2";
        // Get schedule for stream1
        const res1 = await fetch(stream1, {
          method: "GET",
          mode: "cors",
        });
        const txt1 = await res1.text();
        this.schedule1 = JSON.parse(txt1).data;
        // get schedule for stream2
        const res2 = await fetch(stream2, {
          method: "GET",
          mode: "cors",
        });
        const txt2 = await res2.text();
        this.schedule2 = JSON.parse(txt2).data;
      } catch (error) {
        console.log("Failed");
        console.log(error);
      }
    },
    sendNotification(game) {
      const notifId = Math.random();
      chrome.notifications.create(notifId.toString(), {
        type: "basic",
        iconUrl: "esa66.png",
        title: "New Run Started",
        message: game,
        priority: 2,
      });
    },
    setSchedule(schedule) {
      this.selected = schedule;
    },
    saveSettings() {
      localStorage.setItem(
        "esa_settings",
        JSON.stringify({
          notifyAll: this.notifyAll,
          displayOldGames: this.displayOldGames,
        })
      );
      this.updateSettings();
      this.settingsDisplayed = false;
    },
    updateSettings() {
      var settings_value = JSON.parse(localStorage.getItem("esa_settings"));
      if (settings_value) {
        this.displayOldGames = settings_value.displayOldGames;
        this.notifyAll = settings_value.notifyAll;
      }
      this.updateWorkerSettings();
    },
    updateWorkerSettings() {
      chrome.storage.sync.set({ notifyAll: this.notifyAll });
    },
  },
  mounted() {
    // Retrieve stored settings
    this.updateSettings();
    // get all games in the schedule
    this.getSchedule();
  },
};
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
html {
  /* max is 800*600 */
  height: 800px;
  width: 400px;
  /* margin-left: 10px; */
  margin-right: 0px;
  background-image: url("../../public/background.png");
  background-repeat: repeat-y;
}
</style>
