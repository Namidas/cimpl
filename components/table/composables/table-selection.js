import { ref, computed } from 'vue'

function useCTableSelection (props, getRowKey) {

    const selection = ref(new Map())

    const isSelected = row => {
        console.log("useCTableSelection.isSelected?", row)
        return selection.value.has(typeof row === 'object' ? getRowKey(row) : row)
    }

    const paginatedSelection = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute paginatedSelection`)
        var total = new Map(selection.value)
        for (const x in props.rows) {
            const rowKey = getRowKey(props.rows[x])
            if (selection.value.has(rowKey))
                total.delete(rowKey)
        }
        return total
    })

    const select = (row, append) => {
        console.log("APPENDING SELECTION", row, append)

        if (typeof row === 'string') for (const x in props.rows) {
            const rowKey = getRowKey(props.rows[x])
            switch (row) {
                case 'all':
                    if (!selection.value.has(rowKey))
                        selection.value.set(rowKey, props.rows[x])
                    break

                case 'none':
                    selection.value.delete(rowKey)
                    break

                case 'invert':
                    if (selection.value.has(rowKey))
                        selection.value.delete(rowKey)
                    else selection.value.set(rowKey, props.row[x])
                    break
            }
        }
        else {
            const rowKey = getRowKey(row)
            const has = selection.value.has(rowKey)
            switch (props.selection) {
                case 'single':
                    if (!append) selection.value = new Map()
                    else selection.value = (new Map()).set(rowKey, row)
                    break

                case 'multiple':
                    if (!append) {
                        if (has) selection.value.delete(rowKey)
                    }
                    else if (!has) selection.value.set(rowKey, row)
                    break
            }
        }
    }

    const clearPaginatedSelection = () => {
        console.log("clear paginated selection")
        for (const [key, value] of paginatedSelection.value)
            selection.value.delete(key)
    }


    const selectAll = () => select('all')
    const selectInvert = () => select('invert')
    const selectNone = () => select('none')

    return {
        selection,
        isSelected,
        paginatedSelection,
        clearPaginatedSelection,
        select,
        selectAll,
        selectInvert,
        selectNone
    }
}

export {
    useCTableSelection
}