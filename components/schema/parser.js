/* eslint-disable */

import plain_copy from '../../utils/plain_copy'

import { ref, isRef, reactive, unref } from 'vue'
//import { useStore } from 'vuex'
//import { i18n } from 'boot/i18n.js'
import _ from 'lodash'

import $_DEFAULTS from './defaults.js'

const HARDCODED_GUTTER = 'q-col-gutter-md'

const $_COLUMNS_TOTAL = 12

/*parse given schema*/
function parseSchema (origSchema, $store, schemaCompoProps) {
    let schema = {
        /*entry type*/
        type: 'schema',

        /*schema name*/
        name: false,

        /*use multiple languages*/
        available_locales: false,

        /*model for the schema*/
        model: undefined,

        /*schema entries props*/
        entries: {},

        models: {},

        updates: {},
        errors: {},

        /*used to store inner versions of entry models of type "value"*/
        innerModels: {},

        draggableChildren: schemaCompoProps.draggableChildren
    }

    for (const x in origSchema)
        schema[x] = origSchema[x]

    if (schema.model === undefined)
        schema.model = 'modelValue.#{schemaEntry.name}'

    const childrenOptions = {
        columns: $_COLUMNS_TOTAL,
        usedColumns: 0,
        nosize: [],
        parentModel: schema.model,
        schema: schema,
    }

    parseSchema_children(origSchema.children, childrenOptions, schema.entries, undefined, undefined, $store)

    if (schema.name === false) schema.name = _.uniqueId('cimpl_schema_unnamed_')
    return schema
}

/*parse a list of schema children*/
function parseSchema_children (children, options, $entries, currentSelector, parentSelector, $store) {
    if (currentSelector === undefined) currentSelector = ''
    if (parentSelector === undefined) parentSelector = ''

    if (options === undefined) options = {}

    options.nosize = []


    for (const x in children) {
        const child = children[x]

        const unrefed = unref(child)
        if (unrefed === undefined) continue
        const schemaEntry = parseSchema_child(child, options, $entries, `${currentSelector}${currentSelector.trim() !== '' ? '.' : ''}${x}`, currentSelector, $store)
        if (schemaEntry === undefined) continue
        //entries[schemaEntry.uid] = schemaEntry
    }

    if (options.nosize.length) parseSchema_noSize(options/*, ctx*/)


    return $entries
}

/*parse a specific schema child*/
function parseSchema_child (child, options, $entries, currentSelector, parentSelector, $store) {
    const childItem = isRef(child) ? child.value : child
    //const childItemValue = unref(child)

    if (childItem === undefined) return undefined

    let schemaEntry = parseSchema_getEntry(childItem, options, /*ctx,*/ currentSelector, parentSelector, $store)
    $entries[schemaEntry.uid] = schemaEntry

    schemaEntry.class.push(
        `field-${schemaEntry.type}`,
        schemaEntry.size ? `col-${schemaEntry.size}` : undefined,
        schemaEntry.size === 12 ? 'cimpl-schema-entry-first-row-element' : undefined,
        schemaEntry.label_side ? 'side-label row q-col-gutter-md' : undefined
    )

    /* push readonly class */
    if (schemaEntry.readonly) schemaEntry.class.push('cimpl-schema-entry-readonly')
    if (schemaEntry.disable) schemaEntry.class.push('cimpl-schema-entry-disabled')

    /* push classess by type */
    switch (schemaEntry.type) {
        case 'row':
            schemaEntry.class.push('row')
            switch (schemaEntry.gutter) {
                case true:
                    schemaEntry.class = _.concat(schemaEntry.class, /*ctx.*//*$store.getters.row_gutter*/HARDCODED_GUTTER)
                    break

                case false:
                    break

                case 'auto':
                    if (schemaEntry.children.length > 1) {
                        schemaEntry.class = _.concat(schemaEntry.class, /*ctx.*//*$store.getters.row_gutter*/HARDCODED_GUTTER)
                    }
                    break

                default:
                    alert("GUTTER", schemaEntry.gutter)
                    schemaEntry.class.push(`q-col-gutter-${schemaEntry.gutter}`)
                    break
            }
            break

        case 'column':
            schemaEntry.class.push('column')
            switch (schemaEntry.gutter) {
                case true:
                    schemaEntry.class = _.concat(schemaEntry.class, /*ctx.*/$store.getters.col_gutter)
                    break

                case false:
                    break

                case 'auto':
                    if (schemaEntry.children.length > 1) { schemaEntry.class = _.concat(schemaEntry.class, /*ctx.*/$store.getters.col_gutter) }
                    break

                default:
                    schemaEntry.class.push(`q-gutter-${schemaEntry.gutter}`)
                    break
            }
            break
    }


    if (options.columns - options.usedColumns <= options.nosize.length)
        parseSchema_noSize(options/*, ctx*/)

    if (!schemaEntry.size)
        options.nosize.push(schemaEntry)
    else {
        //minimum 1 col for each nosize
        if (options.columns - options.usedColumns - schemaEntry.size < options.nosize.length)
            parseSchema_noSize(options/*, ctx*/)

        if (options.usedColumns === 0) schemaEntry.class.push('cimpl-schema-entry-first-row-element')
        options.usedColumns += schemaEntry.size
    }

    if (schemaEntry.models === undefined)
        schemaEntry.models = []

    /*set models list*/
    if (schemaEntry.model !== false) {
        if (schemaEntry.model === true) {
            schemaEntry.model = options.parentModel
        }
    }

    /*push models into props proxy*/
    for (const x in schemaEntry.controller)
        if (x !== 'is')
            if (!x.startsWith('@'))
                schemaEntry.controllerPropsProxy[x] = schemaEntry.controller[x]
            else {
                //it's an event
                if (x === '@schema-entry:') {
                    //it's a schema entry event, so we're gonna ignore it and handle it wherever it corresponds
                }

                var splitted = x.substr(1).split(':')
                for (const spl in splitted)
                    if (parseInt(spl) === 0) {
                        splitted[spl] = _.camelCase("foo-" + _.kebabCase(splitted[spl]))
                        splitted[spl] = splitted[spl].substr(3)
                    }
                    else
                        splitted[spl] = _.camelCase(_.kebabCase(splitted[spl]))
                const eventName = `on${splitted.join(':')}`
                schemaEntry.controllerPropsProxy[eventName] = schemaEntry.controller[x]
            }

    let childrenOptions = {
        columns: $_COLUMNS_TOTAL,
        usedColumns: 0,
        nosize: [],
        parentModel: schemaEntry.model,
        schema: options.schema,
    }

    switch (schemaEntry.type) {
        case 'tabbed':
        case 'tabbed-panels':
        case 'tabbed-tabs':
            childrenOptions.parentModel = options.parentModel
            //schemaEntry.controllerPropsProxy.context = ctx
            console.log("--- saraza")
            console.log(childItem)
            console.log(x)
            for (var x in schemaEntry.controller.schema) {
                if (schemaEntry.controller.schema[x] === undefined) continue
                let childrenOptionsTab = {
                    ...childrenOptions,
                    usedColumns: 0,
                    nosize: []
                }
                console.log(childItem.controller.schema[x])
                const subs = parseSchema_children(childItem.controller.schema[x].children, childrenOptionsTab, $entries, `${currentSelector}.controller.schema.${x}.children`, currentSelector, $store)

                if (childrenOptionsTab.nosize.length) {
                    parseSchema_noSize(childrenOptionsTab/*, ctx*/)
                }
            }
            break

        case 'row':
        case 'column':
            childrenOptions.parentModel = options.parentModel
        default:
            const grandChildren = parseSchema_children(childItem.children, childrenOptions, $entries, `${currentSelector}.children`, currentSelector, $store)
            if (childrenOptions.nosize.length) {
                parseSchema_noSize(childrenOptions/*, ctx*/)
            }
            break
    }

    if (schemaEntry.draggableChildren === undefined)
        schemaEntry.draggableChildren = options.schema.draggableChildren

    if (schemaEntry.draggable === undefined)
        schemaEntry.draggable = schemaEntry.draggableChildren ? true : undefined//options.schema.draggable

    return schemaEntry
}


/*get a parsed schema entry from a child*/
function parseSchema_getEntry (child, options/*, ctx*/, currentSelector, parentSelector, $store) {

    //const $t = i18n.global.t
    const $t = (word) => {
        console.log("using temp function $t")
        return word
    }

    if ($store === undefined) {
        //$store = useStore()
        $store = {
            getters: {

            }
        }
    }

    const childItem = unref(child)
    //console.log(`[${childItem.name}] ARRANCO GET ENTRY`)
    //console.log("childItem?", childItem)

    if (childItem === undefined) return undefined

    const name = childItem.name === undefined ? _.uniqueId(`cimpl_schema_unnamed_${childItem.type}_`) : childItem.name
    const uid = childItem.entry_uid === undefined ? _.uniqueId(`${name}_`) : childItem.entry_uid
    let isQuasar = parseSchema_checkQuasar(childItem)
    let isCImpl = parseSchema_checkCImpl(childItem)

    /*forced options based on schema config and mode*/
    //const modeOptions = _.get(ctx, `modeOptions.${ctx.mode}`, {})

    let props = reactive(_.merge(
        {
            selector: currentSelector,
            parentSelector: parentSelector,
            class: [],
            style: {},
            controllerPropsProxy: {},
            entryPropsProxy: {},
            parsedRules: {},
            updates: {},
            errors: {},
        }, //default new empty object
        $_DEFAULTS.entry, //defaults for entries
        isQuasar ? _.merge({}, $_DEFAULTS.quasar_components, /*ctx.*/$store.getters.controller_props) : {}, //defaults for quasar controllers
        $_DEFAULTS[childItem.type] !== undefined ? $_DEFAULTS[childItem.type] : {}, //defaults for the specific type
        childItem, //props from the child

        //modeOptions.entry,

        //override some props, most important, the merged controller
        {
            controller: _.merge(
                {}, //default new empty object
                _.get($_DEFAULTS, 'entry.controller', {}), //defaults for entries
                isQuasar || isCImpl ? _.get($_DEFAULTS, 'quasar_components.controller', {}) : {}, //defaults for quasar controllers
                _.get($_DEFAULTS, `${childItem.type}.controller`, {}), //defaults for the specific type
                _.get(childItem, 'controller', {}),  //props from the child
                //_.get(modeOptions, 'controller', {}),
            ),

            //entry name
            name: name,

            //entry UID
            uid: uid
        }
    ))

    //fix gilada que me llegan copias viejas de los children sin UID ?
    props.children = childItem.children

    if (typeof props.style === 'string') {
        var regex = /([\w-]*)\s*:\s*([^;]*)/g
        var match, properties = {}
        while (match = regex.exec(props.style)) properties[match[1]] = match[2].trim()
        props.style = properties
    }

    if (props.controller.is === undefined) {
        switch (props.type) {
            case 'row':
            case 'column':
                props.controller.is = `cimpl-schema-${props.type}`
                break

            //quasar compos
            case 'input':
            case 'rating':
            case 'select':
            case 'checkbox':
                props.controller.is = `q-${props.type}`
                break

            /*case 'wysiwg':
                props.controller.is = 'q-editor'
                break*/

            case 'slot':
            case 'slot-entry':
                break

            case 'tabbed':
            case 'tabbed-panels':
            case 'tabbed-tabs':
                props.controller.is = 'cimpl-schema-tabbed'
                //props.controller.context = ctx

                //fix de que llega un schema viejo sin uids en los entrys?
                props.controller.schema = childItem.controller.schema
                break

            //melon compos
            case 'password-input':
            case 'password-group':
            case 'media-uploader':
            case 'toggle':
            case 'list':
                if (props.label !== undefined && !props.label_side) props.controller.label = /*ctx.*//*$t(*/props.label/*)*/
                props.controller.is = `melon-${props.type}`
                props.controller.name = props.name
                break

            //cimpl compos
            case 'media':
            case 'media-picker':
                props.controller.is = `cimpl-${props.type}`
                break

            default:
                if (props.controller.is === undefined)
                    props.controller.is = props.type
                break
        }
    }

    if (isQuasar || isCImpl) {
        if (Object.keys(props.controller).indexOf('label') === -1 && props.label !== undefined && !props.label_side)
            props.controller.label = /*ctx.*/$t(props.label)
        props.controller.name = props.name

        props.controller.disable = props.disable
        props.controller.readonly = props.readonly
    }

    if (props.wrap) {
        if (props.wrapProxy === undefined) props.wrapProxy = {}
        props.wrapProxy = _.merge({}, $_DEFAULTS.wrapper_component, /*ctx.*/$store.getters.controller_props, props.wrapProxy)
        if (props.wrapProxy.label === undefined && props.label !== undefined && !props.label_side)
            props.wrapProxy.label = /*ctx.*/$t(props.label)
        props.wrapProxy.name = props.name
        props.wrapProxy['data-wrapped'] = props.type

        props.wrapProxy.disable = props.disable
        props.wrapProxy.readonly = props.readonly
    }

    let cssEntryClass = _.get(props, 'class', [])
    if (typeof cssEntryClass === 'string') cssEntryClass = cssEntryClass.split(' ')
    props.class = cssEntryClass

    let cssControllerClass = _.get(props.controller, 'class', [])
    if (typeof cssControllerClass === 'string') cssControllerClass = cssControllerClass.split(' ')
    props.controller.class = cssControllerClass

    if (childItem.entry_uid === undefined) childItem.entry_uid = props.uid
    return props
}

/*create an entry rule wrapper to catch errors*/
async function parseSchema_getBindedRule (ruleUID, item, entry, rule, value, ctx) {
    //console.log("*************************************************************************************")
    //console.log(`EXEC entry binded rule: ${ruleUID}`, entry.uid, value, rule)

    if (ctx.last_rule_checked_value[ruleUID] == value) {
        //console.log("EXEC DE RULE con VALUE ya tiene un valor interno, devuelvo ese")
        //console.log(ctx.last_rule_checked_results[ruleUID])
        return new Promise((resolve, reject) => {
            resolve(ctx.last_rule_checked_results[ruleUID])
        })
    }

    ctx.last_rule_checked_value[ruleUID] = plain_copy(value)

    return new Promise((resolve, reject) => {
        const debug = false
        if (debug) console.log("- rule ya dentro de la promesa que estoy devolviendo")
        if (debug) console.log("PRE EXEC schema binded orig rule", entry.uid, value, rule)
        const result = rule(value)
        if (debug) console.log("exec result", result)
        const isPromise = typeof result.then === 'function'
        if (debug) console.log("- rule result is promise?", isPromise)
        if (debug) console.log("- rule result", result, typeof result)
        if (!isPromise) resolve(parseSchema_getBindedRule_resolve(ruleUID, item, entry, value, result, ctx))
        else result.then((asyncResult) => resolve(parseSchema_getBindedRule_resolve(ruleUID, item, entry, value, asyncResult, ctx)))
    })
}

function parseSchema_getBindedRule_resolve (ruleUID, item, entry, value, result, ctx) {
    //console.log("parseSchema_getBindedRule_resolve")
    const childItem = unref(item)
    const newError = {
        //entryComponent: this.bindedEntries[entry.uid],
        type: 'validation',
        entryUID: entry.uid,
        message: result,
        model: `modelValue.${childItem.name}`,
        ruleUID: ruleUID,
        lastValue: value,
        label: entry.label
    }
    if (result !== true) ctx.setValidationError(newError)
    else ctx.unsetValidationError(newError)

    ctx.last_rule_checked_results[ruleUID] = result

    return result
}

/*check if a given schema entry uses a quasar component*/
function parseSchema_checkQuasar (child) {
    let isQuasar = false
    switch (child.type) {
        case 'input':
        case 'rating':
        case 'select':
        case 'checkbox':
            isQuasar = true
            break
    }

    if (typeof child.type === 'string')
        if (child.type.indexOf('q-') === 0)
            isQuasar = true

    if (typeof child?.controller?.is === 'string')
        if (child.controller.is.indexOf('q-') === 0)
            isQuasar = true

    return isQuasar
}

function parseSchema_checkCImpl (child) {
    var isCImpl = false
    switch (child.type) {
        case 'password-input':
        case 'password-group':
        case 'media-uploader':
        case 'toggle':
        case 'list':
        case 'media':
        case 'media-picker':
            isCImpl = true
            break
    }

    if (typeof child.type === 'string')
        if (child.type.indexOf('cimpl-') === 0 || child.type.indexOf('melon-') === 0)
            isCImpl = true

    return isCImpl
}

/*calculate automatic sizes for nosized entries*/
function parseSchema_noSize (options/*, ctx*/) {
    if (options.nosize.length) {
        let available = options.columns - options.usedColumns
        const size = Math.floor(available / options.nosize.length)
        for (var x in options.nosize) {
            const isFirst = available === 12
            options.nosize[x].size = size
            options.nosize[x].class.push(`col-${size}`)
            available -= size
            if (parseInt(x) === 0 && isFirst)
                options.nosize[x].class.push('cimpl-schema-entry-first-row-element')

        }

        if (available) {
            const last = options.nosize[options.nosize.length - 1]
            last.class.splice(last.class.indexOf(`col-${size}`), 1)
            last.size += available
            last.class.push(`col-${size + available}`)
        }
    }

    options.nosize = []
    options.usedColumns = 0
}

/*set entry models for a given schema entry*/
function parseSchema_setEntryModels (schemaEntry, child, schema, ctx) {
    const saraza = true
    if (saraza) throw new Error("'parseSchema_setEntryModels no deberia estar esta funcion")
    let models = []
    let modelConfigs = []
    if (schemaEntry.model !== false) models.push({
        model: child.model === true ? schemaEntry.model : child.model,
        type: schemaEntry.modelType,
        name: 'modelValue'
    })
    for (const x in child.models) models.push(child.models[x])

    for (const x in models) {
        const type = models[x].type
        const parsed = type === 'var' ? ctx.$melon.serverStringTemplate(models[x].model.startsWith('modelValue.') ? models[x].model.replace('modelValue.', 'innerModelValue.') : models[x].model, {
            schema: schema,
            schemaEntry: schemaEntry,
            ctx: ctx
        }, true) : undefined
        const name = models[x].name
        const modelConfig = {
            name: name,
            type: type,
            //value: value,
            model: models[x].model,
            modelParsed: parsed,
        }

        schemaEntry.controllerPropsProxy[modelConfig.name] = parseSchema_getModel_finalValue(modelConfig, schemaEntry, schema, ctx)
        schemaEntry.controllerPropsProxy[`onUpdate:${_.kebabCase(modelConfig.name)}`] = (newValue) => {
            //console.log("ON UPDATE", modelConfig.type)
            if (modelConfig.type === 'var') {
                ctx.setModelUpdate(newValue, modelConfig, schemaEntry, schema)
                //console.log("AFTER SET MODEL UPDATGE", schemaEntry.controller)
            } else {
                model.model = value
            }
        }

        modelConfigs.push(modelConfig)
    }

    schemaEntry.models = modelConfigs
}


/*get the current value of a given modelConfig,
if it's a 'var' then we already have the innerModel (or whatever) value on modelConfig,
but if it's a 'value' then it could be a proxy to whatever, so we'll just
do a temporary innerModel inside the schema for it, and return a reference to that instead*/
function parseSchema_getModel_finalValue (modelConfig, schemaEntry, schema, ctx) {
    //console.log(`[${schemaEntry.label}] - GET MODEL FINAL VALUE`)
    //console.log("modelConfig?", modelConfig)
    //console.log("schema innerModelValue?", ctx.innerModelValue)
    switch (modelConfig.type) {
        case 'var':
            const model = modelConfig.modelParsed.replace('innerModelValue.', 'modelValue.')
            return _.get(ctx, modelConfig.modelParsed,
                //_.get(ctx.innerModelValue_undefineds, model, undefined)
                undefined
            )

        case 'value':
            return modelConfig.model
    }
}

export default parseSchema

export {
    parseSchema_getModel_finalValue,
    parseSchema_getBindedRule
}