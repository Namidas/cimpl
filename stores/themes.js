/* eslint-disable */
import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { useDefaultsStore } from './defaults'
import { useAppInstanceStore } from './appInstance'
import { useDepsStore } from './deps'
import _ from 'lodash'
/*import fetchModule from 'cimpl/utils/fetchModule'
import axios from 'axios'
import { defineComponent, markRaw } from 'vue'*/

//const depsStore = useDepsStore()

const $_DEFAULT_THEME = 'CimplFormsApp'
const $_DEFAULT_THEMES = {
  'CimplFormsApp': {
    name: 'CimplFormsApp',
    description: 'Default CImpl forms app theme.',
    version: '1.0',
    deps: {
      layouts: {
        main: {
          loader: async () => await import('./../components/app/themes/forms/layouts/main.vue'),
          //required: true
        }
      },
      components: {
        header: {
          loader: async () => await import('./../components/app/themes/forms/components/header.vue'),
          //required: true
        },

        leftDrawer: {
          loader: async () => await import('./../components/app/themes/forms/components/left-drawer.vue'),
          //required: true
        }
      },
    }
  }
}

const defaults = useDefaultsStore()
const debug = defaults.get('debugger')('CImpl themes store', false)

export const useThemesStore = defineStore('cimpl-themes-store', {
  state: () => ({
    themes: { ...$_DEFAULT_THEMES },

    currentThemeName: false,
    //themesCache: {},
    //bootstrapInstance: null,
  }),
  getters: {
    currentTheme: (state) => state.themes[state.currentThemeName],
    currentAppCacheBaseName: (state) => {
      const appInstance = useAppInstanceStore()
      return [
        appInstance.name,
        appInstance.version
      ]
    },

    currentThemeCacheBaseName: (state) => {
      const appInstance = useAppInstanceStore()
      return [
        ...state.currentAppCacheBaseName,
        'theme',
        _.get(state.currentTheme, 'name'),
        _.get(state.currentTheme, 'version'),
        //"melon3.playa_nueva.0|1.theme.CimplFormsApp.layouts.main"
      ]
    },
  },

  actions: {
    setTheme (themeData, appData) {
      debug("SET THEME", themeData)
      const ctx = this

      this.currentThemeName = themeData.name

      //this.updateAppData(appData)
      var forceReloadAllDeps = this.themes[themeData.name] === undefined
      const isNewTheme = this.themes[themeData.name] === undefined
      if (this.themes[themeData.name] === undefined) this.themes[themeData.name] = themeData
      const theme = this.themes[themeData.name]

      /*const setterCache = function (dep, depCachePath, component) {
        debug(`envio al cache '${depCachePath}'`, component)
        _.set(ctx.themesCache, depCachePath, {
          time: dep.time,
          def: component
        })
      }
 
      const defaultLoader = async function () {
        //var depCachePath = `${appData.name}.deps.${depType}.${depName}`
        const action = _.get(dep, 'fetch.params.action', 'get_component')
        const conf = _.merge({
          url: appData.api.url,
          params: {
            client: appData.api.client,
            action: action,
            controller: _.get(dep, 'controller'),
            name: depName
            // authorization: context.getters.user_jwt_token
          }
        }, _.get(dep, 'fetch', {}))
 
        const compoURL = axios.getUri(conf)
 
        debug('- import conf and compoUrl', conf, compoURL)
 
        await fetchModule(compoURL, {}).then((module) => {
          debug("FETCHED MODULE", module)
          debug(module())
          debug("bootstrap instance?", ctx.bootstrapInstance())
          const component = defineComponent(markRaw(module()))
          if (dep.global) ctx.bootstrapInstance().component(_.get(dep, 'tagname', depName), component)
          setterCache(dep, depCachePath, component)
        })
      }
 
      for (const depType in themeData.deps) {
        for (const depName in themeData.deps[depType]) {
          const depPath = `deps.${depType}.${depName}`
          const depData = themeData.deps[depType][depName]
          const currentTime = _.get(theme, `${depPath}.time`, 0)
          const hasCache = _.get(this.themesCache, `${themeData.name}.${depPath}`) !== undefined
          _.set(theme, depPath, depData)
          _.set(theme, `${depPath}._update`, (currentTime < depData.time) && _.get(depData, 'cache', true))
          _.set(theme, `${depPath}._load`, !hasCache || (currentTime < depData.time) || forceReloadAllDeps || !_.get(depData, 'cache', true))
          const dep = _.get(theme, depPath)
          if (dep._load) {
            const depCachePath = `${themeData.name}.${depPath}`
            if (dep.loader === undefined)
              dep.loader = async () => {
                await defaultLoader()
              }
            else {
              const originalLoader = dep.loader
              dep.loader = async () => {
                const component = await originalLoader()
                console.log("---- CARGA PROPIA, res?", component)
                if (dep.global) ctx.bootstrapInstance().component(_.get(dep, 'tagname', depName), component)
                setterCache(dep, depCachePath, markRaw(component.default))
              }
            }
          }
        }
      }*/

      /*if (this.clearUnusedDeps)
        for (const depType in app.deps)
          for (const depName in app.deps[depType]) {
            const depPath = `deps.${depType}.${depName}`
            if (!_.get(appData, depPath, false))
              _.unset(app, depPath)
          }*/

      return theme
    },

    get (theme) {
      debug(`get theme data steps for '${theme}'`)
      //var embeddedTheme = false
      if (theme === undefined) {
        if (this.currentThemeName !== false) {
          theme = this.currentThemeName
          debug(`provided undefined as theme, defaulting to current '${$_DEFAULT_THEME}'`)
        }
        else {
          theme = $_DEFAULT_THEME
          //embeddedTheme = true
          debug(`provided undefined as theme, defaulting to embedded '${$_DEFAULT_THEME}'`)
        }
      }
      else if (this.themes[theme] === undefined) {
        theme = $_DEFAULT_THEME
        debug(`theme '${theme}' could not be found, defaulting to embedded '${$_DEFAULT_THEME}'`)
      }

      var themeData = this.themes[theme]
      themeData.getCache = (path) => this.getCache(path, themeData.name)
      themeData.getCacheDef = (path) => _.get(this.getCache(path, themeData.name), 'def')
      return themeData
    },

    getCache (path, theme) {
      //if (theme === undefined) theme = this.currentThemeName
      //return _.get(this.themesCache, `${theme}.${path}`)
      const depsStore = useDepsStore()
      //return depsStore.getDep(`${this.currentThemeCacheBaseName}.${path}`)
      //console.log("theme get cache?", [this.currentThemeCacheBaseName, path], depsStore.parseCacheKeyArray([this.currentThemeCacheBaseName, path]))
      const result = _.get(depsStore._cache, depsStore.parseCacheKeyArray([this.currentThemeCacheBaseName, path]))
      //console.log("y el result...", result)
      return result
    }
  },

  persist: {
    pick: [
      //'registeredApps'
    ]
  }
})