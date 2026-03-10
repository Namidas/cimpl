<template>
  <div
    class="cimpl-schema"
    ref="schemaWrap"
  >
    <slot></slot>

    <!--<CimplSchemaDebug :schema="innerSchema" />-->

    <CimplSchemaChildren
      :children="innerSchemaItems"
      :context="instance"
      :draggable-children="draggableChildren"
      class="full-width"
      @draggable:update="onDraggableUpdate"
    />
    <!--<pre class="full-width">{{modelValue}}</pre>-->
    <!--<pre class="full-width">{{draggableEntries}}</pre>-->

    <!--<slot name="entries-fields"></slot>-->
    <!--<slot name="entries">
            <div class="full-width" ref="entriesWrap">
                <CimplSchemaEntry
                    v-for="schemaItem in items2Render" :key="schemaItem.entry_uid"
                    :schemaItem="schemaItem"
                    :ref="`entry_component_${schemaItem.entry_uid}`"
                    :context="instance"
                    @update:modelValue="onEntryUpdateModelValue"
                    @removeModelUpdate="onEntryRemoveModelUpdate_"
                    @modelUpdate="onEntryModelUpdate_"
                    @validationError="onEntryValidationError_"
                    @validationSuccess="onEntryValidationSuccess_"
                    />
            </div>
        </slot>-->
    <!--<slot name="entries-fields"></slot>-->
  </div>
</template>

<script src="./schema/component.js"></script>
