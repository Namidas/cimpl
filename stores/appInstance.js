/* eslint-disable */
import { defineStore } from 'pinia'
import { useDefaultsStore } from './defaults'
import { useDepsStore } from './deps'
import _ from 'lodash'

const defaults = useDefaultsStore()
const debug = defaults.get('debugger')('[APP]', true)

export const useAppInstanceStore = defineStore('cimpl-app-instance-store', {
  state: () => ({
    _BOOTED: false,
    name: false,
    version: false,
    user: false,

    api: {},
    url: {},
    //clearUnusedDeps: true,
    //bootstrapInstance: null,

    optics: {
      main: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,

          horizontal: 0,
          vertical: 0
        },

        dimensions: {
          width: 0,
          height: 0,
          absoluteWidth: 0,
          absoluteHeight: 0
        }
      }
    }
  }),

  getters: {
  },

  actions: {
    getCache (key) {
      const cacheKey = [
        this.name,
        this.version,
        'app',
        key
      ]
      const store = useDepsStore()
      //return store.getDep(store.parseCacheKeyArray(cacheKey))
      //console.log("voy a pedir cache de la siguiente verga", cacheKey, store.parseCacheKeyArray(cacheKey))
      const result = _.get(store._cache, store.parseCacheKeyArray(cacheKey))
      //console.log("y el resultado...", result)
      return result
    },

    getCacheDef (key) {
      const result = this.getCache(key)
      //console.log("get cache def res?", result)
      return result ? result.def : undefined
    }
  },

  persist: {
    pick: [
      //'name',
      //'version',
      //'user'
    ]
  }
})