<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title> {{app.title}} </q-toolbar-title>

      <div>{{app.name}} v{{ app.version }}</div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useAppInstanceStore } from './../../../../../stores/appInstance'

export default defineComponent({

  name: 'app-header',

  emits: [
    'toggle-left-drawer'
  ],

  setup () {
    return {
      app: useAppInstanceStore()
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.$emit('toggle-left-drawer')
    }
  }
})
</script>