/* eslint-disable */

import { CIMPL_FORM_parseFooterProp } from './../form/utils.js'
import _ from 'lodash'

function CIMPL_PAGE_parseFooterProp ($props) {
    console.log("--- CIMPL_PAGE_parseFooterProp", $props)
    let footerOptions = {
        reveal: false,
        sticky: false,
        proxy: {},
        model: true,
        qFooter: {
        },
    }

    switch (typeof $props) {
        case 'object':
            footerOptions = _.merge({}, footerOptions, $props)
            break

        case 'boolean':
            if ($props === false) footerOptions = false
            break
    }
    console.log("ESTO ES LO QUE SALE", footerOptions)
    return footerOptions
}

function CIMPL_PAGE_parseHeaderProp ($props) {
    let headerOptions = {
        sticky: true,
        proxy: {},
    }

    switch (typeof $props) {
        case 'object':
            headerOptions = _.merge({}, headerOptions, $props)
            break

        case 'boolean':
            if ($props) headerOptions = false
            break
    }

    return headerOptions
}

function CIMPL_PAGE_parseLayoutViewProp (layout, view, headerSticky, footerSticky) {
    if (view === undefined) view = {
        top: ['h', headerSticky ? 'H' : 'h', 'h'],
        middle: ['l', 'p', 'r'],
        bottom: ['f', footerSticky ? 'F' : 'f', 'f']
    }

    switch (typeof layout) {
        case 'string':
            view = CIMPL_PAGE_parseLayoutViewString(layout)
            break

        case 'object':
            const sources = ['top', 'middle', 'bottom']
            for (const x in sources) {
                const source = sources[x]
                if (layout[source] === undefined) continue

                switch (typeof layout[source]) {
                    case 'string':
                        view[source] = layout[source].split('')
                        break

                    case 'object':
                        alert('CIMPL_PAGE_parseLayoutViewProp aca no deberia recibir objecto')
                        break
                }
            }
            break
    }
    return view
}

function CIMPL_PAGE_parseLayoutViewString (layout) {
    const expl = layout.split(' ')
    return {
        top: expl[0].split(''),
        middle: expl[1].split(''),
        bottom: expl[2].split('')
    }
}

export {
    CIMPL_PAGE_parseFooterProp,
    CIMPL_PAGE_parseHeaderProp,
    CIMPL_PAGE_parseLayoutViewProp
}
