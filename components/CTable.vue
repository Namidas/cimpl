<template>
  <div v-bind="tableProps">
    filters: {{filters}}
    <q-table v-bind="QTableProps">
      <template #loading="scope">
        <slot
          name="loading"
          v-bind="scope"
        >
          <q-linear-progress
            class="c-table-load-indicator full-width"
            indeterminate
          />
        </slot>
      </template>

      <template #top="scope">
        <slot
          name="top"
          v-bind="scope"
        >
          <CTableTop
            :scope="scope"
            v-if="useTableTop"
            v-bind="tableTopProps"
          />
        </slot>
      </template>

      <template #top-row="scope">
        <slot
          name="top-row"
          v-bind="scope"
          :paginated-selection="paginatedSelection"
          :clear-paginated-selection="clearPaginatedSelection"
        >
          <tr v-if="paginatedSelection.length">
            <td
              class="text-center bg-primary text-white"
              :colspan="totalColumns"
            >
              <div
                class="cursor-pointer"
                @click="clearPaginatedSelection"
              >
                off page select: {{paginatedSelection.length}}
              </div>
            </td>
          </tr>
        </slot>
      </template>

      <template #header="scope">
        <slot
          name="header"
          v-bind="scope"
        >
          <CTableHeader :q-scope="scope" />
        </slot>
      </template>

      <template #body="scope">
        <slot
          name="body"
          v-bind="scope"
        >
          <CTableBody :q-scope="scope" />
        </slot>
      </template>
    </q-table>
  </div>
</template>
<script>
/*
true complexity comes wrapped in simplicity
complexity is a treasure, not a barrier

(Mariano Rodriguez?)
*/
/*algo que me sugirió Gemini

const renderHeaders = () => columns.map(c => h('th', { key: c.id }, c.label))

// In your main render function:
return () => h('table', [
  h('thead', [
    h('tr', renderHeaders()) // Fresh VNodes every time the table renders
  ])
])

const renderCells = (row) => {
  return columns.map(col => h('td', { key: col.id }, row[col.key]))
}*/


import './table/styles.v3.scss'

import { defineComponent, computed, h, ref, nextTick, watch, watchEffect, reactive, onMounted } from 'vue'
import { QTable } from 'quasar'
import './table/defaults'
import { hSlot } from './../utils/render'
import { useCompoExtend_computed, compoExtend_get } from './../composables/compoExtend'

import _ from 'lodash'

import CTableTop from './table/components/table-top.vue'
import CTableHeader from './table/components/table-header.vue'
import CTableBody from './table/components/table-body.vue'

import { useProvideCTable } from './table/composables'
import { mergeReactive } from '../utils/reactive'

import { useCTableColumns } from './table/composables/table-columns'
import { useCTableRows } from './table/composables/table-rows'
import { useCTableViews } from './table/composables/table-views'
import { useCTableTop } from './table/composables/table-top'
import { useCTableUtils } from './table/composables/table-utils'
import { useCTableEmit } from './table/composables/table-emit'
import { useCTableSelection } from './table/composables/table-selection'
import { useCTableTools } from './table/composables/table-tools'
import { useProvideCTable2 } from './table/composables/table-provide'



export default defineComponent({
  name: 'CTable',

  props: {
    //get/inherit QTable props
    ...compoExtend_get(QTable, 'props'),

    config: {
      required: false,
      type: Object,
      default: {}
    },

    rowTools: {
      required: false,
      default: []
    },

    //common values to use when determining column props
    // defaults > columnsCommon > columnsProps
    columnsCommonProps: {
      required: false,
      type: Object,
      default: {}
    },

    /*
    CHEQUEAR QUE QTABLE TIENE UN TAL VISIBLE COLUMNS
    */

    //column-specific values to use when determining column props
    // defaults > columnsCommon > columnsProps
    //there are two ways to define table columns, one through the prop "columns" (inherited
    //from QTable) which determine exactly which columns should be shown, order, props, etc,
    //when using "columns" (originally) you either leave it empty and take everything from
    //the first row of data, or define exactly what you want and exclude everything else,
    //on the other hand this new prop "columnProps" allow you to also state column prop 
    //definitions regardless of the prop "columns"
    columnsProps: {
      required: false,
      type: Object,
      default: {}
    },

    //array of columns to exclude, by column name
    excludeColumns: {
      required: false,
      type: Array,
      default: []
    },

    //object of filters models (whereas "filter" is the inheritd prop of QTable) and works
    //as either a straightforward text filter or through a custom handler but uses a single
    //value for each and every column, this new prop allows us to have different filters
    //per column, but also type specific: text, strings, dates or date ranges, etc
    filters: {
      required: false,
      type: Object,
      default: {}
    },

    //separated object/array of sorting options, per-column, instead of having them inside
    //column definition, when an object it contains col.name => sort.direction, when an
    //array it contains object elements in the form of {name, direction}, key difference
    //being that when an array the column/overall-sorting order is implied
    //by the order of elements on the array
    sorting: {
      required: false,
      type: [Object, Array],
      default: []
    },

    //show TH tools on top or to the right of label
    columnToolsPosition: {
      required: false,
      type: String,
      default: 'top'
    },

    //highlight filter results on cell content?
    highlightResults: {
      required: false,
      type: Boolean,
      default: false
    },

    //available tools for the table
    /*can be a string (that will take def handler object from defaults) or a handler object*/
    tools: {
      required: false,
      type: Array
    },

    //amount of tools to show as separate buttons, the rest of them will be added to a contextual menu
    toolsNum: {
      required: false,
      type: Number
    },

    //available view types for the table, when empty, it will default to ['table']
    /*can be a string (that will take def handler object from defaults) or a handler object*/
    views: {
      required: false,
      type: Array
    },

    //available view styles for the table, when empty, it will default to ['cozy']
    /*can be a string (that will take def handler object from defaults) or a handler object*/
    viewStyles: {
      required: false,
      type: Array
    },

    debugRender: {
      required: false,
      type: Boolean,
      default: false
    },
    debugWatch: {
      required: false,
      type: Boolean,
      default: false
    },
    debugSetup: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  emits: [
    ...compoExtend_get(QTable, 'emits'),

    'update:filter',
    'update:filters',

    'update:sorting',

    'update:cell',

    'rowtool:confirm'
  ],

  components: {
    CTableTop,
    CTableHeader,
    CTableBody
  },

  setup (props, { slots, emit, expose }) {
    if (props.debugSetup) console.log("// CTable setup")


    /* UTILS */
    const {
      getComputedProps,
      tableConfig,
      tableLabels,
      getSlot,
      //getComputedTableProps,
      //getComputedTableProp
    } = useCTableUtils(props, slots)


    /* COLUMNS */
    const {
      columnsDefinition,
      totalColumns,
      columnsDefinition4QTable,
      //getColumnDefinition,
      //getReactiveColumnDefinition
      getColumnValues,
      getColumnSort,
      getColumnFilter
    } = useCTableColumns(props, tableConfig)


    /* ROWS */
    const {
      getRowKey,
      getRow,
      getCellValues
    } = useCTableRows(props, tableConfig, getColumnValues, getSlot)


    /* VIEW/STYLE */
    const {
      availableViews,
      currentView,
      availableViewStyles,
      currentViewStyle
    } = useCTableViews(props, tableConfig)


    /* TOP and TOP-ROW related*/
    const {
      useTableTop,
      tableTopProps
    } = useCTableTop(props)

    /* SELECTION */
    const {
      selection,
      isSelected,
      paginatedSelection,
      clearPaginatedSelection,
      select,
      selectAll,
      selectInvert,
      selectNone
    } = useCTableSelection(props, getRowKey)

    /* TOOLS */
    const {
      availableRowTools,
      rowToolsList,
      rowBulkToolsList
    } = useCTableTools(props, tableConfig)

    /* EVENTS */
    const {
      childEmit
    } = useCTableEmit(props, emit)


    useProvideCTable2({
      //provide access to all props
      tableProps: props,

      //columns
      columnsDefinition,
      totalColumns,
      getColumnValues,
      getColumnSort,
      getColumnFilter,

      //selection
      selection,
      isSelected,
      paginatedSelection,
      clearPaginatedSelection,
      select,
      selectAll,
      selectInvert,
      selectNone,

      //tools
      availableRowTools,
      rowToolsList,
      rowBulkToolsList,

      //rows, cells
      getRowKey,
      getCellValues,

      //utils
      getComputedProps,
      tableConfig,
      tableLabels,
      getSlot,
      //getComputedTableProps,
      //getComputedTableProp,

      //events
      childEmit
    })








    /* LEGACY */

    const emitRowTool = (payload) => {
      console.log("-- EMIT ROW TOOL", payload)
      emit('rowtool:confirm', payload)
    }


    /* TABLE TOOLS RELATED *//* TABLE TOOLS RELATED *//* TABLE TOOLS RELATED */
    /* TABLE TOOLS RELATED *//* TABLE TOOLS RELATED *//* TABLE TOOLS RELATED */
    /* TABLE TOOLS RELATED *//* TABLE TOOLS RELATED *//* TABLE TOOLS RELATED */






    /* TABLE PAGINATION *//* TABLE PAGINATION *//* TABLE PAGINATION */
    /* TABLE PAGINATION *//* TABLE PAGINATION *//* TABLE PAGINATION */
    /* TABLE PAGINATION *//* TABLE PAGINATION *//* TABLE PAGINATION */
    /* TABLE PAGINATION *//* TABLE PAGINATION *//* TABLE PAGINATION */
    const innerPagination = reactive({})
    watchEffect(() => {
      if (props.debugWatch) {
        console.log("|| CTable watchEffect props.pagination")
        console.log(props.pagination)
      }
      if (props.pagination) for (const x in props.pagination)
        innerPagination[x] = props.pagination[x]
    })

    /* SLOTS SLOTS SLOTS SLOTS */
    /* SLOTS SLOTS SLOTS SLOTS */
    /* SLOTS SLOTS SLOTS SLOTS */
    /*const bodySlotsProps = reactive({})
    watchEffect(() => {
      if (props.debugWatch) {
        console.log("|| CTable watchEffect bodySlotsProps [start]")
        console.log("rows changed, so we're checking if we need to create new reactive objects to hold")
        console.log("last but not least, need to somehow tie this to the column structure, as-is we're implying the structure of the rows remains the same 4ever")
        console.log("current pagination?", innerPagination)
      }

      for (const x in props.rows) {
        const key = `ctr-body-${getRowKey(props.rows[x])}`

        if (!bodySlotsProps[key])
          bodySlotsProps[key] = reactive({
            debugRender: props.debugRender,
            debugWatch: props.debugWatch,
            debugSetup: props.debugSetup,
            key: key,
            exposedKey: key,
            rowType: 'body',
            'onUpdate:cell': (payload) => emit('update:cell', payload),
            selection: props.selection
          })
      }

      if (props.debugWatch) {
        console.log("..resulting reactive after watchEffect, by the time you see this on console it'll already have the scoped props assigned")
        console.log(bodySlotsProps)
        console.log("|| CTable watchEffect bodySlotsProps [end]")
      }
    })

    const headerSlotProps = reactive({
      debugRender: props.debugRender,
      debugWatch: props.debugWatch,
      debugSetup: props.debugSetup,
      key: 'ctr-header',
      exposedKey: 'ctr-header',
      rowType: 'header',
      'onUpdate:sorting': (payload) => updateSorting(payload),
      'onUpdate:filter': (payload) => updateFilter(payload),
    })

    watchEffect(() => headerSlotProps.selection = props.selection)

    watchEffect(() => {
      if (props.debugWatch) console.log("|| CTable watchEffect headerSlotProps for filters")
      mergeReactive(headerSlotProps, {
        filters: props.filters,
      })
    })*/

    /*watchEffect(() => {
      if (props.highlightResults) {
        if (props.debugWatch) console.log("|| CTable watchEffect bodySlotsProps for highlight")
        for (const x in bodySlotsProps) {
          console.log("-- agrego highlight a " + x)
          bodySlotsProps[x].highlight = props.filters
        }
      }
    })

    watchEffect(() => {
      if (props.debugWatch) console.log("|| CTable watchEffect headerSlotProps for sorting")
      mergeReactive(headerSlotProps, {
        sorting: props.sorting,
      })
    })*/


    const bodyRows = new Map()
    const bodySlot = (scope) => {
      const cacheKey = `ctr-body-${scope.key}`
      if (props.debugRender) {
        //console.log('CTable>CTr current scope key to render body', scope.key)
        //console.log("has cache? ", bodyRows.has(cacheKey))
      }
      if (!bodyRows.has(cacheKey) || bodyRows.get(cacheKey).scope !== scope) bodyRows.set(cacheKey, {
        node: h(CTr, mergeReactive(bodySlotsProps[`ctr-body-${scope.key}`], { props: scope })),
        scope: scope
      })
      return bodyRows.get(cacheKey).node
    }

    const tableSlots = reactive({

      header: hSlot(slots.header, (scope) => h(CTr, mergeReactive(headerSlotProps, { props: scope }))),
    })
    watchEffect(() => {
      if (props.debugWatch) console.log("|| CTable watchEffect tableSlots")

      mergeReactive(tableSlots, {

        //item: this.$slots.item ? (scope) => this.$slots.item(scope) : undefined,


        //body: hSlot(slots.body, (scope) => h(CTr, mergeReactive(bodySlotsProps[`ctr-body-${scope.key}`], { props: scope }))),
        body: hSlot(slots.body, bodySlot),



        /*//'header-cell': this.$slots['header-cell'] ? (scope) => this.$slots['header-cell'](scope) : (scope) => h(CImplTH, { props: scope, filter: this.filters[scope.col.name], 'onUpdate:filter': (payload) => this.$emit('update:filters', payload) }, this.$slots),
        'body-selection': this.$slots['body-selection'] ? (scope) => this.$slots['body-selection'](scope) : undefined,
        'header-selection': this.$slots['header-selection'] ? (scope) => this.$slots['header-selection'](scope) : undefined,
        
        'bottom-row': this.$slots['bottom-row'] ? (scope) => this.$slots['bottom-row'](scope) : undefined,
        
        bottom: this.$slots.bottom ? (scope) => this.$slots.bottom(scope) : undefined,
        pagination: this.$slots.pagination ? (scope) => this.$slots.pagination(scope) : undefined,
        'top-left': this.$slots['top-left'] ? (scope) => this.$slots['top-left'](scope) : undefined,
        'top-right': this.$slots['top-right'] ? (scope) => this.$slots['top-right'](scope) : undefined,
        'top-selection': this.$slots['top-selection'] ? (scope) => this.$slots['top-selection'](scope) : undefined,
        'no-data': this.$slots['no-data'] ? (scope) => this.$slots['no-data'](scope) : undefined,*/
      })
    })
    if (props.debugWatch) watch(() => tableSlots, () => console.log("|| CTable watch tableSlots"))

    /* FILTERS FILTERS FILTERS FILTERS*/
    /* FILTERS FILTERS FILTERS FILTERS*/
    /* FILTERS FILTERS FILTERS FILTERS*/
    /* FILTERS FILTERS FILTERS FILTERS*/
    function updateFilter (payload) {
      emit('update:filter', {
        col: payload.col,
        value: payload.value,
      })
      emit('update:filters', _.merge({}, props.filters, { [payload.col.name]: payload.value }))
      nextTick(() => emit('request'))
    }

    /* SORTING SORTING SORTING SORTING */
    /* SORTING SORTING SORTING SORTING */
    /* SORTING SORTING SORTING SORTING */
    /* SORTING SORTING SORTING SORTING */
    function sortMap () {
      const sort = new Map();
      const isArray = _.isArray(props.sorting)
      for (const x in props.sorting)
        sort.set(isArray ? props.sorting[x].name : x, isArray ? props.sorting[x].direction : props.sorting[x])
      return sort
    }

    function updateSorting (payload, deleteEmpty) {

      if (deleteEmpty === undefined) deleteEmpty = true
      const current = props.sorting
      const isArray = _.isArray(current)
      const isEmpty = payload.direction.trim() === ''
      var result = null
      if (!isArray) {
        result = _.merge({}, current, { [payload.name]: payload.direction })
        if (isEmpty && deleteEmpty) delete result[payload.name]
      }
      else {
        result = []
        for (const x in columnsDefinition.value) {
          const def = columnsDefinition.value[x]
          if (def.name === payload.name) {
            if (!isEmpty || !deleteEmpty) result.push(payload)
          }
          else {
            const found = _.find(current, { name: def.name })
            if (found) result.push(found)
          }
        }
      }
      emit('update:sorting', result)
      nextTick(() => emit('request'))
    }

    const tableHeaderProps = computed(() => {
      return {
        /*debugRender: props.debugRender,
        debugWatch: props.debugWatch,
        debugSetup: props.debugSetup,
        key: 'ctr-header',
        exposedKey: 'ctr-header',*/
        'onUpdate:sorting': (payload) => updateSorting(payload),
        'onUpdate:filter': (payload) => updateFilter(payload),

        selection: props.selection,
        filters: props.filters,
        sorting: props.sorting,
      }
    })

    /*TABLE NODE TABLE NODE TABLE NODE*/
    /*TABLE NODE TABLE NODE TABLE NODE*/
    /*TABLE NODE TABLE NODE TABLE NODE*/
    /*TABLE NODE TABLE NODE TABLE NODE*/


    console.log("COLUMNS QUE MANDO: ", columnsDefinition4QTable)

    const fullscreen = ref(props.fullscreen ? props.fullscreen : false)
    const {
      extendedPropsProxy
    } = useCompoExtend_computed(QTable, props, {
      proxy: {
        columns: columnsDefinition4QTable,
        fullscreen: false,
        //pagination: innerPagination,
        'onUpdate:pagination': (newValue) => {
          if (props.debugWatch) console.log("|| CTable QTable's onUpdate:pagination", newValue)
          for (const x in newValue)
            innerPagination[x] = newValue[x]
          emit('update:pagination', newValue)
        }
      },
      //ignore: ['fullscreen']
    })
    const tableRef = ref(null)
    const QTableProps = computed(() => {
      return {
        ...extendedPropsProxy.value,
        ref: tableRef,
        onRequest: (payload) => emit('request', payload)
      }
    })
    //if (props.debugWatch) watch(extendedPropsProxy, () => console.log("|| CTable watch extendedPropsProxy"))



    /* RENDER RENDER RENDER RENDER RENDER */
    /* RENDER RENDER RENDER RENDER RENDER */
    /* RENDER RENDER RENDER RENDER RENDER */
    /* RENDER RENDER RENDER RENDER RENDER */
    const self = ref(null)
    const tableProps = computed(() => {
      return {
        ref: self,
        class: [
          'c-table',
          //'sticky-header',
          props.loading ? 'is-loading' : undefined,
          `view-type-${currentView.value.name}`,
          `view-style-${currentViewStyle.value.name}`,
          fullscreen.value ? 'is-fullscreen' : undefined
        ]
      }
    })

    /*watchEffect(() => {
      tableProps.class['is-loading'] = props.loading
    })*/
    //if (props.debugWatch) watch(tableProps, () => console.log("|| CTable watch tableProps"))

    onMounted(() => {
      currentView.value.handler(CTable, true)
      currentViewStyle.value.handler(CTable, true)
    })






    const toggleFullscreen = () => {
      console.log("CTABLE TOGGLE FULLSCREEN", tableRef.value)
      fullscreen.value = !fullscreen.value
      //tableRef.value.toggleFullscreen()
      return fullscreen.value
    }

    /* PROVIDE PROVIDE PROVIDE PROVIDE*/
    /* PROVIDE PROVIDE PROVIDE PROVIDE*/
    /* PROVIDE PROVIDE PROVIDE PROVIDE*/
    /* PROVIDE PROVIDE PROVIDE PROVIDE*/
    const {
      //paginatedSelection,
      //clearPaginatedSelection,
      CTable
    } = useProvideCTable(props, slots, getRowKey, emitRowTool, {
      currentView,
      availableViews,
      currentViewStyle,
      availableViewStyles,
      childEmit,
      fullscreen,
      toggleFullscreen
    })

    /* EXPOSE */
    expose({
      sortMap,
      toggleFullscreen
    })


    return {
      tableProps,
      QTableProps,
      useTableTop,
      tableTopProps,
      tableHeaderProps,
      paginatedSelection,
      clearPaginatedSelection
    }

    /*const render = () => {
        if (props.debugRender) console.log('* RENDER: -- CTable')
        return h('div', tableProps, h(QTable, extendedPropsProxy, tableSlots))
    }
    return render*/
  }
})
</script>