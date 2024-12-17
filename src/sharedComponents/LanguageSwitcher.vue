// src/components/LanguageSwitcher.vue
<template>
  <select v-model="$i18n.locale" class="language-select">
    <option value="en">English</option>
    <option value="de">Deutsch</option>
    <option value="fr">Français</option>
    <option value="es">Español</option>
    <option value="it">Italiano</option>
    <option value="tr">Türkçe</option>
  </select>
</template>

<script>
export default {
  name: "LanguageSwitcher",
};
</script>

<style scoped>
.language-select {
  padding: 5px;
  margin: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}
</style>
