import _ from 'lodash'

function mergeReactive () {
    var args = [...arguments]
    var source = args.shift()

    const dbgLVL = typeof args[args.length - 1] === 'number' ? args.pop() : false
    const preSTR = dbgLVL ? Array(dbgLVL).fill("--").join('') : ''

    function debug () {
        if (!dbgLVL) return
        for (const x in arguments)
            if (typeof arguments[x] === 'object') console.log(arguments[x])
            else console.log(`${preSTR} <${typeof arguments[x]}> ${arguments[x]}`)
    }

    debug(`*** MERGE REACTIVE lvl.${dbgLVL}`)

    for (const x in args) {
        debug("-- mergeando argumento " + x, args[x])
        if (!args[x]) continue
        for (const y in args[x]) {
            debug(`-- subarg '${y}' argtype? ${typeof args[x][y]}`)
            if (source[y] === args[x][y]) {
                debug("-- era igual, ignoro")
                continue
            }

            //need to do this like this because _.isObject returns whatever...
            //essentially, returns true for functions as well
            if (typeof args[x][y] === 'object') {
                if (_.isArray(args[x][y])) {
                    debug(`---- mergeando era array  ${x}/${y}`, args[x][y])
                    if (source[y] === undefined) {
                        debug("creo array en limpio y llamo otra vez...")
                        source[y] = []
                    } else debug("ya existia en base, asique solo llamo otra vez")
                    mergeReactive(source[y], args[x][y], dbgLVL ? dbgLVL + 1 : undefined)
                }
                else {
                    debug(`---- mergeando era objeto  ${x}/${y}`, args[x][y])
                    if (source[y] === undefined) {
                        debug("creo objeto en limpio y llamo otra vez...")
                        source[y] = {}
                    } else debug("ya existia en base, asique solo llamo otra vez")
                    mergeReactive(source[y], args[x][y], dbgLVL ? dbgLVL + 1 : undefined)
                }
            }
            else {
                debug(`---- mergeando no era objecto ni array asigno directo ${x}/${y}`)
                source[y] = args[x][y]
            }

        }
    }
    return source
}

export {
    mergeReactive
}