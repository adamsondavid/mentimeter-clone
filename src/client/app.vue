<script setup lang="ts">
import { useAbly } from "./composables/ably";
import { useServer } from "./composables/server";
import { nextTick, ref } from "vue";

const ably = useAbly();
const server = useServer();

const message = ref("");
const messages = ref<string[]>([]);

const last = ref<HTMLDivElement>();
ably.channels.get("chat").subscribe(async (message) => {
  messages.value.push(message.data);
  await nextTick();
  last.value!.scrollIntoView({ behavior: "smooth" });
});

async function send() {
  server.sendMessage({ body: { message: message.value } });
  message.value = "";
}
</script>

<template>
  <h1>chat app</h1>
  <div class="container">
    <div class="message" v-for="message of messages" :key="message">{{ message }}</div>
    <div ref="last" />
  </div>
  <form @submit.prevent="send">
    <input v-model="message" />
    <button>Send!</button>
  </form>
</template>

<style scoped>
.container {
  height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.message {
  width: fit-content;
  background: #f3f3f3;
  border-radius: 4px;
  padding: 0.5em;
  margin: 0.5em;
}
</style>
