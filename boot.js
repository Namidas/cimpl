import _ from 'lodash'

const _debug = process.env.cimpl.debug
const debug = function () {
    if (_debug)
        for (const x in arguments)
            if (typeof arguments[x] === 'object')
                console.log("** cimpl-boot: ", arguments[x])
            else console.log(`** cimpl-boot: ${arguments[x]}`)
}

const locale = 'en-US'
var imported = {
    lang: [],
    directives: []
}

debug("preparing...")

for (const importType in imported) {
    for (const x in process.env.cimpl[importType]) {
        const importName = process.env.cimpl[importType][x]
        var importPath = `FOOO./${importType}/${process.env.cimpl[importType][x]}`
        switch (importType) {
            case 'lang':
                importPath = `./${importType}/${locale}/${importName}.js`
                break

            case 'directives':
                importPath = `./${importType}/${importName}/index.js`
                break
        }
        debug(`import ${importType} '${importName}' from '${importPath}'`)
        imported[importType][importName] = import(importPath)
    }
}

debug("finished preparations")

export default async function ({ app }) {
    console.log("running", process.env)

    for (const importType in imported) {
        for (const x in imported[importType]) {
            debug(`processing import [${importType}] '${x}'`, imported[importType][x])
            switch (importType) {
                case 'lang':
                    imported[importType][x].then((res) => {
                        debug(`result for import lang ? ${x}`, res)
                        const i18nGlobal = app.__VUE_I18N__.global
                        i18nGlobal.setLocaleMessage(locale, _.merge({}, i18nGlobal.getLocaleMessage(locale), res.default))
                    }).catch((res) => {
                        debug(`import ERROR [${importType}] '${x}'`, res)
                    })
                    break

                case 'directives':
                    debug("result for import directive?", imported[importType][x])
                    imported[importType][x].then((res) => {
                        app.directive(x, res.default)
                    }).catch((res) => {
                        debug(`import ERROR [${importType}] '${x}'`, res)
                    })
                    break
            }
        }
    }
}