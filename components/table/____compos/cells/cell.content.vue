<template>
    <cimpl-table-cell-edit v-bind="cellEditProps" ref="editor" @edit:in-place:start="wrapCall('focusInput')">
        <div :class="filterClassess" v-if="mode === 'filter'">
            <input
                class="def-controller"
                :placeholder="filterProps.placeholder"
                v-model="innerModel"
                v-bind="filterProps.bind"
                @input="wrapCall('onFilterChange')"
                />
        </div>
        <div v-else
            :class="cellClassess"
            >
            <div class="def-value">{{cell.value}}</div>
        </div>

        <template #popup v-if="usePopupTemplate">
            <div :class="filterClassess">
                <!--<component
                    :is="editCompo"
                    class="cell-edit-def-controller"
                    :label="$lbl(editProps.label)"
                    :placeholder="$lbl(editProps.placeholder)"
                    v-bind="editProps.bind"
                    autofocus
                    stack-label
                    v-model="editModel"
                    />-->
                <!-- for some reason on top <component /> v-model is not working when it's an
                <input /> so I have to have all this code repeat... -->
                <q-input
                    v-if="editProps.popup === true"
                    :is="editCompo"
                    class="cell-edit-def-controller"
                    :label="$lbl(editProps.label)"
                    :placeholder="$lbl(editProps.placeholder)"
                    v-model="editModel"
                    v-bind="editProps.bind"
                    autofocus
                    stack-label
                    />
                <input v-else-if="editProps.input === 'input'"
                    :class="inputClassess"
                    :placeholder="$lbl(editProps.placeholder)"
                    v-model="editModel"
                    v-bind="editProps.bind"
                    @keydown.enter.exact.prevent="$refs.editor.onEditSubmit"
                    @keydown.enter.shift.exact.prevent="editModel += '\n'"
                    ref="editInput"
                    @input="wrapCall('onInPlaceInput')"
                    />
                <textarea v-else
                    :class="inputClassess"
                    :placeholder="$lbl(editProps.placeholder)"
                    v-model="editModel"
                    v-bind="editProps.bind"
                    @keydown.enter.exact.prevent="$refs.editor.onEditSubmit"
                    @keydown.enter.shift.exact.prevent="editModel += '\n'"
                    ref="editInput"
                    @input="wrapCall('onInPlaceInput')"
                    />
            </div>
        </template>
    </cimpl-table-cell-edit>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref } from 'vue'
import plain_copy from 'src/utils/plain_copy'

import { cellCommonProps,cellCommonEmits, useCommonCell } from './cell.common.js'

export default defineComponent({
    emits: [
        ...cellCommonEmits
    ],

    props: {
        ...cellCommonProps
    },

    watch: {
        modelValue(newValue) {
            this.innerModel = plain_copy(newValue)
            //this.cellModel = plain_copy(newValue)
            //this.editModel = plain_copy(newValue)
        }
    },

    inject: ['onCellQuickEdit', '$lbl'],
    
    setup(props) {
        const {
            innerModel,
            editModel,
            cellEditProps,
            //bindEditor,
            //commonCellFilterClassess,
            //commonCellContentClassess,
            filterClassess,
            cellClassess,
            filterProps,
            editProps,
            hasFilter,
            usePopupTemplate,
            bindedTable,
            hasEditErrors,
            inputClassess,
            focusInput,
            clearFilter,
            onFilterChange,
            onEditSubmit,
            onEditReset,
            onInPlaceInput,
            mountedCommon
        } = useCommonCell(props)

        return {
            innerModel,
            editModel,
            cellEditProps,
            //bindEditor,
            //commonCellFilterClassess,
            //commonCellContentClassess,
            filterClassess,
            cellClassess,
            filterProps,
            editProps,
            hasFilter,
            usePopupTemplate,
            bindedTable,
            hasEditErrors,
            inputClassess,
            focusInput,
            clearFilter,
            onFilterChange,
            onEditSubmit,
            onEditReset,
            onInPlaceInput,
            mountedCommon
        }
    },

    computed: {
        

        /* editCompo() {
            return  this.editProps.popup === true ? 'q-input' : 'input'
        } */
    },

    methods: {
        /* wrap call to a method to avoid problems with composable methods called directly on template
        events, otherwise context gets lost (no 'this') */
        wrapCall (name, args) {
            if (args === undefined) args = []
            this[name].apply(this, args)
        }
    },

    mounted() {
        this.mountedCommon()
    }
})
</script>
