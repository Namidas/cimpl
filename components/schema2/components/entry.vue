<template>
  <div class="c-schema-entry">ENTRY #{{name}}
    <!--<component :is="entryHandler" />-->
    <pre>{{entry}}</pre>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import {
  useCSchemaInject
} from './../composables'

export default defineComponent({
  name: 'CSchemaEntry',
  props: ['name'],
  setup (props) {
    console.log("ENTRY SETUP", props)
    const { getEntry } = useCSchemaInject()
    const entry = getEntry(props.name)

    return {
      entry,
      entryHandler: entry.handler()
    }
  }
})
</script>