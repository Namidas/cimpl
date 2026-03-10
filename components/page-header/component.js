/* eslint-disable */

import './styles.scss'
import { defineComponent, ref, watch, h, provide } from 'vue'
import { registerStickyElement, unregisterStickyElement } from './../../directives/position-sticky'
//import { $melon } from 'src/boot/melon.window_melon'
import _ from 'lodash'
//import { i18n } from 'src/boot/i18n.js'

import $_DEFAULTS from './defaults.js'
//import $_PARSE_PROP from './functions.js'

const $_COMPONENT = defineComponent({
    name: 'cimpl-page-header',
    tagname: 'cimpl-page-header',

    props: {
        icon: {
            required: false,
            type: String,
            default: undefined
        },

        title: {
            required: false,
            type: String,
            default: undefined,
        },

        caption: {
            required: false,
            type: String,
            default: undefined,
        },

        crumbs: {
            required: false,
            type: [Array, Boolean],
            default: false,
        }
    },

    setup (props) {
        let setupData = {
        }

        return setupData
    },

    data () {
        let dataObject = {
        }
        return dataObject
    },

    computed: {
        instance () { return this },
    },

    methods: {
    },
})

export default $_COMPONENT
