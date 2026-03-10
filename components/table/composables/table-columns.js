import { computed, watchEffect } from 'vue'
import _ from 'lodash'

function useCTableColumns (props, tableConfig) {

    const getAutoType = (value) => {
        const typeOf = typeof value
        if (typeOf !== 'number' && ((value instanceof Date && !isNaN(value)) || (!isNaN(new Date(value).getTime())))) return 'date'
        switch (typeof value) {
            case 'string':
                if (parseFloat(value).toString() === value) return value.includes('.') ? 'float' : 'number'
                return 'string'

            case 'number':
                return value.toString().includes('.') ? 'float' : 'number'

            default:
                return typeof value
        }
    }

    const getAutoAlign = (type) => {
        const right = ['date', 'number', 'float', 'amount'/*, 'amount-int'*/]
        return right.includes(type) ? 'right' : 'left'
    }

    var lastValidColumnsDefinition = []
    const columnsDefinition = computed(() => {
        if (props.debugWatch) console.log("|| CTable compute columnsDefinition")
        var cols = []
        //this one is to still show THEAD even if when we  have no column definitions and/or
        //rows to get them from
        if (!props.columns && (!props.rows || !props.rows.length))
            return lastValidColumnsDefinition

        //get from props.columns, compute from first row otherwise
        const columnsBaseDefinitions = props.columns ? props.columns :
            Object.keys(props.rows[0]).map((colName) => {
                const type = getAutoType(props.rows[0][colName])
                return _.merge({}, { name: colName, label: colName, type, align: getAutoAlign(type) })
            })

        console.log("BASE DEFINITIONS", columnsBaseDefinitions)

        if (props.selection !== 'none')
            columnsBaseDefinitions.unshift({
                name: 'row-select',
                type: 'special-col'
            })

        if (props.rowTools)
            columnsBaseDefinitions.push({
                name: 'row-tools',
                type: 'special-col'
            })

        for (const x in columnsBaseDefinitions) {
            const baseColumn = columnsBaseDefinitions[x]
            if (baseColumn.type === 'special-col') {
                cols.push(baseColumn)
                continue
            }
            const columnName = baseColumn.name
            if (columnName === undefined)
                console.error('CTable: column definition has no name', baseColumn)

            if (baseColumn.field === undefined)
                baseColumn.field = columnName

            if (baseColumn.align === undefined) {
                baseColumn.align = 'left'
                if (props.rows && props.rows.length)
                    baseColumn.align = getAutoAlign(props.rows[0][baseColumn.field])
            }

            if (props.excludeColumns.includes(columnName))
                continue

            const columnType = _.get(baseColumn, 'type',
                _.get(props.columnsCommonProps, 'type',
                    tableConfig.get('column._.type', 'text')))

            const col = _.merge({},
                tableConfig.get('column._', {}),
                tableConfig.get(`column.${columnType}`, {}),
                props.columnsCommonProps,
                { type: columnType },
                baseColumn,
                _.get(props.columnsProps, columnName, {})
            )

            console.log("RESULTING COL", col)
            console.log("FROM DEFINED", _.get(props.columnsProps, columnName, {}))

            cols.push(col)
        }
        lastValidColumnsDefinition = cols
        return cols
    })

    const totalColumns = computed(() => {
        if (props.debugWatch) console.log("|| CTable compute totalColumns")
        var cols = columnsDefinition.value.length
        return cols
    })

    //essentially same as above, only we'll override a few things specifically for QTable
    const columnsDefinition4QTable = computed(() => {
        if (props.debugWatch) console.log("|| CTable compute columnsDefinition4QTable")
        var cols = []
        for (const x in columnsDefinition.value)
            cols.push({
                ...columnsDefinition.value[x],
                sortable: false
            })
        return cols
    })

    const colNameToIndexMap = computed(() => {
        if (props.debugWatch) console.log("|| CTable compute colNameToIndexMap")
        const map = {}
        columnsDefinition.value.forEach((col, index) => {
            map[col.name] = index
        });
        return map
    })

    //get a column definition by index or column name
    const getColumnDefinition = (index) => {
        if (!totalColumns.value) return undefined
        if (typeof index === 'number') return columnsDefinition.value[index]
        return columnsDefinition.value.find(el => el.name === index)
    }

    const columnValuesCache = new Map()
    const getColumnValues = (key) => {
        const index = typeof key === 'string' ? colNameToIndexMap.value[key] : key
        if (index === undefined) return undefined
        if (!columnValuesCache.has(index))
            columnValuesCache.set(index, computed(() => {
                const col = getColumnDefinition(index)
                if (props.debugWatch) console.log(`|| CTable compute columnValue.${col.name}`)
                const labelGetter = col.labelGetter ? col.labelGetter : tableConfig.get('labelGetter')

                /*var columnTools = col.columnTools
                var globalColumnTools = tableConfig.get('columnTools.items')
                if(columnTools !== false)*/

                return {
                    colDef: col,
                    label: labelGetter(col.label)?.toUpperCase(),
                    isSpecial: col.type === 'special-col',
                    hasTools: col.filterShowAlways || col.sortable,
                    toolsPosition: tableConfig.get('columnTools.position'),
                    filterPosition: tableConfig.get('columnTools.filter_position')
                }
            }))
        return columnValuesCache.get(index)
    }

    const columnSortCache = new Map()
    columnSortCache.set('*', computed(() => props.sorting))
    const getColumnSort = (key) => {
        if (key === undefined) return columnSortCache.get('*')
        if (!columnSortCache.has(key)) columnSortCache.set(key, computed(() => {
            if (props.debugWatch) console.log(`|| CTable compute columnSort.${key}`)
            return props.sorting[key]
        }))
        return columnSortCache.get(key)
    }

    const columnFilterCache = new Map()
    columnFilterCache.set('*', computed(() => props.filters))
    const getColumnFilter = (key) => {
        if (key === undefined) return columnFilterCache.get('*')
        if (!columnFilterCache.has(key)) columnFilterCache.set(key, computed(() => {
            if (props.debugWatch) console.log(`|| CTable compute columnFilter.${key}`)
            return props.filters[key]
        }))
        return columnFilterCache.get(key)
    }

    return {
        columnsDefinition,
        totalColumns,
        columnsDefinition4QTable,
        getColumnValues,
        getColumnSort,
        getColumnFilter
        //getColumnDefinition,
        //getReactiveColumnDefinition
    }
}


export {
    useCTableColumns
}