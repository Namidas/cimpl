/* eslint-disable */

/* TODO
resolver el tema de filtros cuando prop.fetchRows es false (se alimenta de prop.rows)
*/


//import './styles.scss'
import { defineComponent, ref, computed } from 'vue'

import _ from 'lodash'

import { QTable, useInterval } from 'quasar'
import { useQuasarCompoExtend, useQuasarCompoExtend_get } from './../../composables/quasarCompoExtend'

//import { useNeedsRetry } from 'src/composables/needsRetry'

import { $_DEFAULT_CELL, $_DEFAULT_FILTER, $_DEFAULT_EDIT, $_TABLE_DEFAULTS } from './defaults.js'

import { $_CONTENT_DEFAULT_CELL, $_CONTENT_DEFAULT_FILTER, $_CONTENT_DEFAULT_EDIT } from './columns/content'
import { $_TOGGLER_DEFAULT_CELL, $_TOGGLER_DEFAULT_FILTER, $_TOGGLER_DEFAULT_EDIT } from './columns/toggler'
import { $_DATE_DEFAULT_CELL, $_DATE_DEFAULT_FILTER, $_DATE_DEFAULT_EDIT } from './columns/date'

// import { QSpinnerGears, useQuasar, date } from 'quasar'
// import { $melon } from '../../../boot/melon.window_melon.js'
/* import { values } from 'core-js/core/array'*/

// https://quasar.dev/vue-components/table
/* const $_QUASAR_TABLE_COMPONENT_PROPS = {
    // behavior
    // behavior
    // behavior
    fullscreen: {
        required: false,
        type: Boolean
    },

    noRouteFullscreenExit: {
        required: false,
        type: Boolean
    },

    virtualScrollTarget: {
        required: false,
        type: [Element, String]
    },

    virtualScrollStickySizeStart: {
        required: false,
        type: [Number, String]
    },

    grid: {
        required: false,
        type: Boolean
    },

    gridHeader: {
        required: false,
        type: Boolean
    },

    loading: {
        required: false,
        type: Boolean
    },

    // column
    // column
    // column
    columns: {
        required: false,
        type: Array
    },

    visibleColumns: {
        required: false,
        type: Array
    },

    // content
    // content
    // content
    tableColspan: {
        required: false,
        type: [Number, String]
    },

    iconFirstPage: {
        required: false,
        type: String
    },

    iconPrevPage: {
        required: false,
        type: String
    },

    iconNextPage: {
        required: false,
        type: String
    },

    iconLastPage: {
        required: false,
        type: String
    },

    gridHeader: {
        required: false,
        type: Boolean
    },

    title: {
        required: false,
        type: String
    },

    hideHeader: {
        required: false,
        type: Boolean
    },

    hideBottom: {
        required: false,
        type: Boolean
    },

    hideSelectedBanner: {
        required: false,
        type: Boolean
    },

    hideNoData: {
        required: false,
        type: Boolean
    },

    hidePagination: {
        required: false,
        type: Boolean
    },

    separator: {
        required: false,
        type: String
    },

    wrapCells: {
        required: false,
        type: Boolean
    },

    noDataLabel: {
        required: false,
        type: String
    },

    noResultsLabel: {
        required: false,
        type: String
    },

    loadingLabel: {
        required: false,
        type: String
    },

    // expansion
    // expansion
    // expansion
    expanded: {
        required: false,
        type: Array
    },

    // filter
    // filter
    // filter
    filter: {
        required: false,
        type: [String, Object]
    },

    filterMethod: {
        required: false,
        type: Function
    },

    // general
    // general
    // general
    //moved to cimpl-table and no longer required/mandatory
    // rows: {
        // required: true,
        // type: Array
    // },

    rowKey: {
        required: false,
        type: [String, Function]
    },

    // pagination
    // pagination
    // pagination
    rowsPerPageLabel: {
        required: false,
        type: String,
    },

    paginationLabel: {
        required: false,
        type: Function,
    },

    pagination: {
        required: false,
        type: Object
    },

    rowsPerPageOptions: {
        required: false,
        type: Array
    },

    // selection
    // selection
    // selection
    selectedRowsLabel: {
        required: false,
        type: Function
    },

    selection: {
        required: false,
        type: String
    },

    selected: {
        required: false,
        type: Array
    },

    // sorting
    // sorting
    // sorting
    binaryStateSort: {
        required: false,
        type: Boolean
    },

    columnSortOrder: {
        required: false,
        type: String
    },

    sortMethod: {
        required: false,
        type: Function
    },

    // style
    // style
    // style
    color: {
        required: false,
        type: String
    },

    dense: {
        required: false,
        type: Boolean
    },

    dark: {
        required: false,
        type: [Boolean, null]
    },

    flat: {
        required: false,
        type: Boolean
    },

    bordered: {
        required: false,
        type: Boolean
    },

    square: {
        required: false,
        type: Boolean
    },

    tableStyle: {
        required: false,
        type: [String, Array, Object]
    },

    tableClass: {
        required: false,
        type: [String, Array, Object]
    },

    tableHeaderStyle: {
        required: false,
        type: [String, Array, Object]
    },

    tableHeaderClass: {
        required: false,
        type: [String, Array, Object]
    },

    cardContainerStyle: {
        required: false,
        type: [String, Array, Object]
    },

    cardContainerClass: {
        required: false,
        type: [String, Array, Object]
    },

    cardStyle: {
        required: false,
        type: [String, Array, Object]
    },

    cardClass: {
        required: false,
        type: [String, Array, Object]
    },

    titleClass: {
        required: false,
        type: [String, Array, Object]
    },

    // virtual scroll
    // virtual scroll
    // virtual scroll
    virtualScroll: {
        required: false,
        type: Boolean
    },

    virtualScrollSliceSize: {
        required: false,
        type: [Number, String, null]
    },

    virtualScrollSliceRatioBefore: {
        required: false,
        type: [Number, String]
    },

    virtualScrollSliceRatioAfter: {
        required: false,
        type: [Number, String]
    },

    virtualScrollItemSize: {
        required: false,
        type: [Number, String]
    },

    virtualScrollStickySizeStart: {
        required: false,
        type: [Number, String]
    },

    virtualScrollStickySizeEnd: {
        required: false,
        type: [Number, String]
    },
} */

const $_CIMPL_TABLE_COMPONENT_PROPS = {

    //get QTable props
    ...useQuasarCompoExtend_get(QTable, 'props'),

    /* main row key (tipically, something like 'id'), automatically picked from row on actions
    like set/update/toggle and some other stuff (document) */
    mainRowKey: {
        required: false,
        type: String
    },

    /* object with defaults to merge with hardcoded defaults when fetchin column props
    in the format...
    {
        //cell defaults
        cell: {
            //globals
            _: {},

            //any specific type
            [some-type]: {}
        },
        
        //(th) filter defaults
        filter: {
            //globals
            _: {},

            //any specific type
            [some-type]: {}
        }

        //cell edit defaults
        edit: {
            //globals
            _: {},

            //any specific type
            [some-type]: {}
        }
    }
    */
    columnDefaults: {
        required: false,
        type: Object,
        default: {}
    },

    /* set of table defaults, gets merged with $_TABLE_DEFAULTS */
    defaults: {
        required: false,
        type: Object,
        default: {}
    },



    /* function used to get/parse any label across the whole table */
    labelGet: {
        required: false,
        type: Function,
    },

    /* wether to use internationalization or not (only valid if no custom labelGet is defined) */
    i18n: {
        required: false,
        type: Boolean,
        default: false
    },

    /***** COLUMNS/ROWS START */
    /***** COLUMNS/ROWS START */
    /***** COLUMNS/ROWS START */

    /* wether to retry or not (or how many times, when a number) any given set action */
    retry: {
        required: false,
        type: [Boolean, Number]
    },

    /* wether to call each handler separately (one interval per handler) or in a queue (a single
    interval that calls handlers sequentially) */
    retryQueue: {
        required: false,
        type: Boolean,
        default: true
    },

    /* how much to debounce calls to retry, in milliseconds, by default 30 seconds */
    retryEvery: {
        required: false,
        type: Number,
        default: 1000 * 30
    },

    /* how many calls can be registered, true is infinite */
    retryMaxQueue: {
        required: false,
        type: [Boolean, Number],
        default: true
    },

    /* wether rows are going to be fetched via rest or manually provided through "rows" prop */
    fetchRows: {
        type: Boolean,
        default: false
    },

    /* same as quasar column options but used as "globals", this ones get merged with each
    definition for specific columns */
    columnsCommon: {
        required: false,
        type: Object,
        default: {}
    },

    /* used with getColumnsProps, as: global > infered > specific definition */
    columnsInfered: {
        required: false,
        type: Object,
        default: {}
    },

    /* list of sticky columns, by col ID */
    stickyColumns: {
        required: false,
        type: Array,
        default: []
    },

    /* list of columns to ignore, by col ID, useful when columns is automatic/not-set*/
    ignoreColumns: {
        required: false,
        type: Array,
        default: []
    },

    /* rows of data, as in Quasar, but mainly no longer required/mandatory
    the reason for this is because you may have no rows whatsoever, since you may use the getters
    from rest, ajax, etc */
    // back to being defined by default from QTable through the extender composable
    /* rows: {
        required: false,
        type: Array
    }, */

    /* tools/options to automatically set for each row */
    rowTools: {
        required: false,
        type: [Object, Boolean],
        default: false
    },

    /* wether the row tools column should be fixed/sticky or not*/
    rowToolsSticky: {
        required: false,
        type: Boolean,
        default: true
    },

    /* when true, row tools are added as the first row, last one otherwise (by default) */
    rowToolsPrepend: {
        required: false,
        type: Boolean,
        default: false,
    },

    /* when true, row tools are put inside a menu, one button for each tool otherwise (by default) */
    rowToolsMenu: {
        required: false,
        type: [Boolean, Object],
        default: false
    },

    /* wether the selection column should be sticky or not */
    stickySelection: {
        required: false,
        type: Boolean,
        default: true
    },

    /***** COLUMNS/ROWS END */
    /***** COLUMNS/ROWS END */
    /***** COLUMNS/ROWS END */



    /***** GET/SET/TOGGLE/DELETE OPTIONS START */
    /***** GET/SET/TOGGLE/DELETE OPTIONS START */
    /***** GET/SET/TOGGLE/DELETE OPTIONS START */
    /*this are the opts for the server/side actions, which are hardcoded to get/set/toggle/delete
    they cascade from the defaults, common, and the specific action defaults, and action defined,
    ie: _.merge({},$_TABLE_DEFAULTS.common, ctx.commonOpts,$_TABLE_DEFAULTS.get,ctx.getOpts)*/

    /* pre filters to append to fetch params */
    preFilters: {
        required: false,
        type: Object,
        default: {}
    },

    commonOpts: {
        required: false,
        type: Object,
        default: { ...$_TABLE_DEFAULTS.common }
    },

    getOpts: {
        required: false,
        type: Object,
        default: { ...$_TABLE_DEFAULTS.get },
    },

    setOpts: {
        required: false,
        type: Object,
        default: { ...$_TABLE_DEFAULTS.set }
    },

    deleteOpts: {
        required: false,
        type: Object,
        default: { ...$_TABLE_DEFAULTS.delete },
    },

    toggleOpts: {
        required: false,
        type: Object,
        default: { ...$_TABLE_DEFAULTS.toggle },
    },
    /***** GET/SET/TOGGLE/DELETE OPTIONS END */
    /***** GET/SET/TOGGLE/DELETE OPTIONS END */
    /***** GET/SET/TOGGLE/DELETE OPTIONS END */





    //esto no se qué es
    /*showTop: {
        required: false,
        type: Boolean,
        default: true,
    },*/



    /* esto me parece que no va, quasar lo hace automáticamente
    infereColumns: {
        required: false,
        type: Boolean,
        default: true
    },*/


    /* no estoy seguro de estas 3 opciones, pero me parece que entre la nueva columnsCommon
    y dejar que el auto de quasar, no hacen falta 
    
    inferedColumnOptions: {
        required: false,
        type: Object,
        default: {}
    },

    inferedOptions: {
        required: false,
        type: Object,
        default: {}
    },

    inferedLabelLangPre: {
        required: false,
        type: String,
        default: null
    },
    */




    /* de aca para abajo chequear */

    page: {
        required: false,
        type: Number,
        default: 0
    },

    pageSize: {
        required: false,
        type: Number,
        default: -1
    },

    onSelect: {
        required: false,
        type: Function,
        default: function ($ev) {
        }
    },

    columnFilters: {
        required: false,
        type: Object,
        default: {},
    },

    defaultColumnFilters: {
        required: false,
        type: Object,
        default: {},
    },

    preColumnFilters: {
        required: false,
        type: Object,
        default: {}
    },

    bulkActions: {
        required: false,
        type: Array,
        default: [
            'hola',
            'que',
            'tal'
        ]
    },

    showColumnOptions: {
        required: false,
        type: Boolean,
        default: false,
    },

    showFilterOptions: {
        required: false,
        type: Boolean,
        default: false,
    },

    routes: {
        required: false,
        type: Object,
        default: {},
    },

    selectedRows: {
        required: false,
        type: Array,
        default: [],
    },

    isSideView: {
        required: false,
        type: Boolean,
        default: false,
    },

    renderMode: {
        required: false,
        type: String,
        default: 'replace' // replace | append | prepend
    }
}

const $_DEFAULT_BULK_ACTION = {
    icon: false,
    label: 'default-bulk-action-label',
    action: false,
    name: 'default-bulk-action-name'
}

const $_DEFAULT_BULK_ACTIONS =
{
    delete: {
        ...$_DEFAULT_BULK_ACTION,
        label: 'gen.actions.delete_selection',
        name: 'delete',
        action: 'deleteSelection',
        icon: 'delete',
        fields: [
            'id'
        ]
    }
}

const $_TABLE_EMITS = [
    ...useQuasarCompoExtend_get(QTable, 'emits'),
    'update:pagination', //why isn't this coming from compoExtend?

    'before:get',
    'after:get',
    'get:error',

    'before:set',
    'after:set',
    'set:error',

    'before:update',
    'after:update',
    'update:error'

    //'update:selectedRows',
    //'update:selectionRowsPage'
]

const $_VALID_ACTIONS = [
    'get',
    'set',
    'update',
    'delete',
    'toggle'
]

/* const $_DEFAULT_COLUMN_OPTIONS = {
    // QUASAR defaults
    name: required
    label: required
    field: required
    required
    align
    sortable
    sort
    rawSort
    sortOrder
    format
    style
    classess
    headerStyle
    headerClassess

    // CIMPL PROPS
    type: (default 'content') component name to use as cell/column content/format (cell value will be passed as model-value),
        some special types (any special type passed as a string will use it's specific defaults):
        - 'content': (default) just put the raw content on the cell
        - 'checkbox'/'toggle': will use a checkbox/toggler and convert that column to a toggleable (bulk) column
        - 'date' / 'time': use date/time

        or an object with the format
        {
            type: 'component',
            name: 'compo-name',
            bind: {...compo binds, models, etc}
            //any other option for this custom type
        }

        object format can also be used with special types, like:
        {
            type: 'checkbox',
            values: [1,0,-1] //true,false,intermediate
        }

    filter: same as [type] but specific to column filters, don't use string (leave as true to take from [colType])
    edit: same as [type] but specific to row cell quick edit, don't use string (leave as true to take from [colType])
} */

/* default column options, by type */
const $_COLUMN_CELL_DEFAULTS = {
    /* global/common cell options */
    _: {
        ...$_DEFAULT_CELL
    },

    ...$_CONTENT_DEFAULT_CELL,
    ...$_TOGGLER_DEFAULT_CELL,
    ...$_DATE_DEFAULT_CELL
}

const $_COLUMN_FILTER_DEFAULTS = {
    /* global/common filter options */
    _: {
        ...$_DEFAULT_FILTER
    },

    ...$_CONTENT_DEFAULT_FILTER,
    ...$_TOGGLER_DEFAULT_FILTER,
    ...$_DATE_DEFAULT_FILTER
}

const $_COLUMN_EDIT_DEFAULTS = {
    /* global/common quick-edit options */
    _: {
        ...$_DEFAULT_EDIT
    },

    ...$_CONTENT_DEFAULT_EDIT,
    ...$_TOGGLER_DEFAULT_EDIT,
    ...$_DATE_DEFAULT_EDIT
}

const $_COMPONENT = defineComponent({
    name: 'cimpl-table',
    tagname: 'cimpl-table',

    props: {
        //...$_QUASAR_TABLE_COMPONENT_PROPS,
        ...$_CIMPL_TABLE_COMPONENT_PROPS
    },

    emits: [...$_TABLE_EMITS],

    watch: {
        /*innerPagination (payload) {
            //alert("UPDATE PAGINATION")
            console.log('update pagination', payload)
            //this.$emit('update:pagination', payload)
        },*/

        /*pagination (newValue) {
            //this.innerPagination = newValue
            alert('cambio de afuera')
        }*/

        labelGet (newValue) {
            this.innerLabelGet = newValue
        }
    },

    setup (props) {
        /* this is used for the loading state of q-table */
        const innerLoading = ref(false)
        const isLoading = computed(() => {
            if (props.fetchRows === false) return props.loading
            return innerLoading.value
        })

        const actionOptions = computed(() => {
            let options = {}
            for (const x in $_VALID_ACTIONS) {
                const actionName = $_VALID_ACTIONS[x]

                options[actionName] = _.merge({}, $_TABLE_DEFAULTS.common, props.commonOpts, $_TABLE_DEFAULTS[actionName], props[`${actionName}Opts`])
                options[actionName].params = _.merge({},
                    _.get($_TABLE_DEFAULTS.common, 'params', {}),
                    _.get($_TABLE_DEFAULTS[actionName], 'params', {}),
                    _.get(props.commonOpts, 'params', {}),
                    _.get(props[`${actionName}Opts`], 'params', {}))

                if (options[actionName].extend !== false) {
                    let extend = options[actionName].extend
                    if (!Array.isArray(extend)) extend = [extend]
                    for (const extX in extend) {
                        const extName = extend[extX]
                        options[actionName] = _.merge({}, $_TABLE_DEFAULTS.common, props.commonOpts, $_TABLE_DEFAULTS[extName], props[`${extName}Opts`], options[actionName])
                        options[actionName].params = _.merge({},
                            _.get($_TABLE_DEFAULTS.common, 'params', {}),
                            _.get($_TABLE_DEFAULTS[extName], 'params', {}),
                            _.get(props.commonOpts, 'params', {}),
                            _.get(props[`${extName}Opts`], 'params', {}),
                            options[actionName].params)
                    }
                }
            }
            return options
        })

        // get props for given column
        const getColumnProps = function (base) {
            //get column type (defaults to 'content')
            const columnType = _.get(base, 'type',
                _.get(props.columnsInfered, `${base.name}.type`,
                    _.get(props.columnsCommon, 'type', 'content')))

            const col = _.merge(
                {},
                $_COLUMN_CELL_DEFAULTS._,
                _.get(props.columnDefaults, 'cell._', {}),
                _.get($_COLUMN_CELL_DEFAULTS, columnType, $_COLUMN_CELL_DEFAULTS.content),
                _.get(props.columnDefaults, `cell.${columnType}`, {}),
                props.columnsCommon,
                _.get(props.columnsInfered, base.name, {}),
                base
            )

            if (col.filter !== false) {
                let superBase = {}
                let defaults = _.merge({},
                    $_COLUMN_FILTER_DEFAULTS._,
                    _.get(props.columnDefaults, 'filter._', {}),
                    _.get($_COLUMN_FILTER_DEFAULTS, columnType, $_COLUMN_FILTER_DEFAULTS.content),
                    _.get(props.columnDefaults, `filter.${columnType}`, {}),
                )
                const common = _.get(props.columnsCommon, 'filter', {})
                const infered = _.get(props.columnsInfered, `${base.name}.filter`, {})
                const own = col.filter === true ? {} : col.filter

                const inheritDefaults = _.concat(
                    $_COLUMN_FILTER_DEFAULTS._.inheritableProps,
                    _.get(props.columnDefaults, 'filter._.inheritableProps', []),
                    _.get($_COLUMN_FILTER_DEFAULTS, `${columnType}.inheritableProps`, []),
                    _.get(props.columnDefaults, `filter.${columnType}.inheritableProps`, [])
                )
                const inheritCommon = _.get(props.columnsCommon, 'filter.inheritableProps', [])
                const inheritInfered = _.get(props.columnsInfered, `${base.name}.filter.inheritableProps`, [])
                const inheritOwn = _.get(col, 'filter.inheritableProps', [])

                col.filter = _.merge(
                    superBase,
                    typeof defaults === 'boolean' ? {} : defaults,
                    typeof common === 'boolean' ? {} : common,
                    typeof infered === 'boolean' ? {} : infered,
                    typeof own === 'boolean' ? {} : own,
                    {
                        inheritableProps: _.concat(
                            inheritDefaults,
                            inheritCommon,
                            inheritInfered,
                            inheritOwn
                        )
                    }
                )

                if (col.filter.inheritableProps !== undefined)
                    col.filter = _.merge(
                        _.pick(col, col.filter.inheritableProps),
                        col.filter
                    )
            }

            if (col.edit !== false) {
                let superBase = {}
                let defaults = _.merge({},
                    $_COLUMN_EDIT_DEFAULTS._,
                    _.get(props.columnDefaults, 'edit._', {}),
                    _.get($_COLUMN_EDIT_DEFAULTS, columnType, $_COLUMN_EDIT_DEFAULTS.content),
                    _.get(props.columnDefaults, `edit.${columnType}`, {}),
                )

                const common = _.get(props.columnsCommon, 'edit', {})
                const infered = _.get(props.columnsInfered, `${base.name}.edit`, {})
                const own = col.edit === true ? {} : col.edit

                const inheritDefaults = _.concat(
                    $_COLUMN_EDIT_DEFAULTS._.inheritableProps,
                    _.get(props.columnDefaults, 'edit._.inheritableProps', []),
                    _.get($_COLUMN_EDIT_DEFAULTS, `${columnType}.inheritableProps`, []),
                    _.get(props.columnDefaults, `edit.${columnType}.inheritableProps`, [])
                )
                const inheritCommon = _.get(props.columnsCommon, 'edit.inheritableProps', [])
                const inheritInfered = _.get(props.columnsInfered, `${base.name}.edit.inheritableProps`, [])
                const inheritOwn = _.get(col, 'edit.inheritableProps', [])

                const pickDefaults = _.concat(
                    $_COLUMN_EDIT_DEFAULTS._.pick,
                    _.get(props.columnDefaults, 'edit._.pick', []),
                    _.get($_COLUMN_EDIT_DEFAULTS, `${columnType}.pick`, []),
                    _.get(props.columnDefaults, `edit.${columnType}.pick`, [])
                )
                const pickCommon = _.get(props.columnsCommon, 'edit.pick', [])
                const pickInfered = _.get(props.columnsInfered, `${base.name}.edit.pick`, [])
                const pickOwn = _.get(col, 'edit.pick', [])

                col.edit = _.merge(
                    superBase,
                    typeof defaults === 'boolean' ? {} : defaults,
                    typeof common === 'boolean' ? {} : common,
                    typeof infered === 'boolean' ? {} : infered,
                    typeof own === 'boolean' ? {} : own,
                    {
                        inheritableProps: _.concat(
                            inheritDefaults,
                            inheritCommon,
                            inheritInfered,
                            inheritOwn
                        ),

                        pick: _.concat(
                            pickDefaults,
                            pickCommon,
                            pickInfered,
                            pickOwn
                        )
                    }
                )

                if (col.edit.inheritableProps !== undefined)
                    col.edit = _.merge(
                        _.pick(col, col.edit.inheritableProps),
                        col.edit
                    )
            }

            return col
        }

        /* this one is going store the rows, when prop.fetchRows is false, it returns props.rows
            otherwise it returns innerRows
         */
        const innerRows = ref([])
        const finalRows = computed(() => {
            //if undefined, 
            if (props.fetchRows !== true) return props.rows ? props.rows : []
            return innerRows.value
        })

        /* this one is going store the parsed columns value for the props proxy */
        const innerColumns = computed(() => {
            let columns = []
            if (props.columns !== undefined)
                for (const x in props.columns)
                    columns.push(getColumnProps(props.columns[x]))
            else if (finalRows.value.length)
                for (const x in finalRows.value[0])
                    columns.push(getColumnProps({
                        name: x,
                        label: x,
                        field: x
                    }))
            return columns
        })



        const {
            qCompoPropsProxy
        } = useQuasarCompoExtend(QTable, props, {
            qCompoPropsProxy: {
                proxy: {
                    columns: innerColumns,
                    rows: finalRows,
                    loading: isLoading
                }
            }
        })

        /*const {
            registerInterval: registerRetryInterval,
            removeInterval: removeRetryInterval
        } = useInterval()*/

        /*const {
            // inNeedOfRetry,
            hasNeedsRetry,
            needsRetry
        } = useNeedsRetry({
            enable: props.retry,
            queue: props.retryQueue,
            every: props.retryEvery,
            queueSize: props.retryMaxQueue
        })*/

        let setupData = {
            qCompoPropsProxy,

            /*inNeedOfRetry: ref({}), //callbacks that need to be retry
            registerRetryInterval, //register interval to use when retrying,
            removeRetryInterval, //unregister interval to use when retrying,*/
            // inNeedOfRetry,
            //hasNeedsRetry,
            //needsRetry,


            innerColumns, //remove once I don't need to dump it on screen

            innerPagination: ref({ ...props.pagination }),
            innerRows,
            innerLoading,
            currentFilters: ref({}),

            actionOptions,

            is_cimpl_table: true,
            useDebug: true
        }

        return setupData
    },

    provide () {
        return {
            onCellQuickEdit: function (cell, newValue, pick) {
                if (pick === undefined) pick = []
                if (this.bindedTable.mainRowKey !== undefined)
                    pick.push(this.bindedTable.mainRowKey)
                let updatedRow = _.pick(cell.row, pick)
                updatedRow[cell.col.name] = newValue
                return this.bindedTable.setRows([updatedRow])
            },

            $lbl: function () {
                return this.bindedTable.innerLabelGet.apply(this, arguments)
            },
        }
    },

    methods: {
        /*debug through browser console actions and inner workings*/
        debug () {
            if (!this.useDebug) return
            const baseString = "** cimpl-table: "
            for (const x in arguments)
                console.log(typeof arguments[x] === 'string' ? `${baseString}${arguments[x]}` : arguments[x])
        },

        /* update inner row values for given rows */
        updateRows (rows, mainKey) {
            if (Boolean(mainKey) === false) mainKey = this.mainRowKey
            for (const rowKey in rows) {
                const row = rows[rowKey]
                let found = false
                for (const innerRowKey in this.innerRows) {
                    if (found) continue
                    if (row[mainKey] === this.innerRows[innerRowKey][mainKey]) {
                        found = true
                        for (const updateKey in row)
                            this.innerRows[innerRowKey][updateKey] = row[updateKey]
                    }
                }
            }
        },

        /*get rows from URL */
        getRows (extraOptions) {
            const ctx = this
            const actionOptions = _.merge({},
                this.actionOptions.get,
                extraOptions !== undefined ? extraOptions : {}
            )
            actionOptions.params = _.merge({},
                actionOptions.params,
                this.fetchParams,
                _.get('params', extraOptions, {})
            )

            this.debug("getRows options", "extra?", extraOptions, "final?", actionOptions)

            //ctx.loading = actionOptions.loading
            //ctx.submitting = actionOptions.submitting

            //ctx.debug('doGet()', 'fire before:get with....', actionOptions)
            ctx.$emit('before:get', actionOptions)

            switch (actionOptions.rest) {
                case true:
                    switch (actionOptions.method) {
                        case 'get':
                            ctx.innerLoading = true
                            const thePromise = ctx.$rest.get(actionOptions.url, {
                                params: actionOptions.params
                            })

                            thePromise.then(function (response) {
                                ctx.debug('fire after:get with....', response)
                                ctx.$emit('after:get', response)
                                if (actionOptions.set === true) {
                                    ctx.innerRows = _.get(response, actionOptions.rows_getter, [])
                                    ctx.triggerUpdatePagination({ rowsNumber: _.get(response, actionOptions.total_getter, undefined) })
                                }
                            }).catch(function (error) {
                                ctx.debug("ERROR", error)
                                ctx.$emit('get:error', error)
                                throw error
                            }).finally(() => {
                                ctx.innerLoading = false
                                //ctx.submitting = false
                            })

                            return thePromise
                    }
                    break
            }
        },

        /* set partial/full rows */
        setRows (rows, update) {
            if (update === undefined) update = false
            const ctx = this
            const actionOptions = this.actionOptions[update === false ? 'set' : 'update']

            let postData = {
                rows
            }

            ctx.$emit('before:' + (update === false ? 'set' : 'update'), {
                postData,
                actionOptions
            })

            switch (actionOptions.rest) {
                case true:
                    switch (actionOptions.method) {
                        case 'post':
                            //ctx.innerLoading = true
                            const thePromise = ctx.$rest.post(actionOptions.url, postData, {
                                params: actionOptions.params
                            })

                            thePromise.then(function (response) {
                                ctx.debug('fire after:set with....', response)
                                ctx.$emit('after:set', response)
                                const rows = actionOptions.getter === true ? response : _.get(response, actionOptions.getter, [])
                                if (actionOptions.update) ctx.updateRows(rows, actionOptions.mainRowKey)
                            }).catch(function (error) {
                                ctx.debug("set ERROR", error)
                                ctx.$emit('set:error', error)
                                throw error
                            }).finally(() => {
                                //ctx.innerLoading = false
                                //ctx.submitting = false
                            })

                            return thePromise
                    }
                    break
            }
        },

        /* column filter update */
        columnFilterUpdate (col, payload) {
            this.currentFilters[col.name] = payload
            this.triggerUpdatePagination({ page: 1 })
            //this.getRows()
        },

        /* column filter clear */
        columnFilterClear (col) {
            delete this.currentFilters[col.name]
            this.triggerUpdatePagination({ page: 1 })
            this.getRows()
        },

        /* on table request, when sorting, next page, etc */
        onTableRequest (payload) {
            this.triggerUpdatePagination(payload.pagination)
            this.getRows()
        },

        /* emit update:pagination */
        onUpdatePagination (payload) {
            console.log("UPDATE PAGINATION", payload)
            this.$emit('update:pagination', payload)
        },

        onUpdatePaginationFromQPagination (payload) {
            //return this.triggerUpdatePagination({
            return this.onTableRequest({
                pagination: {
                    page: payload
                }
            })
        },

        /* trigger update:pagination merginx current and provided */
        triggerUpdatePagination (payload) {
            const newPagination = {
                ...this.innerPagination,
                ...payload
            }
            this.innerPagination = newPagination
            this.onUpdatePagination(newPagination)
        },


        /* default labelGet */
        innerLabelGet () {
            if (this.labelGet !== undefined) return this.labelGet.apply(this, arguments)
            return this.i18n === false ? arguments[0] : this.$t.apply(this.$t, arguments)
        },












        /* de aca para abajo no se que son los metodos */


        execBulkAction (bulkAction) {
            //console.log("EXEC BULK ACTION")
            //console.log(this)
            //console.log(bulkAction)
            //console.log(bulkAction.action)
            //console.log(this[bulkAction.action])
            if (typeof bulkAction.action === 'string')
                bulkAction.action = this[bulkAction.action]
            //console.log(bulkAction)
            bulkAction.action(this.selectedRows)
        },

        execToggleBulkAction (columnName, newValue) {
            //console.log("execToggleBulkAction")
            //console.log(columnName)
            //console.log(newValue)
            this.onRowToggler(columnName, this.selectedRows, newValue)
        },

        quickView (route) {
            //console.log("QUICK VIEW")
            //console.log(route)
        },

        getSaveViewData: function () {
            //console.log("MelonList (default) getSaveViewData()")
            //console.log(this.visibleColumns)
            //console.log(this.stickyColumns)
            //console.log(this.columnFilters)
            return {
                visibleColumns: this.visibleColumns,
                stickyColumns: this.stickyColumns,
                columnFilters: this.columnFilters
            }
        },

        parseDate (origDate, dateFormat) {
            console.log("--- parseDate", dateFormat)
            const parsed = date.formatDate(origDate, dateFormat, {
                days: [this.$t('gen.dates.days.sunday'), this.$t('gen.dates.days.monday'), this.$t('gen.dates.days.tuesday'), this.$t('gen.dates.days.wednesday'), this.$t('gen.dates.days.thursday'), this.$t('gen.dates.days.friday'), this.$t('gen.dates.days.saturday')],
                daysShort: [this.$t('gen.dates.days_short.sunday'), this.$t('gen.dates.days_short.monday'), this.$t('gen.dates.days_short.tuesday'), this.$t('gen.dates.days_short.wednesday'), this.$t('gen.dates.days_short.thursday'), this.$t('gen.dates.days_short.friday'), this.$t('gen.dates.days_short.saturday')],
                months: [this.$t('gen.dates.months.january'), this.$t('gen.dates.months.february'), this.$t('gen.dates.months.march'), this.$t('gen.dates.months.april'), this.$t('gen.dates.months.may'), this.$t('gen.dates.months.june'), this.$t('gen.dates.months.july'), this.$t('gen.dates.months.august'), this.$t('gen.dates.months.september'), this.$t('gen.dates.months.october'), this.$t('gen.dates.months.november'), this.$t('gen.dates.months.december')],
                monthsShort: [this.$t('gen.dates.months_short.january'), this.$t('gen.dates.months_short.february'), this.$t('gen.dates.months_short.march'), this.$t('gen.dates.months_short.april'), this.$t('gen.dates.months_short.may'), this.$t('gen.dates.months_short.june'), this.$t('gen.dates.months_short.july'), this.$t('gen.dates.months_short.august'), this.$t('gen.dates.months_short.september'), this.$t('gen.dates.months_short.october'), this.$t('gen.dates.months_short.november'), this.$t('gen.dates.months_short.december')]
            })
            console.log("result", parsed)
            return parsed
        },

        deleteSelection (values, field) {
            const ctx = this
            /*console.log("melon-list . deleteSelection(values,field)")
            console.log(this.deleteOpts)
            console.log(values, field)
            console.log("ROWKEY", this.rowKey)*/

            const appInstance = ctx.$store.getters.appInstance
            appInstance.dialogConfirm({
                title: ctx.$t(`${ctx.deleteOpts.params.controller}.delete.confirm_title`),
                message: ctx.$t(`${ctx.deleteOpts.params.controller}.delete.confirm_excerpt`),
            }, ctx).onOk(() => {
                const loaderDialog = appInstance.dialogConfirm({
                    title: ctx.$t('gen.processing...'),
                    progress: {
                        spinner: QSpinnerGears
                    },
                    persistent: true,
                    cancel: false,
                    ok: false
                })

                if (field === undefined) field = ctx.rowKey
                let v = []
                let rowKeys = []
                ctx.$_.each(values, function (val, ind) {
                    v.push(val[field])
                    rowKeys.push(val[ctx.rowKey])
                    //console.log("ESTE ES EL COMPONENT DE LA ROW?", ctx.$refs[`body-cell-row_tools-${val[ctx.rowKey]}`])
                })

                //console.log(v)
                ctx.loading = true
                ctx.$rest.delete(ctx.deleteOpts.url, {
                    params: {
                        ...ctx.getDeleteParams(),
                        ...{ delete: v }
                    }
                }).then(function (response) {
                    console.log("AFTER DELETE", response)
                    ctx.loading = false
                    loaderDialog.hide();
                    ctx.doFetch()
                }).catch(function (response) {
                    console.log("delete catch", response)
                    ctx.loading = false
                    loaderDialog.hide();
                })
            })
        },

        setColumns () {
            const debug = false
            let visible = []
            this.rowTogglersColNames = []
            this.rowTogglers = {}
            this.rowTogglersLoadingStates = {}

            //this.colDatepickers = {}

            if (debug) console.log("MelonList :: LIST SET COLUMNS ")
            if (debug) console.log("MelonList :: ORIG COLUMNS", this.origColumns)
            const empty = this.rows.length === 0
            if (empty) {
                //this.columns = []
            }
            else {
                //let newCols = [...this.origColumns]
                let newCols = []
                if (debug) console.log("MelonList :: INTERFERE COLS?", this.infereColumns)
                if (!newCols.length && this.infereColumns) {
                    if (debug) console.log("MelonList :: ENTRO AL CICLO DE INFERENCIA")
                    if (debug) console.log("MelonList :: ignore?")
                    if (debug) console.log(this.ignore)
                    for (let x in this.rows[0]) if (this.ignore.indexOf(x) === -1) {
                        let inferedOptions = this.getInferedOptions(x)

                        switch (inferedOptions?.formatCell) {
                            case 'toggler':
                                this.rowTogglersColNames.push(x)
                                this.rowTogglers[x] = []
                                this.rowTogglersLoadingStates[x] = []
                                break

                            case 'date':
                                if (this.colDatepickers[`col-${x}`] === undefined)
                                    this.colDatepickers[`col-${x}`] = {
                                        dates: [],
                                        value: undefined,
                                        range: false,
                                        multiple: false,
                                    }
                                break
                        }

                        if (debug) console.log("INFERED OPTIONS", inferedOptions)
                        let xCol = {}
                        for (let infX in inferedOptions)
                            xCol[infX] = inferedOptions[infX]

                        xCol.name = x
                        xCol.label = this.inferedLabelLangPre !== false ? this.$t(this.inferedLabelLangPre != '' ? this.inferedLabelLangPre /*+ '.'*/ + x : '') : x.toUpperCase()
                        xCol.field = x
                        if (debug) console.log("MelonList :: AGREGANDO")
                        if (debug) console.log(xCol)
                        visible.push(xCol.name)
                        newCols.push(xCol)
                    }
                }
                if (debug) console.log("MelonList :: TENGO QUE AGREGAR ROW TOOLS?")
                if (debug) console.log(this.rowTools, newCols.length, this.rowTools.length)
                if (newCols.length && !this.$_.isEmpty(this.rowTools.length) || this.rowTools === true) {
                    if (debug) console.log("MelonList :: ---entro al agregado de row tools")
                    newCols.push({
                        name: 'row_tools',
                        //label: 'ROW TOOLS',
                        field: 'row_tools',
                        columnToggler: false,
                    })
                    visible.push('row_tools')
                }

                const sortedCols = this.sortColumns(newCols)
                this.columns = sortedCols
                if (this.$_.isEmpty(this.visibleColumns)) this.visibleColumns = visible

            }
        },

        sortColumns ([...columns], sortOrder) {
            if (sortOrder === undefined) sortOrder = this.columnsOrder
            if (!sortOrder.length) return columns
            let newOrder = []
            for (var x in sortOrder) {
                const field = sortOrder[x]
                let colIndex = 0
                let breakW = false
                while (!breakW && colIndex < columns.length) {
                    if (columns[colIndex].name === field) {
                        let col = columns.splice(colIndex, 1)[0]
                        newOrder.push(col)
                        breakW = true
                    }
                    colIndex++
                }
            }

            if (columns.length) for (var x in columns)
                newOrder.push(columns[x])

            return newOrder
        },

        setOrigSelectedRows () {
            //console.log("SET ORIG SELECTE ROWS")
            //console.log(this.origSelectedRows)
            if (this.origSelectedRows.length)
                for (var x in this.origSelectedRows) {
                    if (this.selectedRows.indexOf(this.origSelectedRows[x]) === -1 && this.rows.indexOf(this.origSelectedRows[x]) !== -1)
                        this.selectedRows.push(this.origSelectedRows[x])
                    this.selectedRowsPage.push(this.origSelectedRows[x])
                }
        },

        rowsUpdated (rows, totalItemCount) {
            const ctx = this

            ctx.selectedRowsPage = []

            ctx.pagination.rowsNumber = totalItemCount;
            ctx.setColumns();
            if (ctx.rowTogglersColNames.length)
                for (let x in rows)
                    for (let y in ctx.rowTogglersColNames) {
                        if (parseInt(rows[x][ctx.rowTogglersColNames[y]]) === 1) {
                            ctx.rowTogglers[ctx.rowTogglersColNames[y]].push(rows[x])
                        }
                    }

            ctx.setOrigSelectedRows()
        },

        doFetch (clean) {
            //if (clean == undefined) clean = !this.fetchAppend
            if (clean === undefined) clean = true
            const ctx = this

            return new Promise(function (resolve, reject) {

                switch (ctx.getOpts.rest) {
                    case true:
                        switch (ctx.getOpts.method) {
                            case 'get':
                                ctx.loading = true

                                let params = ctx.getFetchParams()
                                ctx.getOpts.before(params)

                                ctx.$rest.get(ctx.getOpts.url, {
                                    params: params
                                }).then(function (response) {
                                    //console.log("AFTER FETCH");
                                    //console.log(response);
                                    //console.log(ctx.fetch_after);
                                    //console.log("CTX", ctx);
                                    //if (clean) ctx.rows = []
                                    ctx.getOpts.preafter(response)

                                    switch (ctx.renderMode) {
                                        case 'replace':
                                            ctx.rows = [...response.data.items]
                                            break
                                        case 'append':
                                            ctx.rows.push.apply(ctx.rows, response.data.items)
                                            break
                                        case 'prepend':
                                            ctx.rows.unshift.apply(ctx.rows, response.data.items)
                                            break
                                    }
                                    //ctx.rows = [...ctx.rows, ...response.data.items]
                                    /*if(this.fetchAppend)
                                    {
                                        for (let x in response.data.items)
                                            ctx.rows.push(response.data.items[x])
                                    }
                                    else ctx.rows = response.data.items;*/
                                    //console.log("THIS VERGA ROWS")
                                    //console.log(ctx.rows)

                                    ctx.rowsUpdated(response.data.items, response.data.totalItemCount)

                                    ctx.loading = false
                                    ctx.getOpts.after(response, false)
                                    resolve()
                                }).catch(function (response) {
                                    //console.log("ERROR AL doFetch LA LISTA")
                                    //console.log(response)
                                    ctx.loading = false
                                    ctx.getOpts.after(response, true)
                                    reject()
                                })
                                break
                        }
                        break
                }
            })
        },

        getToggleParams () {
            let params = { ...this.toggleOpts.params }
            return params
        },

        reloadRows () {
            /*this.tableRef.setPagination({
                page: 1,
            })*/

            if (this.pagination.page != 1)
                this.pagination.page = 1
            else this.doFetch()
        },

        /*getInferedOptions (colName) {
            let inferedOptionsObject = {
                sortable: true,
                filterInput: true,
                columnToggler: true,
                formatCell: false,
                dateFormat: 'MM/DD/YYYY',
                dateFormat_line_2: 'HH:mm:ss',
                dateFormatFull: 'DD MMMM YYYY',
                dateFormatFull_line_2: 'dddd',
                dateFormatFull_line_3: 'HH:mm:ss',
                //dateRange: true,
            }

            for (var x in this.inferedOptions)
                inferedOptionsObject[x] = this.inferedOptions[x]

            if (colName !== undefined) if (this.inferedColumnOptions[colName] !== undefined)
                for (var x in this.inferedColumnOptions[colName])
                    inferedOptionsObject[x] = this.inferedColumnOptions[colName][x]

            return inferedOptionsObject
        },*/


        onRowToggler (colName, affectedRows, fromBulk) {
            let params = this.getToggleParams()
            if (fromBulk === undefined) fromBulk = false
            let postData = {
                field: colName,
                //owner: this.toggleOpts.fullRecord ? colValue : colValue[this.rowKey],
                owners: [],
                //value: checked ? 1 : 0
                values: [],
                rowkey: this.rowKey,
            }
            console.log("ON ROW TOGGLER", colName, affectedRows, fromBulk)

            for (var x in affectedRows) {
                const colValue = affectedRows[x]
                const checked = fromBulk !== false ? fromBulk : this.rowTogglers[colName].indexOf(colValue) !== -1
                console.log("COL VALUE", colValue, checked)
                postData.owners.push(this.toggleOpts.fullRecord ? colValue : colValue[this.rowKey])
                postData.values.push(checked ? 1 : 0)

                if (this.rowTogglersLoadingStates[colName].indexOf(colValue) === -1)
                    this.rowTogglersLoadingStates[colName].push(colValue)
            }

            this.toggleOpts.before(postData, params, affectedRows)

            const ctx = this

            /*$melon.showNotif({
                message: '<b>Did you know?...</b>row toggler requests have a forced 2secs delay, just to appreciate the spinning hour glass animation....<br /><b>=P</b>',
                type: 'info',
                html: true
            }, this)*/

            switch (ctx.toggleOpts.rest) {
                case true:
                    switch (ctx.toggleOpts.method) {
                        case 'post':
                            ctx.loading = true

                            ctx.$rest.post(ctx.toggleOpts.url, postData, {
                                params: params
                            }).then(function (response) {
                                //console.log("TOGGLE THEN", affectedRows)
                                for (var x in affectedRows) {
                                    try {
                                        const colValue = affectedRows[x]
                                        let checked = parseInt(postData.values[x]) === 1 ? true : false
                                        if (!checked) {
                                            if (ctx.rowTogglers[colName].indexOf(colValue) !== -1)
                                                ctx.rowTogglers[colName].splice(ctx.rowTogglers[colName].indexOf(colValue), 1)
                                        }
                                        else {
                                            if (ctx.rowTogglers[colName].indexOf(colValue) === -1)
                                                ctx.rowTogglers[colName].push(colValue)
                                        }
                                        //console.log("AFAFA", colName, checked, postData.values[x], affectedRows[x][colName], fromBulk)
                                        //affectedRows[x][colName] = checked ? "1" : "0"
                                        //affectedRows[x].name = checked ? "1" : "0"
                                        if (ctx.rowTogglersLoadingStates[colName].indexOf(colValue) !== -1)
                                            ctx.rowTogglersLoadingStates[colName].splice(ctx.rowTogglersLoadingStates[colName].indexOf(colValue), 1)
                                    }
                                    catch (exp) {
                                        console.log("CATCH", exp)
                                    }
                                }
                                ctx.loading = false
                            }).catch(function (response) {
                                //alert("FALLO EL TOGGLE REVIERTO ACCION")

                                for (var x in affectedRows) {
                                    let colValue = affectedRows[x]
                                    let checked = parseInt(postData.values[x]) === 1 ? true : false
                                    if (checked) ctx.rowTogglers[colName].splice(ctx.rowTogglers[colName].indexOf(colValue), 1)
                                    else ctx.rowTogglers[colName].push(colValue)
                                    //setTimeout(function () { ctx.rowTogglersLoadingStates[colName].splice(ctx.rowTogglersLoadingStates[colName].indexOf(colValue), 1) }, 2000)
                                    ctx.rowTogglersLoadingStates[colName].splice(ctx.rowTogglersLoadingStates[colName].indexOf(colValue), 1)
                                }
                                ctx.loading = false
                            })
                            break
                    }
                    break
            }
        },

        filterInputClick ($ev) {
            //prevent sorting from firing up upon clicking on the filter input 
            $ev.cancelBubble = true
        },

        filterDateInputClick (proxyRef) {
            proxyRef.show()
        },

        filterInputBlur ($ev) {
            //console.log("FILTER INPUT BLUR")
            //console.log($ev)
            const input = $ev.srcElement
            const type = input.nodeName
            //console.log("FILTER INPUT BLUR", input, type)

            const filter = input.value.trim()
            const columnName = input.name
            this.setFilter(columnName, filter)
        },

        setFilter (columnName, filter) {
            //console.log("SET FILTER", columnName, filter)
            if (this.columnFilters[columnName] !== undefined) {
                if (this.columnFilters[columnName] == filter) {
                    //console.log("no hubo cambios en el filtro, retorno sin hacer nada")
                    return
                }
            }
            else if (filter == "") {
                //console.log("ya tenía el filtro vacío, asique retorno sin hacer nada")
                return
            }

            if (filter != "") {
                this.columnFilters[columnName] = filter
                //alert("AGREGO FILTRO " + columnName)
            }
            else {
                //console.log("BORRO ESTE FILTRO", columnName)
                delete this.columnFilters[columnName]
                //console.log(this.columnFilters)
            }

            //console.log("filtros finales actuales")
            //console.log(this.columnFilters)

            //this.doFetch()
            //this.reloadRows()

            this.tableRequest({ pagination: this.pagination })
        },

        parsedFiltersArray () {
            let filters = []
            if (!_.isEmpty(this.columnFilters)) _.each(this.columnFilters, function (filterValue, filterKey) {
                filters.push({ name: filterKey, value: filterValue })
            })
            return filters
        },

        getFetchParams () {
            let params = {
                ...this.getOpts.params,
                ...{
                    preFilters: this.preColumnFilters
                }
            }



            let filters = {}
            for (let x in this.defaultColumnFilters)
                filters[x] = this.defaultColumnFilters[x]
            for (let x in this.columnFilters)
                filters[x] = this.columnFilters[x]

            if (!_.isEmpty(filters)) params.filters = filters

            if (this.pagination.sortBy !== null) {
                params.sortBy = this.pagination.sortBy
                params.sortDirection = this.pagination.descending ? "DESC" : "ASC"
            }

            params.page = this.pagination.page - 1
            params.pageSize = this.pagination.rowsPerPage
            if (params.pageSize === 0) params.pageSize = 9999999999999999999
            return params
        },

        getDeleteParams (deleteValues) {
            let params = {
                ...this.deleteOpts.params,
                ...{
                }
            }

            params.delete = deleteValues

            return params
        },


        tableUpdateSelection ($ev) {
            this.$emit('update:selectedRows', $ev)
            //console.log("BASE TABLE SELECTION")
            //console.log(this.selectedRows.length)
            //console.log($ev)
            //console.log("LLAMO A ONSELECT")
            //console.log(this.onSelect)
            //this.onSelect($ev)
        },

        //@selection="tableOnSelection"
        //@update:selected="tableUpdateSelection"
        //:selected="selectedRows"
        //sacar el v-model:selection y agregar esos 3
        tableOnSelection ({ rows, added, evt }) {

            switch (this.selection) {
                case 'single':
                    if (added) {
                        this.selectedRows = [rows[0]]
                        this.selectedRowsPage = [rows[0]]
                    }
                    else {
                        this.selectedRows.splice(this.selectedRows.indexOf(rows[0]), 1)
                        this.selectedRowsPage.splice(this.selectedRowsPage.indexOf(rows[0]), 1)
                        this.origSelectedRows.splice(this.origSelectedRows.indexOf(rows[0]), 1)
                    }
                    this.$emit('update:selectedRows', this.selectedRows)
                    this.$emit('update:selectedRowsPage', this.selectedRowsPage)
                    return true

                case 'multiple':
                    for (var x in rows) {
                        if (added) {
                            this.selectedRows.push(rows[x])
                            this.selectedRowsPage.push(rows[x])
                        }
                        else {
                            this.selectedRows.splice(this.selectedRows.indexOf(rows[x]), 1)
                            this.selectedRowsPage.splice(this.selectedRowsPage.indexOf(rows[x]), 1)
                            this.origSelectedRows.splice(this.origSelectedRows.indexOf(rows[x]), 1)
                        }
                    }
                    this.$emit('update:selectedRows', this.selectedRows)
                    this.$emit('update:selectedRowsPage', this.selectedRowsPage)
                    return true
            }

            alert("MelonList.tableOnSelection() -- I'm here only if we're using selection:multiple-custom")

            const selectionLists = ['selectedRows', 'selectedRowsPage']
            if (this.rows.length === 0 || this.tableRef === void 0) {
                this.$emit('update:selectedRows', this.selectedRows)
                this.$emit('update:selectedRowsPage', this.selectedRowsPage)
                return
            }
            //console.log(rows)
            const row = rows[0]
            const filteredSortedRows = this.tableRef.filteredSortedRows
            const rowIndex = filteredSortedRows.indexOf(row)
            const localLastIndex = this.lastIndex

            this.lastIndex = rowIndex
            //console.log("LOCAL Y LAST")
            //console.log(localLastIndex, this.lastIndex)
            document.getSelection().removeAllRanges()

            for (var x in selectionLists) {
                //console.log("4 " + x)

                //let selectionList = this[selectionLists[x]]

                if (this.$q.platform.is.mobile === true) {
                    evt = { ctrlKey: true }
                }
                else if (evt !== Object(evt) || (evt.shiftKey !== true && evt.ctrlKey !== true)) {
                    this[selectionLists[x]] = added === true ? rows : []
                    continue
                }

                const operateSelection = added === true
                    ? selRow => {
                        const selectedIndex = this[selectionLists[x]].indexOf(selRow)
                        if (selectedIndex === -1) {
                            this[selectionLists[x]] = this[selectionLists[x]].concat(selRow)
                        }
                    }
                    : selRow => {
                        const selectedIndex = this[selectionLists[x]].indexOf(selRow)
                        if (selectedIndex > -1) {
                            this[selectionLists[x]] = this[selectionLists[x]].slice(0, selectedIndex).concat(this[selectionLists[x]].slice(selectedIndex + 1))
                        }
                    }
                //console.log(5)
                if (localLastIndex === null || evt.shiftKey !== true) {
                    //console.log(6)
                    operateSelection(row)
                    continue
                }
                //console.log(7)
                const from = localLastIndex < rowIndex ? localLastIndex : rowIndex
                const to = localLastIndex < rowIndex ? rowIndex : localLastIndex
                for (let i = from; i <= to; i += 1) {
                    operateSelection(filteredSortedRows[i])
                }

                /*console.log("FINAL MAGIA")
                console.log(this.selectedRows)
                console.log(this.selectedRowsPage)*/
            }
            this.$emit('update:selectedRows', this.selectedRows)
            this.$emit('update:selectedRowsPage', this.selectedRowsPage)
        },

        tableRequest ($ev) {
            //console.log("table request")
            //console.log($ev.pagination)
            this.pagination.page = $ev.pagination.page
            this.pagination.rowsPerPage = $ev.pagination.rowsPerPage
            this.pagination.sortBy = $ev.pagination.sortBy
            this.pagination.descending = $ev.pagination.descending
            //alert("table request do fetch")
            this.doFetch()
        },

        tableScroll ($ev) {
            /*console.log("table scroll")
            console.log($ev)
            console.log(this.$refs.table)
            console.log(this.$refs.table.$el.querySelectorAll('th.isSticky'))
            const stickies = this.$refs.table.$el.querySelectorAll('th.isSticky')
            _.each(stickies, function (th, i) {
                //console.log("STICKI")
                th.classList.add('unsticky')
                //console.log(th)
                //console.log(th.getBoundingClientRect())
                //console.log(th.getBoundingClientRect().right - th.getBoundingClientRect().left)
                console.log(`${$ev.position.left} // ${th.getBoundingClientRect().left}`)
                console.log(th.getBoundingClientRect())
        
                th.classList.remove('unsticky')
                //console.log("---------------------")
            })*/
        },

        getSaveViewData (dialogData) {
            /*console.log("MelonList (default) getSaveViewData")
            console.log("dialogData", dialogData)*/
            let data = {
                visibleColumns: this.visibleColumns,
                stickyColumns: this.stickyColumns,
                pagination: this.pagination,
                columnFilters: this.columnFilters
            }
            return data
        },

        onDatePickerFilterConfirm (colName) {
            const datePickerName = `col-${colName}`
            //console.log("ON DATE PICKER FILTER CONFIRM: " + datePickerName)
            let values = this.colDatepickers[datePickerName].value
            this.colDatepickers[datePickerName].value = undefined

            if (values === undefined) return
            if (!Array.isArray(values)) values = [values]

            if (this.colDatePickerFilterReplaceDate !== undefined) {
                const index = this.colDatepickers[datePickerName].dates.indexOf(this.colDatePickerFilterReplaceDate)
                if (index !== -1)
                    this.colDatepickers[datePickerName].dates.splice(index, 1)
                this.colDatePickerFilterReplaceDate = undefined
            }

            for (var x in values) {
                const value = values[x]
                const index = this.colDatepickers[datePickerName].dates.indexOf(value)
                if (index === -1) {
                    this.colDatepickers[datePickerName].dates.push(value)
                    /*switch (typeof value) {
                        case 'string':
                            console.log("FIXED DATE: " + value)
                            this.colDatepickers[datePickerName].push(value)
                            break
    
                        case 'object':
                            console.log("DATE RANGE: " + value.from + " >>> " + value.to)
                            break
                    }*/
                }
            }

            this.setFilter(colName, [...this.colDatepickers[datePickerName].dates])
        },

        datePickerFilterParseEntry (date) {
            if (typeof date === 'string') return date
            else return `${date.from} > ${date.to}`
        },

        removeDatePickerFilter (colName, date, $ev) {
            if ($ev !== undefined) $ev.cancelBubble = true
            const ref = this.colDatepickers[`col-${colName}`]
            //console.log("REMOVE")
            //console.log(ref, date, ref.dates.indexOf(date))
            const index = ref.dates.indexOf(date)
            if (index !== -1)
                ref.dates.splice(index, 1)

            //console.log("PRE SET FILTER")
            this.setFilter(colName, [...ref.dates])
        },

        replaceDatePickerFilter (colName, date) {
            //console.log("REPLACE DATE", colName, date)
            this.colDatePickerFilterReplaceDate = date
            this.$refs[`qDateProxy-head-col-${colName}`].show()
        },

        onDatePickerFilterClose ($ev) {
            this.colDatePickerFilterReplaceDate = undefined
        },


        parseProp (value, name) {
            return $_PARSE_PROP(value, name, this)
        },

        getComponentDefaults () {
            return JSON.parse(JSON.stringify($_COMPONENT_DEFAULTS))
        },
    },

    computed: {

        // row fetch params for getRows()
        fetchParams () {
            let params = {

            }

            if (!_.isEmpty(this.preFilters))
                params.preFilters = { ...this.preFilters }

            //console.log("PAGINATION", this.pagination)
            //if (this.innerPagination !== undefined) {
            params.page = this.innerPagination.page - 1
            params.pageSize = this.innerPagination.rowsPerPage <= 0 ? 9999999999999999999 : this.innerPagination.rowsPerPage
            if (this.innerPagination.sortBy !== null) {
                params.sortBy = this.innerPagination.sortBy
                params.sortDirection = this.innerPagination.descending ? "DESC" : "ASC"
            }
            //}

            let filters = {}
            /*for (let x in this.defaultColumnFilters)
                filters[x] = this.defaultColumnFilters[x]*/
            for (const x in this.currentFilters)
                filters[x] = this.currentFilters[x]
            // console.log("FILTERS?", filters, !_.isEmpty(filters))
            if (!_.isEmpty(filters)) params.filters = filters
            // console.log("FINAL PARAMS", params)
            return params
        },

        // pagination from/to values to use on custom paginator
        paginationFromToValues () {
            const to = this.innerPagination.rowsPerPage * this.innerPagination.page
            const total = this.innerPagination.rowsNumber
            return {
                from: (this.innerPagination.rowsPerPage * (this.innerPagination.page - 1)) + 1,
                to: to > total ? total : to,
                total
            }
        },

        // string (and default) version of paginationLabel
        stringPaginationLabel () {
            return (this.paginationLabel || this.$q.lang.table.pagination)(this.paginationFromToValues.from, this.paginationFromToValues.to, this.paginationFromToValues.total)
        },












        columnsToggleableComputed: function () {
            return this.$_.filter(this.columns, function (col) { return col.columnToggler })
        },

        bulkTogglerColumns: function () {
            let bulkTogglerColumns = []
            if (this.usesBulkTogglers) for (let x in this.rowTogglersColNames) {
                for (let y in this.columns)
                    if (this.columns[y].name === this.rowTogglersColNames[x])
                        bulkTogglerColumns.push(this.columns[y])
            }
            return bulkTogglerColumns
        },

        /*extendedQTableProps: function () {
            const extended = [
                'visibleColumns',
                'columns',
                'rows',
                'rowsPerPageOptions',
                'separator',
                'rowKey',
                'fullscreen',
                'selection',
                'grid',
                'title',
                'pagination'
            ]
        }*/
    },

    /* mounted () {
        for (let x in $_COMPONENT_DEFAULTS.props) {
            //console.log(`-------------melon-list set watch for [${x}]`)
            watch(() => this.$props[x], (newValue, prevValue) => {
                //alert("WATCH")
                //console.log("---- melon-list watch [" + x + "]")
                //console.log("prev y new")
                //console.log(prevValue)
                //console.log(newValue)
                //if (x === 'selectedRows') alert("disparo el watch de selectedRows")
                this[x] = this.parseProp(this.$props[x], x);
                switch (x) {
                    case 'rows':
                        this.rowsUpdated(this.rows, this.rows.length)
                        break

                    case 'rowsPerPageOptions':
                        let max = 0
                        for (x in this.rowsPerPageOptions)
                            if (this.rowsPerPageOptions[x] > max)
                                max = this.rowsPerPageOptions[x]

                        if (this.rowsPerPageOptions.indexOf(this.pagination.rowsPerPage) === -1)
                            this.pagination.rowsPerPage = max

                        //console.log("rowsPerPage: " + this.pagination.rowsPerPage)
                        //if(index)
                        break
                }
            }, { deep: true })
        }

        //for (var x in this.$props)
        //console.log(`:${x}="${x}"`)

        const ctx = this
        if (ctx.getOpts?.auto) {
            //alert("mounted do fetch")
            ctx.doFetch(true)
        }
        else if (ctx.rows.length) {
            ctx.setColumns()
            ctx.setOrigSelectedRows()
        }
    },*/

    /*beforeUnmount () {
        $melon.unsetSaveViewDataGetter(this.saveViewDataUID, this);
    },*/
})

//$melon.components.MelonList = $_COMPONENT

export default $_COMPONENT

export { $_TABLE_EMITS, $_CIMPL_TABLE_COMPONENT_PROPS }