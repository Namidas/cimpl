import { ref, computed, watchEffect, toValue } from 'vue'
import _ from 'lodash'

function constructWrapper (pre, isComputed) {
    const wrapper = {
        get (key, defaultValue) { return this.get(`${pre}.${key}`, defaultValue) },
        set (key, value) { return this.set(`${pre}.${key}`, value) },
        preset (key, value) { return this.preset(`${pre}.${key}`, value) },
        getComputed (key, defaultValue) { return this.getComputed(`${pre}.${key}`, defaultValue) },
        getWrapper (pre2, computed, cache) { return this.getWrapper(`${pre}.${pre2}`, computed, cache) }
    }
    return isComputed ? computed(() => wrapper) : wrapper
}

//merge with current values using the provided ones as base values (first ones)
//on the merge chain, in other words, you should use "preset" when actually "setting"
//default values for (for instance) a component, and use "set" to override said default
//values, otherwise, depending on the import chain overriding values may get overriden
//("reverted back") when setting the "real" default values
function preset (key, value) {
    //console.log("----- preset", this, key, value)
    return _.set(this._values.value, key, _.merge({}, value, _.get(this._values.value, key, {})))
}

//get values from store
function get (key, defaultValue) {
    return _.get(this._values.value, key, defaultValue)
}

//get a computed wrapper for a given value
function getComputed (key, defaultValue) {
    if (!this._computedValuesCache.has(key)) this._computedValuesCache.set(key, computed(() => this.get(key, defaultValue)))
    return this._computedValuesCache.get(key)
}

//set/override values on store
function set (key, value) {
    //console.log("----- set", this)
    return _.set(this._values.value, key, value)
}

//wrapper-related
function getWrapper (pre, isComputed, cache) {
    //if (isComputed === undefined) isComputed = false
    if (cache === undefined) cache = false
    if (cache) {
        if (!this._wrappersCache.has(pre)) this._wrappersCache.set(pre, constructWrapper(pre, isComputed))
        return this._wrappersCache.get(pre)
    }
    return constructWrapper(pre, isComputed)
}

function getDefaultsInstance () {
    const instance = {
        _computedValuesCache: new Map(),
        _wrappersCache: new Map(),
        _values: ref({}),
        preset (key, value) { return preset.apply(instance, arguments) },
        get (key, defaultValue) { return get.apply(instance, arguments) },
        getComputed (key, defaultValue) { return getComputed.apply(instance, arguments) },
        set (key, value) { return set.apply(instance, arguments) },
        getWrapper (pre, isComputed, cache) { return getWrapper.apply(instance, arguments) }
    }

    //not so sure if this watchEffect would actually keep reactivity and not actually generate data-loss
    watchEffect(() => {
        console.log("--- defaults instance watchEffect dependencies")
        for (const x in arguments) {
            const arg = typeof arguments[x] === 'string' ? defaultsStore.get(arguments[x]) : arguments[x]
            instance._values.value = _.merge(instance._values.value, toValue(arg))
        }
    })

    return instance
}

//const wrappersCache = new Map()
//const computedValuesCache = new Map()
/*const defaultsStore = {
    _values: ref({
        debugger: function (pre, _debug) {
            return function () {
                if (_debug)
                    for (const x in arguments)
                        if (typeof arguments[x] === 'object')
                            console.log(`** ${pre}: `, arguments[x])
                        else console.log(`** ${pre}: ${arguments[x]}`)
            }
        }
    }),


    //merge with current values using the provided ones as base values (first ones)
    //on the merge chain, in other words, you should use "preset" when actually "setting"
    //default values for (for instance) a component, and use "set" to override said default
    //values, otherwise, depending on the import chain overriding values may get overriden
    //("reverted back") when setting the "real" default values
    preset (key, value) {
        return _.set(defaultsStore._values.value, key, _.merge({}, value, _.get(defaultsStore._values.value, key, {})))
    },

    //get values from store
    get (key, defaultValue) {
        return _.get(defaultsStore._values.value, key, defaultValue)
    },

    //get a computed wrapper for a given value
    getComputed (key, defaultValue) {
        if (!computedValuesCache.has(key)) computedValuesCache.set(key, computed(() => defaultsStore.get(key, defaultValue)))
        return computedValuesCache.get(key)
    },

    //set/override values on store
    set (key, value) {
        return _.set(defaultsStore._values.value, key, value)
    },

    //wrapper-related
    getWrapper (pre, isComputed, cache) {
        //if (isComputed === undefined) isComputed = false
        if (cache === undefined) cache = false
        if (cache) {
            if (!wrappersCache.has(pre)) wrappersCache.set(pre, constructWrapper(pre, isComputed))
            return wrappersCache.get(pre)
        }
        return constructWrapper(pre, isComputed)
    },

    //it's always a computed, always creates a new object on any update, so be careful when changing values,
    //it's not optimized for that...
    getInstance () {
        return constructInstance.apply(null, arguments)
    },

    unsetWrapperCache (key) {
        var cache = wrappersCache.get(key)
        wrappersCache.delete(key)
        return cache
    }
}*/

const defaultsStore = getDefaultsInstance({
    debugger: function (pre, _debug) {
        return function () {
            if (_debug)
                for (const x in arguments)
                    if (typeof arguments[x] === 'object')
                        console.log(`** ${pre}: `, arguments[x])
                    else console.log(`** ${pre}: ${arguments[x]}`)
        }
    },

    something: {
        nested: true,
        other: false
    }
})

//console.log("defaults store?", defaultsStore._values.value)

export default defaultsStore

export {
    getDefaultsInstance,
    defaultsStore
}