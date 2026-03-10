import { computed } from 'vue'
import { getDefaultsInstance } from "./../../../utils/defaults"
import { inheritSlots } from './../../../utils/render'

function useCTableUtils (props, slots) {
    const computedPropsCache = new Map()
    const getComputedTableProps = (keys, massCache) => {
        if (massCache === undefined) massCache = true
        if (massCache) {
            if (!computedPropsCache.has(keys)) computedPropsCache.set(keys, computed(() => {
                if (props.debugWatch) console.log(`|| CTable compute getComputedTableProps mass`, keys)
                var res = {}
                for (const x in keys) res[keys[x]] = props[keys[x]]
                return res
            }))
            return computedPropsCache.get(keys)
        }
        var res = {}
        for (const x in keys)
            res[x] = getComputedTableProp(keys[x])
        return res
    }
    const getComputedTableProp = (key) => {
        if (!computedPropsCache.has(key)) computedPropsCache.set(key, computed(() => {
            if (props.debugWatch) console.log(`|| CTable compute getComputedTableProp : ${key}`)
            return props[key]
        }))
        return computedPropsCache.get(key)
    }

    const tableConfig = getDefaultsInstance('cimpl-table', props.config)
    //console.log("TABLE CONFIGS", tableConfig)

    const tableLabels = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute tableLabels`)
        const labelGetter = tableConfig.get('labelGetter', string => string)
        const sortingOpts = tableConfig.get('sorting')

        return {
            sorting: {
                select: labelGetter(sortingOpts.labels.select),
                disable: labelGetter(sortingOpts.labels.disable),
                ad: labelGetter(sortingOpts.labels.ad),
                da: labelGetter(sortingOpts.labels.da)
            },
        }
    })

    const getSlot = (search, options) => {
        if (!search) return slots
        return inheritSlots(slots, search, options)
    }

    return {
        //getComputedProps,
        tableConfig,
        tableLabels,
        getSlot,
        //getComputedTableProps,
        //getComputedTableProp
    }
}

export {
    useCTableUtils
}