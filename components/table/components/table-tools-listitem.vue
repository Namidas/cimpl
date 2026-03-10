<template>
  <q-item
    clickable
    v-close-popup
    @click="onItemClick"
  >
    <q-item-section avatar>
      <q-icon
        :name="itemProps.icon"
        size="xs"
        :color="itemProps.color"
      />
    </q-item-section>
    <q-item-section>{{itemProps.label}}</q-item-section>
    <q-item-section
      avatar
      v-if="enabled"
    >
      <q-icon
        name="sym_o_check"
        size="xs"
        color="positive"
      />
    </q-item-section>
  </q-item>
</template>
    
<script>
import { defineComponent, ref, computed } from 'vue'
import { useCTable } from './../composables'

export default defineComponent({
  name: 'CTableToolsListItem',

  props: {
    renderAs: undefined,
    def: undefined
  },

  setup (props) {
    const enabled = computed(() => props.def.toggle ? props.def.toggle(CTable) : false)
    const getToggleableValue = (value) => {
      const take = typeof value !== 'object' ? [value, value] : value
      return enabled.value ? take[1] : take[0]
    }

    const CTable = useCTable()

    const itemProps = computed(() => {
      return {
        icon: getToggleableValue(props.def.icon),
        flat: true,
        padding: 'xs',
        size: 'sm',
        color: enabled.value ? 'primary' : undefined,
        label: getToggleableValue(props.def.label)
      }
    })

    const onItemClick = () => {
      console.log("ITEM CLICK")
      const res = props.def.handler(CTable)
      /*console.log("item click res", res)
      console.log("props.def.toggle", props.def.toggle)
      if (props.def.toggle) enabled.value = res*/
    }

    //const tooltip = computed(() => 

    return {
      onItemClick,
      enabled,
      itemProps
    }
  }
})
</script>