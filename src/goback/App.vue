<template>
    <md-card>
        <md-card-header v-if="randomImage.text != ''">
            <div class="md-title">{{randomImage.text}}</div>
        </md-card-header>
        <md-card-media>
            <img :src="randomImage.path">
        </md-card-media>
    </md-card>
</template>

<script>
    import {localStorage} from "../chromeApiHelpers";

    export default {
        name: "App",

        mounted() {
            this.getRandomImage();
        },
        data() {
            return {
                imagesObjects: [
                    {path: "images/mature_back_to_work.png", text: ""},


                    {path: "images/angry-monkey.jpg", text: "Go Back to work now!"},
                    {path: "images/Black-Girl-Wat.jpg", text: "WAT are you doing here? Go to work"},
                    {path: "images/troll.jpg", text: "you didn't learn your lesson right? Go to work"},
                    {path: "images/angry-white-monkey.jpg", text: "Goooooo!"},
                    {path: "images/coffin-dance.jpg", text: "Go to work or dance with us!"},
                    {path: "images/spongebob.jpg", text: ""}
                ],

                selectedImageIndex: 0
            }
        },
        computed: {
            randomImage() {
                return this.imagesObjects[this.selectedImageIndex];
            }
        },
        methods: {

            getRandomImage() {
                localStorage.get("settings")
                    .then(settings => {
                        if (settings.allowFunnyGoBackImages) {
                            this.selectedImageIndex = Math.floor(Math.random() * this.imagesObjects.length);
                        }
                    })
            }
        }
    };
</script>

<style scoped>
    .md-card {
        max-width: 40%;
        margin: auto;
        position: relative;
        top: 40px;
        text-align: center;
    }

    .md-card-media img {
        width: 95%;
    }
</style>
