<template>
    <div>

        <h3>{{randomQuestion.text}}</h3>
        <md-field>
            <label>Answer</label>
            <md-input @keyup.enter="handleUnlock" v-model="answer"></md-input>
        </md-field>
        <md-snackbar :md-position="`center`" :md-duration="4000"
                     :md-active.sync="showErrorMessage" md-persistent>
            <span>Wrong answer!</span>
            <md-button v-if="numberOfTries >= lockSettings.questionNumberOfTries" class="md-primary" @click="showAnswer">Show answer</md-button>
        </md-snackbar>
    </div>
</template>

<script>
    export default {
        name: "QuestionUnlock",
        props: ['lockSettings'],

        mounted() {
            this.selectedQuestionIndex = Math.floor(Math.random() * this.questions.length);
        },
        data() {
            return {
                answer: "",
                questions: [
                    //ref: https://www.momjunction.com/articles/general-knowledge-questions-for-kids_00439953/
                    {text: "How many months do we have in a year?(the number only)", answer: "12"},
                    {text: "How many days do we have in a week?(the number only)", answer: "7"},
                    {text: "How many days are there in a year?(the number only)", answer: "365"},
                    {text: "What is 2+2?", answer: "4"},
                    {text: "How many colors are there in a rainbow?", answer: "7"},
                ],
                selectedQuestionIndex: 0,
                showErrorMessage: false,
                numberOfTries: 0,
            }
        },
        methods: {
            handleUnlock() {
                if (this.answer.includes(this.randomQuestion.answer)) {
                    this.$emit('unlock');
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
    }
</script>

<style lang="scss" scoped>

</style>