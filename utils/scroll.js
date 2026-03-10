import _ from 'lodash'

function scrollToTop (opts) {
    window.scrollTo(_.merge({
        top: 0,
        behavior: 'smooth'
    }, opts ? opts : {}))
}

export {
    scrollToTop
}