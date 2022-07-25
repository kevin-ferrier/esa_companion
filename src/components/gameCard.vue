<template>
  <div class="flex flex-col justify-center">
    <div
      class="shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3"
      id="static-example"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-mdb-autohide="false"
    >
      <!-- bg-fuchsia-100 -->
      <!-- header -->
      <div
        class="flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-indigo-900 rounded-t-lg"
        :class="bgColor"
      >
        <p class="font-bold flex items-center" :class="txtColor">
          <!-- bell off -->
          <a v-if="!isTracked" @click="trackNotification()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </a>
          <a v-else @click="untrackNotification()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="black"
              viewBox="0 0 24 24"
              stroke="black"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </a>
          <!-- twitch -->
          <a href="#">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="info-circle"
              class="w-4 h-4 mr-2"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              @click="openStream(stream)"
            >
              <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                fill="currentColor"
                d="M391.17,103.47H352.54v109.7h38.63ZM285,103H246.37V212.75H285ZM120.83,0,24.31,91.42V420.58H140.14V512l96.53-91.42h77.25L487.69,256V0ZM449.07,237.75l-77.22,73.12H294.61l-67.6,64v-64H140.14V36.58H449.07Z"
              />
            </svg>
          </a>
          [{{ item.platform }}] {{ item.game }}
        </p>
        <div class="flex items-center">
          <p class="opacity-90 text-xs" :class="txtColor">
            {{ time }}
          </p>
        </div>
      </div>
      <!-- bottom -->
      <div class="p-3 rounded-b-lg break-words" :class="bgColor">
        <p :class="txtColor">{{ item.category }}</p>
        <!-- <p>{{ item.players }}</p> -->
        <ul>
          <li v-for="player in item.players" :key="player">
            <a href="#" @click="openTwitch(player)" :class="txtColor">{{
              showPlayer(player)
            }}</a>
          </li>
        </ul>
        <!-- Pogress bar -->
        <div class="w-full bg-gray-200 h-1">
          <div class="bg-green-500 h-1 w-full" :style="progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "GameCard",
  props: ["item", "stream", "notifyCustom", "notifyAll"],
  data() {
    return {
      time: null,
      length: null,
      scheduled: null,
    };
  },
  created() {
    this.time = moment(this.item.scheduled).fromNow();
    this.length = this.item.length;
    this.scheduled = this.item.scheduled;
    this.trackedList = this.notifyCustom;
  },
  computed: {
    bgColor() {
      switch (this.gameStatus) {
        case "current":
          return "bg-yellow-500";
        case "upcoming":
          return "bg-yellow-50";
        case "previous":
          return "bg-purple-900";
        default:
          return "bg-yellow-500";
      }
    },
    txtColor() {
      switch (this.gameStatus) {
        case "current":
          return "text-black";
        case "upcoming":
          return "text-black";
        case "previous":
          return "text-white";
        default:
          return "text-black";
      }
    },
    progress() {
      switch (this.gameStatus) {
        case "current": {
          let dif = moment().diff(moment(this.scheduled), "seconds");
          let percent = (dif / this.length) * 100;
          return "width:" + percent + "%";
        }
        case "upcoming":
          return "width:" + 0 + "%";
        case "previous":
          return "width:" + 100 + "%";
        default:
          return "width:" + 100 + "%";
      }
    },
    gameStatus() {
      let now = moment();
      let gameStart = moment(this.scheduled);
      let gameEnd = moment(this.scheduled).add(this.length, "s");
      if (gameStart.isAfter(now)) {
        // upcoming game
        return "upcoming";
      } else {
        if (gameEnd.isAfter(now)) {
          // current game
          return "current";
        } else {
          // previous game
          return "previous";
        }
      }
    },
    isTracked() {
      if (this.notifyAll === "All") {
        return true;
      }
      if (this.notifyAll === "None") {
        return false;
      }
      return this.item.id in this.trackedList;
    },
  },
  methods: {
    openStream(number) {
      let stream = "";
      if (number === 2) {
        stream = "2";
      }
      chrome.tabs.create({
        url: "https://www.twitch.tv/esamarathon" + stream,
      });
    },
    showPlayer(player) {
      return player.split("]")[0].replace("[", "");
    },
    openTwitch(player) {
      let url = player.split("(")[1].replace(")", "");
      chrome.tabs.create({ url: url });
    },
    trackNotification() {
      this.trackedList[this.item.id] = true;
      this.$emit("track", this.item.id);
    },
    untrackNotification() {
      delete this.trackedList[this.item.id];
      this.$emit("untrack", this.item.id);
    },
  },
};
</script>

<style></style>
