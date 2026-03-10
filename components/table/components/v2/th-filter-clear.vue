<template>
  <div :class="compoProps.wrapperCSSClassess">
    <q-btn v-bind="compoProps.buttonProps">
      <q-tooltip v-if="compoProps.tooltip">{{compoProps.tooltip}}</q-tooltip>
    </q-btn>
  </div>
</template>
<script>
import { defineComponent, h, computed } from 'vue'
import defaults from './../../../../utils/defaults'

export default defineComponent({
  name: 'CThFilterClear',

  emits: [
    'clear:filter'
  ],

  props: {
    enabled: {
      required: false,
      type: Boolean,
      default: false
    },

    /*colName: String,

    

    iconEnabled: {
      required: false,
      type: String,
      default: 'sym_o_filter_alt_off'
    },

    iconDisabled: {
      required: false,
      type: String,
      default: 'sym_o_filter_alt'
    },

    tooltipEnabled: {
      required: false,
      type: String,
      default: '_clear filter'
    },

    tooltipDisabled: {
      required: false,
      type: String,
      default: '_add filter'
    },

    debugRender: undefined,
    debugWatch: undefined*/
  },

  setup (props, { emit }) {
    var filtersConfig = defaults.getComputed('cimpl-table.filters')
    /*makes sense to make all this into a single computed since the only dependency for all of them is props.enabled
    and they will all change at once anyways...*/
    /*
    const index = computed(() => props.enabled ? 0 : 1)
    const currentProps = computed(() => {
      return {
        icon: filtersConfig.value.icon[index.value],
        tooltip: filtersConfig.value.tooltip[index.value]
      }
    })

    const wrapperCSSClassess = computed(() => {
      return [
        'c-th-filter-clear',
        'tool',
        props.enabled ? 'enabled' : null
      ]
    })*/

    const emitClearFilter = () => emit('clear:filter')
    const compoProps = computed(() => {
      const index = props.enabled ? 0 : 1
      return {
        wrapperCSSClassess: [
          'c-th-filter-clear',
          'tool-inner',
          props.enabled ? 'enabled' : null
        ],
        buttonProps: {
          size: 'xs',
          icon: filtersConfig.value.icon[index],
          padding: 'none',
          flat: true,
          onClick: emitClearFilter
        },
        tooltip: filtersConfig.value.tooltip[index]
      }
    })

    return {
      compoProps
    }
  }
})
</script>