const LifeCycleDirective = {
    // called before bound element's attributes
    // or event listeners are applied
    created (el, binding, vnode, prevVnode) {
        if (typeof binding.value.created === 'function') binding.value.created(el, binding, vnode, prevVnode)
    },

    // called right before the element is inserted into the DOM.
    beforeMount (el, binding, vnode, prevVnode) {
        if (typeof binding.value.beforeMount === 'function') binding.value.beforeMount(el, binding, vnode, prevVnode)
    },

    // called when the bound element's parent component
    // and all its children are mounted.
    mounted (el, binding, vnode, prevVnode) {
        console.log("life-cycle directive MOUNTED", binding)
        if (typeof binding.value.mounted === 'function') binding.value.mounted(el, binding, vnode, prevVnode)
    },

    // called before the parent component is updated
    beforeUpdate (el, binding, vnode, prevVnode) {
        if (typeof binding.value.beforeUpdate === 'function') binding.value.beforeUpdate(el, binding, vnode, prevVnode)
    },

    // called after the parent component and
    // all of its children have updated
    updated (el, binding, vnode, prevVnode) {
        if (typeof binding.value.updated === 'function') binding.value.updated(el, binding, vnode, prevVnode)
    },

    // called before the parent component is unmounted
    beforeUnmount (el, binding, vnode, prevVnode) {
        console.log("life-cycle directive beforeUnmount", el)
        if (typeof binding.value.beforeUnmount === 'function') binding.value.beforeUnmount(el, binding, vnode, prevVnode)
    },

    // called when the parent component is unmounted
    unmounted (el, binding, vnode, prevVnode) {
        if (typeof binding.value.unmounted === 'function') binding.value.unmounted(el, binding, vnode, prevVnode)
    }
}

export default LifeCycleDirective
