<template>
  <q-popup-proxy v-bind="popupProps">
    <q-card>
      <q-card-section class="text-h6">_EDIT</q-card-section>
      <q-card-section>
        <q-input v-model="inputModelValue" />
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn v-bind="saveBtnProps" />
        <q-btn
          label="_CANCEL"
          @click="cancel"
        />
      </q-card-actions>
    </q-card>
  </q-popup-proxy>
</template>
<script>
import { defineComponent, ref, computed, watchEffect } from 'vue'
import { useBodyCell } from './../../composables/td-provide'

export default defineComponent({
  name: 'CTdPopupEdit',

  emits: [
    'show',
    'hide',
    'save',
    'cancel',
  ],

  //props: ['rowIndex', 'colIndex'],

  setup (props, { emit, expose }) {

    const { Cell, contentRef } = useBodyCell()

    const popupRef = ref(null)
    const popupProps = {
      ref: popupRef,
      noParentEvent: true,
      onShow: () => emit('show'),
      onHide: () => emit('hide')
    }

    const show = () => popupRef.value.show()
    const hide = () => popupRef.value.hide()

    const cancel = () => {
      emit('cancel')
      popupRef.value.hide()
      inputModelValue.value = originalValue.value
    }

    const save = () => {
      hide()
      emit('save', { value: inputModelValue.value, cancel })
      //console.log("SAVE")
    }

    expose({
      show,
      hide,
      cancel,
      save
    })

    const originalValue = ref(null)
    const inputModelValue = ref(null)
    watchEffect(() => {
      originalValue.value = Cell.value.editValue
      inputModelValue.value = Cell.value.editValue
    })

    const saveBtnProps = computed(() => {
      return {
        label: '_SAVE',
        onClick: save,
        disabled: inputModelValue.value === originalValue.value
      }
    })

    return {
      popupProps,
      cancel,
      saveBtnProps,
      inputModelValue
    }
  }
})
</script>