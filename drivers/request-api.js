import defaults from './../utils/defaults'

defaults.preset('CDrivers.requests', {
    'axios/api': {
        exec: function (method, endpoint, params, options) {
            console.log("axios/api > exec")
            console.log(`method: ${method}`)
            console.log(`method: ${endpoint}`)
            console.log("params", params)
            console.log("options", options)
            return defaults.get('CDrivers.requests.axios.exec').call(this, method, endpoint, params, options, defaults.get('CDrivers.requests.axios/api.handler'))
        },
    }
})