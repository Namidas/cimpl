<template>
  <div class="c-table-tools row items-center">
    <component
      v-for="(tool,index) in renderTools.buttons"
      :key="index"
      :is="tool.component ? tool.component : 'CTableToolsButton'"
      render-as="button"
      :def="tool"
    />
    <div
      v-if="renderTools.items.length"
      class="c-table-tool"
    >
      <q-btn
        icon="sym_o_more_vert"
        flat
        padding="xs"
        size="sm"
      >
        <q-tooltip>_more</q-tooltip>
        <q-menu>
          <q-list separator>
            <component
              v-for="(tool,index) in renderTools.items"
              :key="index"
              :is="tool.component ? tool.component : 'CTableToolsListItem'"
              render-as="list-item"
              :def="tool"
            />
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
<script>
import { defineComponent, markRaw, computed } from 'vue'
import defaults from './../../../utils/defaults'
import _ from 'lodash'

import CTableToolsButton from './table-tools-button.vue'
import CTableToolsListItem from './table-tools-listitem.vue'

export default defineComponent({
  name: 'CTableTools',

  props: {
    tools: {
      required: false,
      type: Array,
    },

    buttons: {
      required: false,
      type: Number,
    },

    /*views: {
      required: false,
      type: Array
    },
    currentView: {
      required: false,
      type: Object
    },
    viewStyles: {
      required: false,
      type: Array
    },
    currentViewStyle: {
      required: false,
      type: Object
    },*/
  },

  emits: [
    'update:view-type',
    'update:view-style'
  ],

  components: {
    CTableToolsButton,
    CTableToolsListItem
  },

  setup (props, { emit }) {

    const availableTools = computed(() => {
      var res = []
      for (const x in props.tools) {
        var tool = typeof props.tools[x] === 'string' ? defaults.get(`cimpl-table.tools.${props.tools[x]}`) : props.tools[x]
        if (!tool) continue
        tool = _.merge({}, tool, tool.component ? { component: markRaw(tool.component) } : {})
        res.push(tool)
      }
      return res
    })

    //console.log("availableTools", availableTools.value)

    const renderTools = computed(() => {
      var res = {
        buttons: [],
        items: []
      }
      const buttons = props.buttons !== undefined ? props.buttons : 99999999
      for (const x in availableTools.value)
        if (x < buttons) res.buttons.push(availableTools.value[x])
        else res.items.push(availableTools.value[x])

      return res
    })

    /*const availableViews = computed(() => {
      var res = []
      for (const x in props.views) {
        const view = typeof props.views[x] === 'string' ? defaults.get(`cimpl-table.views.${props.views[x]}`) : props.views[x]
        console.log("view", view, props.views[x])
        if (!view) continue
        res.push(view)
      }
      return res
    })
    console.log("AVAILABLE VIEWS", availableViews.value[0])*/
    //const currentView = ref(props.current
    const changeView = (payload) => {
      //if (props.currentView.name === payload.name) return
      emit('update:view-type', payload)
    }

    const renderViews = computed(() => props.views.length > 1)

    /*const availableViewStyles = computed(() => {
      var res = []
      for (const x in props.viewStyles) {
        const viewStyle = typeof props.viewStyles[x] === 'string' ? defaults.get(`cimpl-table.viewStyles.${props.viewStyles[x]}`) : props.viewStyles[x]
        if (!viewStyle) continue
        res.push(viewStyle)
      }
      return res
    })*/
    //const currentViewStyle = ref(availableViewStyles.value[0])
    const changeViewStyle = (payload) => {
      /*if (currentViewStyle.value.name === payload.name) return
      currentViewStyle.value.handler(false)
      currentViewStyle.value = payload
      currentViewStyle.value.handler(true)*/
      emit('update:view-style', payload)
    }

    const renderViewStyles = computed(() => props.viewStyles.length > 1)


    return {
      //availableViews,
      //currentView,
      changeView,
      renderViews,
      //availableViewStyles,
      //currentViewStyle,
      changeViewStyle,
      renderViewStyles,


      renderTools
    }
  }
})
</script>