<template>
  <div>
    <div :class="['note-block', type]">
      <slot />
    </div>
  </div>
</template>

<script>
import MdColumn from "./MdColumn";

export default {
  name: "NoteBlock",
  components: { MdColumn },
  props: {
    type: {
      type: String,
      default: "" /*Options warning*/,
    },
  },
};
</script>

<style lang="scss" scoped>
.note-block {
  padding: 8px 16px;
  overflow: hidden;
  border-left: 4px solid #ffab40;
  background-color: #eee;
  display: block;
}

.warning {
  border-left: 4px solid #ff5252;
  background-color: #ffcdd2;
}
</style>
