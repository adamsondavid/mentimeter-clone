<script setup lang="ts">
import { useAbly } from "./composables/ably";
import { useServer } from "./composables/server";
import { v4 as uuid } from "uuid";
import { useStorage } from "@vueuse/core";
import { Ref, ref } from "vue";
import { Answer, Question, Vote } from "../common/contract";

const ably = useAbly();
const server = useServer();

const voteId: Ref<string> = useStorage("vote-id", uuid());
const votes = ref(new Map<string, Answer>());
const question = ref<Question>({
  id: "a2a4fff8-f1f3-4c20-879a-afe966519fb8",
  question: "What are we going to have for lunch today?",
  answers: [
    { id: "4da51e17-0ccf-4696-adfd-93f2b3e7b4fc", answer: "Pizza 🍕" },
    { id: "0c0cdf84-a449-4c4d-b2b0-9d88e9a91493", answer: "Sushi 🍱" },
    { id: "5d5c3068-b289-4c1e-8cdf-441a10743942", answer: "Pasta 🍝" },
  ],
});

const vote = (answer: Answer) => server.vote({ body: { id: voteId.value, answerId: answer.id } });
ably.channels.get("main").subscribe("vote", ({ data: vote }: { data: Vote }) => {
  votes.value.set(vote.id, question.value.answers.find((answer) => answer.id === vote.answerId)!);
});
</script>

<template>
  <div>
    <h1>{{ question.question }}</h1>
    <button v-for="answer of question.answers" :key="answer.id" @click="vote(answer)">
      {{ answer.answer }}
    </button>
  </div>
  <div>
    <h1>Results</h1>
    <div v-for="answer of question.answers" :key="answer.id">
      {{ answer.answer }}
      {{ [...votes.values()].filter((a) => answer === a).length }}
    </div>
    <p v-if="votes.get(voteId)">
      You voted for
      {{ votes.get(voteId)!.answer }}
    </p>
  </div>
</template>
