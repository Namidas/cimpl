<template>
  <div v-bind="renderProps.main">
    <div
      class="tool flex"
      v-if="col.colDef.filter"
    >
      <q-separator
        vertical
        class="q-mx-xs"
      />
      <THClearFilter
        v-bind="clearFilterProps"
        :enabled="filterEnabled"
      />
    </div>
    <div
      class="tool flex"
      v-if="col.colDef.sortable"
    >
      <q-separator
        vertical
        class="q-mx-xs"
      />
      <THSort :colName="col.colDef.name" />
    </div>
    <q-separator
      vertical
      class="q-mx-xs"
      v-if="col.toolsPosition === 'left'"
    />
  </div>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import THClearFilter from './th-filter-clear.vue'
import THSort from './th-sort.vue'

export default defineComponent({
  name: 'CTableColumnTools',
  props: ['col', 'filterEnabled'],

  components: {
    THClearFilter,
    THSort
  },

  emits: [
    'clear:filter',
  ],

  setup (props, { emit }) {

    const renderFilterClear = computed(() => colValues.value.colDef.filter && !colValues.value.colDef.filterShowAlways)
    var lastFilterEmit = ''
    const clearFilterProps = {
      //debugRender: props.debugRender,
      //debugWatch: props.debugWatch,
      //debugSetup: props.debugSetup,
      //colName: scope.col.name,
      enabled: props.filterEnabled,
      'onClear:filter': (payload) => {
        //console.log("DESDE BOTON onClear:filter", payload)
        emit('clear:filter')
      }
    }


    const renderProps = computed(() => {
      return {
        main: {
          class: [
            'column-tools',
            `column-tools-position-${props.col.toolsPosition}`,
            'row',
            `q-m${props.col.toolsPosition === 'top' ? 'b' : (props.col.toolsPosition === 'right' ? 'l' : (props.col.toolsPosition === 'bottom' ? 't' : 'r'))}-xs`
          ]
        }
      }
    })
    return {
      renderProps,
      clearFilterProps
    }
  }
})
</script>