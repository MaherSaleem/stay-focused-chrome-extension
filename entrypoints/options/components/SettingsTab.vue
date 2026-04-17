<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import {
  NCard,
  NSwitch,
  NTimePicker,
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NInput,
  NInputNumber,
  NButton,
  NSpace,
  useDialog,
} from "naive-ui";
import { storage } from "~/utils/storage";
import { settingsDefault, websitesListDefault, activeDefault } from "~/utils/defaults";
import type { Settings, LockType } from "~/utils/types";

const emit = defineEmits<{
  "reload-data": [];
}>();

const dialog = useDialog();

const settings = ref<Settings>(structuredClone(settingsDefault));
const loaded = ref(false);

function timeStringToMs(time: string): number {
  let hours = parseInt(time.substring(0, 2));
  const minutes = parseInt(time.substring(3, 5));
  const isPM = time.substring(6, 8) === "PM";
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  return (hours * 60 + minutes) * 60 * 1000;
}

function msToTimeString(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const isPM = hours >= 12;
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm} ${isPM ? "PM" : "AM"}`;
}

const startTimeMs = ref<number | null>(timeStringToMs(settings.value.workHours.startTime));
const endTimeMs = ref<number | null>(timeStringToMs(settings.value.workHours.endTime));

async function loadSettings() {
  try {
    const stored = await storage.get<Settings>("settings");
    settings.value = stored;
    startTimeMs.value = timeStringToMs(stored.workHours.startTime);
    endTimeMs.value = timeStringToMs(stored.workHours.endTime);
  } catch {
    await saveSettings();
  }
  await nextTick();
  loaded.value = true;
}

function saveSettings() {
  return storage.set("settings", settings.value);
}

function onStartTimeChange(ms: number | null) {
  if (ms !== null) {
    startTimeMs.value = ms;
    settings.value.workHours.startTime = msToTimeString(ms);
  }
}

function onEndTimeChange(ms: number | null) {
  if (ms !== null) {
    endTimeMs.value = ms;
    settings.value.workHours.endTime = msToTimeString(ms);
  }
}

function handleResetData() {
  dialog.warning({
    title: "Are you sure you want to reset the data?",
    content:
      "This will make all your settings and websites return to their initial values.",
    positiveText: "Yes",
    negativeText: "No",
    onPositiveClick: async () => {
      await storage.set("sitesGroups", websitesListDefault);
      await storage.set("settings", structuredClone(settingsDefault));
      await storage.set("active", activeDefault);
      emit("reload-data");
      loaded.value = false;
      await loadSettings();
    },
  });
}

onMounted(loadSettings);

watch(
  settings,
  () => {
    if (loaded.value) {
      saveSettings();
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="settings-tab">
    <NCard class="settings-card" title="Deactivation Settings">
      <p class="note-block">
        Note: This feature is designed to make deactivation take some effort,
        encouraging you to stay focused and keep working
      </p>
      <NRadioGroup
        :value="settings.lock.type"
        @update:value="(val: LockType) => (settings.lock.type = val)"
      >
        <NSpace vertical>
          <NRadio value="none">None</NRadio>
          <NRadio value="question">Answering a Question</NRadio>
          <div v-if="settings.lock.type === 'question'" class="indent">
            <NInputNumber
              v-model:value="settings.lock.questionNumberOfTries"
              :min="1"
              placeholder="Number of tries before showing answer"
              style="width: 320px"
            />
          </div>
          <NRadio value="password">
            Password
            <span class="tooltip-text">
              (You'll need to enter the password each time you access the settings.)
            </span>
          </NRadio>
          <div v-if="settings.lock.type === 'password'" class="indent">
            <NInput
              v-model:value="settings.lock.password"
              type="password"
              show-password-on="click"
              placeholder="Password"
              style="width: 320px"
            />
          </div>
          <NRadio value="click-button">
            Click a Button
            <span class="tooltip-text">
              (Requires clicking a button multiple times to unlock the extension.)
            </span>
          </NRadio>
          <div v-if="settings.lock.type === 'click-button'" class="indent">
            <NInputNumber
              v-model:value="settings.lock.clickButtonCounts"
              :min="1"
              placeholder="Number of clicks required to unlock"
              style="width: 320px"
            />
          </div>
        </NSpace>
      </NRadioGroup>
    </NCard>

    <NCard class="settings-card" title="Work Schedule">
      <template #header-extra>
        <NSwitch v-model:value="settings.workHours.enableWorkHours" />
      </template>
      <p class="note-block warning">
        Note: To enable this setting, activate the tool and set your preferred
        working hours/days.
      </p>
      <div class="work-hours-row">
        <span>From:</span>
        <NTimePicker
          :value="startTimeMs"
          :disabled="!settings.workHours.enableWorkHours"
          format="hh:mm a"
          :use12-hours="true"
          @update:value="onStartTimeChange"
          style="width: 160px"
        />
        <span>To:</span>
        <NTimePicker
          :value="endTimeMs"
          :disabled="!settings.workHours.enableWorkHours"
          format="hh:mm a"
          :use12-hours="true"
          @update:value="onEndTimeChange"
          style="width: 160px"
        />
      </div>
      <div class="days-section">
        <label>Working Days</label>
        <NCheckboxGroup
          v-model:value="settings.workHours.days"
          :disabled="!settings.workHours.enableWorkHours"
        >
          <NSpace>
            <NCheckbox value="0" label="Sunday" />
            <NCheckbox value="1" label="Monday" />
            <NCheckbox value="2" label="Tuesday" />
            <NCheckbox value="3" label="Wednesday" />
            <NCheckbox value="4" label="Thursday" />
            <NCheckbox value="5" label="Friday" />
            <NCheckbox value="6" label="Saturday" />
          </NSpace>
        </NCheckboxGroup>
      </div>
    </NCard>

    <NCard class="settings-card">
      <NSpace align="center">
        <NSwitch v-model:value="settings.allowFunnyGoBackImages" />
        <span>Show funny images to go back to work</span>
      </NSpace>
    </NCard>

    <NCard class="settings-card">
      <NButton type="error" @click="handleResetData"> Reset Data </NButton>
    </NCard>
  </div>
</template>

<style scoped>
.settings-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-card {
  margin-bottom: 2%;
}

.note-block {
  color: #666;
  font-size: 13px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.note-block.warning {
  background: #fff8e1;
  color: #e65100;
}

.indent {
  margin-left: 24px;
  margin-bottom: 4px;
}

.tooltip-text {
  color: #999;
  font-size: 12px;
}

.work-hours-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.days-section {
  margin-top: 8px;
}

.days-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
</style>
