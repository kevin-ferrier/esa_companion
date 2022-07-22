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
          :notify-custom="notifyCustom"
          :notify-all="notifyAll"
          v-show="filtered(item.game, item.scheduled, item.length)"
          @track="(gameId) => trackGame(gameId)"
          @untrack="(gameId) => untrackGame(gameId)"
        ></game-card>
      </ul>
    </div>
    <div v-else>
      <ul v-for="item in schedule2" :key="item.id">
        <game-card
          :item="item"
          stream="2"
          :notify-custom="notifyCustom"
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
      <select
        class="form-select w-30 appearance-none block w-50 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none"
        aria-label="Default select example"
        v-model="notifyAll"
      >
        <option value="None">None</option>
        <option value="Custom">Custom</option>
        <option value="All">All</option>
      </select>
    </div>
    <div class="flex mt-3">
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
    <div class="flex">
      <button
        @click="resetSettings()"
        type="button"
        class="w-full mt-5 inline-block px-6 py-2.5 mx-3 bg-red-400 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-300 hover:shadow-lg focus:bg-red-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-300 active:shadow-lg transition duration-150 ease-in-out"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import NavBar from "../components/navbar.vue";
import GameCard from "../components/gameCard.vue";
import { getSyncStorageData, setSyncStorageData } from "../libs/storage.js";
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
      notifyAll: "All",
      notifyCustom: {},
      selected: 1,
      filter: "",
      settingsDisplayed: false,
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
    setSchedule(schedule) {
      this.selected = schedule;
    },
    async saveSettings() {
      if (this.notifyAll !== "Custom") {
        this.notifyCustom = [];
      }
      localStorage.setItem("displayOldGames", this.displayOldGames);
      await this.updateSettingsBackend();
      this.settingsDisplayed = false;
    },
    async getSettings() {
      // local settings
      var settings_value = localStorage.getItem("displayOldGames");
      if (settings_value !== undefined) {
        this.displayOldGames = settings_value;
      }
      // synced settings
      this.notifyAll = await getSyncStorageData("notifyAll");
      if (this.notifyAll === undefined) {
        this.notifyAll = "None";
      }
      this.notifyCustom = await getSyncStorageData("notifyCustom");
      if (this.notifyCustom === undefined) {
        this.notifyCustom = {};
      }
      await this.updateSettingsBackend();
    },
    async updateSettingsBackend() {
      await setSyncStorageData("notifyAll", this.notifyAll);
      await setSyncStorageData("notifyCustom", this.notifyCustom);
    },
    async trackGame(gameId) {
      this.notifyCustom[gameId] = true;
      if (this.notifyAll !== "Custom") {
        this.notifyAll = "Custom";
      }
      await this.updateSettingsBackend();
    },
    async untrackGame(gameId) {
      delete this.notifyCustom[gameId];
      if (this.notifyAll !== "Custom") {
        this.notifyAll = "Custom";
      }
      await this.updateSettingsBackend();
    },
    async resetSettings() {
      chrome.storage.sync.clear();
      localStorage.clear();
      this.settingsDisplayed = false;
      await this.getSettings();
    },
  },
  async mounted() {
    // Retrieve stored settings
    await this.getSettings();
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
