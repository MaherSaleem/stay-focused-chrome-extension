<template>
    <div>
        <shared-card>
            <h4>About The Extension</h4>
            <p>Stay focused is an open source chrome extension to help you to block distraction websites like social
                media.</p>

            <p>The idea behinds this, that sometimes you are working, and suddenly you find yourself sitting on social
                media
                like Facebook, and you spend there like 30 minutes without noticing that. So this chrome extension will
                show
                an
                image to remind you to back to work.</p>
        </shared-card>
        <shared-card>
            <h4>Credits</h4>
            <p>Maher Khdeir</p>
            <a target="_blank" href="https://www.linkedin.com/in/maher-khdeir/">LinkedIn</a>
        </shared-card>
        <shared-card>
            <h4>Want to contribute?</h4>
            Check the open source <a target="_blank"
                                     href="https://github.com/MaherSaleem/stay-focused-chrome-extension">Github
            Repository</a>.
        </shared-card>

    </div>
</template>

<script>
    import SharedCard from "../sharedComponents/SharedCard";

    export default {
        name: "AboutTab",
        components: {SharedCard}
    }
</script>

<style lang="scss" scoped>
    .shared-card {
        margin-bottom: 1%;
    }
</style>