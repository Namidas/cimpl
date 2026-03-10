import { ref, computed, onMounted, onBeforeUnmount, isRef } from 'vue'

export function useProgress (props, context, expose) {
    if (expose === undefined) expose = true
    const $emit = context.emit ? context.emit : () => { }
    const currentClockTick = ref(0)
    const normalizedClockTick = computed(() => currentClockTick.value / props.time)

    const isPaused = ref(false)
    const handlers = {
        trigger: undefined,
        tick: undefined
    }

    function clearTimers () {
        handlers.trigger = clearTimeout(handlers.trigger)
        handlers.tick = clearInterval(handlers.tick)
    }

    function createTimers (targetTime) {
        handlers.targetTime = targetTime
        if (props.precise) handlers.trigger = setTimeout(() => triggerClock(), targetTime)
        handlers.tick = setInterval(() => tickClock(), props.tick)
    }

    function stopClock (resetClock, mustEmit) {
        //console.log("// STOP CLOCK")
        clearTimers()
        if (mustEmit === undefined) mustEmit = true
        if (resetClock === undefined) resetClock = false
        if ((handlers.trigger || handlers.tick) && mustEmit) $emit('clock:stop')
        if (resetClock) {
            //console.log("...AND RESET")
            handlers.targetTime = 0
            currentClockTick.value = 0
            isPaused.value = false
        }
    }

    function startClock (targetTime) {
        clearTimers()
        //console.log("// START CLOCK")
        if (targetTime === undefined) targetTime = props.time
        //console.log(`TARGET TIME: ${targetTime} // CURRENT TICK: ${currentClockTick.value}`)
        createTimers(targetTime)
        $emit('clock:start')
    }

    function restartClock () {
        stopClock(true)
        startClock()
    }

    function tickClock () {
        currentClockTick.value += props.tick
        //console.log("//TICK " + currentClockTick.value + "  isref? " + (isRef(currentClockTick) ? 'true' : 'false'))
        $emit('clock:tick', currentClockTick.value)
        if (!props.precise && currentClockTick.value >= props.time)
            triggerClock()
    }

    function triggerClock () {
        //console.log("//TRIGGER")
        //stopClock(false, false)
        clearTimers()
        $emit('clock:trigger')
    }

    function pauseClock () {
        if (isPaused.value) return
        isPaused.value = true
        clearTimers()
        $emit('clock:pause')
    }

    function playClock () {
        if (!isPaused.value) return
        $emit('clock:play')
        startClock(handlers.targetTime - currentClockTick.value)
    }

    function toggleClock () {
        $emit('clock:toggle')
        if (isPaused.value) playClock()
        else pauseClock()
    }

    onMounted(() => { /*console.log("* clock mounted"); */props.autoStart ? restartClock() : null })
    onBeforeUnmount(() => { /*console.log("* clock before unmount"); */stopClock() })

    if (expose) context.expose({
        toggleClock,
        stopClock,
        startClock,
        restartClock,
        pauseClock,
        playClock,
        triggerClock
    })

    return {
        currentClockTick,
        normalizedClockTick
    }
}