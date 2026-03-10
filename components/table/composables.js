import { provide, inject, reactive, watch, watchEffect, computed, onMounted, ref } from 'vue'
import { inheritSlots } from './../../utils/render'
import _ from 'lodash'
import defaults from './../../utils/defaults'

function useProvideCTable (props, slots, getRowKey, emitRowTool, otherStuff) {

    /*var slotsKeys = {}
    watchEffect(() => slotsKeys = Object.keys(slots))*/

    //const toolsList = computed(() => [...props.rowTools])
    const toolsList = computed(() => {
        var tools = []
        for (const x in props.rowTools) {
            const tool = typeof props.rowTools[x] === 'string' ? defaults.get(`cimpl-table.rowTools.${props.rowTools[x]}`) : props.rowTools[x]

            if (tool === undefined) continue
            tools.push(tool)
        }
        return tools
    })
    /*const selection = ref([])
    const isSelected = row => selection.value.indexOf(getRowKey(row)) !== -1
    const paginatedSelection = computed(() => {
        var total = [...selection.value]
        for (const x in props.rows)
            if (isSelected(props.rows[x]))
                total.splice(total.indexOf(isSelected(props.rows[x])), 1)
        return total
    })
    const select = (row, append) => {
        console.log("APPENDING SELECTION", row, append)

        if (typeof row === 'string') switch (row) {
            case 'all':
                for (const x in props.rows)
                    if (!isSelected(props.rows[x]))
                        selection.value.push(getRowKey(props.rows[x]))
                break

            case 'none':
                for (const x in props.rows) {
                    const rowKey = getRowKey(props.rows[x])
                    if (isSelected(props.rows[x]))
                        selection.value.splice(selection.value.indexOf(rowKey), 1)
                }
                break

            case 'invert':
                for (const x in props.rows) {
                    const rowKey = getRowKey(props.rows[x])
                    if (isSelected(props.rows[x]))
                        selection.value.splice(selection.value.indexOf(rowKey), 1)
                    else selection.value.push(rowKey)
                }
                break
        }
        else {
            const rowKey = getRowKey(row)
            const has = isSelected(row)
            switch (props.selection) {
                case 'single':
                    if (!append) selection.value = []
                    else selection.value = [rowKey]
                    break

                case 'multiple':
                    if (!append) {
                        if (has) selection.value.splice(selection.value.indexOf(rowKey), 1)
                    }
                    else if (!has) selection.value.push(rowKey)
                    break
            }
        }
        //console.log("selection res?", selection.value)
    }

    const clearPaginatedSelection = () => {
        console.log("clear paginated selection")
        for (const x in paginatedSelection.value)
            selection.value.splice(selection.value.indexOf(paginatedSelection.value[x]), 1)
    }*/

    const CTable = {
        getSlot (search, options) {
            //console.log("SLOTING", inheritSlots(slots, /body-cell-price(:)/))
            if (!search) return slots
            //console.log("search slot", search, "empty is default?", options)
            return inheritSlots(slots, search, options)
        },
        /*select,
        clearPaginatedSelection,
        isSelected,
        selection,*/
        getRowKey,
        //paginatedSelection,
        toolsList,
        emitRowTool,
        //filters: props.filters

        ...otherStuff
    }

    provide('CTable', CTable)

    return {
        //select,
        //clearPaginatedSelection,
        //isSelected,
        //selection,
        //paginatedSelection,
        toolsList,


        CTable
    }
}

function useCTable () {
    const CTable = inject('CTable', {
        getSlot: () => { },
        //select: () => { },
        //isSelected: () => { },
        //selection: undefined,
        getRowKey: () => { },
        toolsList: undefined,
        emitRowTool: () => { }
        //filters: undefined
    })

    return CTable
}

function useProvideBodyCell (scope, cellType, colType, colName, exposedKey, highlight) {

    /*technically, I see no reason whatsoever why use this inside a CTh, so maybe I can save
    a processor micro-tic and remove cellType from string templates and hardcode it to
    'body' and that's that?*/

    const CTable = useCTable()
    var inheritedSlots = reactive({})
    const cellTypeFull = `${cellType}-cell`
    const cellFullName = `${cellTypeFull}:${colName}:${exposedKey}`

    //console.log("COMPOSABLE EXPOSED", exposedKey)

    watchEffect(() => {
        const got = CTable.getSlot(new RegExp(`^${cellTypeFull}(-type-${colType}|-${colName})?(:content)?$`), { translateNames: false })
        for (const x in got)
            if (x !== cellTypeFull) {
                const translated = x.replace(`${cellTypeFull}-`, '')
                if (inheritedSlots[translated] !== got[x])
                    inheritedSlots[translated] = got[x]
            }
    })

    const value = computed(() => _.get(scope, `row.${_.get(scope, 'col.name')}`))
    const contentGetter = scope.col.contentGetter//defaults.get('cimpl-table.column._.contentGetter')
    const editValueGetter = scope.col.editValueGetter//defaults.get('cimpl-table.column._.contentGetter')

    provide('CTableBodyCell', {
        value,
        editValue: computed(() => editValueGetter !== undefined ? editValueGetter(value.value, scope) : value.value),
        content: computed(() => contentGetter !== undefined ? contentGetter(value.value, scope) : value.value),
        hasSlot: computed(() => inheritedSlots[`${colName}:content`] ? true : (inheritedSlots[`type-${colType}:content`] ? true : (inheritedSlots['content'] ? inheritedSlots['content'] : false))),
        slot: computed(() => inheritedSlots[`${colName}:content`] ? inheritedSlots[`${colName}:content`] : (inheritedSlots[`type-${colType}:content`] ? inheritedSlots[`type-${colType}:content`] : inheritedSlots['content'])),
        scope,
        cellName: cellFullName,
        highlight
    })
}

function useBodyCell () {

    /*var slotsKeys = {}
    watchEffect(() => slotsKeys = Object.keys(slots))*/

    const Cell = inject('CTableBodyCell', {
        value: computed(() => undefined),
        editValue: computed(() => undefined),
        content: computed(() => undefined),
        hasSlot: computed(() => undefined),
        slot: computed(() => undefined),
        scope: undefined,
        cellName: undefined,
        highlight: undefined
    })

    const contentRef = ref(null)

    const highlightContent = () => {
        if (!contentRef.value) return
        //console.log("HIGHLIGHT CONTENT", Content.highlight())
        //console.log(contentRef.value)

        const contentElement = contentRef.value
        const searchTerm = Cell.highlight().trim().split(',').map((it) => it.trim()).filter((it) => it !== '')

        const originalHTML = Cell.content.value

        if (!searchTerm.length) {
            if (contentElement.innerHTML !== originalHTML)
                contentElement.innerHTML = originalHTML
            return
        }

        const searchTermRegex = `(${searchTerm.join(')|(')})`

        const regex = new RegExp(searchTermRegex, 'gi');

        //console.log("REGEX DE BUSQUEDA DE HIGHLIGHT", regex)

        const highlightedHTML = contentElement.innerHTML.replace(regex, match => `<mark class="highlight">${match}</mark>`)
        contentElement.innerHTML = highlightedHTML
    }

    //watch(Cell.highlight, () => highlightContent())

    onMounted(() => {
        //console.log("CONTENT MOUNTED", contentRef.value)
        /*if (Cell.highlight())
            highlightContent()*/
    })

    return {
        Cell,
        contentRef
    }
}

export {
    useProvideCTable,
    useCTable,

    useProvideBodyCell,
    useBodyCell
}