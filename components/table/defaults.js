import defaults from './../../utils/defaults'
import CTableToolsView from './components/table-tools/view.vue'

const $_COLUMN_DEFAULT = {
    name: undefined, //name of the column, related to row[field],
    field: undefined, //row field for the column, defaults to [name]
    label: undefined, //column label, defaults to [name]
    filter: true, //use column header filter?,
    filterShowAlways: false, //use a button to add/remove filters or always show the field ?
    filterDebounce: 1000,
    edit: false, //allow cell quick-edit, false | true | 'popup'
    editOn: 'dblclick', // 'click' | 'dblclick' | 'button'

    /*type of row cell, either a string for an embedded type, or a string with name
    of a globally defined compo, or a compo definition*/
    //'date'/'number'/'float'/'amount'/'amount-int'/'string' | 'global-compo-name' | compo-definition
    type: undefined,

    //getters for header label and content
    labelGetter: undefined, //(label) => `label: ${label}`
    contentGetter: undefined, //(value,scope) => `content: ${value}`
    editValueGetter: undefined, //(value,scope) => value

    align: undefined, //text align, if undefined set automatically to the left(numeric/date values to the right)

    //type: 'number'|'float'|'amount' related
    amount_unit: undefined, //can be either a value or a getter row => unit
    amount_decimals: 2, // .toFixed(value)
    amount_empty_decimals: true, //use decimals even when empty? 
    amount_style_decimals: true, // use value<span>decimals</span>
    amount_dash_empty_decimals: true, //make .0 values transparent (still there for screenreaders, and selectable to copy/paste), but draw a dash over them)
    amount_use_flex: false, //wrap values in a flexbox that will push values and units to the sides
    amount_unit_after: false, //render the amount unit before/after the value

    //type: 'float' related
    //float_decimals: 2, // .toFixed(value)

    //type: 'date' related
    /*can be a string, getter function or iterable (array, object, map),
    - string: used as is with quasar's date.formatDate, 
    - function: do whatever you want, BUT ALWAYS return either a single value, or a Map
    - iterable: iterates the provided formats (that can be strings or functions) and creates a map where
        key is the original key, and value the result of that specific format
    the final values MUST be a Map (so be mindful of that when using getter functions) and then a span is created for each value,
    with a classname like 'date-format-{key}'*/
    format: 'DD-MM-YYYY',
    format_direction: 'column', //formats direction 'row'|'column'
    //array or object of icons (string, getter) to use with the resulting formats, use the same keys you use on "format"
    format_icons: undefined,
    //array or object of tooltips (string, getter) to use with the resulting formats, use the same keys you use on "format"
    format_tooltips: undefined,
    //array or object of CSS classess (string, getter that returns an array of strings) to use with the resulting formats, use the same keys you use on "format"
    format_class: undefined,

    //QTable's
    sortable: true,
    sortOrder: '',

    bodyClass: undefined,
    bodyStyle: undefined,
    bodyIcon: undefined,
    bodyIconPosition: 'left',

    headerClass: undefined,
    headerStyle: undefined,
    headerIcon: undefined,
    headerIconPosition: 'left',

    //will use global if undefined, set to false to not use tools in this column
    //array of definitions, special values are 'sort' and 'filter'
    //you can also use boolean true at any index on the array to "inject" defaults
    //columnTools: undefined,
}

defaults.preset('cimpl-table', {
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

    //defaults to this when no column-specific is defined
    labelGetter: label => label, //(label) => `label: ${label}`
    contentGetter: value => value, //(value,scope) => `content: ${value}`
    editValueGetter: value => value, //(value,scope) => vlaue

    labels: {
        views: 'View',
        views_change: 'Change view',
        views_change_style: 'Change style',
        more_options: 'More'
    },

    columnTools: {
        position: 'right', //'top'|'right'|'bottom'|'left'
        filter_position: 'bottom', //'top'|'bottom',

        //items: ['filter', 'sort'],

        /*defs: {
            filter: {
                
            }
        }*/
    },

    rowTools: {
        edit: {
            name: 'edit',
            icon: 'sym_o_edit',
            label: '_Edit',
            handler: (row, col, bulk, confirm) => { console.log("EDIT", row, col, confirm); confirm() }
        }
    },


    tools: {
        view: {
            component: CTableToolsView
        },

        fullscreen: {
            toggle: (CTable) => CTable.fullscreen.value,
            name: 'fullscreen',
            icon: ['fullscreen', 'fullscreen_exit'],
            label: ['_Go fullscreen', '_Exit fullscreen'],
            handler: (CTable) => { console.log('toggle fullscreen?', CTable); return CTable.toggleFullscreen() }
        },
    },

    views: {
        grid: {
            name: 'grid',
            icon: 'sym_o_cards',
            label: '_Grid',
            handler: (table, enable) => { console.log(`change view grid, enable? ${enable ? 'true' : 'false'}`, table) }
        },

        table: {
            name: 'table',
            icon: 'sym_o_table_view',
            label: '_Table',
            handler: (table, enable) => { console.log(`change view table, enable? ${enable ? 'true' : 'false'}`, table) }
        }
    },

    viewStyles: {
        cozy: {
            name: 'cozy',
            icon: 'sym_o_view_cozy',
            label: '_Cozy',
            handler: (table, enable) => { console.log(`change view style cozy, enable? ${enable ? 'true' : 'false'}`, table) }
        },

        compact: {
            name: 'compact',
            icon: 'sym_o_view_compact',
            label: '_Compact',
            handler: (table, enable) => { console.log(`change view style compact, enable? ${enable ? 'true' : 'false'}`, table) }
        }
    },

    //all values can be an array representing enabled/disabled values, or a single string to use on both cases
    //except for component
    filters: {
        icon: ['sym_o_filter_alt_off', 'sym_o_filter_alt'],
        tooltip: ['_clear filter', '_add filter'],
        component: 'input'
    },

    sorting: {
        labels: {
            select: '_change sort',
            disable: '_unsort',
            ad: '_ascending',
            da: '_descencing'
        },
        icons: {
            select: 'sym_o_sort_by_alpha',
            //disable: '_unsort',
            ad: 'sym_o_arrow_upward',
            da: 'sym_o_arrow_downward'
        }
    }
})