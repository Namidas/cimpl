<template>
  <div class="cimpl-table-wrapper">
    <div
      v-for="(slotContent,slotKey) in tableSlots"
      :key="slotKey"
    >{{slotKey}} /</div>
    <hr />
    slots?: {{Object.keys(tableSlots)}}
    <q-btn
      label="toggle loading"
      @click="innerLoading = !innerLoading"
    />
    <hr />
    qCompoPropsProxyParsed: {{Object.keys(qCompoPropsProxyParsed)}}
    <hr />
    <div v-if="innerLoading">IS LOADING</div>
    <q-table v-bind="qCompoPropsProxyParsed">
      <template
        v-for="(columnDef,columnKey) in columnsDefinition"
        :key="columnKey"
        #[`header-cell-${columnDef.name}`]="scope"
        v-memo="[columnsDefinition]"
      >
        <slot
          :name="`header-cell-${columnDef.name}`"
          v-if="$slots[`header-cell-${columnDef.name}`]"
        />
        <slot
          :name="`header-cell-type-${columnDef.type}`"
          v-else-if="$slots[`header-cell-type-${columnDef.type}`]"
        />
        <slot
          name="header-cell"
          v-else-if="$slots['header-cell']"
        />
        <CImplTH
          v-else
          :props="scope"
          @update:filter="onUpdateTHFilter"
        />
      </template>

      <!--<template
        v-for="(columnDef,columnKey) in columnsDefinition"
        :key="columnKey"
        #[`body-cell-${columnDef.name}`]="scope"
      >
        <slot
          :name="`body-cell-${columnDef.name}`"
          v-if="$slots[`body-cell-${columnDef.name}`]"
          v-bind="scope"
        />
        <slot
          :name="`body-cell-type-${columnDef.type}`"
          v-else-if="$slots[`body-cell-type-${columnDef.type}`]"
          v-bind="scope"
        />
        <slot
          name="body-cell"
          v-else-if="$slots['body-cell']"
          v-bind="scope"
        />
        <CImplTD
          v-else
          :props="scope"
        >
          <template
            #content="scope"
            v-if="$slots[`body-cell-${columnDef.name}:content`]"
          >
            <slot
              :name="`body-cell-${columnDef.name}:content`"
              v-bind="scope"
            />
          </template>
          <template
            #content="scope"
            v-else-if="$slots[`body-cell-type-${columnDef.type}:content`]"
          >
            <slot
              :name="`body-cell-type-${columnDef.type}:content`"
              v-bind="scope"
            />
          </template>
          <template
            #content="scope"
            v-else-if="$slots['body-cell:content']"
          >
            <slot
              name="body-cell:content"
              v-bind="scope"
            />
          </template>
        </CImplTD>
      </template>-->
    </q-table>
  </div>
</template>
<script>
/*eslint-disabled*/
import { defineComponent, computed, h, unref, watch, ref, withMemo } from 'vue'
import { QTable, QInnerLoading } from 'quasar'
import { useQuasarCompoExtend, useQuasarCompoExtend_get } from './../composables/quasarCompoExtend'
import { useDefaultsStore } from './../stores/defaults'
import plain_copy from './../utils/plain_copy'

import _ from 'lodash'

import CImplTH from './table/components/th.vue'
import CImplTD from './table/components/td'

const $_COLUMN_DEFAULT = {
  name: undefined, //name of the column, related to row[name]
  label: undefined,
  filter: true, //use column header filter?,
  filterDebounce: 1000,
  edit: false, //allow cell quick-edit
  editPopup: false, //use a pop-up to quick edit cell, otherwise edit in-place
  type: undefined, //type of row cell,

  //getters for header label and content
  labelGetter: undefined, //(label) => `label: ${label}`
  contentGetter: undefined, //(content) => `content: ${content}`

  //QTable's
  sortable: true,
}

/*const $_CELL_DEFAULT = {
    type: undefined //type of row cell
}*/

const defaults = useDefaultsStore()
defaults.set('cimpl-table', {
  column: {
    _: { ...$_COLUMN_DEFAULT }
  },

  /*cell: {
      _: { ...$_CELL_DEFAULT },

      content: {
          ...$_CELL_DEFAULT,
          type: 'content'
      }
  }*/
})

export default defineComponent({
  name: 'cimpl-table',

  components: {
    CImplTH,
    CImplTD
  },

  props: {
    //get QTable props
    ...useQuasarCompoExtend_get(QTable, 'props', ['loading']/*, ['filter']*/),

    //rows of data to feed the table
    /*rows: {
        required: true,
        type: Array
    },*/

    //common values to use when determining column props
    // defaults > columnsCommon > columnsProps
    columnsCommonProps: {
      required: false,
      type: Object,
      default: {}
    },

    //column-specific values to use when determining column props
    // defaults > columnsCommon > columnsProps
    //there are two way to define table columns, one through the prop "columns" (inherited
    //from QTable) which determine exactly in which columns should be shown, order, props, etc,
    //when using "columns" (originally) you either leave it empty to take everything from
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

    //object of filters models (whereas "filter" is the inheritd prop of QTable)
    /*filters: {
        required: false,
        type: Object,
        default: {}
    }*/

    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: [
    //habria que heredar todos los eventos aca
    'request',

    'update:filters',
  ],

  setup (props, { slots, emit }) {
    //var headerCells = []

    watch(() => props.columns, () => console.log("--- MUTA props.columns"), { deep: true })
    watch(() => props.rows, () => console.log("--- MUTA props.rows"), { deep: true })
    watch(() => props.rows[0], () => console.log("--- MUTA props.rows[0]"), { deep: true })
    watch(() => props.excludeColumns, () => console.log("--- MUTA props.excludeColumns"), { deep: true })
    watch(() => props.columnsCommonProps, () => console.log("--- MUTA props.columnsCommonProps"), { deep: true })
    watch(() => props.columnsProps, () => console.log("--- MUTA props.columnsProps"), { deep: true })

    //var isFirstLoad = true
    var lastValidValue = ref([])
    const columnsDefinition = computed(() => {
      console.log("computo column defs")
      var cols = []
      if (!props.columns && !props.rows.length)
        return lastValidValue.value
      //}
      //else return unref(columnsDefinition)

      const columnsBaseDefinitions = props.columns ? props.columns :
        Object.keys(props.rows[0]).map((colName) => { return _.merge({}, /*defaults.get('cimpl-table.column._'),*/ { name: colName, label: colName }) })

      for (const x in columnsBaseDefinitions) {
        const baseColumn = columnsBaseDefinitions[x]
        const columnName = baseColumn.name
        if (columnName === undefined)
          console.error('cimpl-table: column definition has no name', baseColumn)

        if (props.excludeColumns.includes(columnName))
          continue

        const columnType = _.get(baseColumn, 'type',
          _.get(props.columnsCommonProps, 'type',
            defaults.get('cimpl-table.column._.type', 'text')))

        const col = _.merge({},
          defaults.get('cimpl-table.column._', {}),
          defaults.get(`cimpl-table.column.${columnType}`, {}),
          props.columnsCommonProps,
          { type: columnType },
          _.get(props.columnsProps, columnName, {}),
          baseColumn
        )

        cols.push(col)

        /*var cellNode = null
        if (slots[`header-cell-${col.name}`])
            cellNode = (scope) => slots[`header-cell-${col.name}`](scope)
        else if (slots[`header-cell-type-${col.type}`])
            cellNode = (scope) => slots[`header-cell-type-${col.type}`](scope)
        else if (slots['header-cell']) cellNode = (scope) => slots['header-cell'](scope)
        else cellNode = (scope) => h(CImplTH, { props: scope, filter: props.filters[scope.col.name], 'onUpdate:filter': (payload) => emit('update:filters', payload) }, slots)
        headerCells.push({
            name: col.name,
            node: cellNode
        })*/
      }

      lastValidValue.value = cols
      return cols
    })

    //const ignoreFilterValueChange = undefined
    /*const filterValues = {}
    const updateFilterValues = function () {
        console.log("--- update filter values, current?", filterValues)
        //console.log("payload?", payload)
        //console.log("ignoreCurrent?", ignoreFilterValueChange)
        var defsKeys = []
        for (const x in columnsDefinition.value) {
            const col = columnsDefinition.value[x]
            console.log("FILTREITION DE " + col.name, props.filters[col.name])
            if (filterValues[col.name] === undefined) filterValues[col.name] = computed(() => _.get(props.filters, col.name, ''))
            else console.log("current value", filterValues[col.name].value)
            //else filterValues[col.name].value = 
            defsKeys.push(col.name)
        }
        const currentKeys = Object.keys(filterValues)
        for (const x in currentKeys)
            if (!defsKeys.includes(currentKeys[x])) delete filterValues[currentKeys[x]]

        console.log("--- result", filterValues)
    }*/

    /*const innerFilters = plain_copy(props.filters)
    watch(() => props.filters, () => console.log("--- MUTA props.filters"), { deep: true })*/

    //const columnFilters = ref(plain_copy(props.filters))
    const columnFilters = ref({})
    /*var ignoreNextUpdate = false
    watch(props.filters, (newValue) => {
        console.log("- MUTA props.filters")
        if (ignoreNextUpdate) {
            console.log("ignoro update")
            ignoreNextUpdate = false
        }
        else columnFilters.value = newValue
    }, { deep: true })*/

    /*const filterValues = ref({ ...props.filters })
    const updateFilterValues = function (payload) {
        console.log("--- update filter values, current?", filterValues)
        //console.log("payload?", payload)
        //console.log("ignoreCurrent?", ignoreFilterValueChange)
        var defsKeys = []
        for (const x in columnsDefinition.value) {
            const col = columnsDefinition.value[x]
            console.log("FILTREITION DE " + col.name, props.filters[col.name])
            if (filterValues[col.name] === undefined) filterValues[col.name] = computed(() => _.get(props.filters, col.name, ''))
            else console.log("current value", filterValues[col.name].value)
            //else filterValues[col.name].value = 
            defsKeys.push(col.name)
        }
        const currentKeys = Object.keys(filterValues)
        for (const x in currentKeys)
            if (!defsKeys.includes(currentKeys[x])) delete filterValues[currentKeys[x]]

        console.log("--- result", filterValues)
    }
    updateFilterValues()*/
    /*watch(columnsDefinition, () => {
        console.log("-- watcheo columnsDefinition")
        updateFilterValues()
    })*/


    const headerCells = computed(() => {
      console.log("computo header cells")
      //console.log("current filters?", filterValues)
      /*var cells = unref(headerCells)
      if (cells === undefined) cells = []
      console.log("current?", cells)*/
      var cells = []
      var current = unref(headerCells)
      if (current === undefined) current = []
      var currentMap = {}
      current.map((cellData) => currentMap[cellData.name] = cellData)

      //for(const x in headerCells.value)

      for (const x in columnsDefinition.value) {
        const col = columnsDefinition.value[x]
        var cellNode = null
        var source = 'th'
        if (slots[`header-cell-${col.name}`]) {
          cellNode = (scope) => slots[`header-cell-${col.name}`](scope)
          source = 'cell'
        }
        else if (slots[`header-cell-type-${col.type}`]) {
          cellNode = (scope) => slots[`header-cell-type-${col.type}`](scope)
          source = 'type'
        }
        else if (slots['header-cell']) {
          cellNode = (scope) => slots['header-cell'](scope)
          source = 'header'
        }
        else
          cellNode = (scope) => {
            //console.log("CIMPL TH SCOPE filters?", filterValues)
            const cellNodeProps = {
              props: scope
            }
            //if (scope.col.name === 'name') {
            //cellNodeProps.filter = () => props.filters[scope.col.name]
            //cellNodeProps.filter = innerFilters.value[scope.col.name]
            //cellNodeProps.filter = filterValues[scope.col.name]
            //cellNodeProps.filter = props.filters[scope.col.name]
            //cellNodeProps.filter = plain_copy(columnFilters.value[scope.col.name])
            cellNodeProps['onUpdate:filter'] = (payload) => {
              //console.log("update de filtro, marco para ignorar", payload, columnFilters)
              _.set(columnFilters.value, scope.col.name, payload)
              /*columnFilters.value[scope.col.name] = payload*/
              //ignoreNextUpdate = true
              //columnFilters.set
              emit('update:filters', {
                col: payload.col,
                value: payload.value,
                all: columnFilters.value
              })
            }
            //cellNodeProps['onUpdate:filter'] = (payload) => updateFilterValues(payload)
            //}
            return h(CImplTH, cellNodeProps, slots)
          }

        /*console.log("--- chequeo columna: " + col.name)
        if (currentMap[col.name]) {
          console.log("--- ya tenia este TH")
          const currentTH = currentMap[col.name]
          if (currentTH.source === source) {
            console.log("--- era el mismo source, asique reutilizo")
            cellNode = currentTH.node
          }
          else console.log("--- no era el mismo source, uso nuevo")
        }
        else console.log("--- no tengo cacheado, uso nuevo")*/

        cells.push({
          name: col.name,
          node: cellNode,
          source
        })

        //cells.push(cellNode)
      }
      return cells
    })

    const tableSlots = computed(() => {
      console.log("COMPUTO TABLESLOTS")
      var tableSlots = {
        /*loading: this.$slots.loading ? (scope) => this.$slots.loading(scope) : undefined,
        item: this.$slots.item ? (scope) => this.$slots.item(scope) : undefined,
        body: this.$slots.body ? (scope) => this.$slots.body(scope) : undefined,*/
        'body-cell': slots['body-cell'] ? (scope) => slots['body-cell'](scope) : (scope) => h(CImplTD, { props: scope }, slots),
        /*header: this.$slots.body ? (scope) => this.$slots.header(scope) : undefined,
        //'header-cell': this.$slots['header-cell'] ? (scope) => this.$slots['header-cell'](scope) : (scope) => h(CImplTH, { props: scope, filter: this.filters[scope.col.name], 'onUpdate:filter': (payload) => this.$emit('update:filters', payload) }, this.$slots),
        'body-selection': this.$slots['body-selection'] ? (scope) => this.$slots['body-selection'](scope) : undefined,
        'header-selection': this.$slots['header-selection'] ? (scope) => this.$slots['header-selection'](scope) : undefined,
        'top-row': this.$slots['top-row'] ? (scope) => this.$slots['top-row'](scope) : undefined,
        'bottom-row': this.$slots['bottom-row'] ? (scope) => this.$slots['bottom-row'](scope) : undefined,
        top: this.$slots.top ? (scope) => this.$slots.top(scope) : undefined,
        bottom: this.$slots.bottom ? (scope) => this.$slots.bottom(scope) : undefined,
        pagination: this.$slots.pagination ? (scope) => this.$slots.pagination(scope) : undefined,
        'top-left': this.$slots['top-left'] ? (scope) => this.$slots['top-left'](scope) : undefined,
        'top-right': this.$slots['top-right'] ? (scope) => this.$slots['top-right'](scope) : undefined,
        'top-selection': this.$slots['top-selection'] ? (scope) => this.$slots['top-selection'](scope) : undefined,
        'no-data': this.$slots['no-data'] ? (scope) => this.$slots['no-data'](scope) : undefined,*/
      }

      //computed header cells
      for (const x in headerCells.value)
        tableSlots[`header-cell-${headerCells.value[x].name}`] = headerCells.value[x].node

      //console.log("rows?", props.rows, columnFilters.value)
      /*return withMemo([
          //innerFilters.value,
          //props.rows
      ],
          () => tableSlots)*/
      return tableSlots
    })

    const {
      qCompoPropsProxy
    } = useQuasarCompoExtend(QTable, props/*_.merge({},
            props,
            {
                onRequest: (payload) => { console.log("REQUEST DE TABLA", payload); emit('request', payload) }
            })*/
      , {
        qCompoPropsProxy: {
          proxy: {
            columns: columnsDefinition
            //rows: props.rows
          },
          ignore: ['loading']
        }
      })

    const qCompoPropsProxyParsed = computed(() => {
      //var props = {}
      //return props
      return _.merge({}, qCompoPropsProxy.value, {
        onRequest: (payload) => { console.log("REQUEST DE TABLA", payload); emit('request', payload) }
      })
    })
    watch(qCompoPropsProxy, () => console.log("- MUTA this.qCompoPropsProxy"), { deep: true })
    watch(tableSlots, () => console.log("- MUTA this.tableSlots"), { deep: true })

    return {
      qCompoPropsProxy,
      qCompoPropsProxyParsed,
      columnsDefinition,
      headerCells,
      tableSlots,
      columnFilters,
      //filters
      //filterValues,
      //updateFilterValues

      innerLoading: ref(false)
    }
  },

  methods: {
    onUpdateTHFilter (payload) {
      console.log("update de filtro, marco para ignorar", payload)
      _.set(this.columnFilters, payload.col.name, payload)

      ///////////////////*columnFilters.value[scope.col.name] = payload*/

      //ignoreNextUpdate = true
      //columnFilters.set
      this.$emit('update:filters', {
        col: payload.col,
        value: payload.value,
        all: this.columnFilters
      })
    }
  },

  ___render () {
    console.log("--- render table"/*, this.loading*//*, this.columnFilters*/)
    var mainNodeChildren = [
      //h(QInnerLoading, { showing: this.loading })
    ]
    const mainNode = h('div', { class: 'cimpl-table-wrapper' }, mainNodeChildren)

    //var tableSlots = {
    /*loading: this.$slots.loading ? (scope) => this.$slots.loading(scope) : undefined,
    item: this.$slots.item ? (scope) => this.$slots.item(scope) : undefined,
    body: this.$slots.body ? (scope) => this.$slots.body(scope) : undefined,
    'body-cell': this.$slots['body-cell'] ? (scope) => this.$slots['body-cell'](scope) : (scope) => h(CImplTD, { props: scope }, this.$slots),
    header: this.$slots.body ? (scope) => this.$slots.header(scope) : undefined,
    //'header-cell': this.$slots['header-cell'] ? (scope) => this.$slots['header-cell'](scope) : (scope) => h(CImplTH, { props: scope, filter: this.filters[scope.col.name], 'onUpdate:filter': (payload) => this.$emit('update:filters', payload) }, this.$slots),
    'body-selection': this.$slots['body-selection'] ? (scope) => this.$slots['body-selection'](scope) : undefined,
    'header-selection': this.$slots['header-selection'] ? (scope) => this.$slots['header-selection'](scope) : undefined,
    'top-row': this.$slots['top-row'] ? (scope) => this.$slots['top-row'](scope) : undefined,
    'bottom-row': this.$slots['bottom-row'] ? (scope) => this.$slots['bottom-row'](scope) : undefined,
    top: this.$slots.top ? (scope) => this.$slots.top(scope) : undefined,
    bottom: this.$slots.bottom ? (scope) => this.$slots.bottom(scope) : undefined,
    pagination: this.$slots.pagination ? (scope) => this.$slots.pagination(scope) : undefined,
    'top-left': this.$slots['top-left'] ? (scope) => this.$slots['top-left'](scope) : undefined,
    'top-right': this.$slots['top-right'] ? (scope) => this.$slots['top-right'](scope) : undefined,
    'top-selection': this.$slots['top-selection'] ? (scope) => this.$slots['top-selection'](scope) : undefined,
    'no-data': this.$slots['no-data'] ? (scope) => this.$slots['no-data'](scope) : undefined,*/
    //}

    //computed header cells
    /*for (const x in this.headerCells)
        tableSlots[`header-cell-${this.headerCells[x].name}`] = this.headerCells[x].node*/

    //cell name slots
    /*for (const x in this.columnsDefinition) {
        const col = this.columnsDefinition[x]
        if (this.$slots[`header-cell-${col.name}`])
            tableSlots[[`header-cell-${col.name}`]] = (scope) => this.$slots[`header-cell-${col.name}`](scope)
        else if (this.$slots[`header-cell-type-${col.type}`])
            tableSlots[[`header-cell-${col.name}`]] = (scope) => this.$slots[`header-cell-type-${col.type}`](scope)
 
        if (this.$slots[`body-cell-${col.name}`])
            tableSlots[[`body-cell-${col.name}`]] = (scope) => this.$slots[`body-cell-${col.name}`](scope)
        else if (this.$slots[`body-cell-type-${col.type}`])
            tableSlots[[`body-cell-${col.name}`]] = (scope) => this.$slots[`body-cell-type-${col.type}`](scope)
    }*/

    console.log("RENDO TABLE, props", this.qCompoPropsProxy)
    const tableNode = h(QTable, this.qCompoPropsProxyParsed, this.tableSlots)

    //var tHeadChildren = (scope) => {
    /*console.log("--- corre la funcion theadchildren")
    var tHeadChildren = []
    for (const x in this.columnsDefinition) {
        const col = this.columnsDefinition[x]
        const scope = { col: col }
        var cellNode = null
        var source = 'th'
        if (this.$slots[`header-cell-${col.name}`]) {
            cellNode = this.$slots[`header-cell-${col.name}`](scope)
            source = 'cell'
        }
        else if (this.$slots[`header-cell-type-${col.type}`]) {
            cellNode = this.$slots[`header-cell-type-${col.type}`](scope)
            source = 'type'
        }
        else if (this.$slots['header-cell']) {
            cellNode = this.$slots['header-cell'](scope)
            source = 'header'
        }
        else {
            //console.log("CIMPL TH SCOPE filters?", filterValues)
            const cellNodeProps = {
                props: scope
            }
            //if (scope.col.name === 'name') {
            //cellNodeProps.filter = () => props.filters[scope.col.name]
            //cellNodeProps.filter = innerFilters.value[scope.col.name]
            //cellNodeProps.filter = filterValues[scope.col.name]
            cellNodeProps.filter = this.innerFilters[scope.col.name]
            cellNodeProps['onUpdate:filter'] = (payload) => {
                console.log("update de filtro, marco para ignorar")
                //ignoreNextUpdate = true
                this.$emit('update:filters', payload)
            }
            //cellNodeProps['onUpdate:filter'] = (payload) => updateFilterValues(payload)
            //}
            cellNode = h(CImplTH, cellNodeProps, this.$slots)
        }

        tHeadChildren.push(cellNode)
    }
    //return cells
    //}
    console.log("children?", tHeadChildren)
    const tHead = h('thead', {}, [h('tr', {}, tHeadChildren)])

    var tBodyChildren = []
    const tBody = h('thead', {}, tBodyChildren)
    const tableNode = h('table', {}, [tHead, tBody])*/

    mainNodeChildren.push(tableNode)

    return mainNode
  },
})
</script>