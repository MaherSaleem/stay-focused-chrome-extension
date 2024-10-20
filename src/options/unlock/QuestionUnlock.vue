<template>
  <div>
    <h3>{{ randomQuestion.text }}</h3>
    <md-field>
      <label>Answer</label>
      <md-input @keyup.enter="handleUnlock" v-model="answer"></md-input>
    </md-field>
    <md-snackbar
      :md-position="`center`"
      :md-duration="4000"
      :md-active.sync="showErrorMessage"
      md-persistent
    >
      <span>Wrong answer!</span>
      <md-button
        v-if="numberOfTries >= lockSettings.questionNumberOfTries"
        class="md-primary"
        @click="showAnswer"
        >Show answer</md-button
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
        {
          text: "How many months do we have in a year? (the number only)",
          answer: "12"
        },
        {
          text: "How many days do we have in a week? (the number only)",
          answer: "7"
        },
        {
          text: "How many days are there in a year? (the number only)",
          answer: "365"
        },
        { text: "How many colors are there in a rainbow?", answer: "7" },
        {
          text: "How many sides does a triangle have?(the number only)",
          answer: "3"
        },

        //math questions
        { text: "What is 2+2?", answer: "4" },
        { text: "What is 10+15?", answer: "25" },
        { text: "What is 10 x 9?", answer: "90" },
        { text: "What is 1+1+1+1+1+1?", answer: "6" },
        { text: "What is 2x2 + 1?", answer: "5" },
        { text: "What is 123 - 33?", answer: "90" },
        { text: "What is 10 x (5-3)?", answer: "20" },
        { text: "What is 350 * 0?", answer: "0" },

        //capital questions
        { text: "What is the capital of Italy", answer: "Rome" },
        { text: "What is the capital of France", answer: "Paris" },
        { text: "What is the capital of Egypt", answer: "Cairo" },
        { text: "What is the capital of Spain", answer: "Madrid" },
        { text: "What is the capital of Japan", answer: "Tokyo" },
        { text: "What is the capital of Belgium", answer: "Brussels" },
        { text: "What is the capital of Sweden", answer: "Stockholm" },

        //inverse capital questions
        { text: "Rome is the capital of?", answer: "Italy" },
        { text: "Paris is the capital of?", answer: "France" },
        { text: "Cairo is the capital of?", answer: "Egypt" },
        { text: "Madrid is the capital of?", answer: "Spain" },
        { text: "Tokyo is the capital of?", answer: "Japan" },
        { text: "Brussels is the capital of?", answer: "Belgium" },
        { text: "Stockholm is the capital of?", answer: "Sweden" },

        //history questions
        { text: "When did World War I start", answer: "1914" },
        { text: "When did World War I finish", answer: "1918" },
        { text: "When did World War II start", answer: "1939" },
        { text: "When did World War II start", answer: "1945" }
      ],
      selectedQuestionIndex: 0,
      showErrorMessage: false,
      numberOfTries: 0
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
    }
  },
  computed: {
    randomQuestion() {
      return this.questions[this.selectedQuestionIndex];
    }
  }
};
</script>

<style lang="scss" scoped></style>
