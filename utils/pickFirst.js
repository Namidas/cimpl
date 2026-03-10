function pickFirst () {
    for (const x in arguments)
        if (arguments[x]) return arguments[x]
    return undefined
}

export {
    pickFirst
}