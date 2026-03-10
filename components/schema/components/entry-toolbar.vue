<template>
    <q-toolbar class="cimpl-schema-entry-toolbar">
        <q-btn
            class="draggable-handle"
            icon="drag_indicator"
            size="sm"
            />
    </q-toolbar>
</template>

<script>
/*eslint-disable*/
import { defineComponent } from 'vue'
//import useDraggableEntries from './composables/draggable.js'
//import CimplSchemaEntry from './entry.js'

const CimplSchemaEntryToolbar = defineComponent({

  name: 'cimpl-schema-entry-toolbar',
  tagname: 'cimpl-schema-entry-toolbar',

  props: {
    
  },

  components: {
  },

  setup(props)
  {
    /*const {
      updates,
      errors,
      setModelUpdate,
      setValidationError,
      unsetValidationError,
      onEntryUpdateModelValue,
      onEntryRemoveModelUpdate,
      onEntryModelUpdate,
      onEntryValidationSuccess,
      onEntryValidationError,
      afterModelUpdate
    } = useModels()*/
  },

  computed: {
    
  },

  methods: {
  }

})

export default CimplSchemaEntryToolbar
</script>