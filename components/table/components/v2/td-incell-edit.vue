<template>
  <div class="c-td-incell-edit full-width justify-between row">
    <div class="c-td-incell-edit-controller-wrapper">
      <input
        v-model="inputModelValue"
        class="c-td-incell-edit-controller"
      />
    </div>
    <div class="c-td-incell-edit-tools items-center row">
      <q-btn v-bind="saveBtnProps"><q-tooltip>_SAVE</q-tooltip></q-btn>
      <q-separator
        vertical
        spaced
      />
      <q-btn v-bind="cancelBtnProps"><q-tooltip>_CANCEL</q-tooltip></q-btn>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, watchEffect } from 'vue'
import { useBodyCell } from '../../composables/td-provide'

export default defineComponent({
  name: 'CTdInCellEdit',

  emits: [
    'show',
    'hide',
    'save',
    'cancel',
  ],

  //props: ['rowIndex', 'colIndex'],

  setup (props, { emit, expose }) {

    const { Cell, contentRef } = useBodyCell()

    //const show = () => popupRef.value.show()
    //const hide = () => popupRef.value.hide()

    const cancel = () => {
      emit('cancel')
      //popupRef.value.hide()
      inputModelValue.value = originalValue.value
    }

    const save = () => {
      //hide()
      emit('save', { value: inputModelValue.value, cancel })
      //console.log("SAVE")
    }

    expose({
      //show,
      //hide,
      cancel,
      save
    })

    const originalValue = ref(null)
    const inputModelValue = ref(null)
    watchEffect(() => {
      originalValue.value = Cell.value.editValue
      inputModelValue.value = Cell.value.editValue
    })

    const commonBtnProps = {
      size: 'xs',
      padding: '3px 3px 1px 3px',
      flat: true
    }

    const saveBtnProps = computed(() => {
      return {
        ...commonBtnProps,
        icon: 'sym_o_save',

        onClick: save,
        disabled: inputModelValue.value === originalValue.value
      }
    })

    const cancelBtnProps = computed(() => {
      return {
        ...commonBtnProps,
        icon: 'sym_o_cancel',
        onClick: cancel
      }
    })

    return {
      saveBtnProps,
      cancelBtnProps,
      inputModelValue
    }
  }
})
</script>