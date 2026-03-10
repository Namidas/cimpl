import './progress/circular.scss'
import { defineComponent, ref, watch, h, computed, Comment } from 'vue'
import { QCircularProgress } from 'quasar'
import { useCompoExtend, compoExtend_get } from './../composables/compoExtend'
import { useProgress } from './progress/composable'
import { commonEmits, commonProps } from './progress/common'
import './progress/defaults'
import defaults from './../utils/defaults'

import _ from 'lodash'

export default defineComponent({
    name: 'CCircularTimedProgress',

    emits: [
        ...commonEmits
    ],

    props: {
        ...compoExtend_get(QCircularProgress, 'props', ['value', 'min', 'max', 'show-value', 'animationSpeed']),
        ...commonProps,

        showValue: {
            required: false,
            type: [Boolean, String, Function],
            default: false
        },

        //count type, 'add' | 'minus' | 'left'
        type: {
            required: false,
            type: String,
            default: 'add'
        }
    },


    setup (props, context) {
        const {
            currentClockTick
        } = useProgress(props, context)

        const {
            extendedPropsProxy
        } = useCompoExtend(QCircularProgress, props, {
            proxy: {
                min: 0,
                max: props.time,
                value: currentClockTick,
                showValue: props.showValue !== false,
                animationSpeed: props.animationSpeed === false ? props.tick : props.animationSpeed
            }
        })

        const defaultSlot = computed(() => {
            if (props.showValue === false) return undefined
            if (context.slots.default) return () => context.slots.default({ min: 0, max: props.time, value: currentClockTick })
            switch (typeof props.showValue) {
                //use QCircularProgress default slot
                case 'boolean':
                    return undefined

                case 'string':
                    var parsingFunction = defaults.get(`cimpl-progress.strings.${props.showValue}`, () => defaults.get('cimpl-progress.strings.default')(props.showValue, 0, props.time, currentClockTick.value, props.type, props.decimals))
                case 'function':
                    if (typeof parsingFunction === 'undefined') var parsingFunction = props.showValue
                    return () => h('span', { class: 'c-circular-timed-progress-inner-wrap' }, parsingFunction(0, props.time, currentClockTick.value, props.type, props.decimals))
            }
            context.slots.default ? () => context.slots.default({ min: 0, max: props.time, value: currentClockTick }) : undefined
        })




        return () => h(QCircularProgress, _.merge({}, extendedPropsProxy,
            {
                class: 'c-circular-timed-progress'
            }), defaultSlot.value)
    }
})