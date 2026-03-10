import { computed, watchEffect, reactive, ref } from 'vue'
import _ from 'lodash'

const _DEBUG_PARSER = true

function useCSchemaParser (props, schemaConfig) {
    //parse a schema
    const schemaParser = (oSchema) => {
        if (!oSchema) return null

        if (!oSchema.name) {
            console.error("CSchema: ignoring schema without NAME...", oSchema)
            return null
        }

        //this will hold each ORIGINAL entry data
        const oSchemaData = new Map()

        //this will hold each parsed entry data/definition
        const schemaData = reactive(new Map())

        //this will hold the map/tree/nodes definition itself
        const schemaMap = reactive([])

        schemaEntryParser(oSchema, 'schema', oSchemaData, schemaData, schemaMap/*, []*/)

        //schemaData.set('_schema', oSChema)
        //we'll look for ANY change on the original schema and re parse it
        //although internally, we'll compare node by node, just in case
        /*watchEffect(() => {
            if (_DEBUG_PARSER) console.log("CSchema Parser: watchEffect oSchema")
            if (schemaData.get('_oSchema') !== oSchema) {
                if (_DEBUG_PARSER) console.log("different schema, going to parse")
                schemaData.set('_oSchema', oSChema)
                schemaEntryParser(oSchema, 'schema', schemaData, schemaMap, [])
            }
        })*/


        //return schemaEntryParser(_.merge({ type: 'schema' }, /*structuredClone(*/oSchema/*)*/), [], {})

        return /*reactive(*/{
            data: schemaData,
            map: schemaMap
        }/*)*/
    }

    //parse a schema entry
    const schemaEntryParser = (entry, type, oSchemaData, schemaData, schemaMap) => {

        if (!type) {
            console.error("CSchema: ignoring entry without TYPE...", entry)
            return null
        }

        if (!entry.name) {
            console.error("CSchema: ignoring entry without NAME...", entry)
            return null
        }

        const NAME = entry.name

        watchEffect(() => {

            if (type === 'schema') {
                console.log("LIMPIO EL MAPA", schemaMap)
                //schemaMap = reactive([])
                //console.log("FINAL EL MAPA", schemaMap)
                while (schemaMap.length)
                    schemaMap.splice(0, 1)
            }

            if (oSchemaData.get(NAME) === entry) {
                if (_DEBUG_PARSER) console.log("CSchema Parser: SAME ENTRY", entry)
                if (entry.children)
                    schemaEntryParseChildren(entry, schemaMap, oSchemaData, schemaData)
                else {
                    console.log("PUSHEO AL MAPA", entry.name)
                    schemaMap.push({ name: entry.name, children: [] })
                }
                return
            }

            if (_DEBUG_PARSER) console.log("CSchema Parser: watchEffect entry", entry)

            const parsedEntry = reactive(_.merge({ type },
                schemaConfig.get('entries._'), //common
                schemaConfig.get(`entries.${entry.type}`), //type-specific
                {
                    //all the custom mstuff
                },
                entry
            ))

            console.log("parsed entry?", parsedEntry, "type config?", schemaConfig.get(`entries.${entry.type}`))

            delete parsedEntry.children

            oSchemaData.set(NAME, entry)
            schemaData.set(NAME, parsedEntry)

            if (entry.children)
                schemaEntryParseChildren(entry, schemaMap, oSchemaData, schemaData)
            else {
                console.log("PUSHEO AL MAPA", entry.name)
                schemaMap.push({ name: entry.name, children: [] })
            }
        })
    }

    const schemaEntryParseChildren = (entry, schemaMap, oSchemaData, schemaData) => {
        var childrenMap = []
        for (const x in entry.children)
            schemaEntryParser(entry.children[x], entry.children[x].type, oSchemaData, schemaData, childrenMap)
        schemaMap.push(childrenMap)
    }

    const parsedSchema = /*computed(() => */schemaParser(props.schema)/*)*/

    const getEntry = (name) => {
        console.log("GET ENTRY", name, parsedSchema.data.get(name))
        return parsedSchema.data.get(name)
    }

    return {
        schemaParser,
        parsedSchema,
        getEntry
    }
}

export {
    useCSchemaParser
}