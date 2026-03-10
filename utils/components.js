/* eslint-disable */

import plain_copy from "./plain_copy"

/*get closest parent component from [source] (cheks the source as well if (self = true)*/
const getClosestParentComponent = function (name, source, self) {
    if (self === undefined) self = false
    if (self) if (source.$.type.name === name) return source
    let target = source.$parent
    while (target.$.type.name !== name && target.$parent) {
        //console.log("ciclo", target.$.type.name, target.$.type)
        target = target.$parent
    }
    return target.$.type.name === name ? target : false
}

/* get closest parent component from [source] having props from [props], [undefinedIsAny] (final param)
indicates if the value undefined should be used as "has key, accept any value", otherwise props
in [props] are compared as-is (must explicitly have each prop with identical value), when [props]
is an array, it's converted into an object with it's values set as { [key]:undefined } and
[undefinedIsAny] is automatically set to true */
function checkProps (source, props, undefinedIsAny) {
    const debug = _.get(source.$options, 'name') === 'cimpl-table'
    //console.log("source name", _.get(source.$options, 'name'))
    // if (debug) console.log("checkProps", props)
    if (undefinedIsAny === undefined) undefinedIsAny = true
    let res = true
    let innerProps = plain_copy(props)
    if (Array.isArray(props)) {
        innerProps = {}
        for (const x in props)
            _.set(innerProps, props[x], undefined)
        undefinedIsAny = true
    }
    // if (debug) console.log("-- innerProps", innerProps)
    for (const key in innerProps) {
        // if (debug) console.log("-- ciclo", key)
        // if (debug) console.log("has?", _.has(source, key))
        if (_.has(source, key)) {
            if (!(undefinedIsAny && _.get(innerProps, key, undefined) === undefined ? true : _.get(innerProps, key) === _.get(source, key)))
                res = false
        }
        else {
            res = false
        }
    }
    // console.log("res?", res)
    return res
}
function getClosestParentComponentHaving (props, source, self, undefinedIsAny) {
    // console.log("get closest having")
    // console.log(props)
    // console.log(source)
    // console.log(self)
    if (self === undefined) self = false
    if (self) if (checkProps(source, props, undefinedIsAny) === true) return source
    let target = source.$parent
    // console.log("first target?", target)
    while (checkProps(target, props, undefinedIsAny) === false && target.$parent) {
        target = target.$parent
        // console.log("target?", target)
    }
    return checkProps(target, props, undefinedIsAny) === true ? target : false
}

/*get component slots that start with [search]*/
function getComponentSlots ($slots, search) {
    const keys = Object.keys($slots)
    const slots = []
    //console.log("GET COMPO SLOTS " + search)
    console.log(Object.keys($slots))
    for (const x in keys) {
        const key = keys[x]
        if (key.startsWith(search)) {
            const slotName = key.substring(search.length)
            slots.push(slotName)
        }
    }
    return slots
}

function inheritComponentSlots($slots,search,scope)
{
    if(scope === undefined) scope = {}
    const keys = Object.keys($slots)
    const slots = {}
    //console.log("inheritSlots SLOTS " + search)
    //console.log(Object.keys($slots))
    for (const x in keys) {
        const key = keys[x]
        if (key.startsWith(search)) {
            const slotName = key.substring(search.length)
            slots[slotName] = () => $slots[key](scope)
        }
    }
    return slots
}

const exports = {
    getClosestParentComponent,
    getClosestParentComponentHaving,
    getComponentSlots,
    inheritComponentSlots
}

export {
    getClosestParentComponent,
    getClosestParentComponentHaving,
    getComponentSlots,
    inheritComponentSlots
}
export default exports
