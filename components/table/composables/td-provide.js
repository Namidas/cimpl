import { computed, provide, inject, onMounted, ref, watch } from 'vue'
import { pickFirst } from './../../../utils/pickFirst'

function useProvideBodyCell (colValues, cellValues, getSlot, tableProps, scope, getColumnFilter/*, cellType, colType, colName, exposedKey, highlight*/) {
    const cellInject = computed(() => {
        console.log("|| CTd useProvideBodyCell -> cellInject -> compute")
        //console.log("creo que es porque no se cachea esta computada y los edit (incell/popup) la usan, entonces generan una nueva")
        //console.log("aunque eso explicaría porque veo este log cada vez que entro en 'modo editar', pero no verlo otra vez al cancelar")
        //console.log("no....creo que no...porque esta computada se crea en TD, el único que llama a useProvideBodyCell, asique técnicamente por crear una nueva computada no es, debería ser siempre la misma...(dentro de todos los que inyectan en una misma celda)")
        //console.log("--------------------")
        const colName = colValues.value.colDef.name
        const colType = colValues.value.colDef.type
        const cellType = 'body'
        const exposedKey = cellValues.value.exposedKey

        const cellTypeFull = `${cellType}-cell`
        const cellFullName = `${cellTypeFull}:${colName}:${exposedKey}`

        const inheritedSlots = {}
        const got = getSlot(new RegExp(`^${cellTypeFull}(-type-${colType}|-${colName})?:content$`), { translateNames: false })
        for (const x in got)
            if (x !== cellTypeFull) {
                const translated = x.replace(`${cellTypeFull}-`, '').replace(`${cellTypeFull}:`, '')
                inheritedSlots[translated] = got[x]
            }


        const slot = pickFirst(inheritedSlots[`${colName}:content`], inheritedSlots[`type-${colType}:content`], inheritedSlots['content'])
        const hasSlot = slot !== undefined

        //const editValueGetter = scope.col.editValueGetter//defaults.get('cimpl-table.column._.contentGetter')

        return {
            //value: 'asd',
            //content: 'asd',
            //editValue: 'asd',
            value: cellValues.value.cellValue,
            content: cellValues.value.cellContent,
            editValue: cellValues.value.cellEditValue,
            //hasSlot: false,
            hasSlot,
            //slot: undefined,
            slot,
            scope,
            //scope: {  ///<<<---- acá está el problema

            //...scope.value

            //props: scope.value.props,
            //col: scope.value.col,

            //saving: scope.value.saving,
            //cellContentProps: scope.value.cellContentProps,
            //editProps: scope.value.editProps,
            //innerProps: scope.value.innerProps,
            //triggerCellEdit: scope.value.triggerCellEdit

            //...scope.value.mainCompoProps,
            //...scope.value.slotProps
            //},
            //scope,
            cellName: cellFullName,
            //cellName: 'asd',
            //useHighlight: false,
            //highlight: undefined
            useHighlight: tableProps.highlightResults,
            highlight: tableProps.highlightResults ? getColumnFilter(colValues.value.colDef.name) : undefined
        }

    })

    provide('CTableBodyCell', cellInject)
}

function useBodyCell () {
    const Cell = inject('CTableBodyCell')
    const contentRef = ref(null)


    const highlightContent = () => {
        //console.log("HIGHLIGHT CONTENT", contentRef.value, Cell.value.highlight.value)
        if (!contentRef.value) return
        //console.log("HIGHLIGHT CONTENT", Content.highlight())
        //console.log(contentRef.value)

        const contentElement = contentRef.value
        const searchTerm = Cell.value.highlight.value

        const originalHTML = Cell.value.content
        if (!searchTerm || !searchTerm.length) {
            if (contentElement.innerHTML !== originalHTML)
                contentElement.innerHTML = originalHTML
            return
        }

        const searchTermRegex = `(${searchTerm.join(')|(')})`

        const regex = new RegExp(searchTermRegex, 'gi');

        //console.log("REGEX DE BUSQUEDA DE HIGHLIGHT", regex)

        const highlightedHTML = originalHTML.replace(regex, match => `<mark class="highlight">${match}</mark>`)
        contentElement.innerHTML = highlightedHTML
    }

    watch(Cell.value.highlight, () => highlightContent())

    /*onMounted(() => {
        //console.log("CONTENT MOUNTED", contentRef.value)
        if (Cell.value.highlight.value)
            highlightContent()
    })*/

    return {
        Cell,
        contentRef
    }
}

export {
    useProvideBodyCell,
    useBodyCell
}