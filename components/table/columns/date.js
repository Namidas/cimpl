/* eslint-disable */

import { computed } from 'vue'
import { $_DEFAULT_CELL, $_DEFAULT_FILTER, $_DEFAULT_EDIT } from "../defaults"

const $_DATE_DEFAULT_CELL = {
    date: {
        ...$_DEFAULT_CELL,
        type: 'date',

        /* date format, the full form is an object like this:
        {
            format: [date-format] //string
            icon: {
                //object with icon data
                //any valid prop for a q-icon
            },
            class: //CSS class, array or string
            style: /CSS styles, object or string
        }
        
        can be a single string, in which case it's used as the field 'format' and the
        rest of the values default to false (or whatever) or a function that returns either
        a string or an object

        same for the value of [icon], can be a string with just the name of the icon (and use the rest as defaults)
        
        it can also be an array of string/objects representing different lines to render the format */
        //dateFormat: 'YYYY-MM-DD HH:mm:ss'
        dateFormat: 'YYYY/MM/DD',

        /*mask (dateformat) for q-calendar model */
        mask: 'YYYY/MM/DD',

        /* binds for the q-time, when [type] is 'date-time' */
        timeBind: {}
    }
}
$_DATE_DEFAULT_CELL['time'] = { ...$_DATE_DEFAULT_CELL.date, type: 'time' }
$_DATE_DEFAULT_CELL['date-time'] = { ...$_DATE_DEFAULT_CELL.date, type: 'date-time' }
$_DATE_DEFAULT_CELL['date-time-each'] = { ...$_DATE_DEFAULT_CELL.date, type: 'date-time-each' }

const $_DATE_DEFAULT_EDIT = {
    date: {
        ...$_DEFAULT_EDIT,
        type: 'date',
        //input: 'input'

        /* use native <input type="date" /> for in-place edit */
        native: false,

        // date mask for components
        //mask: 'YYYY/MM/DD'

        inheritableProps: [
            'mask'
        ]
    }
}
$_DATE_DEFAULT_EDIT['time'] = { ...$_DATE_DEFAULT_EDIT.date, type: 'time' }
$_DATE_DEFAULT_EDIT['date-time'] = { ...$_DATE_DEFAULT_EDIT.date, type: 'date-time' }
$_DATE_DEFAULT_EDIT['date-time-each'] = { ...$_DATE_DEFAULT_EDIT.date, type: 'date-time-each' }

const $_DATE_DEFAULT_FILTER = {
    date: {
        ...$_DEFAULT_FILTER,
        type: 'date',
    },
}
$_DATE_DEFAULT_FILTER['time'] = { ...$_DATE_DEFAULT_FILTER.date, type: 'time' }
$_DATE_DEFAULT_FILTER['date-time'] = { ...$_DATE_DEFAULT_FILTER.date, type: 'date-time' }
$_DATE_DEFAULT_FILTER['date-time-each'] = { ...$_DATE_DEFAULT_FILTER.date, type: 'date-time-each' }

export {
    $_DATE_DEFAULT_CELL,
    $_DATE_DEFAULT_FILTER,
    $_DATE_DEFAULT_EDIT
}