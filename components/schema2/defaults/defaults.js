import defaults from './../../../utils/defaults'

import CSchemaChildren from './../components/children.vue'
import CSchemaEntry from './../components/entry.vue'

if (!defaults.get('CSchema._presets'))
    defaults.preset('CSchema', {
        _presets: true,

        //definitions for the children list
        children: {
            handler: () => CSchemaChildren
        },

        //definitions for the entry
        entry: {
            handler: () => CSchemaEntry
        },

        //type-specific definitions
        //keep in mind that the "handler" prop is the inner component, not the wrapping entry handler
        //which is defined on "entry" config above
        entries: {
            //common
            _: {
                name: undefined,
                type: undefined,
                children: undefined,
                map: undefined,

                handler: undefined
            }
        }
    })