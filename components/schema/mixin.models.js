/* eslint-disable */

const CImplSchemaModelsMixin = {
    emits: [
        'update:modelValue', //emit a new modelValue

        'removeModelUpdate', //emit a modelValue update that has been deleted
        'modelUpdate', //emit a modelValue updates

        'validationError', //dispatched when a specific validation rule fails
        'validationSuccess', //dispatched when a specific validation rule succedes
    ],

    setup (props) {
        return {
            /*list of updates by model > (last) update*/
            updates: ref({}),

            /*list of errors by model > rule > error*/
            errors: ref({}),

            /*store the name of the component*/
            mixedComponent: 'undef',
        }
    },

    methods: {
        /*sets the update, if the newValue is identical to the original value then it deletes the update
        it then fires an event [remove/set]modelUpdate, and later on */
        setModelUpdate (newValue, modelConfig, schemaEntry, schema) {
            console.log(`MIXIN setModelUpdate() ${this.mixedComponent} : `, modelConfig, newValue)
            switch (modelConfig.type) {
                case 'var':
                    const isModelValue = modelConfig.model.startsWith('modelValue.')
                    if (isModelValue) {
                        /* check if the update exists or create empty */
                        let update = this.updates[modelConfig.modelParsed] === undefined ? undefined : this.updates[modelConfig.modelParsed]
                        const updateExists = update !== undefined

                        /* doesn't exist? create new */
                        if (!updateExists) {
                            update = {
                                originalValue: _.get(this, modelConfig.modelParsed),
                                // updates: {},
                                // count: 0,
                                update: {
                                    modelConfig: modelConfig,
                                    value: newValue
                                    // entry: schemaEntry,
                                }
                                // component: undefined,
                            }
                            this.updates[modelConfig.modelParsed] = update
                        }
                        /* otherwise, update current one */
                        else {
                            _.merge(update, {
                                update: {
                                    modelConfig: modelConfig,
                                    value: newValue
                                    // entry: schemaEntry,
                                }
                            })
                        }

                        /* check if the new update has the exact same value as originalValue, if so
                        then delete the update (original value has been restored) */
                        if (updateExists && update.originalValue === newValue) {
                            /* let's assume we always have the same model across any component using it,
                            so it's useless to delete the update per component, `${modelConfig.modelParsed}.${schemaEntry.uid}`
                            we can just delete the whole thing */
                            delete this.updates[modelConfig.modelParsed]
                            // _.unset(this.updates, `${modelConfig.modelParsed}.${schemaEntry.uid}`)

                            /* update the value in the components using this model */
                            ////ESTO SOLO SI ES componentType 'schema'
                            /*for (const x in this.entries_by_model[modelConfig.modelParsed]) {
                                const entryUID = this.entries_by_model[modelConfig.modelParsed][x]
                                // console.log("UPDATEO VALORES PArA LA ENTRY", entryUID, modelConfig.name)
                                this.entries[entryUID].controllerPropsProxy[modelConfig.name] = newValue
                            }*/

                            this.$emit('removeModelUpdate', update)
                        }
                        /* insert the update into the updates list */
                        else {
                            this.updates[modelConfig.modelParsed][schemaEntry.uid].modelConfig = modelConfig
                            this.updates[modelConfig.modelParsed][schemaEntry.uid].value = newValue

                            //console.log("model update saraza 1")
                            this.$emit('modelUpdate', {
                                update: this.updates[modelConfig.modelParsed][schemaEntry.uid],
                                modelConfig: modelConfig,
                                entry: schemaEntry,
                                schema: schema
                                // component: this,
                            })
                        }
                        if (typeof modelConfig.update === 'function') modelConfig.update(newValue)

                        console.log('EMITO update:modelValue', newValue)
                        this.$emit('update:modelValue', {
                            newValue: newValue,
                            modelConfig: modelConfig,
                            entry: schemaEntry
                            // component: this,
                        })
                    } else {
                        const isProxy = modelConfig.model.startsWith('proxy.')
                        console.log('ENTRO AL ELSE', isProxy, modelConfig)
                        if (isProxy) {
                            // update the proxy
                            this.context.updateProxyValue(newValue, modelConfig)
                            if (typeof modelConfig.update === 'function') modelConfig.update(newValue)
                        }
                    }
                    break

                case 'value':
                    alert('FALTA QUE PASA CUANDO ES TYPE VALUE')
                    break
            }
        }
    },

    created () {
        this.mixedComponent = this.$.type.name
    }
}

export default CImplSchemaModelsMixin