import defaults from './../../../utils/defaults'
import { QInput } from 'quasar'

defaults.set('CSchema', {
    entries: {
        input: {
            handler: () => QInput
        }
    }
})