<template>
  <q-checkbox
    v-bind="selectorProps"
    :model-value="model"
  >
    <q-tooltip>_SELECT</q-tooltip>
  </q-checkbox>
</template>
<script>
import { defineComponent, h, ref, computed, watchEffect } from 'vue'
import { useInjectCTable } from './../../composables/table-provide'

export default defineComponent({
  name: 'CTdSelector',

  props: {
    row: undefined,
    debugRender: { required: false, type: Boolean, default: false },
    debugWatch: { required: false, type: Boolean, default: false },
    debugSetup: { required: false, type: Boolean, default: false }
  },

  setup (props) {
    if (props.debugSetup) {
      console.log(`// CTdSelector setup`)
    }

    const { select, isSelected, getRowKey } = useInjectCTable()

    const rowKey = ref(null)
    var lastRowCompared = null
    watchEffect(() => {
      if (lastRowCompared === props.row) return
      console.log("|| CTdSelector watchEffect rowKey")
      lastRowCompared = props.row
      rowKey.value = getRowKey(props.row)
    })

    const model = computed(() => {
      console.log("|| CTdSelector compute model")
      return isSelected(rowKey.value)
    })
    const selectorProps = /*reactive(*/{
      'onUpdate:modelValue': (payload) => select(props.row, payload),
      size: 'xs'
    }//)

    return {
      selectorProps,
      model
    }
  }
})
</script>