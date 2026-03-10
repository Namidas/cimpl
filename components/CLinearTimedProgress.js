import './progress/linear.scss'
import { defineComponent, h, computed, cloneVNode } from 'vue'
import { QLinearProgress } from 'quasar'
import { useCompoExtend, compoExtend_get } from './../composables/compoExtend'
import { useProgress } from './progress/composable'
import { commonEmits, commonProps } from './progress/common'
import './progress/defaults'
import defaults from './../utils/defaults'

import _ from 'lodash'

export default defineComponent({
    name: 'CLinearTimedProgress',

    emits: [
        ...commonEmits
    ],

    props: {
        ...compoExtend_get(QLinearProgress, 'props', ['value', 'animationSpeed']),
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
        },

        //don't use 2 layers of text/slots, above and below the progress bar
        noBackdrop: {
            required: false,
            type: Boolean,
            default: false
        }
    },


    setup (props, context) {
        const {
            normalizedClockTick,
            currentClockTick
        } = useProgress(props, context)

        const {
            extendedPropsProxy
        } = useCompoExtend(QLinearProgress, props, {
            proxy: {
                value: normalizedClockTick,
                animationSpeed: props.animationSpeed === false ? props.tick : props.animationSpeed
            }
        })

        const defaultSlot = computed(() => {
            if (props.showValue === false) return undefined
            if (context.slots.default) return () => context.slots.default({ min: 0, max: props.time, value: currentClockTick })
            switch (typeof props.showValue) {
                //use QLinearProgress default slot
                case 'boolean':
                    return undefined

                case 'string':
                    var parsingFunction = defaults.get(`cimpl-progress.strings.${props.showValue}`, () => defaults.get('cimpl-progress.strings.default')(props.showValue, 0, props.time, currentClockTick.value, props.type, props.decimals))
                case 'function':
                    if (typeof parsingFunction === 'undefined') var parsingFunction = props.showValue
                    return () => h('span', { class: 'cimpl-linear-timed-progress-inner-wrap' }, parsingFunction(0, props.time, currentClockTick.value, props.type, props.decimals))
            }
            context.slots.default ? () => context.slots.default({ min: 0, max: props.time, value: currentClockTick }) : undefined
        })

        /*const linearSlots = computed(() => {
            return () => props.noBackdrop ? defaultSlot.value :
                (_.isArray(defaultSlot.value) ? [defaultSlot.value[0], cloneVNode(defaultSlot.value[0], { class: 'top' })] :
                    [defaultSlot.value(), cloneVNode(defaultSlot.value(), { class: 'top' })]
                )
        })*/

        return () => h(QLinearProgress, _.merge({}, extendedPropsProxy,
            {
                class: ['cimpl-linear-timed-progress', !props.noBackdrop ? 'uses-backdrop-text' : null]
            }), /*linearSlots.value*/defaultSlot.value)
    }
})