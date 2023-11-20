import { createApp } from "vue";
import App from "./app.vue";
import { initServer } from "./composables/server";
import { initAbly } from "./composables/ably";

createApp(App).use(initServer()).use(initAbly()).mount("#app");
