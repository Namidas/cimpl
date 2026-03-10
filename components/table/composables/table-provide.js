import { provide, inject, computed } from 'vue'

function useProvideCTable2 (provided) {
    provide('CTable2', provided)
}

function useInjectCTable (get) {
    const state = inject('CTable2')
    if (get === undefined) return state
    var res = {}
    for (const x in get)
        res[get[x]] = state[get[x]]
    return res
}

export {
    useProvideCTable2,
    useInjectCTable
}