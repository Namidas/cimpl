import _ from 'lodash'
import { h } from 'vue'

function hSlot (slot, otherwise) {
    return slot ? slot : otherwise
}

function hSlotScope (scope, slot, otherwise) {
    return slot ? slot(scope) : (otherwise ? otherwise(scope) : undefined)
}

function hSlotScopeSlots (scope, slots, slot, otherwise, debugName) {
    if (slot && debugName) {
        console.log("hSlotScopeSlots " + debugName)
        console.log("tengo slot base y estos son los slots a pasar")
        console.log(slots)
    }
    return slot ? h(slot, scope, slots) : (otherwise ? h(otherwise, scope, slots) : undefined)
}

function pickSlots (source, search, /*scope,*/ asArray) {
    //if (scope === undefined) scope = false
    if (asArray === undefined) asArray = false
    //console.log("PICK SLOTS", source, search)
    const keys = Object.keys(source)
    const slots = asArray ? [] : {}
    const names = []
    const baseNames = []

    for (const x in keys) {
        const key = keys[x]
        //console.log("KEY: " + key)
        //console.log("TEST AGAINST", search, "RES", search.test(key))
        if (search.test(key)) {
            const slotName = key.replace(search, '')
            names.push(slotName)
            baseNames.push(key)
            if (asArray) slots.push(/*scope !== false ? () => source[key](scope) : */source[key])
            else slots[key] = source[key]
        }
    }
    //console.log("FINAL PICK RESULTS", slots, names)
    return { slots, names, baseNames }
}

function inheritSlots (source, search, /*scope,*/ options) {
    if (typeof options === 'boolean') options = { emptyIsDefault: options }
    options = _.merge({
        emptyIsDefault: false,
        translateNames: true
    }, options)
    //console.log("INHERIT SLOTS")
    const { slots, names, baseNames } = pickSlots(source, search, /*scope, */true)
    var result = _.zipObject((options.translateNames ? names : baseNames).map((name) => name.trim() === '' && options.emptyIsDefault ? 'default' : name), slots)
    //console.log("INHERIT RESULT", result)
    return result
}

function inheritSlotsReactive (target, source, search, /*scope,*/ emptyIsDefault) {
    const slots = inheritSlots(source, search, emptyIsDefault)
    for (const x in slots)
        if (target[x] !== slots[x])
            target[x] = slots[x]
}

function inheritSlotsReactive_safe (target, source, search, emptyIsDefault) {
    if (emptyIsDefault === undefined) emptyIsDefault = true
    for (const x in source) {
        if (search.test(x)) {
            var slotName = x.replace(search, '').trim()
            if (emptyIsDefault && slotName === '') slotName = 'default'
            if (target[slotName] !== source[x])
                target[slotName] = source[x]
        }
    }
    return target
}

export {
    hSlot,
    hSlotScope,
    hSlotScopeSlots,
    pickSlots,
    inheritSlots,
    inheritSlotsReactive,
    inheritSlotsReactive_safe
}