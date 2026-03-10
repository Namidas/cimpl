/* eslint-disable */

import { ref, computed } from 'vue'
import _ from 'lodash'

export default function () {

    /*list of updates by model > (last) update*/
    const updates = ref({})

    /*list of errors by model > rule > error*/
    const errors = ref({})

    /*sets the update, if the newValue is identical to the original value then it deletes the update
    it then fires an event [remove/set]modelUpdate, and later on */
    function setModelUpdate (newValue, modelConfig, schemaEntry, schema, $_EMIT) {
        //console.log(`${this.$.type.name} SET MODEL UPDATE`, newValue, modelConfig, this.uid)
        if ($_EMIT === undefined) $_EMIT = true

        let result = { events: {}, update: undefined }

        switch (modelConfig.type) {
            case 'var':
                const isModelValue = modelConfig.model.startsWith('modelValue.')
                if (isModelValue) {
                    /* check if the update exists or create empty */
                    let update = updates.value[modelConfig.modelParsed] === undefined ? undefined : updates.value[modelConfig.modelParsed]
                    const updateExists = update !== undefined

                    /* doesn't exist? create new */
                    if (!updateExists) {
                        const originalValue = _.get(this, modelConfig.modelParsed, '')
                        update = {
                            originalValue: originalValue,
                            update: {
                                modelConfig: modelConfig,
                                value: newValue
                            },
                            caption: _.get(modelConfig, 'notifications.update', (originalValue, newValue) => this.$t('form.restore_original_value', { originalValue, newValue }))(_.get(this, modelConfig.modelParsed, ''), newValue),
                            label: modelConfig.label
                        }
                        updates.value[modelConfig.modelParsed] = update
                        this.afterModelUpdate(modelConfig.modelParsed, update)
                    }
                    /* otherwise, update current one */
                    else {
                        _.merge(update, {
                            update: {
                                modelConfig: modelConfig,
                                value: newValue
                            }
                        })
                    }

                    /* check if the new update has the exact same value as originalValue, if so
                    then delete the update (original value has been restored) */
                    if (updateExists && update.originalValue === newValue) {
                        /* let's assume we always have the same model across any component using it,
                        so it's useless to delete the update per component, `${modelConfig.modelParsed}.${schemaEntry.uid}`
                        we can just delete the whole thing */
                        delete updates.value[modelConfig.modelParsed]
                        // _.unset(this.updates, `${modelConfig.modelParsed}.${schemaEntry.uid}`)

                        result.events['removeModelUpdate'] = update
                        if ($_EMIT) this.$emit('removeModelUpdate', update)
                    }
                    /* insert the update into the updates list */
                    else {
                        update.update.modelConfig = modelConfig
                        update.update.value = newValue
                        result.events['modelUpdate'] = update
                        if ($_EMIT) {
                            this.$emit('modelUpdate', update)
                        }
                    }

                    //if I don't check this to be the original entry, it'll fire the event
                    //all through the entire chain until form-page
                    if (_.get(this, 'schemaItem.entry_uid') !== undefined) {
                        if (_.get(this, 'schemaItem.entry_uid') === schemaEntry.uid)
                            if (typeof modelConfig.update === 'function') modelConfig.update(newValue)
                    }


                    const eventData = {
                        newValue: newValue,
                        modelConfig: modelConfig,
                        entry: schemaEntry
                    }
                    result.update = update
                    result.events['update:modelValue'] = eventData
                    
                    if ($_EMIT)
                    {
                        //console.log(`${this.$.type.name} EMIT update:modelValue`, eventData)
                        //console.log("this?",this)
                        this.$emit('update:modelValue', eventData)
                    }
                } else {
                    const isProxy = modelConfig.model.startsWith('proxy.')
                    if (isProxy) {
                        // update the proxy
                        if (this.$.type.name === 'cimpl-schema') this.updateProxyValue(newValue, modelConfig)
                        else this.context.updateProxyValue(newValue, modelConfig)

                        //if I don't check this to be the original entry, it'll fire the event
                        //all through the entire chain until form-page
                        if (_.get(this, 'schemaItem.entry_uid') !== undefined) {
                            if (_.get(this, 'schemaItem.entry_uid') === schemaEntry.uid)
                                if (typeof modelConfig.update === 'function') modelConfig.update(newValue)
                        }
                    }
                }

                return result

            case 'value':
                alert('FALTA QUE PASA CUANDO ES TYPE VALUE')
                return result
        }

        return result
    }

    function afterModelUpdate (model, update) {
        //console.log("after model update default", model, update)
    }


    /*set validation errors*/
    function setValidationError (newError, $_EMIT) {
        //console.log(`${this.$.type.name} / SET VALIDATION ERROR`, newError)
        if (arguments.length > 2) throw new Error("che recibi mas de dos en setValidationError")

        if ($_EMIT === undefined) $_EMIT = true
        const model = newError.model
        if (model === undefined) throw new Error("saraza model undefined")
        const ruleUID = newError.ruleUID

        if (errors.value[model] === undefined) {
            errors.value[model] = {}
            errors.value[model][ruleUID] = newError
        }
        else errors.value[model][ruleUID] = newError

        //console.log(`${this.$.type.name} / AGREGUE REGLA NUEVAS`, errors.value)

        if ($_EMIT)
            this.$emit('validationError', newError)

        return newError
    }

    function ___setValidationError (ruleUID, item, entry, value, model, message, $_EMIT) {
        if (model === undefined) model = `modelValue.${item.name}`
        if ($_EMIT === undefined) $_EMIT = true

        const newError = {
            type: 'validation',
            entryUID: entry.uid,
            message: message,
            model: model,
            ruleUID: ruleUID,
            lastValue: value,
            label: $_LABEL === undefined ? entry.label : $_LABEL
        }

        if (errors.value[model] === undefined) {
            errors.value[model] = {}
            errors.value[model][ruleUID] = newError
        }
        else errors.value[model][ruleUID] = newError

        if ($_EMIT)
            this.$emit('validationError', newError)

        return newError
    }

    /*remove error from error list*/
    function unsetValidationError (error, $_EMIT) {
        //console.log(`${this.$.type.name} / UNSET VALIDATION ERROR`, error, errors.value, $_EMIT)
        if (arguments.length > 2) throw new Error("che recibi mas de dos en unsetValidationError")
        if (error === undefined) {
            alert("retorno false")
            return false
        }
        //console.log(`${this.$.type.name} / 1`)
        const model = error.model
        const ruleUID = error.ruleUID
        if ($_EMIT === undefined) $_EMIT = true

        //console.log(`${this.$.type.name} / 3-1`, model, errors.value)

        if (errors.value[model] === undefined) {
            //console.log(`${this.$.type.name} / 2`)
            return
        }
        if (errors.value[model][ruleUID]) {
            delete errors.value[model][ruleUID]
            if (!Object.keys(errors.value[model]).length)
                delete errors.value[model]
        }
        if ($_EMIT) {
            //console.log(`${this.$.type.name} / emit validationSuccess`, error)
            this.$emit('validationSuccess', error)
        }

        return error
    }

    ////////EVENTS
    /*entry event: model value has been updated*/
    function onEntryUpdateModelValue (payload) {
        //console.log("ON CHILD ENTRY UPDATE MODEL VALUE", payload, _.get(this, '$.type.name'), this)
        return this.setModelUpdate(payload.newValue, payload.modelConfig, payload.entry, payload.schema)
    }

    /*model update has been removed*/
    function onEntryRemoveModelUpdate (payload) {
    }

    /*model update has been added*/
    /*this is event is not actually used, we used entry's update:modelValue to also 
    capture the update*/
    function onEntryModelUpdate (payload) {
    }

    /*entry validationSuccess event*/
    function onEntryValidationSuccess (payload) {
        return this.unsetValidationError(payload)
    }

    /*entry validationError event*/
    function onEntryValidationError (payload) {
        return this.setValidationError(payload)
    }

    return {
        /*constants*/
        updates,
        errors,

        /*methods*/
        setModelUpdate,
        afterModelUpdate,
        setValidationError,
        unsetValidationError,

        /*events*/
        onEntryUpdateModelValue,
        onEntryRemoveModelUpdate,
        onEntryModelUpdate,
        onEntryValidationSuccess,
        onEntryValidationError

        /*computed*/
    }
}