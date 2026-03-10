<template>
    <div :class="mainClassess" style="width: 100%;">
      <div class="cimpl-schema-tabbed-main-wrapper" :class="{'is-menu': showAsMenu}">
        <slot name="tabs">
          <div class="cimpl-schema-tabbed-main-wrapper-tabs" v-if="showTabs">
            <!--<cimpl-tabs
              :model-value="innerCImplTab"
              @update:model-value="tabChanged"
              :map="map"
              @update:map="mapChanged"
              @trigger:overview="triggerOverview"
              :tabs="schema"
              ref="tabsComponent"
              :notifications="nestedNotifications"
              />-->
            <q-tabs
              v-model="currentTab"
              @update:model-value="tabChanged"
              :vertical="isVertical"
              v-bind="tabsProxy"
              ref="tabsComponent"
              :stretch="false"
              :shrink="true"
              v-if="!showAsMenu"
              >
                <slot :name="`tab-${tabName}`" v-for="(tabData,tabName) in tabs" :key="tabName">
                    <q-tab v-bind="tabDataProxy(tabData,'tab')">
                      <q-badge v-if="Object.keys(currentNotifications[tabName].updates).length" v-bind="getTabBadgeProps('update',tabName)">
                        {{Object.keys(currentNotifications[tabName].updates).length}}
                        <q-tooltip>{{$t('form.updates_count',{count: Object.keys(currentNotifications[tabName].updates).length})}}</q-tooltip>
                      </q-badge>
                      <q-badge v-if="Object.keys(currentNotifications[tabName].errors).length" v-bind="getTabBadgeProps('error',tabName)">
                        {{Object.keys(currentNotifications[tabName].errors).length}}
                        <q-tooltip>{{Object.keys(currentNotifications[tabName].errors).length}} _errors</q-tooltip>
                      </q-badge>
                    </q-tab>
                </slot>
            </q-tabs>
            <q-list padding class="cimpl-page-drawer-tabs drawer-left tabs-as-list bg-grey-2" v-else>
                <slot :name="`tab-item-${tabName}`" v-for="(tabData,tabName) in tabs" :key="tabName">
                  <div class="cimpl-page-drawer-tabs-tab-item-wrapper" :class="`${currentTab === tabName ? 'current' : ''}`">
                      <q-item
                          clickable
                          @click="tabChanged(tabName)"
                          :style="`border-color: var(--q-${tabData.color});`"
                          class="cimpl-page-drawer-tabs-tab-item"
                          :class="`${currentTab === tabName ? 'current' : 'text-grey-6'}`"
                          :active="false"
                          :active-class="`text-${tabData.color}`"
                          :disable="tabData.disable"
                          >
                          <q-item-section avatar>
                              <q-icon :color="currentTab === tabName ? tabData.color : 'grey-6'" :name="tabData.icon" />
                          </q-item-section>
                          <q-item-section>
                              <q-item-label>{{ tabData.label }}</q-item-label>
                          </q-item-section>
                          <q-badge v-if="Object.keys(currentNotifications[tabName].updates).length" v-bind="getTabBadgeProps('update',tabName)">
                            {{Object.keys(currentNotifications[tabName].updates).length}}
                            <q-tooltip>{{$t('form.updates_count',{count: Object.keys(currentNotifications[tabName].updates).length})}}</q-tooltip>
                          </q-badge>
                          <q-badge v-if="Object.keys(currentNotifications[tabName].errors).length" v-bind="getTabBadgeProps('error',tabName)">
                            {{Object.keys(currentNotifications[tabName].errors).length}}
                            <q-tooltip>{{Object.keys(currentNotifications[tabName].errors).length}} _errors</q-tooltip>
                          </q-badge>
                      </q-item>
                      <q-separator />
                  </div>
                </slot>
            </q-list>
          </div>
        </slot>
        <slot name="tab-panels">
            <div class="cimpl-schema-tabbed-main-wrapper-panels" v-if="showPanels">
              <!--panels: {{Object.keys(tabs)}}<br />
              currentPanel: {{currentTab}}<br />-->
              <q-tab-panels
                  v-model="currentTab"
                  animated
                  :vertical="isVertical"
                  transition-prev="jump-up"
                  transition-next="jump-up"
                  v-bind="panelsProxy"
                  ref="panelsComponent"
                  keep-alive
                  infinite
                  >
                  <!--<q-tab-panel ref="panel-all" name="___overview">
                    <div class="cimpl-tabs-overview-panel">
                      <div class="tab-label">{{entry.schemaEntry.label}}</div>
                      <q-separator spaced />
                      <q-list separator>
                        <q-item clickable v-ripple v-for="(tab,index) in schema" :key="tab.name" @click="triggerMap(tab,index)">
                          <q-item-section avatar>
                             <q-icon :color="tab.color" :name="tab.icon" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label overline :class="`text-${tab.color}`">{{$_.get(tab,'label',tab.name).toUpperCase()}}</q-item-label>
                            <q-item-label>
                              <span class="cimpl-tabs-overview-panel-items">
                                <slot v-for="entry in tab.children" :key="entry.name" name="`overview-entry:${tab.name}:${entry.name}`">
                                  <span class="cimpl-tabs-overview-panel-item" v-if="$_.get(entry,'label','').trim() != ''">
                                    {{entry.label.toLowerCase()}}
                                  </span>
                                </slot>
                              </span>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon dense name="more_horiz" />
                          </q-item-section>
                          <q-tooltip>{{$t('gen.actions.show_more')}} / {{$t('gen.actions.view_more_options')}}</q-tooltip>
                        </q-item>
                      </q-list>
                    </div>
                  </q-tab-panel>-->
                  <slot :name="`tab-panel-${tabData.name}`" v-for="tabData in schema" :key="tabData.name">
                      <q-tab-panel v-bind="tabDataProxy(tabData,'panel')" :data-name="tabData.name">
                          <!--<div class="text-h6">PANEL: {{tabName}}</div>-->
                          <slot :name="`tab-panel-${tabData.name}-content`">
                            <div class="tab-panel-content-wrapper" :class="`row ${$store.getters.row_gutter}`">
                              <slot :name="`tab-panel-${tabData.name}-content-child-${child.name}`" v-for="child in children2Render(tabData)" :key="child.name">
                                <!--mando render child: '{{child.name}}' / '{{child.type}}'<br />-->
                                <cimpl-schema-entry-renderaaaa
                                  :schemaItem="child"
                                  :schema="context.innerSchema"
                                  :ref="`entry_component_${child.entry_uid}`"
                                  :context="context"
                                  :render-slots="context.getSlotsFor(child.entry_uid)"
                                  @update:modelValue="(payload) => onEntryUpdateModelValue_(payload,tabData.name)"
                                  @removeModelUpdate="onEntryRemoveModelUpdate_"
                                  @modelUpdate="onEntryModelUpdate_"
                                  @validationError="(payload) => onEntryValidationError_(payload,tabData.name)"
                                  @validationSuccess="(payload) => onEntryValidationSuccess_(payload,tabData.name)"
                                  />
                                <!--<span class="text-h6">--- despues del entry render</span>-->
                              </slot>
                            </div>
                          </slot>
                      </q-tab-panel>
                  </slot>
              </q-tab-panels>
            </div>
        </slot>
      </div>
    </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, watch, ref, unref, provide } from 'vue'
import _ from 'lodash'

import { getClosestParentComponent } from './../../../../utils/components.js'
import { CIMPL_FORM_notificationChips } from './../../form/utils.js'
import plain_copy from 'src/utils/plain_copy'
import useModels from './../composable.models.js'

import { getComponentSlots } from '/src/utils/components.js'
//import CimplSchemaEntryRender from './entry.render.js'

const $_TAB_DEFAULTS = {
  name: 'default-tab-name',
  icon: false,
  // 'keep-alive': true,
  color: 'black',
  children: []
}

const $_GET_CURRENT_TAB_VALUE = function (modelValue, defaultTab, schema) {
  let value = ''
  if (modelValue !== undefined) { value += modelValue } else if (defaultTab !== undefined) { value += defaultTab } else if (schema.length) { value += schema[0].name }
  return value
}

function $_PARSE_TABS(schema,compo)
{
  const tabs = {}
  if (schema.length) {
    for (const x in schema) {
      const schemaX = unref(schema[x])
      if(schemaX === undefined) continue
      tabs[schemaX.name] = _.merge({},/*{notifications: compo !== undefined ? compo.currentNotifications : []},*/ $_TAB_DEFAULTS, plain_copy(schemaX))
    }
  }
  return tabs
}

export default defineComponent({

  name: 'cimpl-schema-tabbed',
  tagname: 'cimpl-schema-tabbed',
  props: {
    modelValue: {
      required: false,
      default: undefined
    },

    showAsMenu: {
      required: false,
      default: true
    },

    map: {
      required: false,
      default: '',
    },

    entry: {
      required: true,
    },

    schema: {
      required: true,
      type: Object
    },
    defaultTab: {
      required: false,
      type: String,
      default: undefined
    },

    /*context: {
      required: true
    },*/

    direction: {
      required: false,
      type: String,
      default: 'vertical' // horizontal | vertical | horizontal-reverse | vertical-reverse
    },

    tabsProxy: {
      required: false,
      default: {}
    },

    panelsProxy: {
      required: false,
      default: {
        // 'keep-alive': true
      }
    },

    notifications: {
      required: false,
      type: Array,
      default: ['updates', 'errors'],
    },

    tooltip: {
      default: false,
    },

    showTabs: {
      required: false,
      type: Boolean,
      default: true,
    },

    showPanels: {
      required: false,
      type: Boolean,
      default: true,
    },

    /* breakpoint: {
      required: false,
      type: Number || String,
      default: 600
    },

    outsideArrows: {
      required: false,
      type: Boolean,
      default: false
    },

    mobileArrows: {
      required: false,
      type: Boolean,
      default: false
    },

    align: {
      required: false,
      type: String,
      default: 'center'
    },

    leftIcon: {
      required: false,
      type: String,
      default: undefined
    },

    rightIcon: {
      required: false,
      type: String,
      default: undefined
    },

    stretch: {
      required: false,
      type: Boolean,
      default: undefined
    },

    shrink: {
      required: false,
      type: Boolean,
      default: undefined
    },

    switchIndicator: {
      required: false,
      type: Boolean,
      default: undefined
    },

    narrowIndicator: {
      required: false,
      type: Boolean,
      default: undefined
    },

    inlineLabel: {
      required: false,
      type: Boolean,
      default: undefined
    },

    noCaps: {
      required: false,
      type: Boolean,
      default: undefined
    },

    activeColor: {
      required: false,
      type: String,
      default: undefined
    },

    activeBgColor: {
      required: false,
      type: String,
      default: undefined
    },

    indicatorColor: {
      required: false,
      type: String,
      default: undefined
    },

    contentClass: {
      required: false,
      type: String,
      default: undefined
    },

    activeClass: {
      required: false,
      type: String,
      default: undefined
    },

    dense: {
      required: false,
      type: Boolean,
      default: false
    } */
  },

  /*components: {
    CimplSchemaEntryRender
  },*/

  watch: {
    schema: {
      handler(newValue,oldValue)
      {
        //alert("CAMBIA SCHEMA TABBED")
        this.parseTabs()
      }/*,
      deep: true,*/
      //para mi ese deep tendría que estar, pero no puedo descubrir por qué
      //algo desde el schema-entry me actualiza el item y consecuentemente el schema
      //y de esa manera entro en un loop
    },

    /*tabs: {
      handler(newValue,oldValue)
      {
      },
      deep: true
    },*/

    modelValue(newValue) {
      this.currentTab = $_GET_CURRENT_TAB_VALUE(newValue, this.defaultTab, this.schema)
      this.innerCImplTab = $_GET_CURRENT_TAB_VALUE(newValue, this.defaultTab, this.schema)
    },

    map(newValue)
    {
      if(this.waitingForMapUpdate)
        {
          this.waitingForMapUpdate = false
          while(this.afterMapUpdate.length)
            this.afterMapUpdate.pop()(newValue)
        }
    },
  },

  emits: ['update:modelValue','update:map'],

  computed: {
    context() {
      return this.entry.context
    },

    parsedNotifications()
    {
      
    },

    mainClassess () {
      //console.log("cimpl-tabbed [START] mainClassess")
      const classess = [
        'cimpl-schema-tabbed',
        `tabbed-direction-${this.direction}`,
        this.showTabs ? 'show-tabs' : undefined,
        this.showPanels ? 'show-panels' : undefined
      ]
      //console.log("cimpl-tabbed [END] mainClassess")
      return classess
    },

    isVertical () {
      const result = this.direction === 'vertical' || this.direction === 'vertical-reverse'
      //console.log("cimpl-tabbed isVertical (computed)?",result)
      return result
    },

  },

  methods: {

    getTabIndex(name)
    {
      //console.log("cimpl-tabbed getTabIndex")
      var found = false
      this.schema.forEach((tab,index) => {
        if(found !== false) return
        if(tab.name === name) found = index
      })
      return found
    },

    /*filter "undefined" from items*/
    children2Render(tabData){
      let items = []
      for (const x in tabData.children)
          if (tabData.children[x] !== undefined && tabData.children[x] !== null)
              items.push(tabData.children[x])
      //console.log("cimpl-tabbed children2Render")
      return items
    },

    entriesSlots (exclude) {
      //console.log("cimpl-tabbed entriesSlots")
        let temp = getComponentSlots(this.$slots, 'entry-slot:')
        let slots = []
        for (const x in temp) {
            const foo = temp[x].split(':')
            if (foo[0] !== exclude)
                slots.push(`entry-slot:${temp[x]}`)
        }
        return slots
    },

    parseTabs() {
      //console.log("cimpl-tabbed parseTabs")
      const tabs = $_PARSE_TABS(this.schema,this)
      this.tabs = tabs
      for(const x in tabs)
        if(this.currentNotifications[x] === undefined)
          this.currentNotifications[x] = {
            updates: {},
            errors: {},
          }

      return tabs
    },

    getTabNames () {
      //console.log("cimpl-tabbed getTabNames")
      const names = []
      for (const x in this.tabs) { names.push(this.tabs[x].name) }
      return names
    },

    tabDataProxy (tabData, type) {
      const props = {
        /* 'keepAlive',
        'keepAliveInclude',
        'keepAliveExclude',
        'keepAliveMax',
        'animated',
        'infinite',
        'swipeable',
        'vertical',
        'transitionPrev',
        'transitionNext'
        'transitionDuration', */
        tab: [
          'icon',
          'label',
          'alert',
          'alertIcon',
          'noCaps',
          'name',
          'tabindex',
          'disable',
          'contentClass',
          'ripple',

          'class',
          'style',
        ],
        panel: [
          /* 'keepAlive',
          'keepAliveInclude',
          'keepAliveExclude',
          'keepAliveMax',
          'animated',
          'infinite',
          'swipeable',
          'vertical', */
          'name',
          'disable',
          'dark',
          /* 'transitionPrev',
          'transitionNext',
          'transitionDuration' */

          'class',
          'style',
        ]
      }

      const result = {}
      for (const x in props[type]) {
        if (tabData[props[type][x]] !== undefined) {
          result[props[type][x]] = props[type][x] === 'label' ? this.$t(tabData[props[type][x]]) : tabData[props[type][x]]
        }
      }

      if(result.class === undefined) result.class = []
      if(typeof result.class === 'string') result.class = result.class.split(' ')

      switch(type)
      {
        case 'panel':
          //result.class.push('row',this.$store.getters.row_gutter)
          break
      }

      return result
    },

    getTabBadgeProps (type,tabName) {
      //console.log("cimpl-tabbed getTabBadgeProps")
      const props = {
        floating: true,
        rounded: true,
        style: 'font-size: 10px; padding: 2px 5px;'
        // outline: true
      }
      switch (type) {
        case 'error':
          props.color = 'red'
          props.textColor = 'white'

          if(Object.keys(this.currentNotifications[tabName].updates).length)
            props.style += 'top: 24px;'
          break
      }
      return props
    },

    /*entry events*/
    onEntryUpdateModelValue_ (payload,tabName) {
      //console.log("cimpl-tabbed onEntryUpdateModelValue_")
      const result = this.entry.onEntryUpdateModelValue(payload)
      const compo = this.context.bindedEntries[payload.entry.uid]
      if(result.events.modelUpdate)
      {
        //add update notification
        const modelParsed = result.events.modelUpdate.update.modelConfig.modelParsed
        if(this.currentNotifications[tabName] === undefined)
          this.currentNotifications[tabName] = {
            updates: {},
            errors: {},
          }
        this.currentNotifications[tabName].updates[modelParsed] = result.events.modelUpdate.update
      }

      if(result.events.removeModelUpdate)
        //remove update notification
        delete this.currentNotifications[tabName].updates[result.events.removeModelUpdate.update.modelConfig.modelParsed]
      
      //this.triggerNestedNotifications()

      return result
    },
    onEntryRemoveModelUpdate_(payload) {
      //console.log("cimpl-tabbed onEntryUpdateModelValue_")
      return this.entry.onEntryRemoveModelUpdate(payload)
    },
    onEntryModelUpdate_(payload) {
      //console.log("cimpl-tabbed onEntryModelUpdate_")
      return this.entry.onEntryModelUpdate(payload)
    },
    onEntryValidationError_(payload,tabName) { 
      //console.log("cimpl-tabbed onEntryValidationError_")
      const result = this.entry.onEntryValidationError(payload)
      this.currentNotifications[tabName].errors[result.model] = result
      //this.triggerNestedNotifications()
      return result
    },
    onEntryValidationSuccess_(payload,tabName) {
      //console.log("cimpl-tabbed onEntryValidationSuccess_")
      const result = this.entry.onEntryValidationSuccess(payload)
      delete this.currentNotifications[tabName].errors[result.model]
      //this.triggerNestedNotifications()
      return result
    },


    removeTabsNotification(type,model)
    {
      //console.log("cimpl-tabbed removeTabsNotification")
      for(const x in this.currentNotifications)
      {
        if(model === undefined) this.currentNotifications[x][type] = {}
        else delete this.currentNotifications[x][type][model]
      }
      //this.triggerNestedNotifications()
    },




    tabChanged(newValue)
    {
      //console.log("cimpl-tabbed tabChanged")
      //console.log("- new tab ?",newValue)
      this.$emit('update:modelValue',newValue)
    },

    mapChanged(newValue)
    {
      //console.log("cimpl-tabbed mapChanged")
      this.waitingForMapUpdate = true
      this.$emit('update:map',newValue)
    },

    triggerOverview(map)
    {
      //console.log("cimpl-tabbed triggerOverview")
      const overview = "___overview"
      if(map.trim() === '') this.$emit('update:modelValue', overview)
      else
      {
        var temp = map.split('.controller.schema')
        temp.pop()
        //console.log("PRE GET ENTRY",temp)
        const entry = _.get(this.entry.schemaEntry.controller.schema,temp.join(".controller.schema"))
        if(entry)
          this.context.getBindedEntry(entry.entry_uid).then(compo => compo.$refs.component.tabChanged(overview))
      }
    },

    triggerMap(tab,cimplTabs)
    {
      //console.log("cimpl-tabbed triggerOverview")
      //const tabIndex = this.getTabIndex(tab.name)
      ////const parent = getClosestParentComponent('cimpl-schema-tabbed',this)
      
      var newMap = `${this.entry.schemaEntry.selector}.controller.schema`
      //this.waitingForMapUpdate = true
      //this.tabChanged(tab.name,true)
      this.triggerParentMap(tab,newMap,this,''+this.map,cimplTabs)

    },

    triggerParentMap(tab,map,orig,origMap,cimplTabs)
    {
      //console.log("cimpl-tabbed triggerOverview")
      const parent = getClosestParentComponent('cimpl-schema-tabbed',this)
      if(parent) parent.triggerParentMap(tab,map,orig,origMap)
      else
      {
        const finalMap = map.substring((this.entry.schemaEntry.selector + '.controller.schema.').length)
        this.mapChanged(finalMap)
        this.innerCImplTab = tab.name
        orig.tabChanged(tab.name,true)
        const nested = (cimplTabs !== undefined ? cimplTabs : this.$refs.tabsComponent).nestedMaps
        for(const x in nested)
          if(nested[x].map !== finalMap)
            if(nested[x].map.indexOf(finalMap) === 0)
            {
              this.triggerOverview(nested[x].map)
            }
        //this.$refs.tabs.tabChanged(tab.name)
        /*console.log("MANDO EMIT ORIG",tab,origMap,"<<--")
        this.$emit('update:modelValue',tab.name)*/
      }
    },

    triggerNestedNotifications_inParent(notifications,selector)
    {
      //console.log("cimpl-tabbed triggerNestedNotifications_inParent")
      const parent = getClosestParentComponent('cimpl-schema-tabbed',this)
      if(parent) parent.triggerNestedNotifications_inParent(notifications,selector)
      else
      {
        var mappedSelector = (selector.trim() === '' ? selector : selector.substr(`${this.entry.schemaEntry.selector}.controller.schema.`.length)) + (selector.trim() === '' ? '' : '.controller.schema')
        if(mappedSelector.trim() === '.controller.schema') mappedSelector = ''
        this.nestedNotifications[mappedSelector] = notifications
      }
    }
  },

  setup (props) {
    //console.log("cimpl-tabbed setup()")
    const bindedEntries = {}

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
            onEntryValidationError
        } = useModels()

    const parsedTabs = $_PARSE_TABS(props.schema)
    let currentNotifications = {}
    for(const x in parsedTabs)
      currentNotifications[x] = {
        updates: {},
        errors: {}
      }

    const setupData = {
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


      tabs: ref(parsedTabs),
      currentTab: ref($_GET_CURRENT_TAB_VALUE(props.modelValue, props.defaultTab, props.schema)),
      innerCImplTab: ref($_GET_CURRENT_TAB_VALUE(props.modelValue, props.defaultTab, props.schema)),
      currentNotifications: ref(currentNotifications),

      waitingForMapUpdate: ref(false),
      afterMapUpdate: ref([]),


      nestedNotifications: ref({}),
    }

    //console.log("cimpl-tabbed setup() END")
    return setupData
  },

  data () {
    return {
    }
  },
})
</script>

<style lang="scss" scoped>
  .cimpl-schema-tabbed
  {
    &-main-wrapper
    {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      justify-content: space-between;

      &-tabs
      {
        //width: 140px;
        //position: sticky;
        max-height: 100%;
        //top: 60px;
      }

      &-panels
      {
        //width: calc(100% - 160px);
        width: 100%;
        .q-tab-panel
        {
          padding: 3px; /*fix for drop shadows*/
        }
      }
    }

    &.show-panels.show-tabs
    {
      $tabsWidth: 140px;
      > .cimpl-schema-tabbed-main-wrapper
      {
        > .cimpl-schema-tabbed-main-wrapper-tabs
        {
          width: $tabsWidth;
        }

        > .cimpl-schema-tabbed-main-wrapper-panels
        {
          
          width: calc(100% - #{$tabsWidth} - 20px);
        }

        &.is-menu
        {
            $tabsWidth: 200px;
            .cimpl-schema-tabbed-main-wrapper-tabs
            {
              width: $tabsWidth;
              background: #f5f5f5;
            }

            .cimpl-schema-tabbed-main-wrapper-panels
            {
              width: calc(100% - #{$tabsWidth} - 20px);
            }
        }
      }
    }

    &.tabbed-direction-horizontal,
    &.tabbed-direction-horizontal-reverse
    {
      .cimpl-schema-tabbed-main-wrapper
      {
        &-tabs,
        &-panels
        {
          width: 100%;
        }
      }
    }

    &.tabbed-direction-horizontal-reverse
    {
      & > .cimpl-schema-tabbed-main-wrapper
      {
        flex-direction: column-reverse;
      }
    }

    &.tabbed-direction-vertical-reverse
    {
      & > .cimpl-schema-tabbed-main-wrapper
      {
        flex-direction: row-reverse;

        .q-tab__indicator
        {
          left: 0;
          right: unset;
        }
      }
    }
  }

</style>

<style lang="scss">
  .cimpl-schema-tabbed
  {
    .q-tabs__content
    {
      height: auto !important;
      position: sticky;
      top: 10px;
    }

    .q-tab-panel
    {
      padding: 3px;
    }

    //$spaces: (xs: $space-xs,sm: $space-sm,md: $space-md,lg: $space-lg,xl: $space-xl);
    //@each $spaceName, $spaceValue in $spaces {
      //.q-tab-panel.q-col-gutter-#{$spaceName}
      //{
        //width: calc(100% + #{map-get($spaceValue,'x')}*2);
      //}
    //}
  }
</style>
