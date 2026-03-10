<template>
  <div class="c-table-row-tools">
    <div
      class="c-table-row-tool"
      v-for="(tool,index) in children.buttons"
      :key="index"
    >
      <q-btn
        v-bind="tool.props"
        :disable="disableTools"
      >
        <q-tooltip v-if="!disableTools">{{tool.def.label}}</q-tooltip>
      </q-btn>
    </div>
    <div
      class="c-table-row-tool"
      v-if="children.items.length"
    >
      <q-btn
        v-bind="commonBtnOpts"
        icon="sym_o_more_vert"
        :disable="disableTools"
      >
        <q-tooltip v-if="!disableTools">_MORE</q-tooltip>
        <q-menu>
          <q-list separator>
            <q-item
              v-for="(tool,index) in children.items"
              :key="index"
              v-bind="tool.props"
              :disable="disableTools"
              v-close-popup
            >
              <q-item-section avatar>
                <q-icon
                  v-bind="commonBtnOpts"
                  :name="tool.def.icon"
                />
              </q-item-section>
              <q-item-section>{{tool.def.label}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
<script>
import { defineComponent, h, watchEffect, withDirectives, computed, reactive } from 'vue'
import { useInjectCTable } from './../../composables/table-provide'

export default defineComponent({
  name: 'CTableRowTools',

  props: {
    row: undefined,
    //col: undefined,

    /*list of tools to show, an array with strings or objects, when a string, the "real" object/tools is
    fetched with defaults.get(`cimpl-tablew.rowTools.${name}`), ignored if can't be found,
    when an object, expected format is:
    {
        name: 'edit',
        icon: 'edit',
        label: '_Edit',
        bulk: undefined,
        handler: (row, col, confirm) => { console.log("EDIT", row, col, confirm); confirm() }
    }
    */
    tools: {
      required: true,
      type: Array
    },


    bulk: {
      required: false,
      type: Boolean,
      default: false
    },

    buttons: {
      required: false,
      type: [Number, Array],
      default: 1,
    },

    //debug related
    exposedKey: undefined,
    debugRender: { required: false, type: Boolean, default: false },
    debugWatch: { required: false, type: Boolean, default: false },
    debugSetup: { required: false, type: Boolean, default: false }
  },

  //emits: ['rowtool:confirm'],

  setup (props, { emit }) {
    //const toolNodesCache = new Map()

    //console.log("ROW TOOLS SETUP", props)

    const {
      childEmit,
      selection
    } = useInjectCTable()

    const confirmTool = (tool) => {
      console.log("TOOL CONFIRM", tool)
      childEmit('rowtool:confirm', { name: tool.name, row: props.row, bulk: props.bulk })
    }

    const commonBtnOpts = {
      //padding: 'none',
      size: 'xs',
      flat: true,
    }

    const disableTools = computed(() => props.bulk && !selection.value.length)

    //const toolPropsButtons = reactive({})
    //const toolPropsItems = reactive({})

    //const children = reactive({
    //buttons: reactive([]),
    //items: reactive([])
    //})

    const children = computed(() => {
      var res = {
        buttons: [],
        items: []
      }

      const buttonsIsInt = typeof props.buttons === 'number'

      for (const x in props.tools) {
        const tool = props.tools[x]
        console.log("parse tool", x, tool, typeof x)

        //if the tool has a declared mode (per-row/selection signaled by tool.bulk and props.bulk) and we're on a different mode, ignore it
        if (tool.bulk !== undefined && tool.bulk !== props.bulk) continue

        var isButton = false
        if ((buttonsIsInt && res.buttons.length < props.buttons) || (!buttonsIsInt && props.buttons.includes(tool.name)))
          isButton = true

        if (isButton) res.buttons.push({
          def: tool,
          props: {
            ...commonBtnOpts,
            //disable: disableTools.value,
            icon: tool.icon,
            onClick: () => tool.handler(props.row, props.col, props.bulk, () => confirmTool(tool))
          }
        })
        else res.items.push({
          def: tool,
          props: {
            clickable: true,
            //disable: disableTools.value,
            onClick: () => tool.handler(props.row, props.col, props.bulk, () => confirmTool(tool))
          }
        })
      }

      return res
    })

    return {
      disableTools,
      commonBtnOpts,
      children
    }
  }

})
</script>