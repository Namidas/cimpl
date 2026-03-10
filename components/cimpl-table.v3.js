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

/*eslint-disabled*/
import './table/styles.v3.scss'

import { defineComponent, computed, h, ref, nextTick } from 'vue'
import { QTable, QLinearProgress } from 'quasar'
import './table/defaults'
import defaults from './../utils/defaults'
import { hSlot, inheritSlots } from './../utils/render'
import { useCompoExtend, compoExtend_get } from './../composables/compoExtend'

import _ from 'lodash'

import CTr from './table/components/tr'



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
        }
    },

    emits: [
        ...compoExtend_get(QTable, 'emits'),

        'update:filter',
        'update:filters',

        'update:sorting'
    ],

    setup (props, { slots, emit, expose }) {

        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        var lastValidValue = ref([])
        const columnsDefinition = computed(() => {
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

        /* SLOTS SLOTS SLOTS SLOTS */
        /* SLOTS SLOTS SLOTS SLOTS */
        /* SLOTS SLOTS SLOTS SLOTS */
        const tableSlots = computed(() => {
            var slotted = {
                loading: hSlot(slots.loading, (scope) => h(
                    QLinearProgress,
                    {
                        class: 'c-table-load-indicator full-width',
                        indeterminate: true
                    }
                )),
                /*item: this.$slots.item ? (scope) => this.$slots.item(scope) : undefined,*/
                body: hSlot(slots.body, (scope) => h(CTr, {
                    key: `ctr-body-${scope.key}`,
                    exposedKey: `ctr-body-${scope.key}`,
                    props: scope,
                    rowType: 'body',
                }, inheritSlots(slots, /body-cell(-)/))),
                //'body-cell': hSlot(slots['body-cell'], (scope) => h(CTd, { props: scope }), inheritSlots(slots, /body-cell(-)/)),
                header: hSlot(slots.header, (scope) => h(CTr, {
                    key: `ctr-header`,
                    exposedKey: `ctr-header`,
                    props: scope,
                    rowType: 'header',
                    filters: props.filters,
                    sorting: props.sorting,
                    'onUpdate:sorting': (payload) => updateSorting(payload),
                    'onUpdate:filter': (payload) => updateFilter(payload),
                }, inheritSlots(slots, /header-cell(-)/))),
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
            }

            const passThroughSlots = [
                //'loading',
                'item',
                //'body',
                'header',
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
                    slotted[passThroughSlots[x]] = slots[passThroughSlots[x]]

            /*//computed header cells
            for (const x in bodyCells.value)
                slotted[`body-cell-${bodyCells.value[x].name}`] = bodyCells.value[x].node
             
            //computed header cells
            for (const x in headerCells.value)
                slotted[`header-cell-${headerCells.value[x].name}`] = headerCells.value[x].node
            */

            return slotted
        })

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


        /* EXPOSE */
        expose({
            sortMap
        })

        /* RENDER RENDER RENDER RENDER RENDER */
        /* RENDER RENDER RENDER RENDER RENDER */
        /* RENDER RENDER RENDER RENDER RENDER */
        /* RENDER RENDER RENDER RENDER RENDER */
        const render = () => {
            console.log("* RENDER: CTable")
            return h('div', {
                class: [
                    'c-table',
                    props.loading ? 'is-loading' : undefined
                ]
            }, h(QTable, _.merge({}, extendedPropsProxy.value, {
                ref: tableRef,
                onRequest: (payload) => { console.log("REQUEST DE TABLA", payload); emit('request', payload) }
            }), tableSlots.value))
        }
        return render
    }
})