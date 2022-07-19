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
          <a href="#">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="info-circle"
              class="w-4 h-4 mr-2 fill-current"
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
  props: ["item", "stream"],
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
        case "current":
          var dif = moment().diff(moment(this.scheduled), "seconds");
          var percent = (dif / this.length) * 100;
          return "width:" + percent + "%";
        case "upcoming":
          return "width:" + 0 + "%";
        case "previous":
          return "width:" + 100 + "%";
        default:
          return "width:" + 100 + "%";
      }
    },
    gameStatus() {
      var now = moment();
      var gameStart = moment(this.scheduled);
      var gameEnd = moment(this.scheduled).add(this.length, "s");
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
  },
  methods: {
    openStream(number) {
      chrome.tabs.create({
        url: "https://www.twitch.tv/esamarathon" + number.toString(),
      });
    },
    showPlayer(player) {
      return player.split("]")[0].replace("[", "");
    },
    // showTwitch(player) {
    //   return player.split("(")[1].replace(")", "");
    // },
    openTwitch(player) {
      var url = player.split("(")[1].replace(")", "");
      chrome.tabs.create({ url: url });
    },
  },
};
</script>

<style></style>
