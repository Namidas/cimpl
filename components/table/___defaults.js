/* eslint-disable */

const $_TABLE_DEFAULTS = {
    common: {
        rest: true, /*use rest?*/
        url: '', /*action url*/
        params: {
            controller: '::controllerName'
        }, /*action params*/

        /* string with another action name to inherit all base values from */
        extend: false,

        //set: false, //wether to set whatever returned value for each action
        //getter: undefined, //string to user with _.get(response/whatever)
        //loading: true, /*set the form in loading mode*/
        //submitting: false, /*set the form in submitting mode*/
    },

    get: {
        method: 'get',
        params: {
            action: 'get_page',
            //page: 0,
            //pageSize: false,
        },
        set: true, //wether to set or not the new rows
        rows_getter: 'data.rows', //selector to fetch rows from response
        count_getter: 'data.count', //selector to fetch row count from response
        total_getter: 'data.total' //selector to fetch total rows count from response
    },

    set: {
        method: 'post',
        // updatesOnly: false,
        // onUpdate: false,
        // set: true,
        getter: 'data.rows', //getter for the rows on resturn value. true to use the whole response
        update: true, //should update inner values with returned from response ?
        mainRowKey: false, //string key to compare when updating values, false to use prop [mainRowKey]
        params: {
            action: 'set'
        },
        //submitting: true,
        //redirect: true,
    },

    update: {
        extend: 'set'
    },

    /*update: {
        method: 'post',
        // updatesOnly: false,
        // onUpdate: false,
        // set: true,
        getter: true, //getter for the rows on resturn value. true to use the whole response
        params: {
            action: 'set'
        },
        //submitting: true,
        //redirect: true,
    },*/

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

// default cell definition
const $_DEFAULT_CELL = {
    //use yes/no column filter
    filter: false,
}

//default quick edit definition
const $_DEFAULT_EDIT = {
    placeholder: 'edit.tooltip',
    debounce: 300,
    bind: {},

    /* row keys to include when saving edit, automatically includes edited column name */
    pick: [],

    /* edit always? when true cell is edited on the cell itself ALWAYS (no click to edit), ignores
    [popup] */
    always: false,

    /* wether to float the loader icon/spinner on top of cell instead of placing it to the right */
    floatLoader: false,

    /* edit on popup or in place */
    popup: false,

    /* when popup and popupSave are true, save action, feedback (loader) and notifications are
    shown on popup, otherwise the popup gets closed, loader is shown next to the cell content
    and notifications are shown as default floating notifications (same as popup = false) */
    popupSave: false,

    /* when editing in place, should it save the edit on backdrop click ? only works when
    [popup] = false */
    dismissSave: false,

    /* show backdrop on popup, actually changes the component used for the popup
    when true, it uses a q-dialog (which has a backdrop) when false, it uses a q-popup-proxy
    which shows as q-menu (no backdrop) on bigger screens and a q-dialog (with backdrop) on smaller screens, 
    when popup is false but backdrop is true, then a backdrop is rendered around the cell and
    clicking on it dismisses the edit */
    backdrop: true,

    /* show notifications on backdrop (when true), otherwise it uses $melon.showNotif, this only
    works when editing in-place */
    backdropNotify: false,

    /* binds for the popup compo (when in use) */
    popupBind: {},

    inheritableProps: [
        'label'
    ]
}

// default filter definition
const $_DEFAULT_FILTER = {
    placeholder: 'filter.placeholder',
    debounce: 300,
    bind: {},
    inheritableProps: [
        'label'
    ]
}

export {
    $_TABLE_DEFAULTS,
    $_DEFAULT_CELL,
    $_DEFAULT_FILTER,
    $_DEFAULT_EDIT
}