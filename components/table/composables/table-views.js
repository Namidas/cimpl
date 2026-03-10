import { computed, ref } from 'vue'
import _ from 'lodash'

function useCTableViews (props, tableConfig) {
    const availableViews = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute availableViews`)
        var res = []
        for (const x in props.views) {
            const view = typeof props.views[x] === 'string' ? tableConfig.get(`views.${props.views[x]}`) : props.views[x]
            //console.log("view", view, props.views[x])
            if (!view) continue
            res.push(view)
        }
        if (!res.length) res.push(tableConfig.get('views.table'))
        return res
    })
    const currentView = ref(_.first(availableViews.value))
    const availableViewStyles = computed(() => {
        if (props.debugWatch) console.log(`|| CTable compute availableViewStyles`)
        var res = []
        for (const x in props.viewStyles) {
            const viewStyle = typeof props.viewStyles[x] === 'string' ? tableConfig.get(`viewStyles.${props.viewStyles[x]}`) : props.viewStyles[x]
            if (!viewStyle) continue
            res.push(viewStyle)
        }
        if (!res.length) res.push(tableConfig.get('viewStyles.cozy'))
        return res
    })
    const currentViewStyle = ref(_.first(availableViewStyles.value))

    return {
        availableViews,
        currentView,
        availableViewStyles,
        currentViewStyle
    }
}

export {
    useCTableViews
}