<script setup lang="ts">
import { ref, computed, onMounted, useSlots } from "vue";
import { NInput, NAlert } from "naive-ui";
import { storage } from "~/utils/storage";
import { getHostNameFromStringUrl } from "~/utils/helpers";
import { websitesListDefault, makeSiteGroup, makeSite } from "~/utils/defaults";
import type { SiteGroup } from "~/utils/types";
import SitesGroupComponent from "./SitesGroup.vue";

const props = withDefaults(
  defineProps<{
    allowCreateNewGroups?: boolean;
    blockTypeToShow: "website" | "word" | "regex";
    allowDeleteGroups?: boolean;
  }>(),
  {
    allowCreateNewGroups: true,
    allowDeleteGroups: true,
  },
);

const slots = useSlots();

const sitesGroups = ref<SiteGroup[]>([...websitesListDefault]);
const newGroupName = ref("");

const toShowSitesGroups = computed(() =>
  sitesGroups.value.filter((sg) => props.blockTypeToShow === sg.blockType),
);

const hasNote = computed(() => !!slots.note);

function findGroupIndexByUid(uid: string): number {
  return sitesGroups.value.findIndex((sg) => sg.uid === uid);
}

function loadWebsites() {
  storage
    .get<SiteGroup[]>("sitesGroups")
    .then((data) => {
      sitesGroups.value = data;
    })
    .catch(() => {
      storeWebsites(); // initial run for the app will get default data
    });
}

function storeWebsites() {
  storage.set("sitesGroups", sitesGroups.value);
}

function addNewSite(groupUid: string, siteData: { siteUrl: string; blockType: string }) {
  const groupIndex = findGroupIndexByUid(groupUid);
  let { siteUrl } = siteData;
  if (siteData.blockType === "website") {
    siteUrl = getHostNameFromStringUrl(siteUrl);
  }
  const group = sitesGroups.value[groupIndex];
  group.sitesList = [makeSite(siteUrl, true), ...group.sitesList];
  storeWebsites();
}

function addNewGroup() {
  if (!newGroupName.value) return;
  sitesGroups.value = [
    makeSiteGroup(newGroupName.value, true),
    ...sitesGroups.value,
  ];
  newGroupName.value = "";
  storeWebsites();
}

function deleteGroup(groupUid: string) {
  const groupIndex = findGroupIndexByUid(groupUid);
  sitesGroups.value.splice(groupIndex, 1);
  storeWebsites();
}

function deleteSite(groupUid: string, siteIndex: number) {
  const groupIndex = findGroupIndexByUid(groupUid);
  // FIXME fix that workaround. It was disabling the item below it
  setTimeout(() => {
    const group = sitesGroups.value[groupIndex];
    group.sitesList.splice(siteIndex, 1);
    storeWebsites();
  }, 10);
}

onMounted(() => {
  loadWebsites();
});
</script>

<template>
  <div>
    <NAlert v-if="hasNote" type="warning" class="note" :bordered="false">
      <slot name="note" />
    </NAlert>

    <div v-if="allowCreateNewGroups" class="enter-new-group-input">
      <NInput
        v-model:value="newGroupName"
        placeholder="Enter a name for the new website group (ex: E-Commerce)"
        @keyup.enter="addNewGroup"
        style="max-width: 50%;"
      />
    </div>

    <div class="sites-groups">
      <SitesGroupComponent
        v-for="sitesGroup in toShowSitesGroups"
        :key="sitesGroup.uid"
        :sites-group="sitesGroup"
        :allow-delete="allowDeleteGroups"
        @store-websites="storeWebsites"
        @add-new-website="(data) => addNewSite(sitesGroup.uid, data)"
        @delete-sites-group="deleteGroup(sitesGroup.uid)"
        @delete-site="(siteIndex) => deleteSite(sitesGroup.uid, siteIndex)"
      />
    </div>
  </div>
</template>

<style scoped>
.sites-groups {
  display: flex;
  flex-flow: row wrap;
}

.enter-new-group-input {
  position: relative;
  left: 1%;
  margin-bottom: 12px;
}

.note {
  margin-bottom: 10px;
  margin-left: 1%;
}
</style>
