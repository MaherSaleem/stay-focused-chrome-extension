<template>
  <div>
    <h3>{{ $t(randomQuestion.text) }}</h3>
    <md-field>
      <label>{{ $t("message.unlock.question.answerLabel") }}</label>
      <md-input @keyup.enter="handleUnlock" v-model="answer"></md-input>
    </md-field>
    <md-snackbar
      :md-position="`center`"
      :md-duration="4000"
      :md-active.sync="showErrorMessage"
      md-persistent
    >
      <span>{{ $t("message.unlock.question.wrongAnswer") }}</span>
      <md-button
        v-if="numberOfTries >= lockSettings.questionNumberOfTries"
        class="md-primary"
        @click="showAnswer"
        >{{ $t("message.unlock.question.showAnswer") }}</md-button
      >
    </md-snackbar>
  </div>
</template>

<script>
export default {
  name: "QuestionUnlock",
  props: ["lockSettings"],

  mounted() {
    this.selectedQuestionIndex = Math.floor(
      Math.random() * this.questions.length
    );
  },
  data() {
    return {
      answer: "",
      questions: [
        //ref: https://www.momjunction.com/articles/general-knowledge-questions-for-kids_00439953/
        { text: "message.questions.text1", answer: "12" },
        { text: "message.questions.text2", answer: "7" },
        { text: "message.questions.text3", answer: "365" },
        { text: "message.questions.text4", answer: "7" },
        { text: "message.questions.text5", answer: "3" },

        //math questions
        { text: "message.questions.text6", answer: "4" },
        { text: "message.questions.text7", answer: "25" },
        { text: "message.questions.text8", answer: "90" },
        { text: "message.questions.text9", answer: "6" },
        { text: "message.questions.text10", answer: "5" },
        { text: "message.questions.text11", answer: "90" },
        { text: "message.questions.text12", answer: "20" },
        { text: "message.questions.text13", answer: "0" },

        //capital questions
        // { text: "What is the capital of Italy", answer: "Rome" },
        // { text: "What is the capital of France", answer: "Paris" },
        // { text: "What is the capital of Egypt", answer: "Cairo" },
        // { text: "What is the capital of Spain", answer: "Madrid" },
        // { text: "What is the capital of Japan", answer: "Tokyo" },
        // { text: "What is the capital of Belgium", answer: "Brussels" },
        // { text: "What is the capital of Sweden", answer: "Stockholm" },

        //inverse capital questions
        // { text: "Rome is the capital of?", answer: "Italy" },
        // { text: "Paris is the capital of?", answer: "France" },
        // { text: "Cairo is the capital of?", answer: "Egypt" },
        // { text: "Madrid is the capital of?", answer: "Spain" },
        // { text: "Tokyo is the capital of?", answer: "Japan" },
        // { text: "Brussels is the capital of?", answer: "Belgium" },
        // { text: "Stockholm is the capital of?", answer: "Sweden" },

        //history questions
        { text: "message.questions.text14", answer: "1914" },
        { text: "message.questions.text15", answer: "1918" },
        { text: "message.questions.text16", answer: "1939" },
        { text: "message.questions.text17", answer: "1945" },
      ],
      selectedQuestionIndex: 0,
      showErrorMessage: false,
      numberOfTries: 0,
    };
  },
  methods: {
    handleUnlock() {
      if (
        this.answer
          .toLowerCase()
          .includes(this.randomQuestion.answer.toLowerCase())
      ) {
        this.$emit("unlock");
      } else {
        this.numberOfTries++;
        this.showErrorMessage = true;
      }
    },
    showAnswer() {
      this.answer = this.randomQuestion.answer;
    },
  },
  computed: {
    randomQuestion() {
      return this.questions[this.selectedQuestionIndex];
    },
  },
};
</script>

<style lang="scss" scoped></style>
