import { computed } from 'vue'
import { QTd } from 'quasar'
import _ from 'lodash'
import { pickFirst } from './../../../utils/pickFirst'

function useCTableRows (props, tableConfig, getColumnValues, getSlot) {
    //get row's key value
    const getRowKey = row => typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey]

    const getRow = index => props.rows[index]

    /*const getCellValue = (rowIndex, colIndex) => {
        const colValues = getColumnValues(colIndex)
        const row = getRow(rowIndex)
        const cellValue = row[colValues.value.colDef.name]
        return cellValue
    }*/

    const getCellValues = (rowIndex, colIndex) => {
        //console.log("GET CELL VALUES", rowIndex, colIndex)
        return computed(() => {
            if (props.debugWatch) console.log(`|| CTable compute getCellValues(${rowIndex},${colIndex}) compute`)
            const colValues = getColumnValues(colIndex)
            const exposedKey = `${rowIndex}.${colIndex}-${colValues.value.colDef.name}`
            if (props.debugWatch) console.log(`|| CTable compute cellValues.${exposedKey}`)
            const row = getRow(rowIndex)
            const cellValue = row[colValues.value.colDef.name]
            const contentGetter = colValues.value.colDef.contentGetter ? colValues.value.colDef.contentGetter : tableConfig.get('contentGetter')
            const cellContent = contentGetter(cellValue)
            const editValueGetter = colValues.value.colDef.editValueGetter ? colValues.value.colDef.editValueGetter : tableConfig.get('editValueGetter')
            const cellEditValue = editValueGetter(cellValue)
            const colType = colValues.value.colDef.type
            const colName = colValues.value.colDef.name
            const inheritedSlots = getSlot(new RegExp(`^body-cell(-type-${colType}|-${colName})?$`), { translateNames: false })
            const slot = pickFirst(inheritedSlots[`body-cell-${colName}`], inheritedSlots[`body-cell-type-${colType}`], inheritedSlots['body-cell'])

            var cssClass = colValues.value.colDef.bodyClass
            var cssStyle = colValues.value.colDef.bodyStyle
            var icon = colValues.value.colDef.bodyIcon

            if (typeof cssClass === 'function') cssClass = cssClass(row, colValues.value.colDef)
            if (typeof cssStyle === 'function') cssStyle = cssStyle(row, colValues.value.colDef)
            if (typeof icon === 'function') icon = icon(row, colValues.value.colDef)
            if (icon && typeof icon !== 'object') icon = [icon]


            //console.log("COL?", colValues.value.colDef)
            //console.log("row?", row)
            //console.log("cellValue?", cellValue)
            return {
                ...colValues.value,
                cellValue,
                cellContent,
                cellEditValue,
                exposedKey,
                isSpecial: colValues.value.colDef.type === 'special-col',
                hasTDSlot: slot !== undefined,
                tdSlot: slot ? slot : QTd,

                cssClass,
                cssStyle,
                icon
            }
        })
    }


    return {
        getRowKey,
        getRow,
        getCellValues
    }
}


export {
    useCTableRows
}