import { computed, watchEffect } from 'vue'
import _ from 'lodash'

function useCSchemaParser (props, schemaConfig) {

    //parse a schema
    const schemaParser = (oSchema) => {
        if (!oSchema) return null
        return schemaEntryParser(_.merge({ type: 'schema' }, /*structuredClone(*/oSchema/*)*/), [], {})
    }

    //parse a schema entry
    const schemaEntryParser = (entry, currentEntryMap, maps) => {
        var parsedEntry = {}

        //me parece que no hace falta este watchEffect porque ya lo tengo adentro de una computada que llama a schemaParser...
        //watchEffect(() => {
        if (!entry.type) {
            console.error("CSchema: ignoring entry without TYPE...", entry)
            return null
        }

        if (!entry.name) {
            console.error("CSchema: ignoring entry without NAME...", entry)
            return null
        }

        const ignore = ['children', 'map']
        /*I'll remove "uid" and make "name" mandatory, if you need to repeat values or whatever, just use the model prop*/
        //const UID = _.uniqueId(`${entry.name ? entry.name : `type_${entry.type}`}_`)
        //const NAME = entry.name ? entry.name : UID

        //console.log("CURRENT MAP", currentEntryMap)
        var newMap = [
            ...currentEntryMap,
            //entry.uid ? entry.uid : UID
            entry.name
        ]

        maps[/*entry.uid ? entry.uid : UID*/entry.name] = newMap

        //watchEffect(() => {
        parsedEntry = _.merge(parsedEntry,
            schemaConfig.get('entries._'), //common
            schemaConfig.get(`entries.${entry.type}`), //type-specific
            {
                //name: NAME,
                //uid: UID
                name: entry.name
            }
        )


        for (const x in entry)
            if (!ignore.includes(x))
                parsedEntry[x] = entry[x]

        parsedEntry.map = newMap
        parsedEntry.mapString = newMap.join('.')
        //})
        //})

        if (entry.children)
            parsedEntry.children = schemaChildrenParser(entry.children, parsedEntry.map, maps)

        return {
            parsedEntry,
            maps
        }
    }

    //parse entries list, returns map
    const schemaChildrenParser = (children, currentEntriesMap, maps) => {
        const isMap = children instanceof Map
        const iterate = isMap ? Array.from(children) : children
        const res = new Map()
        for (const x in iterate) {
            var tempRes = schemaEntryParser(isMap ? iterate[x][1] : iterate[x], currentEntriesMap, maps)
            ///console.log("TEMPRES", tempRes.parsedEntry)
            res.set(isMap ? iterate[x][0] : x, tempRes.parsedEntry)
        }
        return res
    }

    const parsedSchema = computed(() => {
        const res = schemaParser(props.schema)
        return {
            schema: res.parsedEntry,
            maps: res.maps
        }
    })

    return {
        schemaParser,
        parsedSchema
    }
}

export {
    useCSchemaParser
}