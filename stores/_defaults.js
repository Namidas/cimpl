import { defineStore } from '/node_modules/pinia'
import _ from 'lodash'

export const useDefaultsStore = defineStore('cimpl-defaults-store', {
    state: () => ({
        _values: {
            debugger: function (pre, _debug) {
                return function () {
                    if (_debug)
                        for (const x in arguments)
                            if (typeof arguments[x] === 'object')
                                console.log(`** ${pre}: `, arguments[x])
                            else console.log(`** ${pre}: ${arguments[x]}`)
                }
            }
        }
    }),

    getters: {
    },

    actions: {
        //merge with current values using the provided ones as base values (first ones)
        //on the merge chain, in other words, you should use "preset" when actually "setting"
        //default values for (for instance) a component, and use "set" to override said default
        //values, otherwise, depending on the import chain overriding values may get overriden
        //("reverted back") when setting the "real" default values
        preset (key, value) {
            return _.set(this._values, key, _.merge({}, value, _.get(this._values, key, {})))
        },

        //get values from store
        get (key, defaultValue) {
            return _.get(this._values, key, defaultValue)
        },

        //set/override values on store
        set (key, value) {
            return _.set(this._values, key, value)
        }
    },
})