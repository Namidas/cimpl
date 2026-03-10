import { computed } from 'vue'

function useCTableTools (props, tableConfig) {
    const availableRowTools = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute availableRowTools`)
        var tools = []
        for (const x in props.rowTools) {
            const tool = typeof props.rowTools[x] === 'string' ? tableConfig.get(`rowTools.${props.rowTools[x]}`) : props.rowTools[x]

            if (tool === undefined) continue
            tools.push(tool)
        }
        return tools
    })

    const rowToolsList = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute rowToolsList`)
        return availableRowTools.value.filter(value => value.bulk === undefined || value.bulk === false)
    })

    const rowBulkToolsList = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute rowBulkToolsList`)
        return availableRowTools.value.filter(value => value.bulk === undefined || value.bulk === true)
    })

    return {
        availableRowTools,
        rowToolsList,
        rowBulkToolsList
    }
}

export {
    useCTableTools
}