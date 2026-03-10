<template>
  <CTr
    :props="qScope"
    row-type="body"
    v-if="totalColumns"
  >
  </CTr>
</template>
<script>

import { defineComponent, shallowRef } from 'vue'
import { useInjectCTable } from './../composables/table-provide'

import CTr from './v2/tr.vue'

export default defineComponent({
  name: 'CTableBody',

  props: [
    'qScope'
  ],

  components: {
    CTr
  },

  setup (props, { attrs }) {
    const { totalColumns } = useInjectCTable()
    console.log("TABLE BODY", props.qScope)
    return {
      totalColumns
    }
  },
})
</script>
