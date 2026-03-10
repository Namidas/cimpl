<template>
  <RowTools
    :row="row"
    :tools="toolsList"
  />
</template>
<script>
import { defineComponent, h, watchEffect, reactive } from 'vue'
import _ from 'lodash'

import { useInjectCTable } from './../../composables/table-provide'

import RowTools from './row-tools.vue'
export default defineComponent({
  name: 'CTdTools',

  components: {
    RowTools
  },

  props: {
    exposedKey: undefined,
    row: undefined,
    debugRender: { required: false, type: Boolean, default: false },
    debugWatch: { required: false, type: Boolean, default: false },
    debugSetup: { required: false, type: Boolean, default: false }
  },

  /*emits: [
    'rowtool:confirm'
  ],*/

  setup (props, { emit }) {
    //console.log("TOOLS props", props)
    if (props.debugSetup) {
      //console.log(`// CTdTools '${props.col.name}' setup`)
      //console.log("CTdTools props", props)
    }

    //const toolConfirm = payload => emit('rowtool:confirm', payload)

    const {
      rowToolsList
    } = useInjectCTable()

    return {
      toolsList: rowToolsList,
      //toolConfirm
    }
  }
})

</script>