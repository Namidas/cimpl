<template>
    <div>
        <q-date v-if="columnType === 'date'"
            :model-value="modelValue"
            @update:model-value="emitModel"
            v-bind="ctx.bindedCompoProps"
            >
            <div class="row items-center justify-end q-gutter-sm" v-if="columnType === 'date'">
                <q-btn :label="ctx.$lbl('foo.ok')" color="primary" flat v-close-popup />
                <q-btn :label="ctx.$lbl('foo.cancel')" @click="ctx.wrapCall('onEditReset')" color="primary" flat v-close-popup />
            </div>
        </q-date>
        <q-time v-if="columnType === 'time'"
            :model-value="modelValue"
            @update:model-value="emitModel"
            v-bind="ctx.bindedCompoProps"
            >
            <div class="row items-center justify-end q-gutter-sm" v-if="columnType === 'time'">
                <q-btn :label="ctx.$lbl('foo.ok')" color="primary" flat v-close-popup />
                <q-btn :label="ctx.$lbl('foo.cancel')" @click="ctx.wrapCall('onEditReset')" color="primary" flat v-close-popup />
            </div>
        </q-time>
        <cimpl-date-time v-if="columnType === 'date-time'"
            class="cell-edit-cimpl-datetime"
            :model-value="modelValue"
            @update:model-value="emitModel"
            v-bind="ctx.bindedCompoProps"
            >
            <div class="row items-center justify-end q-gutter-sm">
                <q-btn :label="ctx.$lbl('foo.ok')" color="primary" flat v-close-popup />
                <q-btn :label="ctx.$lbl('foo.cancel')" @click="ctx.wrapCall('onEditReset')" color="primary" flat v-close-popup />
            </div>
        </cimpl-date-time>
    </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref } from 'vue'
import plain_copy from 'src/utils/plain_copy'

export default defineComponent({
    props: [
        'ctx',
        'modelValue',
        'type'
    ],

    emits: [
        'update:modelValue'
    ],

    watch: {
        /*modelValue(newValue)
        {
            this.innerModel = ref(plain_copy(newValue))
        }*/
    },

    setup(props)
    {
        return {
            //innerModel: ref(plain_copy(props.modelValue))
        }
    },

    computed: {
        columnType(){
            return this.type !== undefined ? this.type : this.ctx.column.type
        }
    },

    methods: {
        emitModel(newValue)
        {
            this.$emit('update:modelValue',newValue)
        }
    }
})
</script>