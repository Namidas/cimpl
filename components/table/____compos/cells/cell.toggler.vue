<template>
    <cimpl-table-cell-edit v-bind="cellEditProps" ref="editor" @edit:in-place:start="wrapCall('focusInput')">
        <div :class="filterClassess" v-if="mode === 'filter'">
            <select v-if="filterProps.dropdown"
                class="def-controller"
                v-model="innerModel"
                @update:model-value="wrapCall('onFilterChange')"
                >
                <option v-for="(opt,optInd) in dropdownOptions" :key="optInd" :value="opt.value" :style="opt.style">{{opt.label}}</option>
            </select>
            <div style="position: relative; float: left;" v-else>
                <q-icon
                    :name="filterProps.placeholderIcon"
                    :style="placeholderStyles"
                    :size="filterProps.placeholderSize"
                    v-if="usesIndeterminateState"
                    />
                <component
                    :is="`q-${filterProps.type}`"
                    v-bind="togglerBinds"
                    v-model="innerModel"
                    @update:model-value="wrapCall('onFilterChange')"
                    :style="togglerStyles"
                    />
            </div>
            <q-btn v-if="!filterProps.dropdown && usesIndeterminateState"
                icon="filter_alt_off"
                size="sm"
                dense
                rounded
                flat
                :disable="!hasFilter"
                @click="wrapCall('clearFilter')"
                >
                <q-tooltip v-if="hasFilter">{{$lbl('foo.clear.filter')}}</q-tooltip>
            </q-btn>
        </div>
        <div v-else
            :class="cellClassess"
            >
            <select v-if="column.dropdown"
                class="def-controller"
                v-model="cellModel"
                @update:model-value="wrapCall('onCellQuickEdit')"
                ref="editInput"
                >
                <option v-for="(opt,optInd) in dropdownOptions" :key="optInd" :value="opt.value" :style="opt.style">{{opt.label}}</option>
            </select>
            <component
                v-else
                :is="`q-${column.type}`"
                v-bind="togglerBinds"
                v-model="cellModel"
                @update:model-value="wrapCall('onCellQuickEdit')"
                :style="togglerStyles"
                ref="editInput"
                />
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
                <select /> so I have to have all this code repeat... -->
                <q-select
                    v-if="editProps.popup === true"
                    class="cell-edit-def-controller"
                    :label="$lbl(editProps.label)"
                    :options="dropdownOptions"
                    :placeholder="$lbl(editProps.placeholder)"
                    :model-value="editModelQSelect"
                    @update:model-value="editModelQSelectUpdate"
                    v-bind="editProps.bind"
                    autofocus
                    stack-label
                    emit-value
                    />
                <select
                    v-else
                    :class="inputClassess"
                    v-model="editModel"
                    v-bind="editProps.bind"
                    @change="$refs.editor.onEditSubmit"
                    ref="editInput"
                    >
                    <option v-for="(opt,optInd) in dropdownOptions" :key="optInd" :value="opt.value" :style="opt.style">{{opt.label}}</option>
                </select>
            </div>
        </template>
    </cimpl-table-cell-edit>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, computed } from 'vue'
import plain_copy from 'src/utils/plain_copy'
import {getClosestParentComponentHaving} from 'src/utils/components'

import {INDETERMINATE_VALUE_AS_CLEAR, CLEAR_VALUE} from '../../columns/toggler'
import { cellCommonProps,cellCommonEmits, useCommonCell } from './cell.common'

export default defineComponent({
    emits: [
        ...cellCommonEmits
    ],

    props: {
        ...cellCommonProps
    },

    watch: {
        modelValue(newValue) {
            console.log("CHANGED MODEL VALUE",newValue)
            this.innerModel = plain_copy(newValue === undefined ? (this.usesIndeterminateState ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR) : newValue)
            //this.cellModel = ref(plain_copy(newValue === undefined ? (usesIndeterminateState.value ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR) : newValue))
            //this.editModel = ref(plain_copy(newValue === undefined ? (usesIndeterminateState.value ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR) : newValue))
        }
    },

    inject: ['onCellQuickEdit', '$lbl'],
    
    setup(props) {
        const {
            //innerModel,
            //cellModel,
            editProps,
            usePopupTemplate,
            //bindedTable,
            cellEditProps,
            commonCellFilterClassess,
            commonCellContentClassess,
            filterProps,
            inputClassess,
            //hasFilter,
            onEditSubmit,
            onEditReset,
            focusInput,
            onFilterChange,
            mountedCommon
        } = useCommonCell(props)

        /*does the indeterminate use an indeterminate value ?
        if not, then we're going to use the indeterminate as 'clear'
        otherwise we'll have to add an extra option */
        const usesIndeterminateState = computed(() => {
            return filterProps/*.value*/.values.length > 2
        })

        const innerModel = ref(plain_copy(props.modelValue === undefined ? (usesIndeterminateState.value ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR) : props.modelValue))
        const cellModel = computed(() => plain_copy(_.get(props,'cell.value') === undefined ? (usesIndeterminateState.value ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR) : _.get(props,'cell.value')))
        const editModel = ref(plain_copy(_.get(props,'cell.value') === undefined ? (usesIndeterminateState.value ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR) : _.get(props,'cell.value')))

        return {
            usesIndeterminateState,
            innerModel,
            cellModel,
            editModel,
            editProps,
            usePopupTemplate,
            //bindedTable,
            cellEditProps,
            commonCellFilterClassess,
            commonCellContentClassess,
            filterProps,
            inputClassess,
            //hasFilter,
            onEditSubmit,
            onEditReset,
            focusInput,
            onFilterChange,
            mountedCommon
        }
    },

    computed: {
        editModelQSelect()
        {
            let res = false
            for(const x in this.dropdownOptions)
                if(this.dropdownOptions[x].value === this.editModel)
                    res = this.dropdownOptions[x]
            return res
        },

        /* filter CSS classess */
        filterClassess () {
            let res = [
                ...this.commonCellFilterClassess
            ]
            return res
        },

        /* content CSS classess */
        cellClassess() {
            let res = [
                ...this.commonCellContentClassess
            ]

            return res
        },

        /* has filter or is it clear? */
        hasFilter() {
            return this.innerModel !== (this.usesIndeterminateState ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR)
        },

        /* dropdown options */
        dropdownOptions() {
            let options = []
            if(this.mode === 'filter') options.push({ label: 'filter.placeholder', value: this.usesIndeterminateState ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR, style: 'color: #838383' })
            for (const x in this.filterProps.values) {
                var defLabel = 'yes'
                if (x == 1) defLabel = 'no'
                else if (x == 2) defLabel = 'indeterminate'
                if (Array.isArray(this.filterProps.values[x]))
                    options.push({
                        value: this.filterProps.values[x][0],
                        label: this.filterProps.values[x][1]
                    })
                else options.push({
                    value: this.filterProps.values[x],
                    label: `foo.${defLabel}`
                })
            }
            return options
        },

        /* toggleable placeholder styles */
        placeholderStyles() {
            let styles = {
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                opacity: !this.hasFilter ? 1 : 0
            }

            return styles
        },

        /* compo binds */
        togglerBinds() {
            const src = this.mode === 'filter' ? this.filterProps : this.column
            let res = {
                trueValue: Array.isArray(src.values[0]) ? src.values[0][0] : src.values[0],
                falseValue: Array.isArray(src.values[1]) ? src.values[1][0] : src.values[1],
                toggleIndeterminate: true
            }
            if (this.usesIndeterminateState)
                res.indeterminateValue = Array.isArray(src.values[2]) ? src.values[2][0] : src.values[2]
            else res.indeterminateValue = INDETERMINATE_VALUE_AS_CLEAR

            return res
        },

        togglerStyles() {
            let styles = {
                zIndex: 2,
            }

            if (this.usesIndeterminateState) {
                styles = {
                    ...styles,
                    position: 'relative',
                    opacity: this.hasFilter ? 1 : 0
                }
            }

            return styles
        },

        bindedTable(){
            const table = getClosestParentComponentHaving([
                'is_cimpl_table'
            ], this)
            return table
        }
    },

    methods: {
        /* wrap call to a method to avoid problems with composable methods called directly on template
        events, otherwise context gets lost (no 'this') */
        wrapCall (name, args) {
            if (args === undefined) args = []
            this[name].apply(this, args)
        },

        clearFilter() {
            this.innerModel = this.usesIndeterminateState ? CLEAR_VALUE : INDETERMINATE_VALUE_AS_CLEAR
            //this.emitValue('clear:modelValue')
            this.onFilterChange()
        },

        onEditReset()
        {

        },

        editModelQSelectUpdate(newValue)
        {
            this.editModel = newValue
        }
    },

    mounted()
    {
        this.mountedCommon()
    }
})
</script>
