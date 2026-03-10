<template>
  <q-drawer
    v-model="innerLeftDrawerOpen"
    @update:model-value="(newValue) => $emit('update:left-drawer-open',newValue)"
    show-if-above
    bordered
  >
    <q-list>
      <q-item-label header> Essential Links </q-item-label>
      <EssentialLink
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>
<script>
import { defineComponent, ref } from 'vue'
//import plain_copy from './../../../../../utils/plain_copy'
import EssentialLink from 'components/EssentialLink.vue'
export default defineComponent({
  name: 'app-left-drawer',
  props: {
    leftDrawerOpen: undefined,
    linksList: undefined
  },

  emits: [
    'update:left-drawer-open'
  ],

  components: {
    EssentialLink
  },

  watch: {
    leftDrawerOpen: function (newValue) {
      this.innerLeftDrawerOpen = newValue ? true : false
    }
  },

  setup (props) {
    return {
      innerLeftDrawerOpen: ref(props.leftDrawerOpen ? true : false)
    }
  }
})
</script>