<template>
  <div class="c-th-selector-wrap cursor-pointer">
    <q-tooltip>_CHANGE SELECTION</q-tooltip>
    <q-menu>
      <q-list separator>
        <q-item
          clickable
          @click="selectAll"
          v-close-popup
        >
          <q-item-section avatar><q-icon
              name="check_box"
              size="xs"
            /></q-item-section>
          <q-item-section>_ALL</q-item-section>
        </q-item>
        <q-item
          clickable
          @click="selectInvert"
          v-close-popup
        >
          <q-item-section avatar><q-icon
              name="indeterminate_check_box"
              size="xs"
            /></q-item-section>
          <q-item-section>_INVERT</q-item-section>
        </q-item>
        <q-item
          clickable
          @click="selectNone"
          v-close-popup
        >
          <q-item-section avatar><q-icon
              name="check_box_outline_blank"
              size="xs"
            /></q-item-section>
          <q-item-section>_NONE</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-icon name="sym_o_apps" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useInjectCTable } from './../../composables/table-provide'

export default defineComponent({
  name: 'CThSelector',

  setup () {

    const { selectAll, selectInvert, selectNone } = useInjectCTable()

    return {
      selectAll,
      selectInvert,
      selectNone
    }
  }
})

</script>