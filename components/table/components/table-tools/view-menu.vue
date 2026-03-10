<template>
  <q-menu>
    <q-list separator>
      <q-item
        v-for="(data,key) in items"
        :key="key"
        clickable
        v-close-popup
        @click="handler(data)"
      >
        <q-item-section avatar>
          <q-icon
            :name="data.icon"
            size="xs"
          />
        </q-item-section>
        <q-item-section>{{data.label}}</q-item-section>
        <q-item-section
          avatar
          v-if="currentItem.name === data.name"
        >
          <q-icon
            name="sym_o_check"
            size="xs"
            color="positive"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: ['items', 'currentItem', 'handler'],

  setup (props) {
  },
})
</script>
