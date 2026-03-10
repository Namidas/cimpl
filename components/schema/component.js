/* eslint-disable */

import './styles.scss'
import { defineComponent, ref, unref, provide, computed, isProxy, isRef, isReactive, watch, reactive } from 'vue'
//import { $melon } from 'src/boot/melon.window_melon'
import plain_copy from '../../utils/plain_copy'
import _ from 'lodash'

import { getClosestParentComponent, getComponentSlots, inheritComponentSlots } from '../../utils/components.js'

import $_DEFAULTS from './defaults.js'

import parseSchema from './parser.js'

import useModels from './composables/models.js'
//import useDraggableEntries from './composables/draggable.js'

//import CimplSchemaEntryRender from 'components/cimpl/schema/components/entry.render.js'

import CimplSchemaChildren from './components/children.vue'
import CimplSchemaDebug from './components/schema-debug'

const $_COMPONENT_DEFAULTS = {
    props: {
        /*modelValue for the schema*/
        modelValue: {
            required: false,
            type: Object,
            default: {}
        },

        /*deeply watch the modelValue changes?*/
        /*modelValueDeepWatch: {
            required: false,
            type: Boolean,
            default: false,
        },*/

        /*schema definitions*/
        schema: {
            required: false,
            type: Object,
            default: {}
        },

        /*a proxy of more values? for instance used with the tabbed comp*/
        proxy: {
            required: false,
            type: Object,
            default: {}
        },

        /*debug cimpl-schema through the console ?*/
        debugSchema: {
            required: false,
            type: Boolean,
            default: false
        },


        /*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*/
        /*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*/
        /*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*/
        /*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*//*BEHAVIOR OPTIONS*/
        /*input mode, view/create/edit*/
        mode: {
            required: false,
            type: String,
            default: 'create',
        },

        modeOptions: {
            required: false,
            type: Object,
            default: {
                view: {
                    entry: {
                        readonly: true
                    }
                }
            }
        },

        /*make schema child entries draggables?*/
        draggableChildren: {
            required: false,
            type: Boolean,
            default: false
        }
    },
}

const $_COMPONENT = defineComponent({
    props: {
        ...$_COMPONENT_DEFAULTS.props
    },

    components: {
        //CimplSchemaEntry
        CimplSchemaChildren,
        CimplSchemaDebug
    },


    name: 'cimpl-schema',
    tagname: 'cimpl-schema',

    emits: [
        'update:modelValue', //emit a new modelValue
        'update:partialModelValue', //emit a set of key > value to manually update on the model instead of a full replace

        'removeModelUpdate', //emit a modelValue update that has been deleted
        'modelUpdate', //emit a modelValue updates

        'validationError', //dispatched when a specific validation rule fails
        'validationSuccess', //dispatched when a specific validation rule succedes
    ],

    watch: {
        schema: {
            handler: function (newValue) {
                this.onSchemaChange(newValue)
            },
            //SUPER SLOW
            deep: true
        },

        modelValue: {
            handler (newValue) {
                //console.log("cimpl-schema watch() modelValue")
                this.onModelValueOutterUpdate(newValue)
            },
            //deep: true
        },
    },

    /*inject: {*/
    /*cimpl-form injection to bind schemas*/
    /*_cimpl_form_: {
        default: {
            bindSchema: () => { },
            unbindSchema: () => { },
            //ignoreModelUpdate: () => { },
            //ignoreResetUpdates: () => { },
            setValidationError: () => { },
            unsetValidationError: () => { },
        }
    }
    },*/

    setup (props, { slots }) {

        const {
            updates,
            errors,
            setModelUpdate,
            setValidationError,
            unsetValidationError,
            onEntryRemoveModelUpdate,
            onEntryModelUpdate,
            onEntryValidationSuccess,
            onEntryValidationError,
            afterModelUpdate
        } = useModels()

        const innerSchema = ref({ items: [] })
        /*const innerSchemaItems = computed({
            get() {
                console.log("inner schema items?",setupData.innerSchema.value.items)
                return setupData.innerSchema.value.items
            },
            set(newValue) {
                setupData.innerSchema.value.items = newValue
            }
        })*/

        /*filter "undefined" from items*/
        const ___innerSchemaItems = computed({
            get () {
                /*let items = []
                for (const x in innerSchema.value.items) {
                    const unrefed = //unref//(innerSchema.value.items[x])
                    if (unrefed === undefined) continue
                    items.push(innerSchema.value.items[x])
                }
                return items*/
                return setupData.innerSchema.value.children
            },

            /*set(newValue) {
                innerSchema.value.items = newValue
            }*/
        })
        const innerSchemaItems = computed(() => setupData.innerSchema.value.children)

        let setupData = {
            /*inner model value for the controllers*/
            modelValueWatchers: {},

            currentSlots: ref(Object.keys(slots)),

            /*used to store a copy of the modelValue, to prevent double running after internal
            update, and then the external update which triggers a new internal update, also to
            be able to revert changes to specific submodels*/
            modelValueCopy: ref(plain_copy(props.modelValue)),

            /*ignore next outter model update? used to prevent double-fire*/
            ignoreModelValueUpdate: ref(false),

            /*ignore specific model update? same as prev*/
            ignoreModelUpdate: ref({}),

            /*inner parsed schema*/
            innerSchema,
            innerSchemaItems,
            //items2Render,

            /*store values for currently undefined entry models in modelValue*/
            innerModelValue_undefineds: ref({}),

            /*list of updates by model > entry > update*/
            /*from composable*/
            updates,

            /*list of errors by model > entry uid > rule > error*/
            /*from composable*/
            errors,

            /*from composable*/
            setModelUpdate,
            setValidationError,
            unsetValidationError,
            onEntryRemoveModelUpdate,
            onEntryModelUpdate,
            onEntryValidationSuccess,
            onEntryValidationError,
            afterModelUpdate,

            /*binded entry components*/
            bindedEntries: ref({}),
            bindedEntriesCallbacks: ref({}),

            /*list of model updates*/
            //modelUpdates: ref({}),

            validation_errors_by_uid: ref({}),
            validation_errors_by_model: ref({}),

            bindedForm: undefined,

            /*schemaWrap: ref(null),
            entriesWrap: ref(null),
            draggableHandler: null,
            draggableWrap: ref(null)*/
        }

        provide('_cimpl_schema_', {
            bindEntry (component) {
                //console.log("BIND ENTRY",component)
                const schema = getClosestParentComponent('cimpl-schema', component)
                return schema.bindEntry(component)
            },

            unBindEntry (component) {
                const schema = getClosestParentComponent('cimpl-schema', component)
                return schema.unBindEntry(component)
            },
        })

        /*if(props.draggable)
        {
            //setupData.draggableWrap = setupData.schemaWrap
          
            const {
                draggableHandler,
                draggableWrap,
                //draggableEntries,
                //bindDraggableEntry
            } = useDraggableEntries(setupData.entriesWrap,innerSchemaItems)
            
            setupData.draggableHandler = draggableHandler
            setupData.draggableWrap = draggableWrap
            //setupData.draggableEntries = draggableEntries
            //setupData.bindDraggableEntry = bindDraggableEntry
        }*/

        return setupData
    },

    data () {
        return {
            errors: [],
        }
    },

    computed: {
        instance () {
            return this
        },

        /*entries in the current schema*/
        entries () {
            return this.innerSchema.entries ? this.innerSchema.entries : {}
        },

        /*const innerSchemaItems = computed({
            get() {
                console.log("inner schema items?",setupData.innerSchema.value.items)
                return setupData.innerSchema.value.items
            },
            set(newValue) {
                setupData.innerSchema.value.items = newValue
            }
        })*/

        currentSlots_computed () { return Object.keys(this.$slots) },

        //slots specific for each item 2 render
        _____________items2Render_slots () {
            let slots = {}
            for (const x in this.items2Render) {
                const item = this.items2Render[x]
                slots[item.entry_uid] = getComponentSlots(this.$slots, `${item.entry_uid}:`)
            }
            /*for (const x in this.$slots)
                slots[x] = this.$slots*/

            //console.log("/////// item2render_slots", Object.keys(slots))
            return slots
        },

        /*get the innerModelValue which is a computed between modelValue and updates*/
        innerModelValue () {
            //console.log("****** ** ** schema RESET innerModelValue")
            let model = {}
            for (const x in this.modelValueCopy)
                model[x] = this.modelValueCopy[x]

            //console.log("-- aca comenté el set de undefineds, ME PARECE que ahora que tiro models.props ya no hace falta esto")
            //console.log("ademas al quitar esto me evito actualizaciones al pedo cada vez que cambia uno de esos valores")
            /*for (const undef in this.innerModelValue_undefineds.modelValue)
                _.set(model, undef, this.innerModelValue_undefineds.modelValue[undef])*/

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
            //console.log("****** ** ** ENDO schema RESET innerModelValue")
            return model
        },

        /*get entries in a object of model > entry_uid (instead of entries > entry)*/
        entries_by_model () {
            let entries = {}
            for (const x in this.bindedEntries) {
                const entry = this.bindedEntries[x]
                const schemaItem = unref(entry.schemaItem)
                for (const y in entry.componentModelsParsed.modelConfigs) {
                    const model = entry.componentModelsParsed.modelConfigs[y]
                    switch (model.type) {
                        case 'var':
                            if (entries[model.modelParsed] === undefined) entries[model.modelParsed] = []
                            entries[model.modelParsed].push(schemaItem.entry_uid)
                            break

                        case 'value':
                            alert("falta este otro value")
                            break
                    }
                }
            }
            return entries
        },
    },

    methods: {
        getSlotsFor (entryUID) {
            //console.log("GET SLOTS FOR " + entryUID, entryUID)
            const result = getComponentSlots(this.$slots, `${entryUID}:`)
            console.log("- result", result)
            return result
        },

        inheritSlotsFor (entryUID) {
            console.log("INHERIT SLOTS FOR " + entryUID, entryUID)
            const result = inheritComponentSlots(this.$slots, `${entryUID}:`)
            console.log("- result", result)
            return result
        },

        /*debug schema information on browser console*/
        debug () {
            if (!this.debugSchema) return
            const baseString = `** cimpl - schema[${_.get(this, 'schema.name')}]: `
            for (const x in arguments)
                console.log(typeof arguments[x] === 'string' ? `${baseString}${arguments[x]} ` : arguments[x])
        },

        onDraggableUpdate (payload) {
            console.log("on update draggable schema", payload)
            //this.items2Render = payload
        },

        onSchemaChange (newValue) {
            //console.log("--- CIMPL-SCHEMA onSchemaChange, esto esta watcheando deep")
            this.innerSchema = parseSchema(newValue, this.$store, this.$props)
            this.restartWatchModelValue()
        },


        triggerUpdatePartialModel (modeled) {
            //console.log("cimpl-schema triggerUpdatePartialModel")
            for (const key in modeled) {
                const entries = this.entries_by_model[`innerModelValue.${key}`]
                //console.log('trigger update', entries)
                for (const z in entries) {
                    //console.log('- z: ' + z)
                    const entry_uid = entries[z]
                    //console.log("check for entry", entry_uid)
                    const entry = this.bindedEntries[entry_uid]
                    if (entry) {
                        //console.log('trigger update en este entry', entry)
                        //console.log('componentProxy', entry.componentProxy)
                        entry.updates = {}
                        entry.errors = {}
                        this.clearInParent(entry, 'updates')
                        this.clearInParent(entry, 'errors')
                    }
                }
            }
        },

        emitModelValue (forced, ignoreNext, models) {
            if (forced === undefined) forced = {}
            if (ignoreNext === undefined) ignoreNext = false
            if (models === undefined) models = []

            var updateEvent = 'update:modelValue'

            var model2Emit = { ...this.innerModelValue }

            //console.log("cimpl-schema->emitModelValue va a flagear ignorar model update?", ignoreNext)
            if (ignoreNext) {
                //console.log("cimpl-schema->emitModelValue va a ignorar")
                this.ignoreModelValueUpdate = true

                /*esto lo comente porque con undefs no funcionaba
                pero tengo mis dudas de si en cualquier otra situacion "normal"
                si hara falta descomentarlo e ignorar modelos especificos*/
                /*for (const x in models) {
                    //console.log("cimpl-schema->emitModelValue va a ignorar MODELO ESPECIFICO", models[x])
                    this.ignoreModelUpdate[models[x]] = true
                }*/
            }



            /*//console.log("cimpl-schema mando a resetear modelo interno por la actualizacion")
            this.resetInnerModelValue()*/

            /*//console.log("cimpl-schema->emitModelValue  mando a resetear updates de cada binded entry PARA LOS MODELOS DADOS",models)
            //console.log("(esto porque ahora es 'oficial' que actualizo el modelo, entonces ya no es una actualizacion que necesite registrar)")
            for(const model in models)
            {
                const parsedModel = models[model]
                for (const x in this.entries_by_model[parsedModel]) {
                    const compo = this.bindedEntries[this.entries_by_model[parsedModel][x]]*/
            /*if (compo.schemaItem.entry_uid !== payload.entry.uid) {
                delete compo.updates[parsedModel]
                this.clearInParent(compo, 'updates', parsedModel)
            }*/

            /*si no hago esto no se me actualiza ni en el compo que generó el update
            ni en cualquier otro compo que esté usando el mismo modelo*/
            /*//console.log("mando el reset con appendEntry false, cambie esto ahora, creo que funciona")
            compo.resetComponentModelsParsed(false)*/
            /*}
        }*/

            for (const key in forced)
                model2Emit[key] = forced[key]


            //console.log("MODEL 2 EMIT PRE CHEQUEAR [models]")
            //console.log(model2Emit)
            //console.log("forced?", forced)

            if (models !== undefined) {
                //console.log("------- MODELOS NO ERAN INDEFINIDOS", models)
                updateEvent = 'update:partialModelValue'
                var tempModel = {}
                for (const x in models)
                    tempModel[models[x]] = model2Emit[models[x]]
                model2Emit = tempModel
            }

            //console.log("*******************")
            //console.log(`cimpl - schema -> emitModelValue PRE EMITIR ${ updateEvent } `)
            //console.log("*MODELO A EMITIR", model2Emit)
            this.$emit(updateEvent, model2Emit)
            //console.log("*****************************")
            //console.log(`cimpl - schema -> emitModelValue POST EMITIR ${ updateEvent } `)
        },

        /*update a proxied value and all it's uses across the whole schema*/
        updateProxyValue (newValue, modelConfig) {
            _.set(this, modelConfig.modelParsed, newValue)
            for (const x in this.entries_by_model[modelConfig.modelParsed]) {
                this.entries[this.entries_by_model[modelConfig.modelParsed][x]].controllerPropsProxy[modelConfig.name] = newValue
            }
        },

        clearInParent (compo, type, model) {
            const callables = ['cimpl-schema-entry', 'cimpl-schema-tabbed']
            var parento = compo.$parent
            while (parento !== this) {
                if (callables.indexOf(parento.$.type.name) !== -1) {
                    //console.log("CAI EN BORRARRRR")
                    if (model === undefined) parento[type] = {}
                    else delete parento[type][model]
                    if (parento.$.type.name === 'cimpl-schema-tabbed')
                        parento.removeTabsNotification(type, model)
                }
                parento = parento.$parent
            }
        },

        /*custom on entry update:modelValue*/
        onEntryUpdateModelValue (payload) {
            //console.log("cimpl-schema: from entry update:modelValue", payload)
            const result = this.setModelUpdate(payload.newValue, payload.modelConfig, payload.entry, this.schema, false)
            const callables = ['cimpl-schema-entry', 'cimpl-schema-tabbed']
            for (const x in result.events)
                switch (x) {
                    case 'update:modelValue':
                        const doesntExistUndefined = 'DOESNT_EXIST_DOESNT_EXIST_DOESNT_EXIST'
                        const mustIgnore = _.get(this.innerModelValue_undefineds, payload.modelConfig.model, doesntExistUndefined) === doesntExistUndefined
                        this.ignoreModelValueUpdate = mustIgnore
                        this.ignoreModelUpdate[payload.modelConfig.modelParsed] = mustIgnore
                        //console.log("cimpl-schema va a flagear ignorar model update?", mustIgnore)
                        //console.log("(NO ignora si hay undefineds para ese modelo)")
                        if (mustIgnore) {
                            //console.log("cimpl-schema flageando ignorando modelValue update")
                            //console.log(`cimpl - schema flageando ignorar ${ payload.modelConfig.modelParsed } update`)
                        }

                        //console.log("cimpl-schema mando a resetear updates de cada binded entry PARA EL MODELO DADO", payload.modelConfig.modelParsed)
                        //console.log("(esto porque ahora es 'oficial' que actualizo el modelo, entonces ya no es una actualizacion que necesite registrar)")
                        for (const x in this.entries_by_model[payload.modelConfig.modelParsed]) {
                            const compo = this.bindedEntries[this.entries_by_model[payload.modelConfig.modelParsed][x]]
                            if (compo.schemaItem.entry_uid !== payload.entry.uid) {
                                delete compo.updates[payload.modelConfig.modelParsed]
                                this.clearInParent(compo, 'updates', payload.modelConfig.modelParsed)
                            }

                            /*si no hago esto no se me actualiza ni en el compo que generó el update
                            ni en cualquier otro compo que esté usando el mismo modelo*/
                            //console.log("mando el reset con appendEntry false, cambie esto ahora, creo que funciona")
                            compo.resetComponentModelsParsed(false)

                            /*if (compo.schemaItem.type === 'tabbed') {
                                delete compo.$refs.component.updates[payload.modelConfig.modelParsed]
                            }*/
                            //this.watchModelValue_appendEntryModels(compo, true)
                        }

                        //console.log("cimpl-schema termine de hacer toda la gilada de update de model value de un entry entonces mando el update:modelValue del SCHEMA " + x)
                        //console.log("*******************")
                        this.$emit(x, this.innerModelValue)
                        //console.log("*****************************")
                        //console.log("cimpl-schema POST EMITIR " + x)
                        break

                    default:
                        this.$emit(x, result.events[x])
                        break
                }
        },
        onEntryModelUpdate_ (payload) { return this.onEntryModelUpdate(payload) },
        onEntryRemoveModelUpdate_ (payload) { return this.onEntryRemoveModelUpdate(payload) },
        onEntryValidationError_ (payload) { return this.onEntryValidationError(payload) },
        onEntryValidationSuccess_ (payload) {
            return this.onEntryValidationSuccess(payload)
        },


        /*watch any change on the modelValue*/
        onModelValueOutterUpdate (newValue) {
            //console.log("cimpl-schema onModelValueOutterUpdate")

            for (const x in this.innerModelValue_undefineds.modelValue)
                if (_.get(newValue, x) !== undefined) {
                    delete this.innerModelValue_undefineds.modelValue[x]
                    if (this.entries_by_model[`innerModelValue.${x} `] !== undefined)
                        for (const y in this.entries_by_model[`innerModelValue.${x} `]) {
                            //console.log("- mando a resetear UNDEF ", this.bindedEntries[this.entries_by_model[`innerModelValue.${ x } `][y]])
                            const compo = this.bindedEntries[this.entries_by_model[`innerModelValue.${x} `][y]]
                            /*//console.log("cimpl-schema : entonces mando a resetear los modelos del compo (porque ")
                            //compo.resetComponentModelsParsed()*/
                            //console.log("cimpl-schema resetee un UNDEF asique tengo que mandar otra a watchear modelos del compo, para que lo agregue")
                            this.watchModelValue_appendEntryModels(compo)
                        }
                }

            if (this.ignoreModelValueUpdate) {
                this.ignoreModelValueUpdate = false
                //console.log("cimpl-schema IGNORO onModelValueOutterUpdate")
                return
            }

            //console.log("cimpl-schema CONTINUO onModelValueOutterUpdate")
            this.modelValueCopy = plain_copy(newValue)

            //console.log("cimpl-schema : limpio actualizaciones")
            this.updates = {}

            for (const x in this.bindedEntries) {
                const compo = this.bindedEntries[x]
                compo.updates = {}
                const compoItem = unref(compo.schemaItem)

                //console.log(`[${ compoItem.label }] como parte del modelUpdate de schema tiro borrar updates en componente y todos los parents`)
                this.clearInParent(compo, 'updates')

                //console.log(`[${ compoItem.label }] como parte del update tiro resetear modelos de componente`)
                compo.resetComponentModelsParsed()
            }

            this.restartWatchModelValue()
        },

        /*start modelValue watcher*/
        watchModelValue (reset) {
            //console.log("cimpl-schema watchModelValue")
            if (reset === undefined) reset = false
            const ctx = this
            //console.log("[cimpl-schema] WATCH MODEL VALUE")
            //console.log("bindedEntries?", Object.keys(this.bindedEntries))
            for (const x in this.bindedEntries) {
                //console.log("-- watchModelValue pre watchModelValue_appendEntryModels")
                this.watchModelValue_appendEntryModels(this.bindedEntries[x])
            }
        },

        /*specifically watch whatever models an entry has instead of the whole model deeply, which
        would instead trigger an update on everything, because I can't differentiate what triggered what*/
        watchModelValue_appendEntryModels (entryComponent, reset, $options) {
            if ($options === undefined) $options = {}

            var returnThis = {}

            const item = unref(entryComponent.schemaItem)
            const entry = entryComponent.schemaEntry

            //console.log(`cimpl - schema[${ item.label }] APPEND ENTRY MODELS`)
            //console.log("entryComponent?", entryComponent)
            //console.log("componentModelsParsed?", entryComponent.componentModelsParsed)

            const models = entryComponent.componentModelsParsed
            const undefEmits = {}
            var undefEmits_models = []

            //console.log("models?", models)
            for (const x in models.modelConfigs) {
                const modelConfig = models.modelConfigs[x]
                //console.log(`cimpl - schema[${ item.label }] ciclando este model`, modelConfig)
                switch (modelConfig.type) {
                    case 'var':
                        const model = modelConfig.modelParsed.replace('innerModelValue.', 'modelValue.')
                        //if(_.get(this,model) !== undefined)

                        if (this.modelValueWatchers[model] !== undefined && reset) {
                            for (const x in this.modelValueWatchers[model])
                                this.modelValueWatchers[model][x]()
                            this.modelValueWatchers[model] = undefined
                        }

                        if (this.modelValueWatchers[model] === undefined) {
                            const current = _.get(this, model)
                            //console.log(`cimpl - schema[${ item.label }] gonna watch`, model)
                            //console.log("current", current)
                            //console.log("model value", this.modelValue)

                            if (current === undefined) {
                                //console.log(`cimpl - schema[${ item.label }]- modelo indefinido, lo voy a hardcodear`)
                                //console.log(modelConfig)
                                models.props[modelConfig.name] = modelConfig.default
                                if (_.get(this.innerModelValue_undefineds, model) === undefined) {
                                    /*si esto lo meto en este IF, entonces en el proximo IF no puedo mandar a que ignore
                                    los modelos, porque se auto-actualiza solo si seteo este undefined y
                                    cambio el models.props*/
                                    //if (!entry.defaultEmit) {
                                    _.set(this.innerModelValue_undefineds, model, modelConfig.default)
                                    //}

                                    //entryComponent.resetComponentModelsParsed(false)

                                    //console.log("cimpl-schema entry.defaultEmit?", entry.defaultEmit)
                                    //console.log(entry)
                                    if (entry.defaultEmit) {
                                        //console.log("--- si emito default")
                                        alert("DEFAULT EMIT: " + modelConfig.modelParsed)
                                        //console.log("model value default value?", modelConfig.default, modelConfig)
                                        undefEmits[modelConfig.modelParsed.replace('innerModelValue.', '')] = modelConfig.default
                                        undefEmits_models.push(modelConfig.modelParsed.replace('innerModelValue.', ''))
                                        //console.log("undef emits so far?", undefEmits)
                                        /*const defaultForcedModel = {}
                                        defaultForcedModel[modelConfig.modelParsed.replace('innerModelValue.', '')] = modelConfig.default
                                        this.emitModelValue(defaultForcedModel, true, [modelConfig.modelParsed])*/
                                    }
                                    //else //console.log("--- no emito default")

                                    //console.log(`cimpl - schema[${ item.label }] SALTO ESTE MODELO Y CONTINUO EJECUCION DE watchModelValue_appendEntryModels`)

                                    continue
                                    /*var newModel = {
                                        modelValue: { ...this.innerModelValue }
                                    }
                                    _.set(newModel, model, '')
                                    //console.log("EMITO NUEVO MODELO", newModel.modelValue)
                                    this.$emit('update:modelValue', newModel.modelValue)*/
                                }
                                else {
                                    //if (entry.defaultEmit)
                                    //console.log("como ya existia ese undef (de algun otro componente parseado antes) no hago absolutamenente nada, porque en un toque regresa el auto emit) ")
                                    //console.log("NOTESE QUE ACA HAY UN RETURN EN VEZ DE UN CONTINUE")
                                    return returnThis
                                }
                            }

                            var mustWatch = current !== undefined


                            //console.log(`cimpl - schema[${ item.label }] pre watchear modelo`)
                            //console.log("current value?", current)
                            //console.log("must watch?", mustWatch)
                            if (mustWatch) this.modelValueWatchers[model] = this.$watch(model, (newValue) => {

                                //console.log(`cimpl - schema[${ item.label }] MODEL WATCHER`, model)
                                //console.log(model + " / on modelWatcher model update, ignore?", this.ignoreModelUpdate[modelConfig.modelParsed])
                                if (this.ignoreModelUpdate[modelConfig.modelParsed]) {
                                    //console.log(`cimpl - schema[${ item.label }] IGNORO MODELO`, modelConfig.modelParsed)
                                    this.ignoreModelUpdate[modelConfig.modelParsed] = false
                                    return
                                }
                                //console.log(`cimpl - schema[${ item.label }] CONTINUO WATCHER`)
                                //console.log(`cimpl - schema[${ item.label }] RESETEO ESA PROP ENTONCES EN EL COPY DEL SCHEMA`)
                                _.set(this, model.replace('modelValue.', 'modelValueCopy.'), newValue)

                                //console.log(`cimpl - schema[${ item.label }] borro updates y mando a resetear el modelo interno`)
                                delete this.updates[modelConfig.modelParsed]
                                //this.resetInnerModelValue()

                                //console.log(`cimpl - schema[${ item.label }] reseteo TODOS los entries que usen el modelo parseado`, modelConfig.modelParsed)
                                for (const x in this.entries_by_model[modelConfig.modelParsed]) {
                                    //console.log("-- reseteando todo en esta entry", this.entries_by_model[modelConfig.modelParsed][x])
                                    delete this.bindedEntries[this.entries_by_model[modelConfig.modelParsed][x]].updates[modelConfig.modelParsed]
                                    this.clearInParent(this.bindedEntries[this.entries_by_model[modelConfig.modelParsed][x]], 'updates', modelConfig.modelParsed)
                                    this.bindedEntries[this.entries_by_model[modelConfig.modelParsed][x]].resetComponentModelsParsed()
                                }
                            })
                        }
                        break

                    case 'value':
                        alert("zarapapipa")
                        //console.log("------------ VALUE ZARAPAPIPA")
                        //console.log(modelConfig)
                        //console.log(isProxy(modelConfig.model), isRef(modelConfig.model), isReactive(modelConfig.model))
                        if (isReactive(modelConfig.model)) {
                            const entryUID = entryComponent.schemaItem.entry_uid
                            this.modelValueWatchers[entryUID] = this.$watch(() => modelConfig.model, (newValue) => {

                                if (this.ignoreModelUpdate[modelConfig.modelParsed]) {
                                    this.ignoreModelUpdate[modelConfig.modelParsed] = false
                                    return
                                }
                                _.set(this, model.replace('modelValue.', 'modelValueCopy.'), newValue)

                                delete this.updates[modelConfig.modelParsed]

                                for (const x in this.entries_by_model[modelConfig.modelParsed]) {
                                    delete this.bindedEntries[this.entries_by_model[modelConfig.modelParsed][x]].updates[modelConfig.modelParsed]
                                    this.clearInParent(this.bindedEntries[this.entries_by_model[modelConfig.modelParsed][x]], 'updates', modelConfig.modelParsed)
                                    this.bindedEntries[this.entries_by_model[modelConfig.modelParsed][x]].resetComponentModelsParsed()
                                }
                            })
                        }
                        else alert("schema, trying to use non-reactive as entry model value")
                }
            }

            //console.log(`cimpl - schema[${ item.label }] TERMINO APPEND ENTRY MODELS  y mando undef emits si hubiera *********** `)

            if (Object.keys(undefEmits).length) {
                /*pongo ignore a false pero no estoy seguro*/
                const paramsArray = [undefEmits, false, undefEmits_models]
                if ($options.binding) returnThis.emitModelValue = paramsArray
                else this.emitModelValue.apply(this, paramsArray)
            }

            return returnThis
        },

        /*stop the modelValue watchers*/
        stopModelValueWatcher () {
            //console.log("cimpl-schema stopModelValueWatcher")
            for (const x in this.modelValueWatchers)
                //run the watcher stop
                this.modelValueWatchers[x]()
            this.modelValueWatchers = {}
        },

        /*delete all updates, stop and re-start the modelWatchers*/
        restartWatchModelValue () {
            //console.log("cimpl-schema restartWatchModelValue")
            this.stopModelValueWatcher()
            this.watchModelValue()
        },











        /*update the entire innerModelValue from given value, used with the outter update as well*/
        updateInnerModelValue (newValue) {
            if (newValue === undefined) newValue = this.$props.modelValue
            //this.stopInnerModelValueWatcher()
            this.innerModelValue = plain_copy(newValue)
            //this.startInnerModelValueWatcher()
            this.resetModelUpdates(false, newValue)
        },

        /*reset model updates list*/
        resetModelUpdates (resetOriginalValues) {
            if (resetOriginalValues === undefined) resetOriginalValues = true
            if (resetOriginalValues) for (const model in this.updates) {
                for (const entryUID in this.updates[model]) {
                    delete this.updates[model][entryUID].component.updates[model][entryUID]
                }
            }
            this.updates = {}
        },






        bindEntry (entryComponent) {
            const item = unref(entryComponent.schemaItem)
            const entry = entryComponent.schemaEntry
            const uid = item.entry_uid
            const callback = this.bindedEntriesCallbacks[uid]
            this.bindedEntries[uid] = entryComponent
            //console.log(`[${ item.label }]bindEntry`, uid)
            //console.log(`[${ item.label }] bindEntry append models`, item)
            //console.log(`[${ item.label }] bindEntry mando bindEntrya resetear(iniciar, porque estoy dentro de schema -> bindEntry y entry -> beforeMount) modelos del entry`, item)
            entryComponent.resetComponentModelsParsed(false)
            //console.log(`[${ item.label }] bindEntry pre watchModelValue_appendEntryModels`)
            const result = this.watchModelValue_appendEntryModels(entryComponent, false, {
                binding: true
            })
            if (Array.isArray(callback)) {
                delete this.bindedEntriesCallbacks[uid]
                callback.forEach(c => c(entryComponent))
            }
            //entryComponent.bindedSchema = this

            if (result.emitModelValue) {
                //console.log(`[${ item.label }] bindEntry genero forced model updates(probablemente de undefs) asique voy a mandar el update`, result.emitModelValue)
                this.emitModelValue.apply(this, result.emitModelValue)
            }

            //if(entry.draggable)
            //this.bindDraggableEntry(entry)

            //console.log("*** cimpl-schema bindEntry END")
            return this
        },

        unBindEntry (entryComponent) {
            const entry = entryComponent.schemaEntry
            delete this.bindedEntries[entryComponent.schemaItem.entry_uid]
            //entryComponent.bindedSchema = undefined

            if (entry.draggable) {
                console.log("UN_BIND DRAGGABLE ENTRY", entry)
            }
        },

        getBindedEntry (uid) {
            const ctx = this
            return new Promise(function (resolve, reject) {
                var compo = ctx.bindedEntries[uid]
                if (compo === undefined) {
                    if (ctx.bindedEntriesCallbacks[uid] === undefined)
                        ctx.bindedEntriesCallbacks[uid] = []
                    ctx.bindedEntriesCallbacks[uid].push(compoResolved => resolve(compoResolved))
                }
                else resolve(compo)
            })
        },

        getComponentDefaults () {
        },
    },

    beforeUnmount () {
        this.debug("BEFORE UNMOUNT")
        this.stopModelValueWatcher()
        //this._cimpl_form_.unbindSchema(this.schema.name, this)
    },

    beforeMount () {
        //console.clear()
        //console.log("cimpl-schema beforeMount")
        const ctx = this

        this.innerSchema = parseSchema(this.$props.schema, this.$store, this.$props)
        //console.log("en que quedo innerSchema?",this.innerSchema)
        //console.log("cimpl-schema TERMINE DE PARSEAR MODELO AHORA DEBERIA EMPEZAR LO DEMAS")
        //console.log("********************************")
        //console.log("********************************")
        //console.log("********************************")
        //console.log("********************************")
        //console.log("cimpl-schema END beforeMount")
    },

    mounted () {
        //console.log("cimpl-schema MOUNTED", this.$slots)
        //console.log("cimpl-schema MOUNTED END")
    },
})

//$melon.components.CImpl_schema = $_COMPONENT

export default $_COMPONENT
