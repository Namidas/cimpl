<template>
  <component
    :is="cellValues.tdSlot"
    class="c-td"
    v-bind="mainCompoProps"
    :data-cell-type="colValues.colDef.type"
  >
    <div
      class="c-td-outter-wrap"
      v-bind="innerProps.wrapProps"
      v-if="!colValues.isSpecial"
    >
      <div
        class="c-td-icons row q-colgutter-xs"
        v-if="cellValues.icon"
      >
        <span
          class="col"
          v-for="(icon,key) in cellValues.icon"
          :key="key"
        >
          <q-icon :name="icon" />
        </span>
      </div>

      <CTdPopupEdit
        ref="popupEditRef"
        v-bind="editProps"
        v-if="innerProps.usePopupEdit"
      />
      <CTdInCellEdit
        ref="popupEditRef"
        v-bind="editProps"
        v-if="innerProps.renderIncellEdit"
      />
      <CellContent
        v-bind="cellContentProps"
        v-show="innerProps.showContent"
      />
      <div
        class="tools"
        v-if="innerProps.useToolsBlock"
      >
        <q-btn
          v-if="!saving"
          size="xs"
          icon="edit"
          padding="none"
          flat
          @click="triggerCellEdit"
        >
          <q-tooltip>_EDIT</q-tooltip>
        </q-btn>
        <q-circular-progress
          v-else
          indeterminate
        />
      </div>
    </div>
    <div
      class="c-td-outter-wrap"
      v-bind="innerProps.wrapProps"
      v-else
    >
      <component
        :is="specialCompo"
        :row="props.row"
        :col="props.col"
        v-bind="specialCompoProps"
      />
    </div>
  </component>
</template>
<script>

import { defineComponent, computed, ref, watchEffect } from 'vue'
import _ from 'lodash'

import CellContent from './content.vue'
import CTdPopupEdit from './td-popup-edit.vue'
import CTdInCellEdit from './td-incell-edit.vue'
import CTdSelect from './td-selector.vue'
import CTdTools from './td-tools.vue'

import { useInjectCTable } from './../../composables/table-provide'
import { useProvideBodyCell } from '../../composables/td-provide'

export default defineComponent({
  name: 'CTd',

  /*emits: [
    'update:cell',
  ],*/

  components: {
    CTdPopupEdit,
    CellContent,
    CTdInCellEdit
  },

  props: {
    props: {
      required: true,
      type: Object
    },

    colIndex: {
      required: true,
      type: Number
    }
    /*...compoExtend_get(QTd, 'props'),

    specialCol: {
      required: false,
      type: Boolean,
      default: false,
    },

    highlight: {
      required: false,
      type: String,
      //default: 'lorem'
    },
    exposedKey: undefined,
    debugRender: { required: false, type: Boolean, default: false },
    debugWatch: undefined,
    debugSetup: undefined*/
  },

  setup (props) {
    if (props.debugSetup) {
      console.log(`// CTd v2 '${props.props?.col?.name}' <${props.exposedKey}> setup`)
      console.log("CTd v2 props", props)
    }

    const {
      getColumnValues,
      getCellValues,
      getSlot,
      tableProps,
      getColumnFilter,
      childEmit
    } = useInjectCTable()

    const colValues = getColumnValues(props.colIndex)
    const cellValues = getCellValues(props.props.rowIndex, props.colIndex)

    const saving = ref(false)
    const savingValue = ref(null)
    const innerProps = computed(() => {
      console.log("|| CTd compute innerProps")
      const renderIncellEdit = !saving.value && (isEditting.value && colValues.value.colDef.edit === true)
      const useToolsBlock = saving.value || (colValues.value.colDef.edit && colValues.value.colDef.editOn === 'button')
      return {
        usePopupEdit: colValues.value.colDef.edit === 'popup',
        useToolsBlock,
        wrapProps: {
          class: [
            colValues.value.colDef.edit ? 'editable' : undefined,
            useToolsBlock ? 'with-tools' : undefined
          ]
        },
        renderIncellEdit,
        showContent: !renderIncellEdit
      }
    })


    const isEditting = ref(false)
    const triggerCellEdit = () => {
      if (isEditting.value || saving.value) return
      isEditting.value = true
      if (innerProps.value.usePopupEdit) popupEditRef.value.show()
    }

    const inUseRow = ref(null)
    //watchEffect(() => {
    //console.log("|| CTd watchEffect inUseRow")
    if (inUseRow.value !== props.props.row) inUseRow.value = props.props.row
    //})
    const cellContentProps = computed(() => {
      console.log("|| CTd compute cellContentProps")
      var res = {
        type: colValues.value.colDef.type,
        //colIndex: props.colIndex,
        //colName: colValues.value.colDef.name,
        col: colValues.value.colDef,
        //rowIndex: props.props.rowIndex
        row: inUseRow.value
      }
      if (colValues.value.colDef.edit && colValues.value.colDef.editOn !== 'button')
        res[`on${colValues.value.colDef.editOn === 'click' ? 'Click' : 'Dblclick'}`] = triggerCellEdit
      if (saving.value)
        res.content = savingValue.value
      return res
    })



    const updateCell = (payload) => {
      saving.value = true
      isEditting.value = false
      savingValue.value = payload.value
      childEmit('update:cell', { ...payload, cancel: () => { saving.value = false; payload.cancel() }, col: colValues.value.colDef, row: props.props.row, done: () => saving.value = false })
    }

    const popupEditRef = ref(null)
    const editProps = {
      //ref: popupEditRef,
      onHide: () => isEditting.value = false,
      onCancel: () => isEditting.value = false,
      onSave: updateCell,
      //rowIndex: props.props.rowIndex,
      //colIndex: props.colIndex
      //col: colValues.value.colDef
    }

    //this is essentially qTd props plus scope (if there's a slot for body-cell)
    /*const propsAndScopes = computed(() => {
      console.log("|| CTd compute propsAndScopes")
      const slotProps = {
        //saving: saving.value,
        //cellContentProps: cellContentProps.value,
        //editProps,
        //innerProps: innerProps.value,
        //triggerCellEdit: triggerCellEdit
      }

      const res = {
        mainCompoProps: {
          props: {
            ...props.props,
            col: props.props.cols[props.colIndex]
          },
        },
        slotProps
      }

      if (cellValues.value.hasTDSlot) res.mainCompoProps = { ...res.mainCompoProps, ...slotProps }

      return res
    })*/

    const innerSlotProps = /*computed(() => */{
      //console.log("|| CTd compute innerSlotProps")
      //return {
      /*props: {
        ...props.props,
        col: props.props.cols[props.colIndex]
      },*/
      saving: saving/*.value*/,
      cellContentProps: cellContentProps/*.value*/,
      editProps,
      innerProps: innerProps/*.value*/,
      triggerCellEdit: triggerCellEdit
    }
    //})

    /*watch(() => props.colIndex, () => console.log("|| CTd watch props.colIndex"))
    watch(() => props.props, () => console.log("|| CTd watch props.props"))
    watch(() => props.props.color, () => console.log("|| CTd watch props.props.color"))
    watch(() => props.props.cols, () => console.log("|| CTd watch props.props.cols"))*/
    /*watch(() => props.props.cols[0], () => console.log("|| CTd watch props.props.cols[0]"))
    watch(() => props.props.cols[1], () => console.log("|| CTd watch props.props.cols[1]"))
    watch(() => props.props.cols[2], () => console.log("|| CTd watch props.props.cols[2]"))
    watch(() => props.props.cols[3], () => console.log("|| CTd watch props.props.cols[3]"))
    watch(() => props.props.cols[4], () => console.log("|| CTd watch props.props.cols[4]"))
    watch(() => props.props.cols[5], () => console.log("|| CTd watch props.props.cols[5]"))
    watch(() => props.props.colsMap, () => console.log("|| CTd watch props.props.colsMap"))*/
    /*watch(() => props.props.dark, () => console.log("|| CTd watch props.props.dark"))
    watch(() => props.props.dense, () => console.log("|| CTd watch props.props.dense"))
    watch(() => props.props.expand, () => console.log("|| CTd watch props.props.expand"))
    watch(() => props.props.key, () => console.log("|| CTd watch props.props.key"))
    watch(() => props.props.pageIndex, () => console.log("|| CTd watch props.props.pageIndex"))
    watch(() => props.props.row, () => console.log("|| CTd watch props.props.row"))
    watch(() => props.props.rowIndex, () => console.log("|| CTd watch props.props.rowIndex"))
    watch(() => props.props.selected, () => console.log("|| CTd watch props.props.selected"))
    watch(() => props.props.sort, () => console.log("|| CTd watch props.props.sort"))
    watch(() => props.props.__trClass, () => console.log("|| CTd watch props.props.__trClass"))*/

    const mainCompoProps = {
      props: {
        ...props.props,
        col: props.props.cols[props.colIndex]
      },

      class: cellValues.value.cssClass,
      style: cellValues.value.cssStyle
    }

    //console.log("COL", props.props.cols[props.colIndex])


    const commonReturns = {
      mainCompoProps,
      colValues,
      //propsAndScopes,
      innerSlotProps,
      cellValues,
      innerProps
    }

    useProvideBodyCell(colValues, cellValues, getSlot, tableProps, innerSlotProps, getColumnFilter)

    if (!colValues.value.isSpecial) {
      //common cell





      return {
        ...commonReturns,
        cellContentProps,
        isEditting,
        triggerCellEdit,

        popupEditRef,
        editProps,
        saving,
        savingValue
      }
    }
    else return {
      //special cell
      ...commonReturns,
      specialCompoProps: colValues.value.colDef.name === 'row-select' ? {} : {
        row: props.props.row
        //'onRowtool:confirm': payload => childEmit('rowtool:confirm', { name: payload, row: props.props.row })
      },
      specialCompo: colValues.value.colDef.name === 'row-select' ? CTdSelect : CTdTools
    }


    /*if (colValues.value.isSpecial) return {
      colValues,
      qTDProps
      //
    }*/

    /*const scope = props.props
    const colName = scope.col.name
    const colType = scope.col.type

    const {
      extendedPropsProxy
    } = useCompoExtend_computed(QTd, props)

    const tdProps = computed(() => {
      return {
        ...extendedPropsProxy.value,
        class: {
          'c-td': true,
          //'editable': scope.col.edit,
          //'with-tools': useToolsBlock
        },
        'data-cell-type': colType,
        'data-edit-on': scope.col.editOn
      }
    })

    const saving = ref(false)
    const usePopupEdit = computed(() => scope.col.edit === 'popup')
    const useToolsBlock = computed(() => saving.value || (scope.col.edit && scope.col.editOn === 'button'))

    const wrapProps = ref({
      class: {
        'editable': scope.col.edit,
        'with-tools': useToolsBlock
      }
    })

    const CTable = useCTable()

    const bodySlot = computed(() => {
      //const inheritedSlots = CTable.getSlot(new RegExp(`^body-cell(-type-${colType}|-${colName})?(:content)?$`), { translateNames: false })
      const inheritedSlots = CTable.getSlot(new RegExp(`^body-cell(-type-${colType}|-${colName})?$`), { translateNames: false })
      return hSlot(inheritedSlots[`body-cell-${colName}`], hSlot(inheritedSlots[`body-cell-type-${colType}`], hSlot(inheritedSlots['body-cell'])))
    })

    if (props.specialCol) return {
      bodySlot,
      scope,
      tdProps,
      wrapProps,
      specialCompo: computed(() => scope.col.name === 'row-select' ? CTdSelect : CTdTools)
    }

    useProvideBodyCell(props.props,
      'body',
      colType,
      colName,
      props.exposedKey,
      () => props.highlight
    )

    

    

    //const isSpecial = computed(() => scope.col.type === 'special-col')
    //const specialCompo = computed(() => scope.col.name === 'row-select' ? CTdSelect : CTdTools)

    

    //const cellContentProps = reactive({})
    

    return {
      extendedPropsProxy,
      tdProps,
      wrapProps,
      usePopupEdit,
      useToolsBlock,
      popupEditProps,
      cellContentProps,
      bodySlot,
      scope,
      saving,
      //isSpecial,
      //specialCompo
    }*/
  }
})

</script>