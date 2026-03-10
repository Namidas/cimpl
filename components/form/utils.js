import _ from 'lodash'

function CIMPL_FORM_parseFooterProp ($propsFooter) {
    let footerOptions = {
        updates: true,
        errors: true,
        hide: true,
        sticky: true,
        proxy: {},
        controlsCols: 12
    }

    switch (typeof $propsFooter) {
        case 'object':
            footerOptions = _.merge({}, footerOptions, $propsFooter)
            break

        case 'boolean':
            if ($propsFooter === false) footerOptions = false
            break
    }

    return footerOptions
}

function CIMPL_FORM_footerChipProps (chipData) {
    const props = {}
    switch (chipData.type) {
        case 'update':
            props.color = 'primary'
            props.textColor = 'white'
            break

        case 'error':
            props.color = 'negative'
            props.textColor = 'white'
            //props.icon = 'error'
            break
    }
    return props
}


function CIMPL_FORM_notificationChips (updates, errors, append) {
    let chips = {
        updates: {},
        errors: {},
        updates_count: 0,
        errors_count: 0,
        count: 0,
    }

    if (append === undefined) append = {}

    //console.log("NOTIFICATIONS CHIPS", updates, errors)

    for (const x in updates) {
        const caption = typeof updates[x].caption === 'function' ? updates[x].caption(updates[x].originalValue, updates[x].update.value) : updates[x].caption
        chips.updates[`modelValue.${x}`] = _.merge({
            label: updates[x].label,
            value: updates[x].originalValue,
            //update: updates[x],
            messages: [caption/*'gen.form.updates_list.original_value'*/],
            type: 'update',
            model: x
        }, append)
        chips.updates[`modelValue.${x}`].props = CIMPL_FORM_footerChipProps(chips.updates[`modelValue.${x}`])
        chips.updates_count++
    }

    for (const x in errors) {
        chips.errors[x] = _.merge({
            value: '',
            messages: [],
            type: 'error',
            model: x,
            sourceComponent: undefined
        }, append)
        for (const y in errors[x]) {
            const erroredRule = errors[x][y]
            chips.errors[x].label = erroredRule.label
            if (chips.errors[x].messages.indexOf(erroredRule.message) === -1) chips.errors[x].messages.push(erroredRule.message)
            chips.errors[x].value = erroredRule.lastValue
            chips.errors[x].sourceComponent = erroredRule.entryComponent
            chips.errors_count++
        }

        chips.errors[x].props = CIMPL_FORM_footerChipProps(chips.errors[x])
    }
    chips.count = chips.updates_count + chips.errors_count
    return chips
}

export {
    CIMPL_FORM_parseFooterProp,
    CIMPL_FORM_footerChipProps,
    CIMPL_FORM_notificationChips
}
