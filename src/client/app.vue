<script setup lang="ts">
import { useAbly } from "./composables/ably";
import { useServer } from "./composables/server";
import { ref } from "vue";
import { Answer, Choice, Question } from "../common/contract";
import { useClientId } from "./composables/client-id";

const presentationId = "12345678";

const ably = useAbly(presentationId);
const server = useServer();

const presentation = ably.channels.get(presentationId);

const present = ref(new Map<string, number>());
presentation.presence.enter();
presentation.presence.subscribe(({ action, clientId }) => {
  if (action === "present" || action === "enter") present.value.set(clientId, (present.value.get(clientId) ?? 0) + 1);
  if (action === "absent" || action === "leave") present.value.set(clientId, (present.value.get(clientId) ?? 0) - 1);
  if (present.value.get(clientId) === 0) present.value.delete(clientId);
});

const answerId = useClientId();
const answers = ref(new Map<string, Choice>());
const question = ref<Question>({
  id: "a2a4fff8-f1f3-4c20-879a-afe966519fb8",
  question: "What are we going to have for lunch today?",
  choices: [
    { id: "4da51e17-0ccf-4696-adfd-93f2b3e7b4fc", choice: "Pizza 🍕" },
    { id: "0c0cdf84-a449-4c4d-b2b0-9d88e9a91493", choice: "Sushi 🍱" },
    { id: "5d5c3068-b289-4c1e-8cdf-441a10743942", choice: "Pasta 🍝" },
  ],
});

const answer = (choice: Choice) => {
  server.putAnswer({ params: { presentationId, questionId: question.value.id }, body: { choiceId: choice.id } });
};

presentation.subscribe(({ data: answer }: { data: Answer }) => {
  answers.value.set(answer.id, question.value.choices.find((choice) => choice.id === answer.choiceId)!);
});
</script>

<template>
  <div>
    <p>Currently {{ present.size }} users are viewing this page</p>
    <h1>{{ question.question }}</h1>
    <button v-for="choice of question.choices" :key="choice.id" @click="answer(choice)">
      {{ choice.choice }}
    </button>
  </div>
  <div>
    <h1>Results</h1>
    <div v-for="choice of question.choices" :key="choice.id">
      {{ choice.choice }}
      {{ [...answers.values()].filter((c) => choice === c).length }}
    </div>
    <p v-if="answers.get(answerId)">
      You answered
      {{ answers.get(answerId)!.choice }}
    </p>
  </div>
</template>
