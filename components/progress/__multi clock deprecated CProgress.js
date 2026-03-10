import { defineComponent, ref, h, computed, Comment } from 'vue'
import { QTooltip } from 'quasar'
import _ from 'lodash'

export default defineComponent({
    name: 'CProgress',

    props: {
        //time for the timeout (or array), in milliseconds
        time: {
            //required: true,
            required: false,
            type: [Number, Array],
            default: 6000
        },

        //whether to automatically repeat the process every time "time" prop is reached,
        //or a set number of times, or false to don't repeat (or array)
        repeat: {
            required: false,
            type: [Boolean, Number, Array],
            default: false
        },

        //component definition for the clock/s, a component definition or an array of component
        //definitions, you can use boolean true to just show the string with the current time,
        //when undefined/false no visual representation is used
        component: {
            required: false,
            type: [Object, Array, Boolean],
            //default: false
            default: true
        },

        //tooltip text (or array of texts) (when it has a visual representation)
        tooltip: {
            required: false,
            type: [String, Array],
            default: 'hola que tal'
        },

        //speed at which to update/poll the progress of the clock, value or array
        tick: {
            required: false,
            type: [Number, Array],
            default: 100
        },

        //wether to use or not a set of timeout and an interval per clock, one for the clock trigger
        //itself (the timeout), and one to update visuals (the interval), when set to false
        //only the visuals updater timeout is used and you might get a slight difference
        //(upwards) between the actual expected "time" prop and the actual time, for instance:
        //if you had a prop.time of 10, a prop.tick of 3, and prop.precise set to false the actual
        //trigger would happen at 12ms, that's the tick running 4 times before the sum is >= prop.time
        //also, when the component has no visual representation whatsoever, this option is ignored
        precise: {
            required: false,
            type: [Boolean, Array],
            default: false
        },

        //proxy for the component used for the visual representation (or an array of proxies)
        proxy: {
            required: false,
            type: [Object, Array],
            default: {}
        },

        //you can have multiple clocks on a single component instance
        clocks: {
            required: false,
            type: Array,
            default: ['default']
        },

        //auto start the clock? Boolean or array
        autoStart: {
            required: false,
            type: [Boolean, Array],
            default: true,
        }

        /*
        size: {
            required: false,
            default: '45px',
        },

        hook: {
            required: false,
            default: undefined
        },

        circularProgressProxy: {
            required: false,
            type: Object,
            default: {}
        }*/
    },

    emits: [
        'clock:start',
        'clock:tick',
        'clock:trigger',
        'clock:stop'
    ],

    setup (props, { slots, emit, expose }) {

        const $emit = typeof window !== 'undefined' ? emit : null
        /*const clockChecks = ['ping']
        let setupData = {
            innerEvery: ref((0 + props.every) * 1000),
            clockChecks: ref([...clockChecks]),
            hookedTo: ref(props.hook),
            hooks: ref([]),
            uid: ref(_.uniqueId('ping_'))
        }*/

        const normalizedTicks = ref({})
        const clockHandlers = {}
        const clocksProps = computed(() => {
            var clocks = {}
            var a_time = _.isArray(props.time) ? props.time : [props.time]
            var a_repeat = _.isArray(props.repeat) ? props.repeat : [props.repeat]
            var a_component = _.isArray(props.component) ? props.component : [props.component]
            var a_tooltip = _.isArray(props.tooltip) ? props.tooltip : [props.tooltip]
            var a_tick = _.isArray(props.tick) ? props.tick : [props.tick]
            var a_precise = _.isArray(props.precise) ? props.precise : [props.precise]
            var a_proxy = _.isArray(props.proxy) ? props.proxy : [props.proxy]
            var a_autoStart = _.isArray(props.autoStart) ? props.autoStart : [props.autoStart]
            var i_time = -1
            var i_repeat = -1
            var i_component = -1
            var i_tooltip = -1
            var i_tick = -1
            var i_precise = -1
            var i_proxy = -1
            var i_autoStart = -1
            for (const x in props.clocks) {
                const clockName = props.clocks[x]

                i_time++
                i_repeat++
                i_component++
                i_tooltip++
                i_tick++
                i_precise++
                i_proxy++
                i_autoStart++

                if (i_time >= a_time.length) i_time = 0
                if (i_repeat >= a_repeat.length) i_repeat = 0
                if (i_component >= a_component.length) i_component = 0
                if (i_tooltip >= a_tooltip.length) i_tooltip = 0
                if (i_tick >= a_tick.length) i_tick = 0
                if (i_precise >= a_precise.length) i_precise = 0
                if (i_proxy >= a_proxy.length) i_proxy = 0
                if (i_autoStart >= a_autoStart.length) i_autoStart = 0

                const isTextNode = a_component[i_component] === true
                clockHandlers[clockName] = createClockHandler(clockHandlers[clockName])

                clocks[clockName] = {
                    name: clockName,
                    time: a_time[i_time],
                    repeat: a_repeat[i_repeat],
                    component: () => (!props.component ? null : //no visual representation in general
                        (!a_component[i_component] ? null :  //no visuals for this specific clock
                            h('div', { class: 'cimpl-clock-wrapper' }, [
                                h(isTextNode ? 'div' : a_component[i_component], //either a component or a text node
                                    {
                                        ...props.proxy,
                                        value: normalizedTicks.value[clockName]
                                    }, () => [ //children
                                        isTextNode ? 'current-time' : //if it's a text node, show the text...
                                            (slots[clockName] ? slots[clockName] : undefined) //otherwise pass through whatever slot (if any)
                                    ]),
                                a_tooltip[i_tooltip] ? h(QTooltip, null, () => a_tooltip[i_tooltip]) : undefined //finally add the clock tooltip
                            ]))),
                    tooltip: a_tooltip[i_tooltip],
                    tick: a_tick[i_tick],
                    precise: a_precise[i_precise],
                    proxy: a_proxy[i_proxy],
                    autoStart: a_autoStart[i_autoStart],
                }
            }
            return clocks
        })

        const createClockHandler = (clockData) => {
            if (clockData !== undefined) stopClock(clockData)
            return {
                trigger: undefined,
                tick: undefined,
                current_tick: 0,
                //normalized: ref(0),
            }
        }

        const getClockData = (clockData) => typeof clockData === 'string' ? clockHandlers[clockData] : clockData

        const stopClock = (clockData, resetClock, mustEmit) => {
            if (mustEmit === undefined) mustEmit = true
            if (resetClock === undefined) resetClock = false
            const clock = getClockData(clockData)
            if (!clock) return
            const handler = clockHandlers[clock.name]
            if ((handler.trigger || handler.tick) && mustEmit) $emit('clock:stop', clock)
            //console.log("CLOCK STOP", clock)
            handler.trigger = clearTimeout(handler.trigger)
            handler.tick = clearInterval(handler.tick)
            if (resetClock) {
                handler.current_tick = 0
                //handler.normalized = 0
                normalizedTicks.value[clock.name] = 0
            }
        }

        //const createTimeout = (target, name, time, callback) => target[name] = setTimeout(callback, time)

        const startClock = (clockData) => {
            const clock = getClockData(clockData)
            if (!clock) return
            stopClock(clock)
            const handler = clockHandlers[clock.name]
            if (!clock.component || (clock.component && clock.precise)) handler.trigger = setTimeout(() => triggerClock(clock), clock.time)
            if (clock.component) handler.tick = setInterval(() => tickClock(clock), clock.tick)

            $emit('clock:start', clock)
        }

        const tickClock = (clockData) => {
            const clock = getClockData(clockData)
            //console.log(`CLOCK TICK (${!clock.precise ? 'NOT ' : ''} PRECISE)`, clock)
            const handler = clockHandlers[clock.name]
            handler.current_tick += clock.tick
            const normalizedValue = handler.current_tick * 100 / clock.time
            normalizedTicks.value[clock.name] = normalizedValue
            //console.log(`target: ${clock.time} / current: ${handler.current_tick} / norm: ${normalizedValue}`)
            //console.log(normalizedTicks)
            $emit('clock:tick', { clock, tick: handler.current_tick })
            if (!clock.precise && handler.current_tick >= clock.time)
                triggerClock(clock)
        }

        const triggerClock = (clockData) => {
            const clock = getClockData(clockData)
            //console.log("CLOCK TRIGGER", clock)
            stopClock(clock, false, false)
            $emit('clock:trigger', clock)
        }

        if (props.autoStart)
            for (const clockName in clocksProps.value)
                if (clocksProps.value[clockName].autoStart)
                    startClock(clocksProps.value[clockName])

        const visuals = computed(() => {
            if (!props.component) return false
            var result = []
            for (const x in clocksProps.value)
                result.push(clocksProps.value[x].component)
            return result
        })

        expose({ clocksProps })

        return () => visuals.value ? h('div', { class: 'cimpl-timeout' }, [...visuals.value.map((clock) => clock())])
            : h(Comment, 'cimpl-timeout')
    }
})