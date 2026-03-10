/* eslint-disable */
import { defineStore } from 'pinia'
import _ from 'lodash'
import plain_copy from './../utils/plain_copy'
import { useAppInstanceStore } from './appInstance'
//import axios from 'axios'
import { configEntriesPrivate } from './configEntriesPrivate.js'


export const useCfgStore = defineStore('config', {
  state: () => ({
    /*layers: { //here goes default configs on the base layer
      _: {...underscoreValues(prepareList($_DEFAULTS),{})}
    }*/
  }),

  getters: {
    //hasProject: (state) => state.currentProject !== false/*Object.keys(state.currentProject).length > 0*/,
    url: (state) => { return { ...useAppInstanceStore().url } },
    api: (state) => { return { ...useAppInstanceStore().api } },
  },

  actions: {
    get (key, defaultValue) {
      const privateConfig = configEntriesPrivate()
      if (key === undefined) return plain_copy(privateConfig._values)
      //console.log(`--- getting ${key}`)
      var map = key.split(':')
      var layer = false
      if (map.length > 1) layer = map.shift()

      /*if(map[0].trim() === '')
      {
        if(layer === false) return privateConfig._values
      }*/

      map = map[0].split('.')
      const variable = map.shift()

      //console.log(`--- layer ${layer ? layer : '[cascade]'}`)
      //console.log(`--- variable ${variable}`)
      //console.log(`--- map`,map)

      const found = layer === false ? _.get(privateConfig._cascaded, variable, undefined) : _.get(privateConfig._layers, `${layer}.${variable}`, undefined)

      //console.log("--- found?",found)
      //console.log("CASCADED?",privateConfig,privateConfig._cascaded)

      if (found === undefined) return defaultValue
      else return plain_copy(map.length ? _.get(found.value, map, undefined) : found.value)
    }
  },

  set (variable, value) {
    //var args = [...arguments]
    var map = variable.split(':')
    var layer = map.length > 1 ? map[0] : 'user'
    const voidConfigs = []
    var variable = map.shift()
    layer = 'user'
    const privateConfig = configEntriesPrivate()
    return privateConfig.set(layer, variable, value)
  },

  persist: {
    pick: [
      //'registeredApps'
    ]
  }
})
