/* eslint-disable */
import { defineStore } from 'pinia'
import { useDefaultsStore } from './defaults'
import { useCfgStore } from './config'
import { useAppsStore } from 'stores/apps'
import fetchModule from './../utils/fetchModule'
import _ from 'lodash'
import axios from 'axios'
import { defineComponent, markRaw } from 'vue'

const defaults = useDefaultsStore()
const debug = defaults.get('debugger')('CImpl depsStore', false)
const cfgStore = useCfgStore()

defaults.preset('deps', {
    empty: {
        name: undefined, //dep name
        tagname: undefined, //dep tagname, if it corresponds (used to globally register)...
        type: undefined, //component, style, lang, etc
        time: -1, //timestamp of last changes reported by server,
        def: undefined, //definition, result of the load,
        global: false, //register as global after load,
        fetch: {}, //options for the loader,,
        scopeWrap: true, //when true, the returned module is expected to be a function to be called with the given scope that will in turn return the "real" default export for the module, otherwise the module is imported as is
        cache: true, //save load to cache ?
        imports: ['default'], //array of module exports to import, when empty the entire module is saved instead of specific exports
        required: false //only used by bootstrap, to signal deps that need to be loaded first
    },

    loaderScope: {},

    loaderGetURL: function (dep, baseURL) {
        const action = _.get(dep, 'fetch.params.action', 'get_component')
        const conf = _.merge({
            url: baseURL ? baseURL : cfgStore.api.url,
            params: {
                client: cfgStore.api.client,
                action: action,
                controller: _.get(dep, 'controller'),
                name: dep.name
                // authorization: context.getters.user_jwt_token
            }
        }, _.get(dep, 'fetch', {}))
        const compoURL = axios.getUri(conf)
        debug('- import conf and compoUrl', conf, compoURL)
        return compoURL
    },

    loader: async function (dep) {
        const compoURL = defaults.get('deps.loaderGetURL')(dep)
        var loadedModule = undefined
        await fetchModule(compoURL, {}, dep.imports).then((module) => {
            loadedModule = module
        })

        debug("FETCHED MODULE", loadedModule)
        //debug(module())
        //debug("bootstrap instance?", ctx.bootstrapInstance())
        var definition = loadedModule
        switch (dep.type) {
            case 'components':
                definition = defineComponent(markRaw(dep.scopeWrap ? loadedModule(defaults.get('deps.loaderScope')) : loadedModule))
                if (dep.global) {
                    debug("registro globalmente " + _.get(dep, 'tagname', dep.name), definition)
                    useAppsStore().bootstrapInstance().component(_.get(dep, 'tagname', dep.name), definition)
                }
                break
        }
        dep.def = definition
        //setterCache(dep, depCachePath, component)
        return definition
    },

    loaderWrapper: async function (dep) {
        const definition = await dep.loader(defaults.get('deps.loaderScope'))
        var resultDef = {}
        if (dep.imports.length === 1) resultDef = markRaw(definition[dep.imports[0]])
        else for (const x in dep.imports)
            resultDef[dep.imports[x]] = markRaw(definition[dep.imports[x]])
        dep.def = resultDef
        return resultDef
    },

    load: async function (dep) {
        return dep.loader !== undefined ? await defaults.get('deps.loaderWrapper')(dep) :
            await defaults.get('deps.loader')(dep)
    }
})

export const useDepsStore = defineStore('cimpl-deps-store', {
    state: () => ({
        _cache: {}
    }),

    getters: {
    },

    actions: {
        async getDep (cacheKey, depData, autoLoad) {
            if (autoLoad === undefined) autoLoad = true
            if (depData === undefined) return _.get(this._cache, cacheKey, undefined)

            var depName = cacheKey.split('.').pop()
            var dep = _.merge({},
                defaults.get('deps.empty'),
                { name: depName },
                depData
            )

            const fromCache = _.get(this._cache, cacheKey, undefined)

            debug(`get dep '${cacheKey}'`, depData)

            const definition = fromCache ? fromCache.def : (autoLoad ? await defaults.get('deps.load')(dep) : undefined)
            debug("DEFINITION AFTER LOAD?", definition)
            if (dep.cache) _.set(this._cache, cacheKey, dep)

            return dep
        },

        //getDepDef(cache)

        hasCache (cacheKey) {
            return _.get(this._cache, cacheKey) !== undefined
        },

        parseCacheKeyArray (keyList) {
            var preJoinedResult = []
            const iteratee = (value) => {
                if (_.isArray(value)) value.map(iteratee)
                else if (typeof value === 'string')
                    preJoinedResult.push(value.split('.').join('|'))
            }
            keyList.map(iteratee)
            return preJoinedResult.join('.')
        }
    },

    persist: {
        pick: [
        ]
    }
})