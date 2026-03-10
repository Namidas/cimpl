<template>
  <q-th
    class="c-th"
    :props="qTHProps"
    :data-cell-type="colValues.colDef.type"
  >
    <div
      class="c-th-outter-wrap column"
      v-if="!colValues.isSpecial"
    >
      <ColumnTools
        :col="colValues"
        :filter-enabled="filterEnabled"
        @clear:filter="onClearFilter"
        v-if="colValues.toolsPosition === 'top'"
      />

      <THFilter
        v-if="renderFilter && colValues.filterPosition === 'top'"
        v-bind="filterProps"
      />

      <div class="c-th-inner-wrap row justify-between">

        <ColumnTools
          :col="colValues"
          :filter-enabled="filterEnabled"
          @clear:filter="onClearFilter"
          v-if="colValues.toolsPosition === 'left'"
        />

        <span class="label flex-grow-1">{{colValues.label}}</span>

        <ColumnTools
          :col="colValues"
          :filter-enabled="filterEnabled"
          @clear:filter="onClearFilter"
          v-if="colValues.toolsPosition === 'right'"
        />

        <!--<div
          v-if="colValues.hasTools"
          class="tools row q-ml-sm"
        >
          <q-separator
            v-if="renderFilterClear"
            vertical
            class="q-mx-xs"
          />
          <THClearFilter
            v-if="renderFilterClear"
            v-bind="clearFilterProps"
          />
          <q-separator
            v-if="colValues.colDef.sortable"
            vertical
            class="q-mx-xs"
          />
          <THSort
            v-if="colValues.colDef.sortable"
            :colName="colValues.colDef.name"
          />
        </div>-->
      </div>

      <ColumnTools
        :col="colValues"
        :filter-enabled="filterEnabled"
        @clear:filter="onClearFilter"
        v-if="colValues.toolsPosition === 'bottom'"
      />

      <THFilter
        v-if="renderFilter && colValues.filterPosition === 'bottom'"
        v-bind="filterProps"
      />
    </div>
    <div
      class="c-th-outter-wrap text-center"
      v-else
    >
      <component :is="specialCompo" />
    </div>
  </q-th>
</template>
<script>
import { defineComponent, ref, computed } from 'vue'
import _ from 'lodash'

import { useInjectCTable } from './../../composables/table-provide'


import THClearFilter from './th-filter-clear.vue'
import THSort from './th-sort.vue'
import THFilter from './th-filter.vue'


import THSelector from './th-selector.vue'
import THTools from './th-tools.vue'
import ColumnTools from './column-tools.vue'

export default defineComponent({
  name: 'CTh',

  props: {
    props: {
      required: true,
      type: Object
    },

    colIndex: {
      required: true,
      type: Number
    },

    /*filter: {
      required: false
    },
    sorting: {
      required: false
    },

    specialCol: {
      required: false,
      type: Boolean,
      default: false,
    },

    exposedKey: undefined,
    debugRender: undefined,
    debugWatch: undefined,
    debugSetup: undefined,

    selectionCell: undefined,
    noSelect: undefined*/
  },

  emits: [
    'update:sorting',
    'update:filter'
  ],

  components: {
    THClearFilter,
    THSort,
    THFilter,
    ColumnTools
  },

  setup (props, { emit }) {

    //console.log("THv2", props)

    const {
      getColumnValues,
      childEmit,
      //getComputedTableProp
    } = useInjectCTable()

    const colValues = getColumnValues(props.colIndex)
    const qTHProps = computed(() => {
      console.log("|| CTh compute qTHProps")
      return {
        ...props.props,
        col: props.props.cols[props.colIndex]
      }
    })

    if (colValues.value.isSpecial) return {
      colValues,
      qTHProps,
      specialCompo: computed(() => colValues.value.colDef.name === 'row-select' ? THSelector : THTools)
    }


    //const showFilter = ref(colValues.value.colDef.filterShowAlways)
    /*const renderFilterClear = computed(() => colValues.value.colDef.filter && !colValues.value.colDef.filterShowAlways)
    var lastFilterEmit = ''
    const clearFilterProps = ref({
      //debugRender: props.debugRender,
      //debugWatch: props.debugWatch,
      //debugSetup: props.debugSetup,
      //colName: scope.col.name,
      enabled: colValues.value.colDef.filterShowAlways,
      'onClear:filter': (payload) => {
        //console.log("DESDE BOTON onClear:filter", payload)
        if (!clearFilterProps.value.enabled) clearFilterProps.value.enabled = true
        else {
          clearFilterProps.value.enabled = false
          if (lastFilterEmit !== '') {
            childEmit('update:filter', { col: { name: colValues.value.colDef.name }, value: '' })
            lastFilterEmit = ''
          }
        }
      }
    })*/

    const filterEnabled = ref(false)
    var lastFilterEmit = ''
    const onClearFilter = (payload) => {
      if (!filterEnabled.value) filterEnabled.value = true
      else {
        filterEnabled.value = false
        if (lastFilterEmit !== '') {
          childEmit('update:filter', { col: { name: colValues.value.colDef.name }, value: '' })
          lastFilterEmit = ''
        }
      }
    }


    const renderFilter = computed(() => colValues.value.colDef.filter && filterEnabled.value/*clearFilterProps.value.enabled*/)
    const filterProps = ref({
      //props: scope,
      //filter: props.filter,
      //filter: this.innerModel,
      class: `q-m${colValues.value.filterPosition === 'bottom' ? 't' : 'b'}-xs`,
      col: colValues.value.colDef,
      'onUpdate:filter': (payload) => {
        if (lastFilterEmit === payload.value) return
        lastFilterEmit = payload.value
        childEmit('update:filter', payload)
      }
    })

    return {
      qTHProps,
      colValues,

      //renderFilterClear,
      //clearFilterProps,
      filterEnabled,
      onClearFilter,

      renderFilter,
      filterProps
    }

  }
})
</script>