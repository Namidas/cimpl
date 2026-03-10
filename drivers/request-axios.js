import defaults from './../utils/defaults'

defaults.preset('CDrivers.requests', {
    'axios': {
        exec: function (method, endpoint, params, options, wrapper) {
            const handler = wrapper ? wrapper : this.handler
            console.log("request-axios handler?", handler)
            switch (method) {
                case 'get':
                    return handler.get(endpoint, { params })
            }
        },
    }
})