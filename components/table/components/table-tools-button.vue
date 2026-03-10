<template>
  <div class="c-table-tool">
    <q-btn v-bind="buttonProps">
      <q-tooltip>{{tooltip}}</q-tooltip>
    </q-btn>
  </div>
</template>
    
<script>
import { defineComponent, ref, computed } from 'vue'
import { useCTable } from './../composables'

export default defineComponent({
  name: 'CTableToolsButton',

  props: {
    renderAs: undefined,
    def: undefined
  },

  setup (props) {
    const CTable = useCTable()
    const enabled = computed(() => props.def.toggle ? props.def.toggle(CTable) : false)
    const getToggleableValue = (value) => {
      const take = typeof value !== 'object' ? [value, value] : value
      return enabled.value ? take[1] : take[0]
    }

    const buttonProps = computed(() => {
      return {
        icon: getToggleableValue(props.def.icon),
        flat: true,
        padding: 'xs',
        size: 'sm',
        color: enabled.value ? 'primary' : undefined,
        onClick: () => {
          const res = props.def.handler(CTable)
          //if (props.def.toggle) enabled.value = res
        }
      }
    })

    const tooltip = computed(() => getToggleableValue(props.def.label))

    return {
      buttonProps,
      tooltip
    }
  }
})
</script>