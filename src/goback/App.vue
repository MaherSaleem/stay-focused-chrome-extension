<template>
    <div class="center">
        <h3>{{randomImage.text}}</h3>
        <img :src="randomImage.path" width="480">
    </div>
</template>

<script>
    export default {
        name: "App",

        mounted() {
            this.randomImage = this.getRandomImage();
        },
        data() {
            return {
                imagesObjects: [
                    {path: "images/angry-monkey.jpg", text: "Go Back to work now!"}, //TODO maybe add Dimensions
                    {path: "images/Black-Girl-Wat.jpg", text: "WAT are you doing here? Go to work"},
                    {path: "images/troll.jpg", text: "you didn't learn your lesson right? Go to work"},
                    {path: "images/angry-white-monkey.jpg", text: "Goooooo!"},
                    {path: "images/coffin-dance.jpg", text: "Go to work or dance with us!"},
                    {path: "images/spongebob.jpg", text: ""}
                ],
                randomImage: {path: "", text: ""}
            }
        },
        methods: {
            getRandomImage() {
                return this.imagesObjects[Math.floor(Math.random() * this.imagesObjects.length)];
            }
        }
    };
</script>

<style scoped>
    .center {
        margin: auto;
        margin-top: 3%;
        width: 60%;
        border: 1px solid #555755;
        padding: 10px;
        text-align: center;
    }
</style>
