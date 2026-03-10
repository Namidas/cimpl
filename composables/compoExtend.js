import { reactive, watchEffect, computed, toValue } from 'vue'
import _ from 'lodash'

//get definitions from the original compo, for instance props, emits, etc
// compoExtend_get(someCompo,'props',['ignoredProp'])
const compoExtend_get = function (baseCompo, source, ignore) {
    let res = source === 'emits' ? [] : {}
    if (ignore === undefined) ignore = []
    for (const propName in baseCompo[source]) {
        if (!ignore.includes(propName))
            if (source === 'emits') res.push(baseCompo[source][propName])
            else res[propName] = baseCompo[source][propName]
    }
    return res
}

/* Create an object that "extends" the base compo props so you can bind later on
    options: {
        ignore: array of props to ignore
            ie: ['columns']
        proxy: object of props to manually proxy
            ie: {columns: myColumnsPropsFromExtendingCompo}
    }
*/
const useCompoExtend = function (baseCompo, props, options) {

    const extendedPropKeys = Object.keys(compoExtend_get(baseCompo, 'props', _.get(options, 'ignore')))
    const extendedPropsProxy = reactive({})

    watchEffect(() => {
        for (const x in extendedPropKeys) {
            const propName = extendedPropKeys[x]
            if (_.get(options, `proxy.${propName}`) !== undefined)
                extendedPropsProxy[propName] = /*toValue(*/_.get(options, `proxy.${propName}`)/*)*/

            else if (props[propName] !== undefined)
                extendedPropsProxy[propName] = props[propName]
        }
    })


    return {
        /*constants*/

        /*methods*/

        /*events*/

        /*computed*/
        extendedPropsProxy
    }
}



const useCompoExtend_computed = function (baseCompo, props, options) {
    if (options === undefined) options = {}
    const proxied = options.proxy !== undefined ? options.proxy : {}
    const extendedPropKeys = Object.keys(compoExtend_get(baseCompo, 'props', _.get(options, 'ignore')))
    const extendedPropsProxy = computed(() => {
        var exProps = {}
        for (const x in extendedPropKeys) {
            const propName = extendedPropKeys[x]
            if (proxied[propName] !== undefined)
                //exProps[propName] = proxied[propName]
                exProps[propName] = toValue(proxied[propName])

            else if (props[propName] !== undefined)
                exProps[propName] = props[propName]
        }
        return exProps
    })


    return {
        /*constants*/

        /*methods*/

        /*events*/

        /*computed*/
        extendedPropsProxy
    }
}


export {
    useCompoExtend,
    useCompoExtend_computed,
    compoExtend_get
}