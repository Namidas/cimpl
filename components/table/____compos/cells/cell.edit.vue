<template>
    <slot v-if="!enable" />
    <div v-else
        :class="editorClassess"
        >
        <div class="placeholder cursor-pointer" v-if="(!always && !editPopupVisible) || popup" @click="showEditPopup" />
        <div class="slot-wrapper">
            <slot v-if="(!always && !editPopupVisible) || !editPopupVisible || popup" />
            <slot name="popup" v-else-if="always || (!always && !popup && editPopupVisible)" />
        </div>
        <cimpl-backdrop v-if="!popup"
            :source="backdropSource"
            :target="backdropTarget"
            v-model="editPopupVisible"
            @update:model-value="onBackdropDismiss"
            filter
            hover-no-filter
            animate-filter
            :hover-opacity=".5"
            >
            <template #tooltip>{{$lbl('foo.click_to_cancel')}}</template>
            <template #content:bottom>
                <transition
                    v-if="backdropNotify"
                    v-show="notifications !== false"
                    appear
                    enter-active-class="animated slideInDown"
                    leave-active-class="animated slideOutUp"
                    style="--animate-duration: 1s;"
                    >
                    <q-banner inline-actions class="text-white bg-red">
                        {{$lbl(String(notifications))}}
                    </q-banner>
                </transition>
                <slot name="backdrop:content:bottom" />
            </template>
        </cimpl-backdrop>

        <transition
            v-if="!popup || !popupSave"
            v-show="loading"
            appear
            enter-active-class="animated bounceIn"
            leave-active-class="animated bounceOut"
            style="--animate-duration: 1s;"
            >
            <q-spinner-hourglass size="xs" class="loader-spinner" />
        </transition>

        <component v-if="popup" :is="editorPopupCompoName" v-bind="editorPopupCompoProps" :class="popupEditorClassess">
            <q-card
                >
                <q-form
                    @submit="onEditSubmit"
                    >
                    <q-card-section>
                        <div class="text-overline">{{$lbl('foo.quick_edit.popup.title',column.name)}}</div>
                        <div class="main-wrap">
                            <div class="slot-wrapper"><slot name="popup" /></div>
                            <transition
                                v-if="popupSave"
                                v-show="loading"
                                appear
                                enter-active-class="animated bounceIn"
                                leave-active-class="animated bounceOut"
                                style="--animate-duration: 1s;"
                                >
                                <q-spinner-hourglass size="xs" class="loader-spinner" />
                            </transition>
                        </div>
                        <transition
                            v-if="popupSave"
                            v-show="notifications !== false"
                            appear
                            enter-active-class="animated slideInDown"
                            leave-active-class="animated slideOutUp"
                            style="--animate-duration: 1s;"
                            >
                            <q-banner inline-actions class="text-white bg-red">
                                {{$lbl(String(notifications))}}
                            </q-banner>
                        </transition>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions>
                        <q-btn @click="onEditCancel" :disable="loading">{{$lbl('foo.cancel')}}</q-btn>
                        <q-btn @click="onEditReset" :disable="loading">{{$lbl('foo.reset')}}</q-btn>
                        <q-btn type="submit" :disable="loading">{{$lbl('foo.ok')}}</q-btn>
                    </q-card-actions>
                </q-form>
            </q-card>
        </component>

        <q-tooltip v-if="!always && !editPopupVisible">{{$lbl('foo.click_to_edit')}}</q-tooltip>
    </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref } from 'vue'
// import plain_copy from 'src/utils/plain_copy'
import { getClosestParentComponentHaving } from 'src/utils/components'

import { uid } from 'quasar'

export default defineComponent({
    emits: [
        'edit:in-place:start'
    ],

    props: {
        /* wether quick edit is enabled or not, adds elements, functionalities, etc
        otherwise it just proxies it's default slot */
        enable: {
            required: false,
            type: Boolean,
            default: false
        },

        /* edit always? when true cell is edited on the cell itself ALWAYS (no click to edit), ignores
        [popup] */
        always: {
            required: false,
            type: Boolean,
            default: false
        },

        /* wether to float the loader icon/spinner on top of cell instead of placing it to the right */
        floatLoader: {
            required: false,
            type: Boolean,
            default: false
        },
        
        /* show normal content and when clicked render slot [popup] on compo */
        popup: {
            required: false,
            type: Boolean,
            default: false
        },

        /* when popup and popupSave are true, save action, feedback (loader) and notifications are
        shown on popup, otherwise the popup gets closed, loader is shown next to the cell content
        and notifications are shown as default floating notifications (same as popup = false) */
        popupSave: {
            required: false,
            type: Boolean,
            default: true
        },

        /* when editing in place, should it save the edit on backdrop click ? only works when
        [popup] = false */
        dismissSave: {
            required: false,
            type: Boolean,
            default: false
        },

        /* show backdrop on popup, actually changes the component used for the popup
        when true, it uses a q-dialog (which has a backdrop) when false, it uses a q-popup-proxy
        which shows as q-menu (no backdrop) on bigger screens and a q-dialog (with backdrop) on smaller screens, 
        when popup is false but backdrop is true, then a backdrop is rendered around the cell and
        clicking on it dismisses the edit */
        backdrop: {
            required: false,
            type: Boolean,
            default: false
        },

        /* show notifications on backdrop (when true), otherwise it uses $melon.showNotif, this only
        works when editing in-place */
        backdropNotify: {
            required: false,
            type: Boolean,
            default: false
        },

        /* binds for the popup compo (when in use) */
        popupBind: {
            required: false,
            type: Object,
            default: {}
        },

        column: Object
    },

    inject: ['$lbl'],

    watch: {
        editPopupVisible(newValue) {
            if(newValue === false)
                this.notifications = false
        }
    },
    
    setup(props) {
        return {
            uid: uid(),
            loading: ref(false),
            editPopupVisible: ref(false),
            bindedComponent: null,
            notifications: ref(false),
            editing: ref(false),
            backdropSource: ref(undefined)
        }
    },

    computed: {
        editorClassess() {
            return [
                'cimpl-table-cell-edit',
                this.floatLoader ? 'float-loader' : undefined,
                this.popupSave ? 'popup-save' : undefined,
                this.loading ? 'loading' : undefined
            ]
        },

        popupEditorClassess() {
            return [
                'cimpl-table-popup-edit',
                this.floatLoader ? 'float-loader' : undefined,
                this.popupSave ? 'popup-save' : undefined,
                this.loading ? 'loading' : undefined
            ]
        },

        editorPopupCompoProps()
        {
            let props = {
            }

            if(this.backdrop)
            {
                //we need to bind the model to show q-dialog
                props.modelValue = this.editPopupVisible
                props['onUpdate:modelValue'] = (newValue) => this.editPopupVisible = newValue

                if(this.loading)
                {
                    props['noEscDismiss'] = true
                    props['noBackdropDismiss'] = true
                }
            }

            _.merge(props,this.popupBind)

            return props
        },

        editorPopupCompoName()
        {
            return this.backdrop ? 'q-dialog' : 'q-popup-proxy'
        },

        bindedTable() {
            const table = getClosestParentComponentHaving([
                'is_cimpl_table'
            ],this)
            return table
        },

        backdropTarget()
        {
            return this.bindedTable
        }
    },

    methods: {
        /* wrap call to a method to avoid problems with composable methods called directly on template
        events, otherwise context gets lost (no 'this') */
        wrapCall (name, args) {
            if (args === undefined) args = []
            this[name].apply(this, args)
        },

        /* bind cell component to cell editor */
        bindEditor(compo)
        {
            this.bindedComponent = compo
        },

        onEditSubmit__()
        {
            const currentModel = this.bindedComponent.editModel
            const ctx = this
            function wrapperFunction(firstTime)
            {
                const promise = ctx.bindedComponent.onEditSubmit(currentModel)
                if(promise !== false)
                {
                    ctx.loading = true
                    ctx.editing = false
                    if(!ctx.popupSave) ctx.editPopupVisible = false
                    promise.then(() => {
                        if(ctx.popupSave) ctx.editPopupVisible = false
                    }).catch((response) => {
                        ctx.notifications = _.get(response,'data.error_msg','')
                        if(firstTime === true) ctx.bindedTable.needsRetry(ctx.uid,wrapperFunction)
                    }).finally(() => {
                        ctx.loading = false
                    })
                }
            }
            return wrapperFunction(true)
        },

        onEditSubmit()
        {
            const currentModel = this.bindedComponent.editModel
            const ctx = this
            function wrapperFunction()
            {
                const mainPromise = new Promise((resolve,reject) => {
                    const innerPromise = ctx.bindedComponent.onEditSubmit(currentModel)
                    /* if(innerPromise !== false)
                    { */
                    ctx.loading = true
                    ctx.editing = false
                    if(!ctx.popupSave) ctx.editPopupVisible = false
                    innerPromise.then(() => {
                        if(ctx.popupSave) ctx.editPopupVisible = false
                        resolve() // resolve mainPromise
                    }).catch((response) => {
                        ctx.notifications = _.get(response,'data.error_msg','')
                        reject() // reject mainPromise
                    }).finally(() => {
                        ctx.loading = false
                    })
                    /* } */
                })

                return mainPromise
            }
            return ctx.bindedTable.needsRetry(ctx.uid,wrapperFunction,'cell quick edit')
        },

        onEditReset()
        {
            this.bindedComponent.onEditReset()
        },

        onEditCancel()
        {
            this.editing = false
            if(this.backdrop) this.editPopupVisible = false
            this.onEditReset()
        },

        showEditPopup()
        {
            this.editing = true
            this.editPopupVisible = true
            if(!this.popup) this.$emit('edit:in-place:start')
        },

        onBackdropDismiss()
        {
            if(this.dismissSave)
                this.onEditSubmit()
            else this.onEditCancel()
        }
    },

    mounted() {
        let found = false
        let el = this.$el
        while(!found && el.parentNode)
        {
            el = el.parentNode
            found = el.nodeName === 'TD'
        }
        this.backdropSource = el
    }
})
</script>
