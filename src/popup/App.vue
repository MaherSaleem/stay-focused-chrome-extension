<template>
    <div>
        <button @click="toggleStatus">{{active ? "Deactivate" : 'Activate'}}</button>
        <button @click="openOptionsPage"> Open Setting</button>
    </div>
</template>

<script>
    export default {
        mounted() {
            chrome.storage.local.get("active", item => this.active = item.active);
        },
        data() {
            return {
                active: true,
            }
        },
        methods: {
            openOptionsPage() {
                chrome.tabs.create({"url": "options/options.html"});
            },
            toggleStatus() {
                this.active = !this.active;
                chrome.storage.local.set({"active": this.active});
            }
        }
    }
</script>

<style lang="scss" scoped>
    p {
        font-size: 20px;
    }
</style>
