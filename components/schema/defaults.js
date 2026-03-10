const $_DEFAULTS = {

    entry: {
        name: false,
        type: undefined,
        controller: {},
        label: undefined,
        size: false,
        available_locales: false,
        //class: undefined,
        label_side: false,
        label_size: false,
        label_compo: false,
        model: false,
        models: undefined, //a list of {model: '', name: '', type: ''}
        modelType: 'var', //var/value
        defaultValue: 'COMPO-DEFAULT-VALUE',
        defaultEmit: true, /*base-emit a default value when used*/
        rulesCheckLastValue: true, /*cache and check lastValue against newValue and auto return true if same*/
        //variant: false,
        conditions: undefined,

        wrap: false,
        wrapProxy: undefined,
        theme: true,

        disable: false,
        readonly: false,
        tooltip: false,
    },

    quasar_components: {

        controller:
        {
            hideBottomSpace: true,
            lazyRules: false,
            //readonly: false
        }
    },

    wrapper_component: {
        stackLabel: true,
    },

    row:
    {
        use_controller_props: false,
        gutter: 'auto',
        controller: {
            //class: '',
        }
    },

    column:
    {
        use_controller_props: false,
        gutter: 'auto',
        controller: {
            //class: '',
        }
    },

    toggle:
    {
        controller: {
            //'true-value': 1,
            //'false-value': 0,
            stackLabel: true,
            //'true-label': undefined,
            //'false-label': undefined,
        },
        wrap: true,
        defaultValue: false,
    },

    'password-group':
    {
        controller: {
            inputClass: 'col-6',
            //class: ''
        }
    },

    'media-uploader': {
        controller: {
            proxy: {
                multiple: false,
                url: '',
                //headers: [],
                //'form-fields': [],
            },
            params: {},
            //fieldAppend: undefined,
            //factoryContext: undefined,
            type: 'picture',
            stackLabel: true,
            class: ['wrapped'],
        },
        wrap: true,
    },

    rating: {
        controller: {
            size: '22px',
            noDimming: true,
            icon: 'star_border',
            iconSelected: 'star',
            iconHalf: 'star_half',
            color: 'primary',
            style: 'margin: 8px 0 10px 0;'
        },
        wrap: true,
        defaultValue: 1
    },

    wysiwyg: {
        label_compo: true,
        controller: {
            minHeight: '5rem',
            'is': 'q-editor'
        }
    },

    tabbed: {
        controller: {
            showTabs: true,
            showPanels: true,
        }
    },

    'tabbed-panels': {
        controller: {
            showTabs: false,
        }
    },

    'tabbed-tabs': {
        controller: {
            showPanels: false,
        }
    },

    component: {
        controller: {
            is: undefined,
        }
    }
}

/*setDefaults(newValues,options)
{
    options = _.merge({},{
        
    },options)
}*/

/*const $_CURRENT_DEFAULTS = () => {

}*/



/*undef_compo: {
    name: 'CimplUndefCompo',
        template: '<div>_undefCompo / {{compo_name}}<br /><slot></slot></div>',
            props: {
        compo_name: {
            required: true,
                type: String
        }
    }
}
    }*/

export default $_DEFAULTS