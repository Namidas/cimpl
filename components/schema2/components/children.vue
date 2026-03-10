<template>
  <div
    class="c-schema-children"
    v-if="entries.length"
  >
    <component
      :is="entryCompo"
      v-for="(entry,key) in entries"
      :key="key"
      :name="entry.name"
    />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import CSChemaEntry from './entry.vue'
import {
  useCSchemaInject
} from './../composables'

export default defineComponent({
  name: 'CSchemaChildren',
  props: ['entries'],
  components: {
    CSChemaEntry
  },
  setup (props) {
    console.log("CHILDREN SETUP", props)
    const { schemaConfig } = useCSchemaInject()
    return {
      entryCompo: schemaConfig.get('entry.handler')()
    }
  }
})
</script>