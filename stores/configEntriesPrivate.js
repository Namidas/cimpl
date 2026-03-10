/* eslint-disable */
import { defineStore } from 'pinia'
import _ from 'lodash'
//import plain_copy from 'cimpl/utils/plain_copy'
//import { useAppsStore } from './apps.js'
//import axios from 'axios'

const useChildren = false

const defaultEmpty = {
  _isCfg: true,
  children: false,
  type: undefined,
  override: true,
  value: undefined
}

const $_DEFAULTS = {
  //layers: ['instance','user'], //layers of configurations

  /*url: {
    ...defaultEmpty,
    children: {
      base: {
        ...defaultEmpty,
        type: String,
        override: false,
      },
      api: {
        ...defaultEmpty,
        type: String,
        override: false
      },
    }
  },*/

  auth: {
    ...defaultEmpty,
    children: {
      always: { //force any visitor to auth
        ...defaultEmpty,
        type: Boolean,
        override: false,
        value: false
      },
      guest: { //allow for guest users (if auth.always === true)
        ...defaultEmpty,
        type: Boolean,
        override: false,
        value: false
      },
      timeout: { //sessions are valid for 10 minutes of inactivity
        ...defaultEmpty,
        type: Number,
        override: false,
        value: 60 * 1000 * 10
      },
      keep_alive_ask: 60 * 1000 * 1, //one minute before session timeout, let the user know and ask him if he's still there
      getter: { //auth getter options
        url: true, //true to use url.api
        method: 'post',
        params: {
          action: 'post',
          controller: 'user'
        }
      }
    }
  },

  theme: 'CimplFormsApp'
}

function prepareValue (value, defaults, key) {
  if (defaults === undefined) defaults = {}
  //console.log(`PREPARE VALUE ${key}`,value,_.get(value,'_isCfg',undefined))
  if (_.get(value, '_isCfg', undefined) === undefined) {
    value = _.merge({}, defaultEmpty, defaults, { value: value })
    //console.log("---- transformed value into",value)
  }
  if (Object.keys(_.get(value, 'children', {})).length)
    value.children = prepareList(value.children, defaults)

  return value
}

function prepareList (values, defaults, undescore) {
  for (const x in values)
    values[x] = prepareValue(values[x], defaults, x)

  return values
}

function underscoreValues (values, target, baseMap) {
  if (baseMap === undefined) baseMap = []
  for (const key in values) {
    const currentMap = [...baseMap, key]
    //console.log("currentmap",currentMap.join("_"))
    //console.log("hasChildren?",values[key].children)
    //console.log(`-- append key ${key}`,values[key].value)
    if (!values[key].children) target[currentMap.join('_')] = values[key]
    else target = underscoreValues(values[key].children, target, currentMap)
  }
  return target
}

export const configEntriesPrivate = defineStore('configPrivate', {
  state: () => ({
    _layers: { //here goes default configs on the base layer
      _: { ...underscoreValues(prepareList($_DEFAULTS), {}) }
    }
  }),

  getters: {
    _cascaded: (state) => {
      var entireConfig = {}
      /*var layers = ['_'].push.apply(state._layers._.layers.value)
      console.log("LAYERS?",layers,"value?",state._layers._.layers.value)*/
      var layers = ['_', 'instance', 'user']
      layers = layers.reverse() //['user','instance','_']
      //console.log("cascaded layers?",layers)
      for (const x in layers) {
        const layerName = layers[x]
        const layerConfigs = _.get(state._layers, layerName, undefined)
        for (const key in layerConfigs) {
          const conf = layerConfigs[key]
          if (entireConfig[key] === undefined || !conf.override) entireConfig[key] = { ...conf, _source: layerName }
        }
      }
      return entireConfig
    },

    _values: (state) => {
      var entireConfigValues = {}
      for (const confKey in state._cascaded)
        entireConfigValues[confKey] = state._cascaded[confKey].value
      return entireConfigValues
    }
  },

  actions: {
    set (layer, variable, value) {
      var map = variable.split('.')
      variable = map.shift()

      const config = _.get(this._layers, `${layer}.variable`, undefined)
      if (config === undefined) return undefined
      if (map.length) _.set(config.value, map, value)
      else config.value = value

      return value
    }
  },

  persist: {
    pick: [
      //'registeredApps'
    ]
  }
})