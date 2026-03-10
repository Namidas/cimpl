import { defineComponent, h } from 'vue'

export default defineComponent({
    name: 'CSlot',

    //template: `<component :is='slotFn' v-bind="scope" />`,

    props: ['slotFn', 'scope'],
    /*setup (props, { slots }) {
        console.log("CSlot recieved...", slots)
        //const render = () => h(props.slotFn(props.scope), props.scope, slots)
        //return render
    },*/

    /*render () {
        return h(this.slotFn, this.scope, this.$slots)
    }*/

    render () {
        return this.slotFn.apply(this, [this.scope, {
            // This is the manual 'injection' of the slot content
            slots: {
                content: () => h('div', {}, 'asd')
            }
        }])
    }
})