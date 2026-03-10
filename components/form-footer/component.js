/* eslint-disable */

//import './styles.scss'
import { defineComponent, ref, watch } from 'vue'
//import { $melon } from 'src/boot/melon.window_melon'
import _ from 'lodash'

const $_COMPONENT = defineComponent({

    tagname: 'cimpl-form-footer',

    emits: ['submit', 'reset', 'notification:click'],

    props: {
        mode: {
            required: false,
            type: String,
            default: 'create'
        },

        loading: {
            required: false,
            type: Boolean,
            default: false
        },

        submitting: {
            required: false,
            type: Boolean,
            default: false
        },

        /*form: {
            required: false,
            type: Object,
            default: undefined
        },*/

        enableSubmit: {
            required: false,
            type: Boolean,
            default: true,
        },

        enableReset: {
            required: false,
            type: Boolean,
            default: true,
        },

        useSubmit: {
            required: false,
            type: Boolean,
            default: true,
        },

        useReset: {
            required: false,
            type: Boolean,
            default: true,
        },

        align: {
            required: false,
            type: String,
            default: 'end'
        },

        border: {
            required: false,
            type: Boolean,
            default: true
        },

        controlsCols: {
            required: false,
            type: Number,
            default: 12
        },

        notifications: {
            required: false,
            type: Object,
            default: {},
        },

        submitLabel: {
            required: false,
            type: String,
            default: 'form.submit'
        },

        updateLabel: {
            required: false,
            type: String,
            default: 'form.save_changes'
        },

        resetLabel: {
            required: false,
            type: String,
            default: 'form.reset'
        },
    },

    setup (props) {
        let setupData = {
        }
        return setupData
    },

    data () {
        const dataObject = {
            notificationSources: ['updates', 'errors']
        }
        return dataObject
    },

    computed: {
        /*disableSubmit () {
            return this.disableButton('submit')
        }*/

        submitLabel_parsed () {
            return /*this.$t(*/this.mode === 'create' ? this.submitLabel : this.updateLabel/*)*/
        },

        resetLabel_parsed () {
            return /*this.$t(*/this.resetLabel/*)*/
        },

        notificationsWrapperClass () {
            let classess = []
            var w = 12 - this.controlsCols
            if (w < 1) w = 12
            classess.push(`col-${w}`)
            return classess
        }
    },

    methods: {
        submit: function () {
            //console.log("CLICK SUBMIT", this.form)
            this.$emit('submit', this)
            /*if (this.form !== undefined)
                this.form.onFooterSubmit()*/
        },

        reset: function () {
            this.$emit('reset', this)
            //if (this.form !== undefined)
            //this.form.onReset()
        },

        onNotificationClick (notification, type) {
            //console.log("--- notification click", type)
            //console.log(notification)
            this.$emit('notification:click', {
                notification: notification,
                type: type
            })
        },
    },

    mounted () {
    },
})

export default $_COMPONENT
