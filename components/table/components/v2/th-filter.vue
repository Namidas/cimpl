<template>
  <div class="c-th-filter">
    <component
      :is="filterComponentDefinition"
      v-bind="filterComponentProps"
    />
    <div
      v-if="hasOptions"
      class="tools row"
    >
      <div
        v-if="renderDebouncer"
        class="tool enabled"
      >
        <CCircularTimedProgress v-bind="debouncerProps" />
      </div>
      <CThFilterClear
        v-if="renderFilterClear"
        v-bind="filterClearProps"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, resolveComponent, nextTick, ref } from 'vue'
import isVueComponentDefinition from './../../../../utils/isVueComponentDefinition'
import CCircularTimedProgress from './../../../CCircularTimedProgress'
import _ from 'lodash'
import CThFilterClear from './th-filter-clear.vue'

import { useInjectCTable } from './../../composables/table-provide'

export default defineComponent({
  name: 'CThFilter',

  components: {
    CCircularTimedProgress,
    CThFilterClear
  },

  props: {
    col: {
      required: true
    }
    /*colName: {
      required: true,
      type: String
    }*/
    /*props: {
      required: true,
      type: Object
    },

    filter: {
      required: false,
      default: ''
    },

    component: {
      required: false,
      type: [String, Object],
      default: 'input'
    },

    debugRender: undefined,
    debugWatch: undefined*/
  },

  emits: [
    'update:filter',
  ],

  setup (props, { emit }) {

    const { tableConfig, tableLabels, getColumnFilter } = useInjectCTable()

    const debouncingFilter = ref(false)
    const renderDebouncer = computed(() => props.col.filterDebounce && debouncingFilter.value)
    const debouncerProps = computed(() => {
      return {
        ref: debounceProgressNodeRef,
        time: props.col.filterDebounce,
        thickness: 1,
        //showValue: 'ms',
        autoStart: false,
        'onClock:trigger': emitFilter
      }
    })

    const filterValue = getColumnFilter(props.col.name)
    const filterValueString = computed(() => filterValue.value ? filterValue.value.join(', ') : undefined)
    const hasFilter = computed(() => filterValueString.value ? filterValueString.value.trim() !== '' : false)
    const renderFilterClear = computed(() => props.col.filterShowAlways && hasFilter.value)
    const filterClearProps = computed(() => {
      return {
        //colName: scope.col.name,
        enabled: true,
        'onClear:filter': (payload) => {
          debouncingFilter.value = false
          emit('update:filter', { col: props.col, value: '' })
        }
      }
    })

    const nativeInputs = [
      'input'
    ]
    const isNativeInput = computed(() => nativeInputs.includes(tableConfig.get('filters.component')))
    const filterComponentDefinition = computed(() => {
      if (isNativeInput.value) return tableConfig.get('filters.component')
      if (isVueComponentDefinition(tableConfig.get('filters.component'))) return tableConfig.get('filters.component')
      return resolveComponent(tableConfig.get('filters.component'))
    })

    function emitFilter () {
      debouncingFilter.value = false
      if (isNativeInput.value) {
        if (isNativeInput.value) filterNodeRef.value.blur()
        lastEmit = filterNodeRef.value.value
        emit('update:filter', { col: props.col, value: filterNodeRef.value.value })
      }
    }

    const filterNodeRef = ref(null)
    const debounceProgressNodeRef = ref(null)
    var lastEmit = ''
    const filterComponentProps = computed(() => {
      var compoProps = _.merge({},
        //base props
        {
          //class: ['full-width'],
          ref: filterNodeRef,
          name: `table_filter[${props.col.name}]`
        },
        //props if native input
        isNativeInput.value ? {
          value: filterValueString.value,
          placeholder: '_placeholder',
          onInput: /*async */(payload) => {
            if (payload.target.value === lastEmit) return debouncingFilter.value = false
            if (!debouncingFilter.value) debouncingFilter.value = true
            nextTick(() => debounceProgressNodeRef.value.restartClock())
          },
          onKeydown: (payload) => {
            if (payload.key === 'Enter')
              emitFilter()
          }
        } : undefined,
        //props if vue
        !isNativeInput.value ? {
          modelValue: props.filter,
          'onUpdate:modelValue': (payload) => {
            emit('update:filter', { col: props.col, value: payload })
          }
        } : undefined)
      return compoProps
    })
    //const filterNode = () => h(filterComponentDefinition.value, filterComponentProps.value)

    const hasOptions = computed(() => hasFilter.value || debouncingFilter.value)

    return {
      filterComponentDefinition,
      filterComponentProps,
      hasOptions,
      renderDebouncer,
      debouncerProps,
      renderFilterClear,
      filterClearProps
    }
  }
})

</script>