/* eslint-disable */

import { computed, ref, inject, watch, getCurrentInstance } from 'vue'
import { getClosestParentComponentHaving } from 'src/utils/components'
import plain_copy from 'src/utils/plain_copy'
import { $melon } from 'src/boot/melon.window_melon'

const cellCommonProps = {
    /*props: {
        required: false
    },

    filterProps: {
        required: false
    },*/

    column: Object,
    cell: Object,

    modelValue: {
        required: false
    },

    expanded: {
        required: false,
        type: Boolean,
        default: false
    },

    mode: {
        required: false,
        type: String,
        default: 'filter'
    }
}

const cellCommonEmits = [
    'update:model-value'
]

function useCommonCell (props, cell) {
    const innerModel = ref(plain_copy(props.modelValue))
    /*const cellModel = ref(plain_copy(_.get(props, 'cell.value')))*/
    const cellModel = computed(() => _.get(props, 'cell.value'))
    const editModel = ref(plain_copy(_.get(props, 'cell.value')))

    const editHasChanges = computed(() => {
        return editModel.value !== cellModel.value
    })

    const editErrors = ref([])
    const hasEditErrors = computed(() => editErrors.value.length > 0)

    const filterProps = props.column.filter
    const editProps = props.column.edit

    //const watchModelValue = watch(())

    const cellEditProps = computed(() => {
        let res = {
            enable: editProps !== false && props.mode !== 'filter'
        }
        if (res.enable === false) return res

        res = {
            ...res,
            column: props.column,
            ..._.pick(editProps, [
                'always',
                'floatLoader',
                'popup',
                'popupSave',
                'dismissSave',
                'backdrop',
                'backdropNotify',
                'popupBind'
            ])
        }

        return res
    })

    const commonCellFilterClassess = computed(() => {
        return [
            'cimpl-table-th-filter-element'
        ]
    })

    const commonCellContentClassess = computed(() => {
        return [
            'cimpl-table-td-content-element',
            _.get(props, 'column.edit.keepLoaderSpace') ? 'keep-loader-space' : undefined,
            _.get(props, 'column.edit.floatLoader') ? 'float-loader' : undefined
        ]
    })


    /* filter CSS classess */
    const filterClassess = computed(() => {
        let res = [
            ...commonCellFilterClassess.value
        ]
        return res
    })

    /* content CSS classess */
    const cellClassess = computed(() => {
        let res = [
            ...commonCellContentClassess.value
        ]
        return res
    })

    const hasFilter = computed(() => {
        if (innerModel.value === undefined) return false
        return innerModel.value.trim() !== ''
    })

    const usePopupTemplate = computed(() => {
        return editProps !== false && props.mode !== 'filter'
    })

    const bindedTable = computed(() => {
        const instance = getCurrentInstance()

        const table = getClosestParentComponentHaving([
            'is_cimpl_table'
        ], instance.ctx)
        return table
    })

    const inputClassess = computed(() => {
        return [
            'cell-edit-def-controller',
            hasEditErrors.value === true ? 'has-errors' : undefined
        ]
    })

    /* focus the quick edit input, in-place (no popup) */
    function focusInput () {
        if (this.$refs.editInput !== undefined && this.$refs.editInput !== null)
            this.$refs.editInput.focus()
        else {
            setTimeout(this.focusInput.bind(this), 100)
        }
    }

    /* clear filter */
    function clearFilter () {
        this.innerModel = undefined
        //this.emitValue('clear:modelValue')
        this.onFilterChange()
    }

    /* 'content' filter changed */
    function onFilterChange () {
        this.$emit('update:model-value', {
            value: this.innerModel,
            empty: !this.hasFilter
        })
    }

    function onEditReset () {
        //this.editHasChanges = false
        this.editModel = plain_copy(_.get(this.$props, 'cell.value'))
    }

    function onEditSubmit (model) {
        if (model === undefined) model = this.editModel
        const ctx = this
        if (hasEditErrors.value === true) {
            $melon.showNotif({
                type: 'negative',
                message: this.$lbl('foo.edit_has_errors')
            })
            return false
        }
        const pick = [...editProps.pick]
        pick.push(this.column.name)
        const thePromise = this.onCellQuickEdit(ctx.cell, model, pick)
        thePromise.then((response) => {
            //ctx.editHasChanges = false
        }).catch((e) => {
            // console.log("cell quick edit error", ctx.bindedTable)
            throw e
        }).finally()
        return thePromise
    }

    function onInPlaceInput ($ev) {
        let res = []
        const rules = _.get(this.editProps, 'bind.rules', [])
        for (const x in rules) {
            const ruleRes = rules[x](this.editModel, this.cellModel)
            if (ruleRes !== true) res.push(ruleRes)
        }
        if (res.length) {
            editErrors.value = res
            if (editProps.backdropNotify === false)
                $melon.showNotif({
                    type: 'negative',
                    message: editErrors.value
                })
            else this.$refs.editor.notifications = this.$lbl('foo.edit_has_errors')

            return res
        }
        editErrors.value = []
        return true
    }

    function mountedCommon () {
        if (this.mode === 'content')
            this.$refs.editor.bindEditor(this)
    }

    return {
        editHasChanges,

        innerModel,
        cellModel,
        editModel,
        //bindEditor,
        cellEditProps,
        commonCellFilterClassess,
        commonCellContentClassess,
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
}

export {
    cellCommonProps,
    cellCommonEmits,
    useCommonCell
}