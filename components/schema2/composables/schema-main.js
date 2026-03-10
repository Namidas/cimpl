import { getDefaultsInstance } from './../../../utils/defaults'

function useCSchemaMain (props) {
    const schemaConfig = getDefaultsInstance('CSchema'/*,more*/)

    return {
        schemaConfig
    }
}

export {
    useCSchemaMain
}