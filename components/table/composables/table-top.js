import { computed } from 'vue'

function useCTableTop (props) {
    const useTableTop = computed(() => true)
    const tableTopProps = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute tableTopProps`)
        return {
            title: props.title,
            tools: props.tools,
            toolsNum: props.toolsNum
        }
    })

    return {
        useTableTop,
        tableTopProps
    }
}


export {
    useCTableTop
}