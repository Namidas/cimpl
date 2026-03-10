import { unref } from 'vue'

function plain_copy (obj, unrefValue) {
    if (unrefValue === undefined) unrefValue = true

    if (obj === undefined) return undefined
    if (obj === null) return null

    var result = {}
    if (!unrefValue) result = JSON.parse(JSON.stringify(obj))
    else {
        const base = unref(obj)
        switch (typeof obj) {
            case 'string':
                result = '' + obj
                break
            case 'number':
                result = 0 + obj
                break
            default:
                for (const x in base) {
                    const unrefX = unref(base[x])
                    if (typeof unrefX !== 'object')
                        result[x] = unrefX
                    else result[x] = plain_copy(unrefX, true)
                }
        }
    }

    return result
}

export default plain_copy
