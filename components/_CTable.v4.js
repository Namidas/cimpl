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
import { QTable, QLinearProgress, QSpace, QBtn, QMenu, QList, QItem, QItemSection, ClosePopup, QIcon } from 'quasar'
import './table/defaults'
import defaults from './../utils/defaults'
import { hSlot } from './../utils/render'
import { useCompoExtend, compoExtend_get } from './../composables/compoExtend'

import _ from 'lodash'

import CTr from './table/components/tr.vue'
import CTableTools from './table/components/table-tools.vue'
import { useProvideCTable } from './table/composables'
import { mergeReactive } from '../utils/reactive'



export default defineComponent({
    name: 'CTable',

    props: {
        //get/inherit QTable props
        ...compoExtend_get(QTable, 'props'),

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

        //highlight filter results on cell content?
        highlightResults: {
            required: false,
            type: Boolean,
            default: false
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

    setup (props, { slots, emit, expose }) {
        if (props.debugSetup) console.log("// CTable setup")

        const getRowKey = row => typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey]

        const emitRowTool = (payload) => {
            console.log("-- EMIT ROW TOOL", payload)
            emit('rowtool:confirm', payload)
        }

        /* PROVIDE PROVIDE PROVIDE PROVIDE*/
        /* PROVIDE PROVIDE PROVIDE PROVIDE*/
        /* PROVIDE PROVIDE PROVIDE PROVIDE*/
        /* PROVIDE PROVIDE PROVIDE PROVIDE*/
        const {
            paginatedSelection,
            clearPaginatedSelection
        } = useProvideCTable(props, slots, getRowKey, emitRowTool)

        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        /*COLUMNS COLUMNS COLUMNS COLUMNS*/
        var lastValidValue = ref([])
        const columnsDefinition = computed(() => {
            if (props.debugWatch) console.log("|| CTable compute columnsDefinition")
            var cols = []
            //this one is to still show THEAD even if when we  have no column definitions and/or
            //rows to get them from
            if (!props.columns && (!props.rows || !props.rows.length))
                return lastValidValue.value

            //get from props.columns, compute from first row otherwise
            const columnsBaseDefinitions = props.columns ? props.columns :
                Object.keys(props.rows[0]).map((colName) => { return _.merge({}, { name: colName, label: colName }) })

            if (props.selection !== 'none')
                columnsBaseDefinitions.unshift({
                    name: 'row-select',
                    type: 'special-col'
                })

            if (props.rowTools)
                columnsBaseDefinitions.push({
                    name: 'row-tools',
                    type: 'special-col'
                })

            for (const x in columnsBaseDefinitions) {
                const baseColumn = columnsBaseDefinitions[x]
                if (baseColumn.type === 'special-col') {
                    cols.push(baseColumn)
                    continue
                }
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

        const totalColumns = computed(() => {
            var cols = columnsDefinition.value.length
            if (props.selection !== 'none') cols++
            return cols
        })


        /* TABLE VIEW RELATED *//* TABLE VIEW RELATED *//* TABLE VIEW RELATED */
        /* TABLE VIEW RELATED *//* TABLE VIEW RELATED *//* TABLE VIEW RELATED */
        /* TABLE VIEW RELATED *//* TABLE VIEW RELATED *//* TABLE VIEW RELATED */
        const availableViews = computed(() => {
            var res = []
            for (const x in props.views) {
                const view = typeof props.views[x] === 'string' ? defaults.get(`cimpl-table.views.${props.views[x]}`) : props.views[x]
                console.log("view", view, props.views[x])
                if (!view) continue
                res.push(view)
            }
            if (!res.length) res.push(defaults.get('cimpl-table.views.table'))
            return res
        })
        const currentView = ref(_.first(availableViews.value))
        const availableViewStyles = computed(() => {
            var res = []
            for (const x in props.viewStyles) {
                const viewStyle = typeof props.viewStyles[x] === 'string' ? defaults.get(`cimpl-table.viewStyles.${props.viewStyles[x]}`) : props.viewStyles[x]
                if (!viewStyle) continue
                res.push(viewStyle)
            }
            if (!res.length) res.push(defaults.get('cimpl-table.viewStyles.cozy'))
            return res
        })
        const currentViewStyle = ref(_.first(availableViewStyles.value))




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
        //const bodySlotsProps = reactive({})
        //var bodySlotsPropsKeyyIndex = 0
        const bodySlotsProps = reactive({})
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
            //delete non-existant?
            /*const currentRowsKeys = Object.keys(props.rows)
            for (const x in bodySlotsProps) {
                const fooKey = (parseInt(x.replace('ctr-body-', '')) - 1).toString()
                if (!currentRowsKeys.includes(fooKey)) {
                    if (props.debugWatch) console.log(`deleting bodySlotsProps[${fooKey}]...`)
                    delete bodySlotsProps[fooKey]
                }
            }*/
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
        })

        watchEffect(() => {
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
        })

        const topRowSlot = (scope) => {
            if (!paginatedSelection.value.length) return undefined
            else return h('tr', null,
                h('td', { class: 'text-center bg-primary text-white', colspan: totalColumns.value },
                    h('div', { class: 'cursor-pointer', onClick: () => clearPaginatedSelection() }, `off page select: ${paginatedSelection.value.length} - ${totalColumns.value}`)
                )
            )
        }

        const topSlot = (scope) => {
            //view_cozy
            //view_compact_alt
            //view_compact
            //table
            //grid_view
            return [
                h('div', { class: "col-2 q-table__title" }, props.title),
                h(QSpace),
                availableViews.value.length > 1 || availableViewStyles.value.length > 1 ? h(CTableTools, {
                    views: availableViews.value,
                    viewStyles: availableViewStyles.value,
                    currentView: currentView.value,
                    currentViewStyle: currentViewStyle.value,
                    'onUpdate:view-type': (payload) => {
                        if (currentView.value.name === payload.name) return
                        currentView.value.handler(self.value, false)
                        currentView.value = payload
                        currentView.value.handler(self.value, true)
                    },
                    'onUpdate:view-style': (payload) => {
                        if (currentViewStyle.value.name === payload.name) return
                        currentViewStyle.value.handler(self.value, false)
                        currentViewStyle.value = payload
                        currentViewStyle.value.handler(self.value, true)
                    }
                }) : undefined
                /*h(QBtn, { icon: 'sym_o_view_cozy', flat: true, padding: 'xs' }, () => h(QMenu, {}, () => h(QList, { separator: true }, () => [
                    withDirectives(h(QItem, { clickable: true, onClick: () => updateSelection('all') }, () => [
                        h(QItemSection, { avatar: true }, () => h(QIcon, { name: 'check_box', size: 'xs' })),
                        h(QItemSection, {}, () => '_ALL')
                    ]), [[ClosePopup]]),
                    withDirectives(h(QItem, { clickable: true, onClick: () => updateSelection('invert') }, () => [
                        h(QItemSection, { avatar: true }, () => h(QIcon, { name: 'indeterminate_check_box', size: 'xs' })),
                        h(QItemSection, {}, () => '_INVERT')
                    ]), [[ClosePopup]]),
                    withDirectives(h(QItem, { clickable: true, onClick: () => updateSelection('none') }, () => [
                        h(QItemSection, { avatar: true }, () => h(QIcon, { name: 'check_box_outline_blank', size: 'xs' })),
                        h(QItemSection, {}, () => '_NONE')
                    ]), [[ClosePopup]]),
                ]))),
                h(QBtn, { icon: 'sym_o_view_compact_alt', flat: true, padding: 'xs' }),
                h(QBtn, { icon: 'sym_o_view_compact', flat: true, padding: 'xs' }),
                h(QBtn, { icon: 'sym_o_table', flat: true, padding: 'xs' }),
                h(QBtn, { icon: 'sym_o_grid_view', flat: true, padding: 'xs' }),*/
            ]
        }

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
            loading: hSlot(slots.loading, (scope) => h(
                QLinearProgress,
                {
                    class: 'c-table-load-indicator full-width',
                    indeterminate: true
                }
            )),
            header: hSlot(slots.header, (scope) => h(CTr, mergeReactive(headerSlotProps, { props: scope }))),
        })
        watchEffect(() => {
            if (props.debugWatch) console.log("|| CTable watchEffect tableSlots")

            mergeReactive(tableSlots, {

                //item: this.$slots.item ? (scope) => this.$slots.item(scope) : undefined,


                //body: hSlot(slots.body, (scope) => h(CTr, mergeReactive(bodySlotsProps[`ctr-body-${scope.key}`], { props: scope }))),
                body: hSlot(slots.body, bodySlot),


                'top-row': hSlot(slots['top-row'], topRowSlot),
                top: hSlot(slots.top, topSlot),

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


        /*TABLE NODE TABLE NODE TABLE NODE*/
        /*TABLE NODE TABLE NODE TABLE NODE*/
        /*TABLE NODE TABLE NODE TABLE NODE*/
        /*TABLE NODE TABLE NODE TABLE NODE*/
        const {
            extendedPropsProxy
        } = useCompoExtend(QTable, props, {
            proxy: {
                columns: columnsDefinition,
                //pagination: innerPagination,
                'onUpdate:pagination': (newValue) => {
                    if (props.debugWatch) console.log("|| CTable QTable's onUpdate:pagination", newValue)
                    for (const x in newValue)
                        innerPagination[x] = newValue[x]
                    emit('update:pagination', newValue)
                }
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
        const self = ref(null)
        const tableProps = reactive({
            ref: self,
            class: {
                'c-table': true,
                'is-loading': false
                //'sticky-header',
                //props.loading ? 'is-loading' : undefined
            }
        })
        watchEffect(() => {
            tableProps.class['is-loading'] = props.loading
        })
        if (props.debugWatch) watch(tableProps, () => console.log("|| CTable watch tableProps"))

        onMounted(() => {
            currentView.value.handler(self.value, true)
            currentViewStyle.value.handler(self.value, true)
        })

        const render = () => {
            if (props.debugRender) console.log('* RENDER: -- CTable')
            return h('div', tableProps, h(QTable, extendedPropsProxy, tableSlots))
        }
        return render
    }
})