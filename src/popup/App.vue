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
            this.setIcon();
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
                this.setIcon();
            },
            setIcon() {
                let iconPath = this.active ? "../icons/icon_48_active.png" : "../icons/icon_48_inactive.png";
                chrome.browserAction.setIcon({"path": iconPath});
            }
        }
    }
</script>

<style lang="scss" scoped>
    p {
        font-size: 20px;
    }
</style>
