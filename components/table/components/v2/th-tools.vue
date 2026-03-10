<template>
  <RowTools
    :tools="toolsList"
    bulk
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
    debugRender: { required: false, type: Boolean, default: false },
    debugWatch: { required: false, type: Boolean, default: false },
    debugSetup: { required: false, type: Boolean, default: false }
  },

  setup (props, { emit }) {
    //console.log("TOOLS props", props)
    if (props.debugSetup) {
      //console.log(`// CTdTools '${props.col.name}' setup`)
      //console.log("CTdTools props", props)
    }

    //const toolConfirm = payload => emit('rowtool:confirm', payload)

    const {
      rowBulkToolsList
    } = useInjectCTable()

    return {
      toolsList: rowBulkToolsList,
      //toolConfirm
    }
  }
})

</script>