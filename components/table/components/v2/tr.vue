<template>
  <!--<q-tr v-bind="trProps">-->
  <q-tr
    :props="props"
    v-if="rowType === 'header'"
  >
    <CTh
      :props="props"
      :col-index="index"
      v-for="(colData,index) in columnsDefinition"
      :key="index"
    />
  </q-tr>
  <q-tr
    :props="props"
    v-bind="trProps"
    v-else
  >
    <CTd
      :props="props"
      :col-index="index"
      v-for="(colData,index) in columnsDefinition"
      :key="index"
    />
  </q-tr>
</template>
<script>
import { QTr } from 'quasar'
import { defineComponent, h, reactive, ref, watchEffect, watch, computed } from 'vue'
//import { useCompoExtend_computed, compoExtend_get } from './../../../../composables/compoExtend'
import _ from 'lodash'
import { mergeReactive } from './../../../../utils/reactive'

import CTh from './th.vue'
import CTd from './td.vue'

import { useInjectCTable } from './../../composables/table-provide'

export default defineComponent({
  name: 'CTr',

  emits: [
    //'update:sorting',
    'update:filter',
    'update:cell'
  ],

  components: {
    CTh,
    CTd
  },

  props: {
    //...compoExtend_get(QTr, 'props'),
    props: undefined,

    rowType: {
      required: true,
      type: String
    },

    /*filters: {
      required: false
    },

    sorting: {
      required: false
    },

    highlight: {
      required: false
    },

    

    exposedKey: undefined,
    debugRender: undefined,
    debugWatch: undefined,
    debugSetup: undefined,
    slotted: undefined,

    selection: undefined*/
  },

  setup (props, { slots, emit, attrs }) {

    if (props.debugSetup) {
      console.log(`// CTr v2 <${props.rowType}:${props.exposedKey}> setup`, props)
      console.log(`// CTr v2 <${props.rowType}:${props.exposedKey}> slots`, slots)
    }

    const { columnsDefinition, isSelected, getRowKey } = useInjectCTable()

    const rowKey = ref(null)
    var lastRowCompared = null
    watchEffect(() => {
      if (lastRowCompared === props.props.row) return
      console.log("|| CTr watchEffect rowKey", props.props.row)
      lastRowCompared = props.props.row
      rowKey.value = props.rowType === 'body' ? getRowKey(props.props.row) : null
    })

    /*const isSelectedRow = computed(() => {
      console.log("|| CTr compute isSelectedRow", props.props.row)
      return props.rowType === 'body' ? isSelected(props.props.row) : false
    })*/

    /*const isSelectedRow = computed(() => {
      console.log("|| CTr compute isSelectedRow")
      return isSelected(rowKey.value)
    })*/

    /*const trClassess = computed(() => {
      console.log("|| CTr compute trClassess")
      return [
        'c-tr',
        isSelectedRow.value ? 'selected-row' : undefined
      ]
    })*/

    const trProps = computed(() => {
      console.log("|| CTr compute trProps")
      const isSelectedRow = isSelected(rowKey.value)
      return {
        //...extendedPropsProxy.value,
        //class: trClassess.value
        class: [
          'c-tr',
          isSelectedRow ? 'selected-row' : undefined
        ]
      }
    })

    return {
      columnsDefinition,
      trProps,
      //isSelectedRow
    }
  },
})
</script>