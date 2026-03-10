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

import { defineComponent, computed, h, ref, nextTick, watch, watchEffect, reactive } from 'vue'
import { QTable, QLinearProgress } from 'quasar'
import './table/defaults'
import defaults from './../utils/defaults'
import { hSlot, inheritSlots, inheritSlotsReactive, inheritSlotsReactive_safe } from './../utils/render'
import { useCompoExtend, compoExtend_get } from './../composables/compoExtend'

import _ from 'lodash'

import CTr from './table/components/tr'
import { mergeReactive } from '../utils/reactive'



export default defineComponent({
    name: 'CTable',

    props: {
        //get/inherit QTable props
        ...compoExtend_get(QTable, 'props'),

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

        'update:sorting'
    ],

    setup (props, { slots, emit, expose }) {
        if (props.debugSetup) console.log("// CTable setup")
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        var lastValidValue = ref([])
        const columnsDefinition = computed(() => {
            if (props.debugWatch) console.log("|| CTable compute columnsDefinition")
            var cols = []
            //this one is to still show THEAD even if when we  have no column definitions and/or
            //rows to get them from
            if (!props.columns && !props.rows.length)
                return lastValidValue.value

            //get from props.columns, compute from first row otherwise
            const columnsBaseDefinitions = props.columns ? props.columns :
                Object.keys(props.rows[0]).map((colName) => { return _.merge({}, { name: colName, label: colName }) })

            for (const x in columnsBaseDefinitions) {
                const baseColumn = columnsBaseDefinitions[x]
                const columnName = baseColumn.name
                if (columnName === undefined)
                    console.error('CTable: column definition has no name', baseColumn)

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
            }
            lastValidValue.value = cols
            return cols
        })

        const cellsSlotsCache = new Map()

        /* SLOTS SLOTS SLOTS SLOTS */
        /* SLOTS SLOTS SLOTS SLOTS */
        /* SLOTS SLOTS SLOTS SLOTS */
        //const bodySlotsProps = reactive({})
        const bodySlotsProps = reactive({})
        watchEffect(() => {
            if (props.debugWatch) {
                console.log("|| CTable watchEffect bodySlotsProps [start]")
                console.log("rows changed, so we're checking if we need to create new reactive objects to hold")
                console.log("last but not least, need to somehow tie this to the column structure, as-is we're implying the structure of the rows remains the same 4ever")
            }
            for (const x in props.rows) {
                //why is this index coming back as a string instead of a number?
                //also...WHY ON EARTH is the Quasar team using one-indexed keys ?
                const key = `ctr-body-${parseInt(x) + 1}`
                if (!bodySlotsProps[key])
                    bodySlotsProps[key] = reactive({
                        debugRender: props.debugRender,
                        debugWatch: props.debugWatch,
                        debugSetup: props.debugSetup,
                        key: key,
                        exposedKey: key,
                        rowType: 'body',
                    })
            }
            //delete non-existant?
            const currentRowsKeys = Object.keys(props.rows)
            for (const x in bodySlotsProps) {
                const fooKey = (parseInt(x.replace('ctr-body-', '')) - 1).toString()
                if (!currentRowsKeys.includes(fooKey)) {
                    if (props.debugWatch) console.log(`deleting bodySlotsProps[${fooKey}]...`)
                    delete bodySlotsProps[fooKey]
                }
            }
            if (props.debugWatch) {
                console.log("..resulting reactive after watchEffect, by the time you see this on console it'll already have the scoped props assigned")
                console.log(bodySlotsProps)
                console.log("|| CTable watchEffect bodySlotsProps [end]")
            }
        })

        const bodySlotsSlots_keys = ref([])
        //watch(bodySlotsSlots_keys, () => console.log("*********** bodySlotsSlots_keys"), { deep: true })
        watchEffect(() => {
            if (props.debugWatch) console.log("|| CTable watchEffect bodySlotsSlots_keys [start]")
            const current = Object.keys(slots)
            const regx = /body-cell(-)/
            for (const x in current)
                if (regx.test(current[x])) {
                    var translatedKey = current[x].replace(regx, '').trim()
                    if (translatedKey === '') translatedKey = 'default'
                    bodySlotsSlots_keys.value.push([current[x], translatedKey])
                }
            //bodySlotsSlots_keys.push(slots[current[x]])
            if (props.debugWatch) { console.log("final res"); console.log(bodySlotsSlots_keys.value); console.log("|| CTable watchEffect bodySlotsSlots_keys [end]") }
        })

        watch(() => slots, () => alert("watching slots"), { deep: true })

        //reactive implementation
        const bodySlotsSlots = reactive({})
        //watchEffect(() => {
        //watch(() => slots, () => {
        const watcher = (/*newVal,oldVal*/) => {
            console.log("//////// SE ACTIVA EL WATCH DE bodySlotsSlots_keys ")
            console.log(bodySlotsSlots_keys.value, props.rows)
            //implementation cycling bodySlotsSlots_keys
            for (const x in props.rows) {
                //why is this index coming back as a string instead of a number?
                //also...WHY ON EARTH is the Quasar team using one-indexed keys ?
                const key = `ctr-body-${parseInt(x) + 1}`
                if (!bodySlotsSlots[key]) bodySlotsSlots[key] = reactive({})
                console.log(`- cycling rows, current key '${key}'`)
                for (const y in bodySlotsSlots_keys.value) {
                    console.log(`- cycling bodySlotsSlots_keys`, bodySlotsSlots_keys.value[y])
                    if (bodySlotsSlots[key][bodySlotsSlots_keys.value[y][1]] !== slots[bodySlotsSlots_keys.value[y][0]])
                        bodySlotsSlots[key][bodySlotsSlots_keys.value[y][1]] = slots[bodySlotsSlots_keys.value[y][0]]
                }
            }


            //implementation cycling slots
            //if (props.debugWatch) console.log("|| CTable watchEffect bodySlotsSlots [start]")
            /*for (const x in props.rows) {
                //why is this index coming back as a string instead of a number?
                //also...WHY ON EARTH is the Quasar team using one-indexed keys ?
                const key = `ctr-body-${parseInt(x) + 1}`
                if (!bodySlotsSlots[key]) bodySlotsSlots[key] = reactive({})
                inheritSlotsReactive_safe(bodySlotsSlots[key], slots, /body-cell(-)/)
            }*/
            if (props.debugWatch) {
                console.log("resulting bodySlotsSlots")
                console.log(bodySlotsSlots)
                console.log("|| CTable watchEffect bodySlotsSlots [end]")
            }
        }
        watch(bodySlotsSlots_keys, watcher, { deep: true, immediate: true })
        watch(() => props.rows, () => {
            console.log("watch props.rows to call bodySlotsSlots_keys watcher")
            watcher()
        })
        /*watchEffect(() => {
            console.log("//// SE ACTIVA watchEffect CON ROWS")
            if (props.rows.length)
                watcher()
        })*/

        //map implementation
        /*const bodySlotsSlots = new Map()
        watchEffect(() => {
            if (props.debugWatch) console.log("|| CTable watchEffect bodySlotsSlots [start]")
            for (const x in props.rows) {
                //why is this index coming back as a string instead of a number?
                //also...WHY ON EARTH is the Quasar team using one-indexed keys ?
                const key = `ctr-body-${parseInt(x) + 1}`
                if (!bodySlotsSlots.has(key))
                    bodySlotsSlots.set(key, inheritSlotsReactive_safe({}, slots, /body-cell(-)/))
            }
            if (props.debugWatch) {
                console.log("resulting bodySlotsSlots")
                console.log(bodySlotsSlots)
                console.log("|| CTable watchEffect bodySlotsSlots [end]")
            }
        })*/

        const bodySlot = /*hSlot(slots.body, */(scope) => {
            console.log("-- bodySlot function runs...")
            return h(CTr, mergeReactive(bodySlotsProps[`ctr-body-${scope.key}`], {
                props: scope,
                //slotted: bodySlotsSlots.get(`ctr-body-${scope.key}`)
                //slotted: bodySlotsSlots[`ctr-body-${scope.key}`]
            }),
                //map
                //bodySlotsSlots.get(`ctr-body-${scope.key}`)

                //reactive
                bodySlotsSlots[`ctr-body-${scope.key}`]
                /*, cellsSlotsCache.has(`ctr-body-${scope.key}`) ? cellsSlotsCache.get(`ctr-body-${scope.key}`) : cellsSlotsCache.set(`ctr-body-${scope.key}`, inheritSlots(slots, /body-cell(-)/)).get(`ctr-body-${scope.key}`)*/
            )
        }//)

        //if (props.debugWatch) watch(bodySlot, () => console.log("|| CTable watch bodySlot (main)"))

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
        watchEffect(() => {
            if (props.debugWatch) console.log("|| CTable watchEffect headerSlotProps")
            mergeReactive(headerSlotProps, {
                filters: props.filters,
                sorting: props.sorting,
            })
        })

        const tableSlots = reactive({})
        watchEffect(() => {
            if (props.debugWatch) console.log("|| CTable watchEffect tableSlots")

            /*if (cellsSlotsCache.has('ctr-header'))
                cellsSlotsCache.set('ctr-header', inheritSlots(slots, /header-cell(-)/))*/

            mergeReactive(tableSlots, {
                /*loading: hSlot(slots.loading, (scope) => h(
                    QLinearProgress,
                    {
                        class: 'c-table-load-indicator full-width',
                        indeterminate: true
                    }
                )),*/
                //item: this.$slots.item ? (scope) => this.$slots.item(scope) : undefined,


                body: bodySlot,


                /*body: hSlot(slots.body, (scope) => h(CTr, {
                    debugRender: props.debugRender,
                    key: `ctr-body-${scope.key}`,
                    exposedKey: `ctr-body-${scope.key}`,
                    props: scope,
                    rowType: 'body',
                }*//*, cellsSlotsCache.has(`ctr-body-${scope.key}`) ? cellsSlotsCache.get(`ctr-body-${scope.key}`) : cellsSlotsCache.set(`ctr-body-${scope.key}`, inheritSlots(slots, /body-cell(-)/)).get(`ctr-body-${scope.key}`)*/
                //)),
                //'body-cell': hSlot(slots['body-cell'], (scope) => h(CTd, { props: scope }), inheritSlots(slots, /body-cell(-)/)),


                header: hSlot(slots.header, (scope) => h(CTr, mergeReactive(headerSlotProps, { props: scope }), cellsSlotsCache.get('ctr-header'))),


                /*//'header-cell': this.$slots['header-cell'] ? (scope) => this.$slots['header-cell'](scope) : (scope) => h(CImplTH, { props: scope, filter: this.filters[scope.col.name], 'onUpdate:filter': (payload) => this.$emit('update:filters', payload) }, this.$slots),
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
            })

            /*const passThroughSlots = [
                //'loading',
                'item',
                //'body',
                //'header',
                'body-selection',
                'header-selection',
                'top-row',
                'bottom-row',
                'top',
                'bottom',
                'pagination',
                'top-left',
                'top-right',
                'top-selection',
                'no-data'
            ]
         
            //pass-through slots
            for (const x in passThroughSlots)
                if (slots[passThroughSlots[x]])
                    tableSlots[passThroughSlots[x]] = slots[passThroughSlots[x]]*/

            /*//computed header cells
            for (const x in bodyCells.value)
                slotted[`body-cell-${bodyCells.value[x].name}`] = bodyCells.value[x].node
             
            //computed header cells
            for (const x in headerCells.value)
                slotted[`header-cell-${headerCells.value[x].name}`] = headerCells.value[x].node
            */

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


        /*TABLE NODE TABLE NODE TABLE NODE*/
        /*TABLE NODE TABLE NODE TABLE NODE*/
        /*TABLE NODE TABLE NODE TABLE NODE*/
        /*TABLE NODE TABLE NODE TABLE NODE*/
        const {
            extendedPropsProxy
        } = useCompoExtend(QTable, props, {
            proxy: {
                columns: columnsDefinition
            },
        })

        const tableRef = ref(null)
        Object.assign(extendedPropsProxy, {
            ref: tableRef,
            onRequest: (payload) => emit('request', payload)
        })
        if (props.debugWatch) watch(extendedPropsProxy, () => console.log("|| CTable watch extendedPropsProxy"))


        /* EXPOSE */
        expose({
            sortMap
        })

        /* RENDER RENDER RENDER RENDER RENDER */
        /* RENDER RENDER RENDER RENDER RENDER */
        /* RENDER RENDER RENDER RENDER RENDER */
        /* RENDER RENDER RENDER RENDER RENDER */
        const tableProps = reactive({
            class: [
                'c-table',
                //'sticky-header',
                props.loading ? 'is-loading' : undefined
            ]
        })
        if (props.debugWatch) watch(tableProps, () => console.log("|| CTable watch tableProps"))

        const render = () => {
            if (props.debugRender) console.log('* RENDER: -- CTable')
            return h('div', tableProps, h(QTable, extendedPropsProxy, tableSlots))
        }
        return render
    }
})