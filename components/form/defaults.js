const $_DEFAULTS = {
    common: {
        rest: true, /*use rest?*/
        url: '', /*action url*/
        params: {
            controller: '::controllerName'
        }, /*action params*/

        set: false, //wether to set whatever returned value for each action
        getter: undefined, //string to user with _.get(response/whatever)
        loading: true, /*set the form in loading mode*/
        submitting: false, /*set the form in submitting mode*/
    },

    get: {
        method: 'get',
        params: {
            action: 'get'
        },
        set: true,
        getter: 'data',
    },

    set: {
        method: 'post',
        updatesOnly: false,
        onUpdate: false,
        set: true,
        getter: 'data.record',
        params: {
            action: 'set'
        },
        submitting: true,
        redirect: true,
    },

    delete: {
        method: 'delete',
        params: {
            action: 'delete',
        }
    },

    toggle: {
        method: 'post',
        fullModel: false,
        params: {
            action: 'toggle',
        }
    },
}

export default $_DEFAULTS