import { i18n } from 'src/boot/i18n.js'
export default {
    required: function (value, errorMessage) {
        const $t = i18n.global.t
        if (errorMessage === undefined || typeof errorMessage !== 'string') errorMessage = $t('validators.error.empty_field')
        return !!value || errorMessage
    }
}