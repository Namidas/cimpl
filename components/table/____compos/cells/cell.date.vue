<template>
    <cimpl-table-cell-edit v-bind="cellEditProps" ref="editor" @edit:in-place:start="wrapCall('onInPlaceEditStart')">
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
            style-x="flex-wrap: wrap;"
            >
            <!--<div style="display: inline-block; width: 100%; clear: both; float: left;">
                editHasChanges: {{editHasChanges}} / {{editModel}}<br />
                {{editProps.mask}}
            </div>-->
            <div class="def-value">
                <ul class="date-lines">
                    <li v-for="(date,index) in parsedCellDate" :key="index"
                        :style="date.style"
                        :class="date.class"
                        >
                        <q-icon v-if="date.icon !== false" v-bind="date.icon"/>
                        <span class="value">{{date.value}}</span>
                    </li>
                </ul>
            </div>
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
                    v-bind="editProps.bind"
                    autofocus
                    stack-label
                    />
                <div :class="dateInputWrapperClassess" v-else>
                    <div v-if="!isNativeInput">
                        <div class="placeholder" v-if="column.type !== 'date-time-each'">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <DateEdit
                                    v-model="editModel"
                                    :ctx="helperContext"
                                    />
                                <!--<div>
                                    <q-date v-if="column.type === 'date'"
                                        v-model="editModel"
                                        v-bind="bindedCompoProps"
                                        >
                                        <div class="row items-center justify-end q-gutter-sm" v-if="column.type === 'date'">
                                            <q-btn :label="$lbl('foo.ok')" color="primary" flat v-close-popup />
                                            <q-btn :label="$lbl('foo.cancel')" @click="wrapCall('onEditReset')" color="primary" flat v-close-popup />
                                        </div>
                                    </q-date>
                                    <q-time v-if="column.type === 'time'"
                                        v-model="editModel"
                                        v-bind="bindedCompoProps"
                                        >
                                        <div class="row items-center justify-end q-gutter-sm" v-if="column.type === 'time'">
                                            <q-btn :label="$lbl('foo.ok')" color="primary" flat v-close-popup />
                                            <q-btn :label="$lbl('foo.cancel')" @click="wrapCall('onEditReset')" color="primary" flat v-close-popup />
                                        </div>
                                    </q-time>
                                    <cimpl-date-time v-if="column.type === 'date-time'"
                                        class="cell-edit-cimpl-datetime"
                                        v-model="editModel"
                                        v-bind="bindedCompoProps"
                                        >
                                        <div class="row items-center justify-end q-gutter-sm">
                                            <q-btn :label="$lbl('foo.ok')" color="primary" flat v-close-popup />
                                            <q-btn :label="$lbl('foo.cancel')" @click="wrapCall('onEditReset')" color="primary" flat v-close-popup />
                                        </div>
                                    </cimpl-date-time>
                                </div>-->
                            </q-popup-proxy>
                            <q-tooltip>{{$lbl('foo.pick_date')}}</q-tooltip>
                        </div>
                        <ul class="date-lines">
                            <li v-for="(date,index) in parsedEditDate" :key="index"
                                :style="date.style"
                                :class="date.class"
                                >
                                <div class="placeholder" v-if="column.type === 'date-time-each'">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <DateEdit
                                            v-model="editModel"
                                            :ctx="helperContext"
                                            :type="date.type"
                                            />
                                    </q-popup-proxy>
                                    <q-tooltip>{{$lbl(`foo.pick_${date.type}`)}}</q-tooltip>
                                </div>
                                <q-icon v-if="date.icon !== false" v-bind="date.icon"/>
                                <span class="value">{{date.value}}</span>
                            </li>
                        </ul>
                        <div class="date-confirm-button-wrapper" v-if="editHasChanges">
                            <q-btn
                                size="sm"
                                icon="save"
                                dense
                                class="date-confirm-button"
                                @click="$refs.editor.onEditSubmit"
                                >
                                <q-tooltip>{{$lbl('foo.confirm.edit')}}</q-tooltip>
                            </q-btn>
                        </div>
                    </div>
                    <input
                        v-if="isNativeInput"
                        v-model="editModel"
                        v-bind="dateInputProps"
                        @keydown.enter.exact.prevent="$refs.editor.onEditSubmit"
                        @keydown.enter.shift.exact.prevent="editModel += '\n'"
                        ref="editInput"
                        @input="wrapCall('onInPlaceInput')"
                        />
                    <!--<q-icon
                        size="xs"
                        name="event"
                        flat
                        dense
                        class="date-picker-button"
                        >
                    </q-icon>-->
                </div>
            </div>
        </template>
    </cimpl-table-cell-edit>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref } from 'vue'
import plain_copy from 'src/utils/plain_copy'
import {getClosestParentComponentHaving} from 'src/utils/components'

import { cellCommonProps,cellCommonEmits, useCommonCell } from './cell.common.js'
import { date } from 'quasar'

import DateEdit from './cell.date-quick-edit-helper.vue'

const $_DEFAULT_DATE_LINE = {
    format: '',
    icon: false,
    class: [],
    style: {},
    type: 'date' //date/time, which compo to use on line when cell type is 'date-time-each'
}

const $_DEFAULT_LINE_ICON = {
    size: 'xs',
    color: 'grey-6'
}

export default defineComponent({
    emits: [
        ...cellCommonEmits
    ],

    components: {
        DateEdit
    },

    props: {
        ...cellCommonProps,

        /* use native <input type="date" /> for in-place edit */
        native: {
            required: false,
            type: Boolean,
            default: false
        }
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
            editHasChanges,

            innerModel,
            editModel,
            cellModel,
            cellEditProps,
            filterClassess,
            cellClassess,
            filterProps,
            editProps,
            hasFilter,
            usePopupTemplate,
            //bindedTable,
            //hasEditErrors,
            inputClassess,
            focusInput,
            clearFilter,
            onFilterChange,
            onEditSubmit,
            onEditReset,
            //onInPlaceInput,
            mountedCommon
        } = useCommonCell(props)

        return {
            //qCalendarEditModel: ref(date.formatDate(/*new Date(*/editModel.value/*)*/,editProps.mask)),
            editHasChanges,

            innerModel,
            editModel,
            cellModel,
            cellEditProps,
            filterClassess,
            cellClassess,
            filterProps,
            editProps,
            hasFilter,
            usePopupTemplate,
            //bindedTable,
            //hasEditErrors,
            inputClassess,
            focusInput,
            clearFilter,
            onFilterChange,
            onEditSubmit,
            onEditReset,
            //onInPlaceInput,
            mountedCommon
        }
    },

    computed: {
        /* get the parsed date with formats and everything to show on cell */
        parsedCellDate() {
            return this.parseDate(Array.isArray(this.column.dateFormat) ? this.column.dateFormat : [this.column.dateFormat],this.cellModel)
        },

        /* get the parsed date with formats and everything to show on quick edit */
        parsedEditDate() {
            return this.parseDate(Array.isArray(this.column.dateFormat) ? this.column.dateFormat : [this.column.dateFormat],this.editModel)
        },

        isNativeInput()
        {
            return this.native === true
        },

        dateInputProps()
        {
            let props = {
                type: this.isNativeInput ? 'date' : 'input',
                class: this.inputClassess,
                placeholder: this.$lbl(this.editProps.placeholder),
                readonly: !this.isNativeInput,
                value: this.editModel,
                ...this.editProps.bind
            }
            return props
        },

        dateInputWrapperClassess()
        {
            return [
                'date-input-wrapper',
                this.isNativeInput ? 'is-native' : undefined,
                this.editHasChanges ? 'edit-has-changes' : undefined
            ]
        },

        useDatePicker()
        {
            const types = [
                'date',
                'date-time'
            ]
            return types.includes(this.column.type)
        },

        useTimePicker()
        {
            const types = [
                'time',
                'date-time'
            ]
            return types.includes(this.column.type)
        },

        bindedTable(){
            const table = getClosestParentComponentHaving([
                'is_cimpl_table'
            ], this)
            return table
        },

        bindedCompoProps()
        {
            return _.merge({
                mask: this.editProps.mask
            },this.editProps.bind)
        },

        helperContext()
        {
            return this
        }
    },

    methods: {
        /* wrap call to a method to avoid problems with composable methods called directly on template
        events, otherwise context gets lost (no 'this') */
        wrapCall (name, args) {
            if (args === undefined) args = []
            this[name].apply(this, args)
        },

        parseDate(lines,currentDate) {
            let res = []
            for(const x in lines)
            {
                let line = this.parseDateLine(lines[x],currentDate)
                if(line === false) continue
                res.push(line)
            }
            return res
        },

        parseDateLine(lineData,currentDate,base)
        {
            let line = base === undefined ? {...$_DEFAULT_DATE_LINE} : base
            switch(typeof lineData)
            {
                case 'string':
                    line.format = lineData
                    break
                case 'object':
                    _.merge(line,lineData)
                    break
                case 'function':
                    const funcRes = lineData(currentDate)
                    if(funcRes === false) return false
                    _.merge(line,this.parseDateLine(funcRes,currentDate,line))
                    break
            }

            if(line.value === undefined)
               line.value = date.formatDate(currentDate,line.format)

            line.icon = this.parseDateLineIcon(line.icon,currentDate)

            return line
        },

        parseDateLineIcon(iconData,currentDate)
        {
            if(iconData === false) return false
         
            let icon = {...$_DEFAULT_LINE_ICON}
            switch(typeof iconData)
            {
                case 'string':
                    icon.name = iconData
                    break
                case 'object':
                    _.merge(icon,iconData)
                    break
                case 'function':
                    const functionRes = iconData(currentDate) 
                    if(functionRes === false) return false
                    _.merge(icon,this.parseDateLineIcon(functionRes,currentDate))
                    break
            }
            
            return icon
        },

        onInPlaceEditStart()
        {
            if(this.isNativeInput === true) this.focusInput()
        }
    },

    mounted() {
        this.mountedCommon()
    }
})
</script>
