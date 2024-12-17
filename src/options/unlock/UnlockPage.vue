<template>
  <div>
    <card-with-logo>
      <component
        v-if="this.lockSettings.type"
        v-on:unlock="handleUnlock"
        :lock-settings="lockSettings"
        :is="lockComponentName"
      />
    </card-with-logo>
    <div class="buy-me-coffee">
      <shared-card>
        <buy-me-a-coffee align="left" />
      </shared-card>
    </div>
  </div>
</template>

<script>
import { localStorage } from "../../chromeApiHelpers";
import QuestionUnlock from "./QuestionUnlock";
import PasswordUnlock from "./PasswordUnlock";
import CardWithLogo from "../../sharedComponents/CardWithLogo";
import ClickButtonUnlock from "./ClickButtonUnlock";
import BuyMeACoffee from "../../sharedComponents/BuyMeACoffee.vue";
import SharedCard from "../../sharedComponents/SharedCard.vue";

export default {
  name: "UnlockPage",
  components: {
    SharedCard,
    BuyMeACoffee,
    CardWithLogo,
    PasswordUnlock,
    QuestionUnlock,
    ClickButtonUnlock,
  },
  data() {
    return {
      lockSettings: {},
    };
  },
  mounted() {
    localStorage.get("settings").then((settings) => {
      this.lockSettings = settings.lock;
    });
  },
  methods: {
    handleUnlock() {
      localStorage.set("active", false);
      this.$emit("unlock");
    },
  },
  computed: {
    lockComponentName() {
      console.log(this.lockSettings);
      return this.lockSettings.type + "-unlock";
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-me-coffee {
  margin-top: 5rem;
  width: 40%;
  margin-left: 30%;
}
</style>
