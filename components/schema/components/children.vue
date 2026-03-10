<template>
    <div :class="wrapClassess" ref="wrap">
        <CimplSchemaEntry
            v-for="schemaItem in children" :key="schemaItem.entry_uid"
            :schemaItem="schemaItem"
            :ref="`entry_component_${schemaItem.entry_uid}`"
            :context="context"
            @update:modelValue="onEntryUpdateModelValue"
            @removeModelUpdate="onEntryRemoveModelUpdate"
            @modelUpdate="onEntryModelUpdate"
            @validationError="onEntryValidationError"
            @validationSuccess="onEntryValidationSuccess"
            />
    </div>
</template>

<script>
/*eslint-disable*/
import { defineComponent, ref } from 'vue'
import useDraggableEntries from '../composables/draggable.js'
import CimplSchemaEntry from './entry.js'

const CimplSchemaChildren = defineComponent({

  name: 'cimpl-schema-children',
  tagname: 'cimpl-schema-children',

  props: {
    children: {
        required: true,
        type: Array
    },

    /*entry: {
        required: true,
        type: Object,
    },*/

    //row / col
    type: {
        required: false,
        type: String,
        default: 'row'
    },

    gutter: {
        required: false,
        type: [Boolean, String],
        default: false
    },

    /*make schema entries draggables?*/
    draggableChildren: {
        required: false,
        type: Boolean,
        default: false
    },

    /* parent cimpl-schema component */
    context: {
      required: true
    },
  },

  components: {
    CimplSchemaEntry
  },

  emits: [
    'draggable:start',
    'draggable:update'
  ],

  setup(props, {emit})
  {
    const draggableHandler = null
    const wrap = ref(null)
    let setupData = {
        wrap,
        draggableHandler: null
    }

    if(props.draggableChildren)
    {
        const {
            draggableHandler,
        } = useDraggableEntries(wrap,props.children,emit)
        setupData.draggableHandler = draggableHandler
    }

    return setupData
  },

  computed: {
    wrapClassess()
    {
        const gutter = this.gutter
        if(gutter === true) alert("ACA TENDRIA QUE LEVANTAR DESDE GUTTER DEFAULT")
        return [
            'cimpl-schema-children',
            this.type,
            gutter ? `q-${this.type}-gutter-${gutter}` : null
        ]
    }
  },

  methods: {
    /*bubble entry events to parent and real entry (used to use the underscore methods except for onEntryUpdateModelValue)*/
    onEntryUpdateModelValue(payload) { return this.$parent.onEntryUpdateModelValue(payload) },
    onEntryRemoveModelUpdate(payload) { return this.$parent.onEntryRemoveModelUpdate(payload) },
    onEntryModelUpdate(payload) { return this.$parent.onEntryModelUpdate(payload) },
    onEntryValidationError(payload) { return this.$parent.onEntryValidationError(payload) },
    onEntryValidationSuccess(payload) { return this.$parent.onEntryValidationSuccess(payload) },
  }

})

export default CimplSchemaChildren
</script>
