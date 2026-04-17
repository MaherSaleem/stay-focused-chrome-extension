<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NInput, NButton, useMessage } from "naive-ui";
import type { LockSettings } from "~/utils/types";

const props = defineProps<{ lockSettings: LockSettings }>();
const emit = defineEmits<{ unlock: [] }>();

const answer = ref("");
const numberOfTries = ref(0);
const selectedQuestionIndex = ref(0);
const message = useMessage();

const questions = [
  // General knowledge
  { text: "How many months do we have in a year? (the number only)", answer: "12" },
  { text: "How many days do we have in a week? (the number only)", answer: "7" },
  { text: "How many days are there in a year? (the number only)", answer: "365" },
  { text: "How many colors are there in a rainbow?", answer: "7" },
  { text: "How many sides does a triangle have?(the number only)", answer: "3" },
  // Math questions
  { text: "What is 2+2?", answer: "4" },
  { text: "What is 10+15?", answer: "25" },
  { text: "What is 10 x 9?", answer: "90" },
  { text: "What is 1+1+1+1+1+1?", answer: "6" },
  { text: "What is 2x2 + 1?", answer: "5" },
  { text: "What is 123 - 33?", answer: "90" },
  { text: "What is 10 x (5-3)?", answer: "20" },
  { text: "What is 350 * 0?", answer: "0" },
  // Capital questions
  { text: "What is the capital of Italy", answer: "Rome" },
  { text: "What is the capital of France", answer: "Paris" },
  { text: "What is the capital of Egypt", answer: "Cairo" },
  { text: "What is the capital of Spain", answer: "Madrid" },
  { text: "What is the capital of Japan", answer: "Tokyo" },
  { text: "What is the capital of Belgium", answer: "Brussels" },
  { text: "What is the capital of Sweden", answer: "Stockholm" },
  // Inverse capital questions
  { text: "Rome is the capital of?", answer: "Italy" },
  { text: "Paris is the capital of?", answer: "France" },
  { text: "Cairo is the capital of?", answer: "Egypt" },
  { text: "Madrid is the capital of?", answer: "Spain" },
  { text: "Tokyo is the capital of?", answer: "Japan" },
  { text: "Brussels is the capital of?", answer: "Belgium" },
  { text: "Stockholm is the capital of?", answer: "Sweden" },
  // History questions
  { text: "When did World War I start", answer: "1914" },
  { text: "When did World War I finish", answer: "1918" },
  { text: "When did World War II start", answer: "1939" },
  { text: "When did World War II finish", answer: "1945" },
];

const randomQuestion = computed(() => questions[selectedQuestionIndex.value]);

function handleUnlock() {
  if (answer.value.toLowerCase().includes(randomQuestion.value.answer.toLowerCase())) {
    emit("unlock");
  } else {
    numberOfTries.value++;
    message.error("Wrong answer!");
  }
}

function showAnswer() {
  answer.value = randomQuestion.value.answer;
}

onMounted(() => {
  selectedQuestionIndex.value = Math.floor(Math.random() * questions.length);
});
</script>

<template>
  <div class="question-unlock">
    <h3>{{ randomQuestion.text }}</h3>
    <n-input v-model:value="answer" placeholder="Answer" @keyup.enter="handleUnlock" />
    <div class="actions">
      <n-button type="primary" @click="handleUnlock">Submit</n-button>
      <n-button v-if="numberOfTries >= lockSettings.questionNumberOfTries" @click="showAnswer">
        Show Answer
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.question-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>
