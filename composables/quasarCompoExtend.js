import { ref, computed, unref } from 'vue'
import _ from 'lodash'

const useQuasarCompoExtend_get = function (baseCompo, source, ignore) {
    let res = source === 'emits' ? [] : {}
    if (ignore === undefined) ignore = []
    for (const propName in baseCompo[source]) {
        //console.log(`useQCompoExtend_get for {${baseCompo.name}} [${source}] key: ${propName}: `, baseCompo[source][propName], typeof baseCompo.props[propName])
        if (!ignore.includes(propName))
            if (source === 'emits') res.push(baseCompo[source][propName])
            else res[propName] = baseCompo[source][propName]
    }
    //console.log(`useQCompoExtend_get for {${baseCompo.name}} [${source}] ---- END`, res)
    return res
}

/* 
    options: {
        ignore: array of props to ignore,

        qCompoPropsProxy: object of props to manually proxy
            ie: {columns: parsedColumns}
    }
*/

const useQuasarCompoExtend = function (baseCompo, props, options) {

    //base keys
    const extendedPropKeys = Object.keys(useQuasarCompoExtend_get(baseCompo, 'props', _.get(options, 'ignore')))

    /* quasar compo props proxy */
    // should this be a ref ?
    const qCompoPropsProxy = computed(() => {
        // console.log('PROP KEYS', extendedPropKeys)
        // console.log('BASE PROPS', props)
        let parsedProps = {}
        const ignoreProps = _.get(options, 'qCompoPropsProxy.ignore', [])
        console.log("ignore props?", ignoreProps)
        for (const x in extendedPropKeys) {
            const propName = extendedPropKeys[x]
            if (ignoreProps.includes(propName)) continue
            if (_.get(options, `qCompoPropsProxy.proxy.${propName}`) !== undefined) {
                //console.log('vue version', version)
                const proxiedVal = unref(_.get(options, `qCompoPropsProxy.proxy.${propName}`))
                parsedProps[propName] = proxiedVal
                //console.log(`proxied prop ${propName}`, proxiedVal)
            }
            else if (props[propName] !== undefined)
                parsedProps[propName] = props[propName]

            // console.log('PARSED PROPS', parsedProps)
        }
        return parsedProps
    })



    return {
        /*constants*/

        /*methods*/

        /*events*/

        /*computed*/
        qCompoPropsProxy
    }
}

export {
    useQuasarCompoExtend,
    useQuasarCompoExtend_get
}