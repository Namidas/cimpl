<template>
  <div :class="compoProps.wrapperCSSClassess">
    <q-btn v-bind="compoProps.buttonProps">
      <q-tooltip>{{tableLabels.sorting.select}}</q-tooltip>
      <q-menu separator>
        <q-item
          clickable
          @click="updateSortAD"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon
              :name="sortIcons.ad"
              size="xs"
            />
          </q-item-section>
          <q-item-section>{{tableLabels.sorting.ad}}</q-item-section>
          <q-item-section
            avatar
            v-if="sortValue === 'ad'"
          >
            <q-icon
              name="sym_o_check"
              size="xs"
              color="positive"
            />
          </q-item-section>
          <q-tooltip v-if="sortValue === 'ad'">{{tableLabels.sorting.disable}}</q-tooltip>
        </q-item>

        <q-item
          clickable
          @click="updateSortDA"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon
              :name="sortIcons.da"
              size="xs"
            />
          </q-item-section>
          <q-item-section>{{tableLabels.sorting.da}}</q-item-section>
          <q-item-section
            avatar
            v-if="sortValue === 'da'"
          >
            <q-icon
              name="sym_o_check"
              size="xs"
              color="positive"
            />
          </q-item-section>
          <q-tooltip v-if="sortValue === 'da'">{{tableLabels.sorting.disable}}</q-tooltip>
        </q-item>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
import { defineComponent, h, withDirectives, computed, ref, toValue } from 'vue'
import _ from 'lodash'
import defaults from './../../../../utils/defaults'
import { useInjectCTable } from './../../composables/table-provide'

export default defineComponent({
  name: 'CThSort',

  props: {
    colName: {
      required: true,
      type: String
    }
    /*props: {
      required: true,
      type: Object
    },

    sorting: {
      required: false,
      default: ''
    },

    debugRender: undefined,
    debugWatch: undefined*/
  },

  /*emits: [
    'update:sorting'
  ],*/

  setup (props, { emit }) {

    const { getColumnSort, tableConfig, tableLabels, childEmit } = useInjectCTable()

    function updateSort (direction) {
      if (direction !== '')
        if (sortValue.value === direction) direction = ''
      childEmit('update:sorting', { name: props.colName, direction })
    }

    const updateSortAD = () => updateSort('ad')
    const updateSortDA = () => updateSort('da')

    const sortValue = getColumnSort(props.colName)
    const sortIcons = tableConfig.get('sorting.icons')
    const compoProps = computed(() => {
      const keyword = !sortValue.value || sortValue.value.trim() === '' ? 'select' : sortValue.value
      return {
        wrapperCSSClassess: [
          'tool-inner',
          sortValue.value && sortValue.value.trim() !== '' ? 'enabled' : null
        ],

        buttonProps: {
          size: 'xs',
          icon: sortIcons[keyword],
          padding: 'none',
          flat: true,
          class: 'cimpl-table-th-sorter'
        }
      }
    })

    return {
      sortValue,
      compoProps,
      tableLabels,
      sortIcons,
      updateSortAD,
      updateSortDA
    }
  }
})
</script>