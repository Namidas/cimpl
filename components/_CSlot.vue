<template>
  <component
    :is='slotFn'
    v-bind="scope"
  >
    <template #content>
      asd
    </template>
  </component>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CSlot',

  props: ['slotFn', 'scope'],
})
</script>