/* eslint-disable */

import './styles.scss'
import { defineComponent, ref, watch, h, provide } from 'vue'
import { registerStickyElement, unregisterStickyElement } from '../../directives/position-sticky/index.js'
//import { $melon } from 'src/boot/melon.window_melon'
import _ from 'lodash'
import { i18n } from 'src/boot/i18n.js'

import { CIMPL_FORM_parseFooterProp, CIMPL_FORM_notificationChips } from './utils.js'

import useModels from '../schema/composables/models.js'
import plain_copy from '../../utils/plain_copy'

import $_DEFAULTS from './defaults.js'
//import $_PARSE_PROP from './functions.js'

import CimplSchema from '../cimpl-schema.vue'
import CimplFormFooter from '../cimpl-form-footer.vue'

const $_VALID_ACTIONS = [
    'get',
    'set',
    'delete',
    'toggle'
]

const $_BUTTON_DISABLE_CONDITIONS = {
    error: true,
    noUpdate: true
};

const $_CIMPL_FORM_COMPONENT_PROPS = {
    /***** BASE START *//***** BASE START *//***** BASE START */
    /***** BASE START *//***** BASE START *//***** BASE START */
    /***** BASE START *//***** BASE START *//***** BASE START */
    /*form model value*/
    modelValue: {
        required: true,
        type: Object
    },

    /*form cimpl-schema, if any*/
    schema: {
        required: false,
        type: Object,
        default: undefined
    },
    /*cimpl-schema proxy of extra props*/
    schemaProxy: {
        required: false,
        type: Object,
        default: undefined
    },

    schemaClass: {
        required: false,
    },

    /*form mode, view/create/edit*/
    mode: {
        required: false,
        type: String,
        default: 'create',
    },

    /*use form footer ?*/
    footer: {
        required: false,
        default: true,
    },

    /*auto hide footer if there are no notifications?*/
    footerHide: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*footer is sticky?*/
    footerSticky: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*size of controls wrapper, if undefined it will default to 12, or 6 if there are notifications*/
    footerControlsCols: {
        required: false,
        type: Number,
    },

    /*proxy of props for the cimpl-form-footer*/
    footerProxy: {
        required: false,
        type: Object,
        default: {}
    },

    /*list of notification types to show*/
    notifications: {
        required: false,
        type: Array,
        default: ['updates', 'errors'],
    },

    /*form routes used in method navigate()*/
    routes: {
        required: false,
        type: Object,
        default: {},
    },

    /*true/false wether to do a reload() on reset, if FALSE then model will be restored from origModelValue*/
    reloadOnReset: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*show confirm dialog before reset*/
    resetConfirm: {
        required: false,
        type: Boolean,
        default: true,
    },

    /*debug through browser console form actions and inner workings*/
    debugForm: {
        required: false,
        type: Boolean,
        default: false
    },

    buttonDisableOn: {
        required: false,
        type: Object,
        default: { ...$_BUTTON_DISABLE_CONDITIONS }
    },

    /***** BASE END *//***** BASE END *//***** BASE END */
    /***** BASE END *//***** BASE END *//***** BASE END */
    /***** BASE END *//***** BASE END *//***** BASE END */



    /***** GET/SET/TOGGLE/DELETE OPTIONS START */
    /***** GET/SET/TOGGLE/DELETE OPTIONS START */
    /***** GET/SET/TOGGLE/DELETE OPTIONS START */
    /*this are the opts for the server/side actions, which are hardcoded to get/set/toggle/delete
    they cascade from the defaults, common, and the specific action defaults, and action defined,
    ie: _.merge({},$_DEFAULTS.common, ctx.commonOpts,$_DEFAULTS.get,ctx.getOpts)*/

    commonOpts: {
        required: false,
        type: Object,
        default: { ...$_DEFAULTS.common }
    },

    getOpts: {
        required: false,
        type: Object,
        default: { ...$_DEFAULTS.get },
    },

    setOpts: {
        required: false,
        type: Object,
        default: { ...$_DEFAULTS.set }
    },

    deleteOpts: {
        required: false,
        type: Object,
        default: { ...$_DEFAULTS.delete },
    },

    toggleOpts: {
        required: false,
        type: Object,
        default: { ...$_DEFAULTS.toggle },
    },
    /***** GET/SET/TOGGLE/DELETE OPTIONS END */
    /***** GET/SET/TOGGLE/DELETE OPTIONS END */
    /***** GET/SET/TOGGLE/DELETE OPTIONS END */

    /***** VISUALS START *********************/
    /***** VISUALS START *********************/
    /***** VISUALS START *********************/
    padding: {
        required: false,
        type: String,
        default: 'none'
    },

    loadingPre: {
        required: false,
        type: Boolean,
        default: false,
    },

    loadingInner: {
        required: false,
        type: Boolean,
        default: false
    },

    loadingType: {
        required: false,
        type: String,
        default: 'float', //static, float, none
    },

    loadingStateBlocksForm: {
        required: false,
        type: [Boolean, String], // false/true, 'form','updates'
        default: true
    },
    /***** VISUALS END ***********************/
    /***** VISUALS END ***********************/
    /***** VISUALS END ***********************/


    action: undefined,
    method: undefined
}

const $_FORM_EMITS = [
    'update:modelValue', //emit a new modelValue
    'update:partialModelValue',

    'removeModelUpdate', //emit a modelValue update that has been deleted
    'modelUpdate', //emit a modelValue updates

    'validationError', //dispatched when a specific validation rule fails
    'validationSuccess', //dispatched when a specific validation rule succedes

    'before:get',
    'after:get',

    'before:submit',
    'after:submit',
    'after:submit:error',

    'before:delete',
    'after:delete',

    'before:toggle',
    'after:toggle',

    'submit'
]

const $_COMPONENT = defineComponent({
    name: 'cimpl-form',
    tagname: 'cimpl-form',

    props: {
        ...$_CIMPL_FORM_COMPONENT_PROPS
    },

    emits: $_FORM_EMITS,

    components: {
        'cimpl-schema': CimplSchema,
        'cimpl-form-footer': CimplFormFooter
    },

    watch: {
        /*footerHide () { this.parseFooterProp() },
        footerSticky () { this.parseFooterProp() },
        //footerNotifications () { this.parseFooterProp() },
        footerControlsCols () { this.parseFooterProp() },
        footerProxy () { this.parseFooterProp() },
        footerHide () { this.parseFooterProp() },*/

        modelValue: {
            handler: function (newValue) {
                //console.log("DISPARO ACTUALIZACION EXTERNA", newValue)
                this.onModelValueOutterUpdate(newValue)
            },
            //deep: true,
        },
    },

    inject: {
        _cimpl_form_page_: {
            default: {
                bindForm: () => { },
                unbindForm: () => { },
                mountedForm: () => { },
            }
        }
    },

    setup (props) {

        const {
            updates,
            errors,
            setModelUpdate,
            setValidationError,
            unsetValidationError,
            onEntryRemoveModelUpdate: onSchemaRemoveModelUpdate,
            //onEntryModelUpdate,
            //onEntryValidationSuccess,
            //onEntryValidationError,
        } = useModels()


        const modelValue_keys = ref(Object.keys(typeof props.modelValue === 'object' ? props.modelValue : {}))


        let setupData = {
            //is_cimpl_form: true,

            loading: ref(false),
            submitting: ref(false),

            updates,
            errors,
            setModelUpdate,
            setValidationError,
            unsetValidationError,
            onSchemaRemoveModelUpdate,
            //onEntryModelUpdate,
            //onEntryValidationSuccess,
            //onEntryValidationError,*/

            ignoreModelValueUpdate: ref(false),
            ignoreModelUpdate: ref({}),
            modelValueWatchers: ref({}),

            /*used to store a copy of the modelValue, to prevent double running after internal
            update, and then the external update which triggers a new internal update, also to
            be able to revert changes to specific submodels*/
            modelValueCopy: ref(plain_copy(props.modelValue)),
            /*used to store keys of the last registered modelValue*/
            modelValue_keys,

            cimpl_form_uid: _.uniqueId('cimpl_form_'),
            bindedFormPage: undefined,
        }

        return setupData
    },

    data () {
        let dataObject = {
            //errors: [],
        }
        return dataObject
    },

    computed: {
        /*get the component instance*/
        instance () { return this },

        useFormBlocker () {
            return this.loading && this.loadingType !== 'float' && (this.loadingStateBlocksForm === true || this.loadingStateBlocksForm === 'form')
        },

        useUpdatesBlock () {
            return this.loading && this.loadingType !== 'float' && this.loadingStateBlocksForm === 'updates'
        },

        /*get the footer options*/
        footerOptions () {
            /*this.footerOptions = CIMPL_FORM_parseFooterProp(this.$props.footer)*/
            const updates = this.notifications.indexOf('updates') !== -1 && this.mode !== 'create' ? this.updates : undefined
            const errors = this.notifications.indexOf('errors') !== -1 ? this.errors : undefined
            const notifications = CIMPL_FORM_notificationChips(updates, errors)

            const options = this.footer === false ? false : {
                hide: this.footerHide,
                sticky: this.footerSticky,
                notifications: notifications,
                controlsCols: this.footerControlsCols,
                proxy: this.footerProxy,
            }

            return options
        },

        /*get the innerModelValue which is a computed between modelValue and updates*/
        innerModelValue () {
            //console.log("****** ** ** form RESET innerModelValue", this.modelValueCopy)
            let model = {}

            for (const x in this.modelValueCopy)
                model[x] = this.modelValueCopy[x]

            for (const updatedModel in this.updates) {
                const update = this.updates[updatedModel].update
                switch (update.modelConfig.type) {
                    case 'var':
                        _.set(model, updatedModel.startsWith('innerModelValue.') ? updatedModel.replace('innerModelValue.', '') : updatedModel, update.value)
                        break
                    case 'value':
                        alert("OTRO VALUE QUE FALTA")
                        break
                }
            }

            //console.log(this.updates)
            //console.log("--- computed end")
            return model
        },

        /*footer is visible?*/
        footerIsVisible () {
            if (this.footerOptions === false) return false
            let show = !this.footerOptions.hide
            for (const x in this.notifications)
                if (Object.keys(this[this.notifications[x]]).length)
                    show = true
            return show
        },

        /* q-form props proxy */
        qFormProxy () {
            return {
                action: this.action,
                method: this.method
            }
        },

        actionOptions () {
            let options = {}
            for (const x in $_VALID_ACTIONS) {
                const actionName = $_VALID_ACTIONS[x]
                options[actionName] = _.merge({}, $_DEFAULTS.common, this.commonOpts, $_DEFAULTS[actionName], this[`${actionName}Opts`])
                options[actionName].params = _.merge({},
                    _.get($_DEFAULTS.common, 'params', {}),
                    _.get($_DEFAULTS[actionName], 'params', {}),
                    _.get(this.commonOpts, 'params', {}),
                    _.get(this[`${actionName}Opts`], 'params', {}))
            }
            return options
        },

        modelUpdatesColoquial () {
            return Object.keys(this.modelUpdates)
        },

        formClassess () {
            let classess = []
            if (this.loading) classess.push('loading')
            if (this.submitting) classess.push('submitting')
            if (this.useUpdatesBlock) classess.push('block-updated-entries')
            if (this.padding.trim() != '') {
                if (this.footer) classess.push(`q-px-${this.padding}`, `q-pt-${this.padding}`)
                else classess.push(`q-pa-${this.padding}`)
            }

            return classess
        },

        /*generate form footer update/error chips*/
        footerNotifications () {
            this.debug("FOOTER NOTIF", this.updates, this.errors, this.footerOptions)
            if (this.footerOptions === false) return {}
            //alert("COMPUTED FOOTER CHIPS")
            let updates = this.updates
            if (!this.footerOptions.updates) updates = undefined
            let errors = this.errors
            if (!this.footerOptions.errors) errors = undefined
            let chips = CIMPL_FORM_notificationChips(updates, errors)
            return chips
        },

        enableFooterButtonSubmit () {
            return this.enableFooterButton('submit')
        },

        footerInstanceNode () {
            let footer = undefined
            if (this.$refs.footer !== undefined)
                if (this.$refs.footer.$el != undefined)
                    footer = this.$refs.footer.$el
            return footer
        }
    },

    methods: {

        afterModelUpdate (model, update) {
            //console.log('cimpl-form afterModelUpdate', model, update)
            const actionOptions = this.actionOptions.set
            //console.log("ACTION OPTIONS", actionOptions)

            if (actionOptions.onUpdate !== false) {
                this.submit()
            }
        },

        compareModelKeys (compare) {
            const compareKeys = Object.keys(compare !== undefined ? compare : {})
            const result = this.modelValue_keys.filter(x => !compareKeys.includes(x))
            //console.log("COMPARE MODEL KEYS", compareKeys, this.modelValue_keys, result)
            return result
        },

        /*watch any change on the modelValue*/
        onModelValueOutterUpdate (newValue) {
            //console.log("cimpl-form onModelValueOutterUpdate")
            if (this.ignoreModelValueUpdate) {
                this.ignoreModelValueUpdate = false
                //console.log("cimpl-form IGNORO onModelValueOutterUpdate")
                return
            }
            //console.log("cimpl-form CONTINUO onModelValueOutterUpdate")
            this.modelValueCopy = plain_copy(newValue)
            this.modelValue_keys = Object.keys(this.modelValueCopy)

            //console.log("cimpl-form por el update mando a resetear el watcher de modelo")
            this.resetModelValueWatch()
            this.updates = {}
        },

        startModelValueWatch (watchList) {
            //console.log("cimpl-form startModelValueWatch")
            //console.log("model keys", Object.keys(this.modelValue))
            //console.log("current model watchers", this.modelValueWatchers)
            //alert("ME PARECE QUE ESTO TENDRIA QUE TOMAR LO QUE VENGA DEL SCHEMA")
            if (watchList === undefined) watchList = Object.keys(this.modelValue)
            for (const x in watchList) {
                const model = `modelValue.${watchList[x]}`
                this.startModelValueWatch_4Model(model)
            }
        },

        startModelValueWatch_4Model (model) {
            if (this.modelValueWatchers[model] === undefined) {
                //console.log(`- mando a watchear ${model}`)
                this.modelValueWatchers[model] = this.$watch(model, (newValue) => {
                    //console.log("WATCHEO ESTE MODEL: " + model)
                    if (this.ignoreModelUpdate[model]) {
                        //console.log("- ignore")
                        this.ignoreModelUpdate[model] = false
                        return
                    }
                    _.set(this, model.replace('modelValue.', 'modelValueCopy.'), newValue)
                    delete this.updates[model]
                    delete this.updates[model.replace('modelValue.', 'innerModelValue.')]
                })
            }
        },

        restartModelWatcher_4model (model) {
            //console.log("restartModelWatcher_4model", model)
            this.stopModelValueWatch_4Model(model)
            this.startModelValueWatch_4Model(model)
        },

        stopModelValueWatch () {
            //console.log("cimpl-form stopModelValueWatch")
            for (const x in this.modelValueWatchers)
                this.modelValueWatchers[x]()
            this.modelValueWatchers = {}
        },

        stopModelValueWatch_4Model (model) {
            if (this.modelValueWatchers[model] !== undefined) {
                this.modelValueWatchers[model]()
                delete this.modelValueWatchers[model]
            }
        },

        resetModelValueWatch () {
            //console.log("cimpl-form resetModelValueWatch")
            this.stopModelValueWatch()
            this.startModelValueWatch()
        },

















        /*debug through browser console form actions and inner workings*/
        debug () {
            if (!this.debugForm) return
            const baseString = "** cimpl-form: "
            for (const x in arguments)
                console.log(typeof arguments[x] === 'string' ? `${baseString}${arguments[x]}` : arguments[x])
        },

        /*footerChipProps (chipData) {
            return CIMPL_FORM_footerChipProps(chipData)
        },*/

        bindSchema (name, component) {
            if (this.bindedSchemas[name] !== undefined)
                if (this.bindedSchemas[name] !== component)
                    throw new Error(`cimpl-form: schema name '${name}' already in use, can't bind`)
            this.bindedSchemas[name] = component
            component.bindedForm = this
            this.bindedSchemasWatchers[name] = [
                watch(() => component.validation_errors_by_model, (newValue) => this.validation_errors_by_model = newValue, { deep: true }),
                watch(() => component.validation_errors_by_uid, (newValue) => this.validation_errors_by_uid = newValue, { deep: true })
            ]
        },

        unbindSchema (name, component) {
            for (const x in this.bindedSchemasWatchers[name]) this.bindedSchemasWatchers[name][x].stop()
            delete this.bindedSchemasWatchers[name]
            if (this.bindedSchemas[name] === undefined)
                throw new Error(`cimpl-form: schema name '${name}' not in use, can't unbind`)
            delete this.bindedSchemas[name]
            component.bindedForm = undefined
        },

        setIgnoreModelValue (newValue) {
            this.ignoreModelUpdate.value = newValue
            for (const x in this.bindedSchemas) {
                this.bindedSchemas[x].ignoreModelUpdate = newValue
            }
        },

        setIgnoreResetUpdates (newValue) {
            this.ignoreResetUpdates.value = newValue

            for (const x in this.bindedSchemas) {
                this.bindedSchemas[x].ignoreResetUpdates = newValue
            }
        },


        /*set a new model value, usually after:[action]*/
        setModel (newModel) {
            //console.log("--- form set model", newModel)
            this.debug('setModel', newModel)
            //console.log("cimpl-form emit update:modelValue")
            this.$emit('update:modelValue', newModel)
        },

        triggerUpdatePartialModel (modeled) {
            const schema = this.$refs.schema
            schema.triggerUpdatePartialModel(modeled)
            this.setPartialModel(modeled)
        },

        setPartialModel (modeled) {
            //alert("SET PARTIAL MODEL")
            //console.log("MODELED", modeled)
            //console.log("modelValueWatchers", this.modelValueWatchers)
            if (this.$refs.schema !== undefined) {
                //alert("copio ignoreModelValueUpdate del schema")
                this.ignoreModelValueUpdate = this.$refs.schema.ignoreModelValueUpdate
            }

            for (const x in modeled) {
                //alert("piso modelValue copy " + x + " con " + modeled[x])
                this.modelValueCopy[x] = modeled[x]
                this.restartModelWatcher_4model(`modelValue.${x}`)
            }

            this.$emit('update:partialModelValue', modeled)
        },

        /*check validity of action name*/
        checkActionName (actionName) {
            const isValid = $_VALID_ACTIONS.indexOf(actionName) !== -1
            return isValid
        },

        doGet () {
            const ctx = this
            const actionOptions = this.actionOptions.get

            ctx.loading = actionOptions.loading
            ctx.submitting = actionOptions.submitting

            ctx.debug('doGet()', 'fire before:get with....', actionOptions)
            ctx.$emit('before:get', actionOptions)

            switch (actionOptions.rest) {
                case true:
                    switch (actionOptions.method) {
                        case 'get':
                            ctx.$rest.get(actionOptions.url, {
                                params: actionOptions.params
                            }).then(function (response) {
                                ctx.debug('fire after:get with....', response)
                                ctx.$emit('after:get', response)
                                if (actionOptions.set) ctx.setModel(_.get(response, actionOptions.getter))
                            }).catch(function (response) {
                                ctx.debug("ERROR", response)
                            }).finally(() => {
                                ctx.loading = false
                                ctx.submitting = false
                            })
                            break
                    }
                    break
            }
        },

        doSet () {
            //console.log("cimpl-form doSet")
            const ctx = this
            const actionOptions = this.actionOptions.set


            ctx.loading = actionOptions.loading
            ctx.submitting = actionOptions.submitting

            var blockEntries = []
            //console.log("DO SET", this.updates)
            var postModel = this.modelValue
            const schema = this.$refs.schema
            if (actionOptions.updatesOnly) {
                postModel = {}
                for (const x in this.updates) {
                    if (this.useUpdatesBlock) {
                        //console.log("model actual", x)
                        //console.log('schema', schema.entries_by_model)
                        const modeledEntries = _.get(schema, ['entries_by_model', x]/*`entries_by_model.${x}`*/, [])
                        //console.log("modeled entries", x, modeledEntries)
                        if (modeledEntries.length)
                            for (const z in modeledEntries) {
                                const entry = this.getSchemaEntry(modeledEntries[z])
                                //console.log("pusheando entry " + z, entry)
                                blockEntries.push(entry)
                            }
                        //console.log(entry by model,)
                        /*getSchemaEntry(entryUID, schemaName) {
                            const schema = schemaName !== undefined ? this.bindedSchemas[schemaName] : this.$refs.schema
                            return schema.bindedEntries[entryUID]
                        }*/
                        //for (const compoIndex in this.entries_by_model[x])
                        //console.log("BLOCK ENTRY", compoIndex, this.entries_by_model[x])
                    }
                    var split = x.split('.')
                    split.shift()
                    const variable = split.join(".")
                    _.set(postModel, variable, _.get(this, x))
                    console.log('seteo en post model esta variable', variable)
                }
            }

            console.log('post model final', postModel)

            //console.log("--- magia", blockEntries)

            const setEntryBlock = function (blockState) {
                //console.log("SET ENTRY BLOCK", blockState)
                if (blockEntries.length)
                    for (const x in blockEntries) {
                        blockEntries[x].loading = blockState
                        blockEntries[x].blocked = blockState
                    }
            }

            let params = actionOptions.params
            let postData = {
                record: _.merge({}, _.get(actionOptions, 'params.record', {}), JSON.parse(JSON.stringify(postModel))),
                mode: this.mode,
            }

            console.log("POST DATA FINAL", postData)
            console.log('params record?', _.get(actionOptions, 'params.record', {}))


            let emitOptions = {
                options: actionOptions,
                postData: postData
            }
            ctx.debug('doSet()', 'fire before:submit with....', emitOptions)
            this.$emit('before:submit', emitOptions)

            switch (emitOptions.options.rest) {
                case true:
                    switch (emitOptions.options.method) {
                        case 'post':
                            setEntryBlock(true)
                            ctx.$api.post(emitOptions.options.url, emitOptions.postData, {
                                params: params
                            }).then(function (response) {
                                ctx.$emit('after:submit', response)
                                if (emitOptions.options.set) {
                                    ctx.ignoreModelValueUpdate = false
                                    //console.log("cimpl-form emitOptions.set", response)
                                    //alert('cimpl-form emitOptions.options.set === true')

                                    const responseItems = _.get(response, emitOptions.options.getter, undefined)
                                    //console.log("response items", responseItems)

                                    if (emitOptions.options.updatesOnly) {
                                        //console.log('cimpl-form emitOptions.options.updatesOnly')
                                        for (const x in responseItems) {
                                            //console.log(`-- deleteo updates.innerModelValue.${x}`)
                                            //console.log(`-- deleteo ignoreModelUpdate.modelValue.${x}`)
                                            delete ctx.updates[`innerModelValue.${x}`]
                                            delete ctx.ignoreModelUpdate[`modelValue.${x}`]
                                        }
                                        //console.log("-- mando setPartialModel")
                                        ctx.setModel({ ...ctx.innerModelValue, ...responseItems })
                                        //ctx.triggerUpdatePartialModel({ ...responseItems })
                                    }
                                    else {
                                        ctx.ignoreModelUpdate = {}
                                        ctx.updates = {}
                                        ctx.setModel({ ...responseItems })
                                    }
                                }
                                //if (emitOptions.options.set) ctx.reset(response.data.record, true)
                                if (emitOptions.options.redirect && response.data.url) {
                                    //const view = ctx.$melon.getViewComponentFromSource(ctx)
                                    //view.navigate(response.data.url, {})
                                    alert("SHOULDN BE HERE 1")
                                }
                            }).catch(function (response) {
                                ctx.$emit('after:submit:error', response)
                            }).finally(function () {
                                setEntryBlock(false)
                                ctx.loading = false
                                ctx.submitting = false
                            })
                            break
                    }
                    break
            }
        },

        reload () {
            this.doGet()
        },

        submit () {
            //console.log("submit?")
            if (Object.keys(this.errors).length) return false
            //console.log("si, submit")
            if (this.actionOptions.set.method === 'submit') {
                this.$emit('submit')
            }
            else this.doSet()
        },

        onQFormSubmit () {
            //console.log("on Q FORM SUBMIT")
            this.submit()
        },

        onFooterSubmit () {
            this.submit()
        },

        onReset () {
            this.reset()
        },

        reset (model, forceConfirm) {
            if (model === undefined) model = this.innerModelValue
            if (forceConfirm === undefined) forceConfirm = false
            //console.log("cimpl-form reset")
            //console.log("model?", model)
            //console.log("forceConfirm?", forceConfirm)
            const ctx = this
            //const appInstance = this.$store.getters.appInstance

            const performReset = function () {
                if (ctx.reloadOnReset) ctx.reload()
                else {
                    ctx.updates = {}
                    ctx.errors = {}
                    ctx.$emit('update:modelValue', model)
                }
            }
            /*if (this.resetConfirm && !forceConfirm) appInstance.dialogConfirm({
                title: this.$t('form.reset_confirm.title'),
                message: this.$t('form.reset_confirm.excerpt')
            }, this.$melon.getViewComponentFromSource(this)).onOk(performReset).onCancel(() => {
            })
            else*/ performReset()
        },

        onValidationSuccess () {
            this.error = false
        },

        onValidationError (ref) {
            //console.log("on validation error from qform?", ref)
            this.error = true
        },

        onNotificationClick (payload) {
            this.debug("FORM NOTIFICATION CLICK", payload)
            switch (payload.type) {
                case 'updates':
                    delete this.updates[payload.notification.model]
                    delete this.updates[payload.notification.model.replace('innerModelValue.', 'modelValue.')]
                    this.ignoreModelValueUpdate = true
                    this.$emit('update:modelValue', this.innerModelValue)
                    break
            }
        },

        schemaSlots (schemaName) {
            const keys = Object.keys(this.$slots)
            const slots = []
            for (const x in keys) {
                const key = keys[x]
                const search = 'schema:' + (schemaName !== undefined ? `${schemaName}:` : '')
                if (key.startsWith(search)) {
                    const schemaSlotName = key.substring(search.length)
                    slots.push(schemaSlotName)
                }
            }
            return slots
        },

        enableFooterButton (name) {
            //console.log("cimpl-form.enableFooterButton " + name, this.buttonDisableOn)
            const disableConfig = _.merge({
                error: true,
                noUpdate: true,
            }, _.get(this.buttonDisableOn, name, {}))
            //console.log("disableOn parseado", disableConfig)
            let enable = true
            for (const x in disableConfig) {
                if (disableConfig[x] === true) switch (x) {
                    case 'error':
                        if (Object.keys(this.errors).length)
                            enable = false
                        break
                    case 'noUpdate':
                        if (!Object.keys(this.updates).length)
                            enable = false
                        break
                }
                //return enable
            }

            //return disableConfig
            return enable
        },

        footerIsMounted (el, binding, vnode, prevVnode) {
            if (this.footerOptions.sticky) {
                alert("STICKY FOOTER EN VEZS DE PAGE FOOTER")
                registerStickyElement(el, {
                    value: {
                        target: '.cimpl-form',
                        bottom: true,
                    }
                })
            }
        },

        footerIsUnmounted (el, binding, vnode, prevVnode) {
            //console.log("--- cimpl-form FOOTER IS UNMOUNTED")
            unregisterStickyElement(el)
        },







        onSchemaUpdateModelValue (payload) {
            //console.log("FORM: viene de SCHEMA @update:modelValue", payload)
            if (this.$refs.schema !== undefined) {
                //console.log("cimpl-form seteo ignoreModelValueUpdate al valor que tenga el esquema", this.ignoreModelValueUpdate)
                this.ignoreModelValueUpdate = this.$refs.schema.ignoreModelValueUpdate
            }
            this.$emit('update:modelValue', payload)
        },

        onSchemaUpdatePartialModelValue (payload) {
            //console.log("FORM: viene de SCHEMA @update:partialModelValue", payload)
            this.setPartialModel(payload)
        },

        onSchemaModelUpdate (payload) {
            this.debug("FORM: SCHEMA @modelUpdate", payload)
            const localModel = payload.update.modelConfig.modelParsed.replace('innerModelValue.', 'modelValue.')
            const result = this.setModelUpdate(payload.update.value, payload.update.modelConfig, undefined, this.schema, false)
            this.debug("RESULT", result)
            const callables = ['cimpl-schema-entry', 'cimpl-schema-tabbed']
            for (const x in result.events)
                switch (x) {
                    case 'update:modelValue':
                        //es el schema diciendome que cambio el modelo entero, lo ignoro
                        //y en su lugar voy a usar modelUpdate para poder trackear cambios
                        //específicos
                        this.ignoreModelValueUpdate = true
                        this.ignoreModelUpdate[localModel] = true
                        //console.log("FORM VIENE DE schema modelUpdate (entry, no form entero)")
                        this.$emit('update:modelValue', this.innerModelValue)
                        break

                    default:
                        this.$emit(x, result.events[x])
                        break
                }
        },

        onSchemaRemoveModelUpdate_ (payload) {
            this.debug("FORM: SCHEMA @removeModelUpdate", payload)
            delete this.updates[payload.update.modelConfig.modelParsed]
            this.debug("-- 1", this.innerModelValue)
            this.ignoreModelValueUpdate = true
            this.$emit('removeModelUpdate', payload)
            this.$emit('update:modelValue', this.innerModelValue)
            this.debug("-- 2", this.innerModelValue)
            return this.onSchemaRemoveModelUpdate(payload)
        },

        onSchemaValidationSuccess (payload) {
            this.debug("FORM: SCHEMA @validationSuccess", payload)
            return this.unsetValidationError(payload)
        },

        /*entry validationError event*/
        onSchemaValidationError (payload) {
            this.debug("FORM: SCHEMA @validationError", payload)
            return this.setValidationError(payload)
        },

        getSchemaEntry (entryUID, schemaName) {
            const schema = schemaName !== undefined ? this.bindedSchemas[schemaName] : this.$refs.schema
            return schema.bindedEntries[entryUID]
        }
    },

    beforeMount () {
        //console.log("cimpl-form beforeMount")
        this._cimpl_form_page_.bindForm(this)
        this.startModelValueWatch()
        //console.log("cimpl-form END beforeMount")

    },

    beforeUnmount () {
        this._cimpl_form_page_.unbindForm(this)
        this.stopModelValueWatch()
    },

    mounted () {
        //console.log("cimpl-form MOUNTED")
        this._cimpl_form_page_.mountedForm(this)
        //console.log("cimpl-form END MOUNTED")
    }
})

export default $_COMPONENT

export { $_FORM_EMITS, $_CIMPL_FORM_COMPONENT_PROPS }