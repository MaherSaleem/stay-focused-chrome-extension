<script setup lang="ts">
import { NCard, NSwitch, NButton, NTooltip } from "naive-ui";
import { truncateText } from "~/utils/helpers";
import type { SiteGroup } from "~/utils/types";
import AddBlockItemToList from "./AddBlockItemToList.vue";

const props = defineProps<{
  sitesGroup: SiteGroup;
  allowDelete?: boolean;
}>();

const emit = defineEmits<{
  "store-websites": [];
  "add-new-website": [data: { siteUrl: string; blockType: string }];
  "delete-sites-group": [];
  "delete-site": [siteIndex: number];
}>();

function truncateSiteUrl(siteUrl: string): string {
  return truncateText(siteUrl, 15);
}
</script>

<template>
  <div :class="['site-group', sitesGroup.groupEnabled ? '' : 'disabled']">
    <NCard style="width: 320px; margin: 4px; display: inline-block; vertical-align: top">
      <template #header>
        <div class="card-header">
          <div class="group-title">{{ sitesGroup.groupName }}</div>
          <NSwitch
            class="enable-group-switch"
            :value="sitesGroup.groupEnabled"
            @update:value="
              (val: boolean) => {
                sitesGroup.groupEnabled = val;
                emit('store-websites');
              }
            "
          />
        </div>
      </template>

      <AddBlockItemToList
        :block-type="sitesGroup.blockType"
        @add-new-website="(data) => emit('add-new-website', data)"
      />

      <div class="sites-list">
        <div v-for="(site, siteIndex) in sitesGroup.sitesList" :key="siteIndex" class="site-item">
          <NSwitch
            :value="site.enabled"
            @update:value="
              (val: boolean) => {
                site.enabled = val;
                emit('store-websites');
              }
            "
            size="small"
          />
          <NTooltip>
            <template #trigger>
              <span :class="{ 'website-disabled': !site.enabled }" class="site-url">
                {{ truncateSiteUrl(site.url) }}
              </span>
            </template>
            {{ site.url }}
          </NTooltip>
          <NButton
            text
            type="error"
            size="small"
            class="delete-btn"
            @click="emit('delete-site', siteIndex)"
          >
            Delete
          </NButton>
        </div>
      </div>

      <template #action v-if="allowDelete !== false">
        <div style="text-align: right">
          <NButton @click="emit('delete-sites-group')"> Remove Group </NButton>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-title {
  font-size: 16px;
  font-weight: 600;
}

.enable-group-switch {
  margin-left: auto;
}

.sites-list {
  overflow-y: auto;
  max-height: 250px;
  margin-top: 8px;
}

.site-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.site-url {
  flex: 1;
  font-size: 14px;
}

.delete-btn {
  margin-left: auto;
}

.website-disabled {
  text-decoration: line-through;
  opacity: 0.5;
}

.disabled {
  opacity: 0.5;
}
</style>
