/* eslint-disable */

import { isRef, unref, isReactive, defineComponent, ref, h, computed, resolveComponent } from 'vue'
import { parseSchema_getModel_finalValue, parseSchema_getBindedRule } from '../parser.js'
//import CImplSchemaModelsMixin from './../mixin.models.js'
import $_DEFAULTS from '../defaults.js'
import useModels from '../composables/models.js'
import useCommons from '../composables/common.js'
import parseSchema_getEntry from '../parser.js'
import _ from 'lodash'
//import CimplSchemaEntryRender from './entry.render.js'

//import CimplSchemaEntryRender2 from 'components/cimpl/schema/components/entry.render.js'
/*import CimplSchemaEntryRender from 'components/cimpl/schema/components/entry.render.js'*/

import CimplSchemaChildren from './children.vue'
import CimplSchemaEntryToolbar from './entry-toolbar.vue'

import { inheritComponentSlots } from '../../../utils/components.js'

import { QField } from 'quasar'

function serverStringTemplate (template, data, clean) {
  if (clean === undefined) clean = false
  // console.log('SERVER STRING TEMPLATE', data)
  const compiled = _.template(template, { interpolate: /#{([\s\S]+?)}/g, imports: data })
  const result = compiled(data)
  // if(clean)
  return result
}

const CimplSchemaEntry = defineComponent({

  name: 'cimpl-schema-entry',
  tagname: 'cimpl-schema-entry',

  /*components: {
    'cimpl-schema-entry-render': CimplSchemaEntryRender2
  },*/

  components: {
    //CimplSchemaEntryRender2
  },

  props: {
    schemaItem: {
      required: true,
      type: Object
    },

    /*make this entry draggable?
      only works if parent children container has draggableChildren set to true
    */
    /*inDraggableParent: {
        required: false,
        type: Boolean,
        default: false
    },*/

    /*make schema child entries draggables?*/
    /*draggableChildren: {
        required: false,
        type: Boolean,
        default: false
    },*/

    /*make this entry draggable?
    only works if parent children container has draggableChildren set to true
    */
    draggable: {
      required: false,
      type: Boolean,
      default: false
    },

    /* cimpl-schema component */
    context: {
      required: true
    },

    debugEntry: {
      required: false,
      type: Boolean,
      default: true,
    },
  },

  watch: {

    schemaEntry: {
      handler () {
        this.resetComponentModelsParsed()
      },
      deep: true,
    },
  },

  setup (props, { slots }) {
    const {
      updates,
      errors,
      setModelUpdate,
      setValidationError,
      unsetValidationError,
      onEntryUpdateModelValue,
      onEntryRemoveModelUpdate,
      onEntryModelUpdate,
      onEntryValidationSuccess,
      onEntryValidationError,
      afterModelUpdate
    } = useModels()

    const {
      debug,
      debugID,
      debugGroup,
      debugGroupCollapsed,
      debugGroupEnd
    } = useCommons()

    /*get the schema entry from the context*/
    const schemaEntry = computed(() => {
      const item = unref(props.schemaItem)
      if (item === undefined) return item
      const uid = item.entry_uid
      const result = props.context.entries[uid]
      return result
    })

    const loading = ref(false)
    const blocked = ref(false)

    /*define if it's a container [row/column] entry or if it's component should be rendered*/
    const rendereableEntry = computed(() => schemaEntry.value.controller.is !== 'cimpl-schema-row' && schemaEntry.value.controller.is !== 'cimpl-schema-column')
    const status = ref({})
    if (schemaEntry.value.draggable)
      status.value.draggable = true


    const mainNode_css_class = computed(() => [
      'cimpl-schema-entry',
      ...schemaEntry.value.class,
      Object.keys(updates.value).length ? 'has-updates' : undefined,
      Object.keys(errors.value).length ? 'has-errors' : undefined,
      loading.value ? 'is-loading' : undefined,
      blocked.value ? 'is-blocked' : undefined,
      ...Object.keys(status.value).map((currentValue, index, arr) => `is-${currentValue}`)
    ])

    const entrySlots = computed(() => {
      const parsedSlots = {}

      for (const x in slots)
        parsedSlots[x] = slots[x]

      const fromContext = props.context.inheritSlotsFor(props.schemaItem.entry_uid)
      for (const x in fromContext)
        parsedSlots[x] = fromContext[x]

      return parsedSlots
    })

    const entryChildren = computed(() => schemaEntry.value.children ? schemaEntry.value.children : [])

    const setupData = {
      //commons composables
      debug,
      debugID,
      debugGroup,
      debugGroupCollapsed,
      debugGroupEnd,

      /*list of updates by model > entry > update*/
      //moved to mixin.models
      updates,

      /*list of errors by model > rule > error*/
      //moved to mixin.models
      errors,

      setModelUpdate,
      setValidationError,
      unsetValidationError,
      onEntryUpdateModelValue,
      onEntryRemoveModelUpdate,
      onEntryModelUpdate,
      onEntryValidationSuccess,
      onEntryValidationError,
      afterModelUpdate,

      componentModelsParsed: ref({}),

      componentValidate: ref(undefined),

      /*this ones are used with the list of binded rules*/
      componentParsedRules_uids: ref([]),
      last_parsed_rules: [],
      last_parsed_rules_result: {},

      /*these ones are used INSIDE rules*/
      last_rule_checked_value: ref({}),
      last_rule_checked_results: ref({}),

      //loading: ref(false),
      //blocked: ref(false)
      loading,
      blocked,

      schemaEntry,
      entryChildren,
      rendereableEntry,
      mainNode_css_class,
      entrySlots
    }

    return setupData
  },

  render () {
    //if(this.schemaEntry.type === 'slot')
    //return this.renderSlotEntry()

    this.debugGroupCollapsed('RENDER ENTRY', '*** BEGIN')

    //const loading = ref(false)
    //const blocked = ref(false)

    console.log("aca 1")

    const mainNode_html_data = /*computed(() => */{
      name: this.schemaEntry.name,
      uid: this.schemaEntry.uid
    }/*)*/

    var toolbarNode = null
    if (this.$slots.toolbar !== undefined) toolbarNode = this.$slots.toolbar
    /*if(schemaEntry.label_side && schemaEntry.label !== undefined)
      return false*/
    else toolbarNode = h(CimplSchemaEntryToolbar,
      {

      }
    )

    var labelNode = null
    if (this.$slots.label !== undefined) labelNode = this.$slots.label
    /*if(schemaEntry.label_side && schemaEntry.label !== undefined)
      return false*/
    else labelNode = h('div',
      {
        class: [
          'cimpl-schema-entry-label',
          `col${this.schemaEntry.label_size ? `-${this.schemaEntry.label_size}` : ''}`
        ]
      },
      [h('div', { class: 'wrap' },/*this.$t(this.schemaEntry.label)*/this.schemaEntry.label)]
    )

    console.log("aca 2")

    const wrapProxyParsed = computed(() => {
      var proxy = {}
      for (const x in _.get(schemaEntry.value, 'wrapProxy', {}))
        proxy[x] = schemaEntry.value.wrapProxy[x]

      if (loading.value === true)
        proxy.loading = true

      return proxy
    })

    var controllerSuperNode = this.$slots['controller-super'] !== undefined ? this.$slots['controller-super'] : null

    if (this.rendereableEntry && controllerSuperNode === null) {
      /*get the entry component proxy of props, events, models, etc*/
      const componentProxy = computed(() => {
        const child = /*unref(this.*/this.schemaItem/*)*/
        const proxy = {}
        //const schemaEntry = this.schemaEntry
        const schema = this.context.innerSchema
        const ctx = this.context

        //first copy the defined proxy props
        for (const x in this.schemaEntry.controllerPropsProxy)
          proxy[x] = _.get(child, `controller.${x}`,
            _.get(this.schemaEntry, `controllerPropsProxy.${x}`, undefined))

        //trying to fix this error with empty tabs?
        //for(const x in _.get(this.schemaItem,'controller',{}))
        //proxy[x] = this.schemaItem.controller[x]

        //assign the models and update events
        const modelsParsed = this.componentModelsParsed
        for (const x in modelsParsed.props) proxy[x] = modelsParsed.props[x]
        //schemaEntry.models = modelsParsed.modelConfigs

        if (this.componentRulesProxy.length)
          proxy.rules = this.componentRulesProxy

        const tabbeds = ['tabbed', 'tabbed-panels', 'tabbed-tabs']
        if (tabbeds.indexOf(this.schemaEntry.type) !== -1) {
          proxy.entry = this
        }

        if (this.loading === true)
          proxy.loading = true

        return proxy
      })

      const componentNodeProps = {
        ref: 'component',
        onValidationSuccess: this.onComponentValidationSuccess,
        onValidationError: this.onComponentValidationError
      }
      for (const x in componentProxy.value)
        componentNodeProps[x] = componentProxy.value[x]
      const componentSlots = inheritComponentSlots(this.entrySlots, 'component:')

      var componentNode = null
      if (this.schemaEntry.type !== 'slot')
        componentNode = this.$slots['controller-component'] !== undefined ? this.$slots['controller-component'] :
          h(resolveComponent(this.schemaEntry.controller.is), componentNodeProps,
            componentSlots
            /*<template v-for="slot in componentSlots()" :key="slot" #[slot]="scope">
                        <slot :name="`component:${slot}`" v-bind="scope ? scope : {}" />
                      </template>*/
          )

      const isWrapped = this.schemaEntry.wrap
      const superSlots = [
        this.$slots['controller-component:pre'] ? this.$slots['controller-component:pre'] : null,
        this.schemaEntry.type === 'slot' ? null :
          (isWrapped ? h(QField, wrapProxyParsed, componentNode) : componentNode),
        this.$slots['controller-component:post'] ? this.$slots['controller-component:post'] : null
      ]

      controllerSuperNode = h('div', { class: 'cimpl-schema-entry-super-controller' },
        this.entrySlots.controller ? [this.entrySlots.controller()] : /*h('_controller',{},*/superSlots/*)*/
      )
    }
    //else { }


    var childrenNode = this.$slots['children'] ? this.$slots['children'] : null
    //if(this.children2Render.length)
    console.log("aca?")
    if (this.entryChildren.length) {
      /*var children = []
      for(const x in this.children2Render)
      {
        const child = this.children2Render[x]
        const childNode = h(CimplSchemaEntry,{
          schemaItem: child,
          ref: `child_entry_${child.entry_uid}`,
          context: this.context,
          'onUpdate:modelValue': this.onEntryUpdateModelValue_,
          onRemoveModelUpdate: this.onEntryRemoveModelUpdate_,
          onModelUpdate: this.onEntryModelUpdate_,
          onValidationError: this.onEntryValidationError_,
          onValidationSuccess: this.onEntryValidationSuccess_
        })
        children.push(childNode)
      }*/
      //childrenNode = h('div',{class: 'children-wrapper'},this.$slots['children:inner'] ? this.$slots['children:inner'] : children)
      console.log("entry children?", this.entryChildren)
      childrenNode = h(CimplSchemaChildren,
        {
          context: this.context,
          children: this.entryChildren,
          draggableChildren: this.schemaEntry.draggableChildren
        },
        //this.$slots['children:inner'] ? this.$slots['children:inner'] : children
      )
    }
    /*<div class="children-wrapper" v-if="children2Render.length">
          <slot name="children:inner">
            <CimplSchemaEntryRender
              v-for="child in children2Render" :key="child.entry_uid"
              :schemaItem="child"
              :schema="schema"
              :ref="`child_entry_${child.entry_uid}`"
              :context="context"
              :render-slots="context.getSlotsFor(child.entry_uid)"
              @update:modelValue="onEntryUpdateModelValue_"
              @removeModelUpdate="onEntryRemoveModelUpdate_"
              @modelUpdate="onEntryModelUpdate_"
              @validationError="onEntryValidationError_"
              @validationSuccess="onEntryValidationSuccess_"
              />
            </slot>
        </div>*/

    /*const mainNode_slots = ref({
      label: labelNode.value,
      //'controller-super': controllerSuperNode.value
    }//)*/

    const mainNode_slots = [
      //toolbarNode,
      labelNode,
      controllerSuperNode,
      childrenNode
    ]

    /*const mainNode_props = computed(() => {
      var props = {
        class: mainNode_css_class,
        style: this.schemaEntry.style,
        data: mainNode_html_data
      }

      for(const x in this.schemaEntry.entryProxyProps)
        props[x] = this.schemaEntry.entryProxyProps[x]
      return props
    })*/

    const mainNode_props = {
      class: this.mainNode_css_class,
      style: this.schemaEntry.style
    }

    for (const x in mainNode_html_data)
      mainNode_props[`data-${x}`] = mainNode_html_data[x]

    for (const x in this.schemaEntry.entryPropsProxy)
      mainNode_props[x] = this.schemaEntry.entryPropsProxy[x]

    const mainNode = h('div',
      mainNode_props,
      mainNode_slots
    )

    this.debug('*** END')
    this.debugGroupEnd()

    return mainNode
  },

  inject: {
    /* cimpl-schema injection to bind entry to schema */
    _cimpl_schema_: {
      default: {
        bindEntry: () => false,
        unBindEntry: () => false
      }
    },
  },

  emits: [
    'update:modelValue', //emit a new modelValue

    'removeModelUpdate', //emit a modelValue update that has been deleted
    'modelUpdate', //emit modelValue updates

    'validationError', //dispatched when a specific validation rule fails
    'validationSuccess', //dispatched when a specific validation rule succedes
  ],

  computed: {

    /*entryClassess()
    {
      var classess = [
        ...this.schemaEntry.class,
        Object.keys(this.updates).length ? 'has-updates' : undefined,
        Object.keys(this.errors).length ? 'has-errors' : undefined,
        this.loading ? 'is-loading' : undefined,
        this.blocked ? 'is-blocked' : undefined,
      ]
      //console.log("entry classewss",classess,Object.keys(this.updates).length,Object.keys(this.errors).length)
      return classess
    },*/

    /*sideLabelClass()
    {
      return [
        `col${this.schemaEntry.label_size ? `-${this.schemaEntry.label_size}` : ''}`
      ]
    },*/

    /*define if it's a container [row/column] entry or if it's component should be rendered*/
    /*rendereableEntry () {
      return this.schemaEntry.controller.is !== 'cimpl-schema-row' && this.schemaEntry.controller.is !== 'cimpl-schema-column'
    },*/

    uid () {
      return unref(this.schemaItem).entry_uid
    },

    /*filter "undefined" from items*/
    children2Render () {
      let items = []
      for (const x in this.schemaEntry.children)
        if (this.schemaEntry.children[x] !== undefined)
          items.push(this.schemaEntry.children[x])
      return items
    },

    /*parsed/wrapped rules for the component*/
    componentParsedRules () {
      const child = unref(this.schemaItem)
      //console.log(`[${child.label}] - [${this.$.type.name}] *** [5] ENTRY COMPUTED: componentParsedRules ` + this.uid,this)

      const schemaEntry = this.schemaEntry
      const schema = this.context.innerSchema

      const ctx = this.context

      /*now we have to parse and bind the defined rules, if any*/
      const origRules = _.get(this.schemaEntry, 'controllerPropsProxy.rules', [])
      //console.log(`[${child.label}] - [${this.$.type.name}] --- chequeo si son mismas reglas, asi no re-parseo al pedo`)
      if (origRules === this.last_parsed_rules) {
        //console.log(`[${child.label}] --- mismas reglas ya parseadas asique retorno`)
        return this.last_parsed_rules_result
      }
      //console.log(`[${child.label}] no eran mismas reglas parseadas, asique re parseo`)
      this.last_parsed_rules = origRules

      this.removeCurrentRules()

      let parsedRules = {}
      const hasRuleUID = !Array.isArray(origRules)
      for (const x in origRules) {
        const origRule = origRules[x]
        const ruleUID = hasRuleUID ? x : _.uniqueId('schema_entry_binded_rule_')
        //console.log(`[${child.label}] entry, pre llamar parseSchema_getBindedRule`)
        parsedRules[ruleUID] = (value) => parseSchema_getBindedRule(
          ruleUID,
          this.schemaItem,
          this.schemaEntry,
          origRule,
          value,
          this
        )
        this.componentParsedRules_uids.push(ruleUID)
      }
      this.last_parsed_rules_result = parsedRules
      return parsedRules
    },

    /*component rules proxy, returns them as a Quasar compatible array, instead of a ruleUID keyed object*/
    componentRulesProxy () {
      const child = unref(this.schemaItem)
      //console.log(`[${child.label}] computed componentRulesProxy`,this.componentParsedRules)
      return Object.values(this.componentParsedRules)
    },

    /*a proxy to the context.innerModelValue (from schema), needed by the composable.models*/
    innerModelValue () {
      return this.context.innerModelValue
    }
  },

  data () {
    return {

    }
  },

  methods: {

    renderSlotEntry () {
      this.debugGroupCollapsed('RENDER SLOT ENTRY', '*** BEGIN')
      this.debugGroupCollapsed('*** END')
      return null
    },

    onUpdateDraggable () {
      this.debugID("on update draggable entry")
    },

    //append/remove an entry status
    setStatus (name, value) {
      if (value === undefined) value = true
      this.status[name] = value
    },

    removeStatus (name) {
      const removed = this.getStatus(name)
      delete this.status[name]
      return removed
    },

    getStatus (name) {
      return this.status[name]
    },

    hasStatus (name) {
      return this.status[name] !== undefined
    },

    /*remove current binded rules, actually doesn't remove the rules themselves
    more like deletes the related UIDs and related errors, if any*/
    removeCurrentRules () {
      const child = unref(this.schemaItem)
      //console.log(`[${child.label}] removeCurrentRules`)

      //console.log(`[${child.label}] reseteo last_rule_checked_value y last_rule_checked_results`)
      //console.log("last_rule_checked_value?",this.last_rule_checked_value)
      //console.log("last_rule_checked_results?",this.last_rule_checked_results)
      this.last_rule_checked_value = {}
      this.last_rule_checked_results = {}



      if (this.componentParsedRules_uids === undefined) {
        //console.log(`[${child.label}] currentParsedRules_uids era indefinido, asique retorno`)
        return
      }
      //else console.log(`[${child.label}] currentParsedRules_uids no era indefinido, asique sigo`)
      //console.log(`[${child.label}] como reseteo reglas, reseteo notificaciones de error`)
      //console.log(`[${child.label}] deberian entonces volver a correr los validadores ?`)
      for (const model in this.errors)
        for (const ruleUID in this.errors[model])
          if (this.componentParsedRules_uids.indexOf(ruleUID) !== -1) {
            //console.log(`[${child.label}] unsetValidationError`,model,ruleUID)
            this.unsetValidationError(this.errors[model][ruleUID])
            // delete this.errors[model][ruleUID]
          }

      this.componentParsedRules_uids = []
    },

    /*entry events*/
    onEntryUpdateModelValue_ (payload) { return this.onEntryUpdateModelValue(payload) },
    onEntryRemoveModelUpdate_ (payload) { return this.onEntryRemoveModelUpdate(payload) },
    onEntryModelUpdate_ (payload) { return this.onEntryModelUpdate(payload) },
    onEntryValidationError_ (payload) { return this.onEntryValidationError(payload) },
    onEntryValidationSuccess_ (payload) { return this.onEntryValidationSuccess(payload) },

    onComponentValidationSuccess (payload) {
      //alert("COMPONENT VALIDATION SUCCESS")
      //console.log("cimpl-schema-entry onComponentValidationSuccess",payload)
      //console.log(payload)
      if (payload === undefined) return
      const error = { ...payload }
      if (error.model === undefined) error.model = _.get(this.componentModelsParsed, 'modelConfigs.0.modelParsed', '').replace('innerModelValue', 'modelValue')
      if (error.label === undefined) error.label = this.schemaEntry.label

      error.entryUID = this.schemaItem.entry_uid
      this.unsetValidationError(error)
    },

    onComponentValidationError (payload) {
      const error = { ...payload }
      //console.log("onComponentValidationError",this.componentModelsParsed)
      //console.log(payload)
      if (error.model === undefined) error.model = _.get(this.componentModelsParsed, 'modelConfigs.0.modelParsed', '').replace('innerModelValue', 'modelValue')
      if (error.label === undefined) error.label = this.schemaEntry.label
      error.entryUID = this.schemaItem.entry_uid

      //console.log("cimpl-schema-entry mando error nuevo",error)
      this.setValidationError(error)
    },

    resetComponentModelsParsed (appendEntryModels) {
      if (appendEntryModels === undefined) appendEntryModels = true
      const child = unref(this.schemaItem)
      //console.log(`[${child.label}] - entry resetComponentModelsParsed`)
      //console.log("(esta funcion basicamente actualiza el valor interno del entry)")

      const schemaEntry = this.schemaEntry
      if (schemaEntry === undefined) return {
        props: {},
        modelConfigs: [],
        children: {},
      }

      const schema = this.context.innerSchema
      const ctx = this.context

      //now we create the models handlers
      let models = []
      let modelConfigs = []
      let props = {}
      var hasAuto = false
      if (schemaEntry.model !== false) {
        hasAuto = true
        const defaultModel = {
          model: child.model === true ? schemaEntry.model : child.model,
          default: _.get(child, 'defaultValue',
            _.get($_DEFAULTS, `${child.type}.defaultValue`,
              _.get($_DEFAULTS, 'entry.defaultValue'))),
          label: _.get(child, 'modelLabel'),
          type: schemaEntry.modelType,
          name: 'modelValue',
          notifications: _.get(child, 'modelNotifications', {}),
          auto: true,
        }
        //console.log("PUSHEO ESTE MODELO DEFAULT",defaultModel)
        models.push(defaultModel)
      }
      for (const x in child.models) models.push(child.models[x])

      for (const x in models) {
        const type = models[x].type !== undefined ? models[x].type : 'var'
        const parsed = type === 'var' ? serverStringTemplate(models[x].model.startsWith('modelValue.') ? models[x].model.replace('modelValue.', 'innerModelValue.') : models[x].model, {
          schema: schema,
          schemaEntry: schemaEntry,
          ctx: ctx
        }, true) : undefined
        const name = models[x].name
        const modelConfig = {
          name: name,
          type: type,
          model: models[x].auto ? (type === 'value' ? child.model : schemaEntry.model) : (type === 'value' ? child[x - (hasAuto && !models[x].auto ? 1 : 0)] : models[x].model),
          default: _.get(models[x], 'default',
            _.get($_DEFAULTS, `${child.type}.defaultValue`,
              _.get($_DEFAULTS, 'entry.defaultValue'))),
          modelParsed: parsed,
          update: models[x].update,
          label: _.get(models, `${x}.label`, _.get(child, 'controller.label', _.get(child, 'label'))),
          notifications: _.get(models, `${x}.notifications`, {}),
        }

        if (type === 'value') {
          alert("SETEO MODELO VALUE")
          console.log("SETEO MODELO VALUE", models[x])
          console.log("child 1", child)
          console.log("model: ", child.model)
          console.log("model: ", _.get(child, 'model'))
          console.log("isRef?", isRef(child.model))
          console.log("isReactive?", isReactive(child.model))
          console.log("child 2", child)
          console.log("modelConfig", modelConfig)
          //throw new Error('asd')
        }

        //console.log(`[${child.label}] - resetModels PRE GETEAR EL MODEL FINAL VALUE`)
        props[modelConfig.name] = parseSchema_getModel_finalValue(modelConfig, schemaEntry, schema, ctx)
        //console.log(`[${child.label}] - valor geteado`,props[modelConfig.name])

        //props[`onUpdate:${_.kebabCase(modelConfig.name)}`] = (newValue) => {
        props[`onUpdate:${modelConfig.name}`] = (newValue) => {
          /*if (modelConfig.type === 'var') {
              this.setModelUpdate(newValue, modelConfig, schemaEntry, schema)
          } else {
              console.log("MODELLLLLLLLLLLLLLLL",modelConfig)
              modelConfig.model = newValue
          }*/
          //console.log(`[${child.label}] - componente disparo evento onUpdate:${_.kebabCase(modelConfig.name)}`)
          this.setModelUpdate(newValue, modelConfig, schemaEntry, schema)
        }
        //console.log("--- modelo final agregado",modelConfig)
        modelConfigs.push(modelConfig)
      }

      const children = {}
      for (const x in schemaEntry.children) {
        const subEntry = schemaEntry.children[x]
        if (subEntry === undefined) continue
        if (this.context.bindedEntries[subEntry.uid] !== undefined)
          children[subEntry.uid] = this.context.bindedEntries[subEntry.uid].componentModelsParsed
      }

      const result = {
        props: props,
        modelConfigs: modelConfigs,
        children: children,
      }

      this.componentModelsParsed = result

      if (appendEntryModels) {
        //console.log(`[${child.label}] - entry resetComponentModelsParsed pre watchModelValue_appendEntryModels`)
        this.context.watchModelValue_appendEntryModels(this)
      }

      //console.log(`[${child.label}] - entry resetComponentModelsParsed result`)
      //console.log(result)
      return result
    },

    /*para que estos eventos funcionen hay que agregar al component
    
            v-life-cycle="{
                mounted: componentIsMounted,
                beforeUnmount: componentIsUnmounted,
              }"

    a ambas instancias del component, la wrapeada y la no <component />
    */
    componentIsMounted (el, binding, vnode, prevVnode) {

    },

    componentIsUnmounted (el, binding, vnode, prevVnode) {
    },
  },

  beforeMount () {
    const item = unref(this.schemaItem)
    //console.log(`[${item.label}] ******* ENTRY beforeMount type: ${item.type} / name: ${item.name}`)
    const isBinded = this._cimpl_schema_.bindEntry(this)
    if (!isBinded) {
      //console.log(`[${item.label}] - entry beforeMount pre reset`)
      //console.log(isBinded)
      this.resetComponentModelsParsed(false)
    }
    //else alert("ROMPER ENTRY " + this.schemaItem.name)
  },

  mounted () {
    const item = unref(this.schemaItem)
    //console.log(`[${item.label}] ******* ENTRY MOUNT type: ${item.type} / name: ${item.name}`)
  },

  beforeUnmount () {
    this._cimpl_schema_.unBindEntry(this)
  }
})

export default CimplSchemaEntry