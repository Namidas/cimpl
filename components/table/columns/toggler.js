/* eslint-disable */

import { computed, ref } from 'vue'
import { $_DEFAULT_CELL, $_DEFAULT_FILTER, $_DEFAULT_EDIT } from "../defaults"

const INDETERMINATE_VALUE_AS_CLEAR = '_INDETERMINATE_CLEAR_VALUE_'
const CLEAR_VALUE = 'foo.clear'

const $_TOGGLER_DEFAULTS = {
    /* represent the content/filter as dropdown with available values */
    dropdown: true,

    /* array of available values, in order: true, false, indeterminate
    each member of the array can be a value for the state, or an array containing 2 elements [value,label],
    at least 2 values have to be provided, but a third one is accepted as well, implying the use of 'intedeterminate' */
    values: [
        [true, 'foo.yes'],
        [false, 'foo.no']
    ]
}

const $_TOGGLER_FILTER_EDIT_DEFAULTS = {
    /* this value is only used when dropdown:false and uses indeterminate value,
    then we need to add an extra icon to represent the 'clear' state of the filter */
    placeholderIcon: 'border_inner',
    placeholderSize: 'sm',

    /* props that can be inherited from cell definition */
    inheritableProps: [
        'dropdown',
        'values'
    ],
}

const $_TOGGLER_FILTER_DEFAULTS = {

}

const $_TOGGLER_EDIT_DEFAULTS = {
    /* edit in place ?
    when this is true, cell content/component will be based on [dropdown] and whatever done
    with it directly fire onCellQuickEdit, otherwise it'll use a popup dialog with a
    dropdown, can be false (to use the same [values] as [edit]) or an array of values with the same format as [values]
    */
    inPlace: true
}

const $_TOGGLER_DEFAULT_CELL = {
    checkbox: {
        ...$_DEFAULT_CELL,
        ...$_TOGGLER_DEFAULTS,
        type: 'checkbox',
    },

    toggle: {
        ...$_DEFAULT_CELL,
        ...$_TOGGLER_DEFAULTS,
        type: 'toggle',
    }
}

const $_TOGGLER_DEFAULT_EDIT = {
    checkbox: {
        ...$_DEFAULT_EDIT,
        //...$_TOGGLER_DEFAULTS,
        ...$_TOGGLER_FILTER_EDIT_DEFAULTS,
        ...$_TOGGLER_EDIT_DEFAULTS,
        type: 'checkbox',
    },

    toggle: {
        ...$_DEFAULT_EDIT,
        //...$_TOGGLER_DEFAULTS,
        ...$_TOGGLER_FILTER_EDIT_DEFAULTS,
        ...$_TOGGLER_EDIT_DEFAULTS,
        type: 'toggle',
    }
}

const $_TOGGLER_DEFAULT_FILTER = {
    checkbox: {
        ...$_DEFAULT_FILTER,
        //...$_TOGGLER_DEFAULTS,
        ...$_TOGGLER_FILTER_EDIT_DEFAULTS,
        ...$_TOGGLER_FILTER_DEFAULTS,
        type: 'checkbox',
    },

    toggle: {
        ...$_DEFAULT_FILTER,
        // ...$_TOGGLER_DEFAULTS,
        ...$_TOGGLER_FILTER_EDIT_DEFAULTS,
        ...$_TOGGLER_FILTER_DEFAULTS,
        type: 'toggle',
    }
}

export {
    INDETERMINATE_VALUE_AS_CLEAR,
    CLEAR_VALUE,
    $_TOGGLER_DEFAULT_CELL,
    $_TOGGLER_DEFAULT_FILTER,
    $_TOGGLER_DEFAULT_EDIT
}