import { markRaw } from 'vue'

async function fetchModule (moduleURL, fetchParams, imports) {
    if (imports === undefined) imports = ['default']
    return new Promise((resolve, reject) => {
        fetch(moduleURL, fetchParams)
            // Retrieve its body as ReadableStream
            .then((response) => {
                const reader = response.body.getReader()
                return new ReadableStream({
                    start (controller) {
                        return pump()
                        function pump () {
                            return reader.read().then(({ done, value }) => {
                                // When no more data needs to be consumed, close the stream
                                if (done) {
                                    controller.close()
                                    return
                                }
                                // Enqueue the next data chunk into our target stream
                                controller.enqueue(value)
                                return pump()
                            })
                        }
                    }
                })
            })
            // Create a new response out of the stream
            .then((stream) => new Response(stream))
            // Create an object URL for the response
            .then((response) => {
                // console.log('RESPONSE PRE TEXT', response)
                // return response.blob()
                return response.text()
            })
            .then((text) => {
                // console.log('RESPONSE PRE BLOB', text)
                // URL.createObjectURL(blob)
                return new Blob([text], { type: 'text/javascript' })
            })
            .then((blob) => {
                // console.log('RESPONSE BLOB PRE URL', blob)
                return URL.createObjectURL(blob)
            })
            // Update image
            .then((url) => {
                import(/* webpackIgnore: true */url).then(function (compo) {
                    // console.log('INNER COMPO IMPORT PROMISE THEN')
                    // console.log(compo)
                    // console.log(markRaw(compo.default))
                    if (imports.length > 1) {
                        var result = {}
                        for (const x in imports)
                            result[imports[x]] = markRaw(compo[imports[x]])
                        resolve(result)
                    }
                    else resolve(markRaw(compo[imports[0]]))
                    URL.revokeObjectURL(url)
                }).catch(function (error) {
                    console.log('INNER COMO IMPORT PROMISE ERROR')
                    console.log(error)
                })
            })
            .catch((err) => console.error(err))
    })
}

export default fetchModule