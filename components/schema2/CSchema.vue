<template>
  <div class="c-schema">
    <component
      :is="childrenCompo"
      :entries="parsedSchema.map[0]"
    />
    <pre
      class="full-width"
      style="border: 1px solid #dadada; padding: 10px;"
    >// parsedSchema

{{parsedSchema}}</pre>
    <!--<CSchemaChildren :name="parsedSchema.schema.name" />
    SCHEMA
    <pre style="border: 1px solid #dadada; padding: 10px;">origSchema: {{schema}}</pre>

    <pre style="border: 1px solid #dadada; padding: 10px;">parsedSchema {{parsedSchema.schema}}</pre>
    <pre style="border: 1px solid #dadada; padding: 10px;">maps {{parsedSchema.maps}}</pre>

    <pre>{{schemaConfig._values}}</pre>-->
  </div>
</template>

<script>

import { defineComponent, markRaw } from 'vue'

//import CSchemaRenderer from './components/renderer.vue'
import CSchemaChildren from './components/children.vue'

import './defaults/defaults'
import {
  useCSchemaMain,
  useCSchemaParser,
  useCSchemaProvide
} from './composables'

export default defineComponent({
  name: 'CSchema',
  props: {
    schema: {
      required: true,
      type: [Object, Map]
    }
  },

  components: {
    //CSchemaRenderer
    CSchemaChildren
  },

  setup (props) {

    const {
      schemaConfig
    } = useCSchemaMain(props)

    console.log("CONFIG", schemaConfig)

    const {
      parsedSchema,
      getEntry
    } = useCSchemaParser(props, schemaConfig)

    useCSchemaProvide({
      schema: parsedSchema.data,
      map: parsedSchema.map,
      getEntry,
      schemaConfig
    })

    return {
      schemaConfig,
      parsedSchema,
      childrenCompo: schemaConfig.get('children.handler')()
    }
  }
})
</script>