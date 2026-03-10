import { provide, inject } from 'vue'

function useCSchemaProvide (provided) {
    provide('CSchema', provided)
}

function useCSchemaInject () {
    return inject('CSchema')
}

export {
    useCSchemaProvide,
    useCSchemaInject
}