<template>
  <nav
    class="w-full justify-start py-3 bg-violet-900 text-white hover:text-gray-200 focus:text-gray-200 shadow-lg"
  >
    <div class="w-full flex justify-start px-3 items-center">
      <a href="#"
        ><img src="esa66.png" class="w-8 h-8" @click="openStream()"
      /></a>
      <a
        class="text-xl text-white hover:text-violet-200 pl-5"
        @click="openSchedule()"
        href="#"
        >Schedule</a
      >
      <a
        class="text-xl text-white hover:text-violet-200 pl-5"
        @click="openDonate()"
        href="#"
        >Donate</a
      >
      <a
        class="text-xl text-white hover:text-violet-200 pl-5"
        @click="$emit('settings')"
        href="#"
        >Settings</a
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      msg: "popup",
      schedule1: [],
      schedule2: [],
      now: "",
      selected: 1,
    };
  },
  methods: {
    openSchedule() {
      chrome.tabs.create({ url: "https://esamarathon.com/schedule/" });
    },
    openStream() {
      chrome.tabs.create({ url: "https://esamarathon.com/" });
    },
    openDonate() {
      chrome.tabs.create({
        url: "https://donations.esamarathon.com/index/esaw2022",
      });
    },
  },
};
</script>

<style></style>
