<template>
  <div>
    <shared-card>
      <h4>{{ $t("message.options.settingsTab.deactivation.title") }}</h4>
      <note-block>{{
        $t("message.options.settingsTab.deactivation.note")
      }}</note-block>
      <md-radio v-model="settings.lock.type" value="none">
        {{ $t("message.options.settingsTab.deactivation.radio.none") }}
      </md-radio>
      <md-radio v-model="settings.lock.type" value="question">
        {{ $t("message.options.settingsTab.deactivation.radio.question") }}
      </md-radio>
      <md-column v-if="settings.lock.type === 'question'">
        <md-field>
          <label>{{
            $t("message.options.settingsTab.deactivation.radio.questionLabel")
          }}</label>
          <md-input
            type="number"
            min="1"
            v-model="settings.lock.questionNumberOfTries"
          ></md-input>
        </md-field>
      </md-column>
      <md-radio v-model="settings.lock.type" value="password"
        >{{ $t("message.options.settingsTab.deactivation.radio.password") }}
        <tooltip>
          {{
            $t("message.options.settingsTab.deactivation.radio.passwordTooltip")
          }}
        </tooltip>
      </md-radio>
      <md-column v-if="settings.lock.type === 'password'">
        <md-field>
          <label>{{
            $t("message.options.settingsTab.deactivation.radio.password")
          }}</label>
          <md-input type="password" v-model="settings.lock.password"></md-input>
        </md-field>
      </md-column>
      <md-radio v-model="settings.lock.type" value="click-button"
        >{{ $t("message.options.settingsTab.deactivation.radio.click") }}
        <tooltip>
          {{
            $t("message.options.settingsTab.deactivation.radio.clickTooltip")
          }}
        </tooltip>
      </md-radio>
      <md-column v-if="settings.lock.type === 'click-button'">
        <md-field>
          <label>{{
            $t("message.options.settingsTab.deactivation.radio.clickLabel")
          }}</label>
          <md-input
            type="number"
            min="1"
            v-model="settings.lock.clickButtonCounts"
          ></md-input>
        </md-field>
      </md-column>
    </shared-card>

    <shared-card>
      <h4>
        {{ $t("message.options.settingsTab.schedule.title") }}
        <tooltip>
          {{ $t("message.options.settingsTab.schedule.titleTooltip") }}
        </tooltip>
      </h4>
      <note-block type="warning">
        {{ $t("message.options.settingsTab.schedule.note") }}
      </note-block>
      <md-switch
        v-model="settings.workHours.enableWorkHours"
        class="md-menu-content-right-end md-primary"
      >
        {{ $t("message.options.settingsTab.schedule.isActive") }}
      </md-switch>

      <div>
        {{ $t("message.options.settingsTab.schedule.from") }}
        <vue-timepicker
          :disabled="!settings.workHours.enableWorkHours"
          format="hh:mm A"
          v-model="settings.workHours.startTime"
        ></vue-timepicker>
        {{ $t("message.options.settingsTab.schedule.to") }}
        <vue-timepicker
          :disabled="!settings.workHours.enableWorkHours"
          format="hh:mm A"
          v-model="settings.workHours.endTime"
        ></vue-timepicker>
        <md-column :width="50">
          <md-field>
            <label>{{
              $t("message.options.settingsTab.schedule.daysLabel")
            }}</label>
            <md-select
              v-model="settings.workHours.days"
              name="working-days"
              id="working-days"
              multiple
            >
              <md-option value="0">{{
                $t("message.options.settingsTab.schedule.days.sunday")
              }}</md-option>
              <md-option value="1">{{
                $t("message.options.settingsTab.schedule.days.monday")
              }}</md-option>
              <md-option value="2">{{
                $t("message.options.settingsTab.schedule.days.tuesday")
              }}</md-option>
              <md-option value="3">{{
                $t("message.options.settingsTab.schedule.days.wednesday")
              }}</md-option>
              <md-option value="4">{{
                $t("message.options.settingsTab.schedule.days.thursday")
              }}</md-option>
              <md-option value="5">{{
                $t("message.options.settingsTab.schedule.days.friday")
              }}</md-option>
              <md-option value="6">{{
                $t("message.options.settingsTab.schedule.days.saturday")
              }}</md-option>
            </md-select>
          </md-field>
        </md-column>
      </div>
    </shared-card>

    <shared-card>
      <md-switch
        v-model="settings.allowFunnyGoBackImages"
        class="md-menu-content-right-end md-primary"
      >
        {{ $t("message.options.settingsTab.showImages") }}
      </md-switch>
    </shared-card>
    <shared-card>
      <md-button
        class="md-raised reset-button"
        @click.native="isResetButtonActive = true"
        >{{ $t("message.options.settingsTab.resetData") }}</md-button
      >
    </shared-card>
    <md-dialog-confirm
      :md-active.sync="isResetButtonActive"
      :md-title="$t('message.options.resetData.title')"
      :md-content="$t('message.options.resetData.content')"
      :md-confirm-text="$t('message.options.resetData.confirm')"
      :md-cancel-text="$t('message.options.resetData.cancel')"
      @md-cancel=""
      @md-confirm="onResetConfirm"
    />
  </div>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import { settingsDefault } from "../defaults";
import { resetChromeStorageData } from "../helpers";
import { localStorage } from "../chromeApiHelpers";
import SharedCard from "../sharedComponents/SharedCard";
import Tooltip from "../sharedComponents/Tooltip";
import MdColumn from "../sharedComponents/MdColumn";
import NoteBlock from "../sharedComponents/NoteBlock";

export default {
  name: "SettingsTab",
  mounted() {
    this.loadSettings();
  },
  data() {
    return {
      settings: settingsDefault,
      isResetButtonActive: false,
    };
  },

  methods: {
    loadSettings() {
      localStorage
        .get("settings")
        .then((settings) => {
          this.settings = settings;
        })
        .catch((e) => {
          this.saveSettings(); //save default settings(initially default settings will be in data)
        });
    },
    saveSettings() {
      localStorage.set("settings", this.settings);
    },
    onResetConfirm() {
      resetChromeStorageData();
      this.$emit("reload-data");
      this.loadSettings();
    },
  },
  components: {
    NoteBlock,
    MdColumn,
    Tooltip,
    SharedCard,
    VueTimepicker,
  },
  watch: {
    settings: {
      handler() {
        this.saveSettings();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-button {
  margin-top: 2%;
}

.time-picker {
  z-index: 6;
}
.md-radio {
  display: flex;
}

.shared-card {
  margin-bottom: 2%;
}
.note {
  color: #fa6d6d;
}
</style>
