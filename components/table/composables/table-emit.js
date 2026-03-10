import { nextTick } from 'vue'
import _ from 'lodash'

function useCTableEmit (props, emit) {
    const childEmit = (eventName, payload, afterEmit) => {
        console.log(`TABLE CHILD EMIT: ${eventName}`, payload)
        //var afterEmit = false

        const dontGloballyEmit = []

        switch (eventName) {
            case 'update:view-type':
                if (payload.name === currentView.value.name) return
                currentView.value.handler(CTable, false)
                currentView.value = payload
                currentView.value.handler(CTable, true)
                break

            case 'update:view-style':
                if (payload.name === currentViewStyle.value.name) return
                currentViewStyle.value.handler(CTable, false)
                currentViewStyle.value = payload
                currentViewStyle.value.handler(CTable, true)
                break

            case 'update:sorting':
                var current = props.sorting ? props.sorting : {}
                if (payload.direction === '') delete current[payload.name]
                else current[payload.name] = payload.direction
                payload = current
                afterEmit = () => nextTick(() => emit('request'))
                break

            case 'update:filter':
                var current = props.filters ? props.filters : {}
                if (payload.value === '') delete current[payload.col.name]
                else current[payload.col.name] = payload.value.trim().split(',').map(v => v.trim()).filter(v => v !== '')
                afterEmit = () => childEmit('update:filters',
                    current,
                    () => nextTick(() => emit('request'))
                )
                break
        }

        if (!dontGloballyEmit.includes(eventName))
            emit(eventName, payload)

        if (afterEmit) afterEmit()
    }

    return {
        childEmit
    }
}

export {
    useCTableEmit
}