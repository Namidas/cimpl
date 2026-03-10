<template>
  <CTr
    :props="qScope"
    row-type="header"
    v-if="totalColumns"
  >
  </CTr>
</template>
<script>

import { defineComponent, shallowRef } from 'vue'
import { useInjectCTable } from './../composables/table-provide'

import CTr from './v2/tr.vue'
//import CTh from './th.vue'

export default defineComponent({
  name: 'CTableHeader',

  props: [
    /*'header',
    'cols',
    'colsMap',
    'color',
    'dark',
    'dense',
    'selected',
    'sort'*/
    'qScope'
  ],

  components: {
    CTr,
    //CTh
  },

  setup (props, { attrs }) {
    const { totalColumns } = useInjectCTable(['totalColumns'])
    //console.log("TABLE-HEADER", props, attrs)
    return {
      totalColumns
    }
  },
})
</script>
