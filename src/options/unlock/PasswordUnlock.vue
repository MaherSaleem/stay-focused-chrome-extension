<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item">
        <div v-if="this.lockSettings.password === ''">
          <p>{{ $t("message.unlock.password.noPassword") }}</p>
          <md-button class="md-raised md-accent" @click="$emit('unlock')">{{
            $t("message.unlock.password.goToSettings")
          }}</md-button>
        </div>
        <md-field v-else>
          <label>{{ $t("message.unlock.password.enterPassword") }}</label>
          <md-input
            @keyup.enter="handleUnlock"
            v-model="password"
            type="password"
          ></md-input>
        </md-field>
      </div>
    </div>

    <md-snackbar
      :md-position="`center`"
      :md-duration="4000"
      :md-active.sync="showErrorMessage"
      md-persistent
    >
      <span>{{ $t("message.unlock.password.wrongPassword") }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import Tooltip from "../../sharedComponents/Tooltip";

export default {
  name: "PasswordUnlock",
  components: { Tooltip },
  props: ["lockSettings"],
  data() {
    return {
      password: "",
      showErrorMessage: false,
    };
  },
  methods: {
    handleUnlock() {
      if (
        this.password.toLowerCase() === this.lockSettings.password.toLowerCase()
      ) {
        // TODO make trim/to_lower and things like that
        this.$emit("unlock");
      } else {
        this.showErrorMessage = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
