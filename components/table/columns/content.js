/* eslint-disable */

import { computed } from 'vue'
import { $_DEFAULT_CELL, $_DEFAULT_FILTER, $_DEFAULT_EDIT } from "../defaults"

const $_CONTENT_DEFAULT_CELL = {
    content: {
        ...$_DEFAULT_CELL,
        type: 'content'
    }
}

const $_CONTENT_DEFAULT_EDIT = {
    content: {
        ...$_DEFAULT_EDIT,
        type: 'content',
        input: 'input'
    }
}

const $_CONTENT_DEFAULT_FILTER = {
    content: {
        ...$_DEFAULT_FILTER,
        type: 'content',
    },
}

const useContentFilter = function (props, filterProps, filterValue) {
    /* computed *//* computed *//* computed */
    /* computed *//* computed *//* computed */
    /* computed *//* computed *//* computed */

    /* do nothing more with the composable if it's not the proper type */
    if (!filterProps.value.type === 'content') return {}

    /* get 'content' filter classess */
    const contentFilterClassess = computed(() => {
        let res = [
            'cimpl-table-th-filter-element',
            //this.hasFilter ? ''
        ]
        return res
    })

    const content_filterValue = computed(() => {
        console.log("CONTENT FILTER VALUE", filterValue.value)
        return filterValue.value !== undefined ? filterValue.value.trim() : undefined
    })

    /* methods *//* methods *//* methods */
    /* methods *//* methods *//* methods */
    /* methods *//* methods *//* methods */

    /* 'content' filter changed */
    function contentFilterChange () {
        this.hasFilter = this.filterValue.trim() !== ''
        if (this.expanded) return
        if (!this.usesDebounce) this.emitValue()
        else this.debounce(true)
    }

    return {
        //computed
        contentFilterClassess,
        content_filterValue,

        //methods
        contentFilterChange
    }
}

export {
    $_CONTENT_DEFAULT_CELL,
    $_CONTENT_DEFAULT_FILTER,
    $_CONTENT_DEFAULT_EDIT,
    useContentFilter
}