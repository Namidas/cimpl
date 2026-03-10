/* eslint-disable */

//import './styles.scss'
import scrollparent from '../../utils/scrollparent/scrollparent.js'
import getStyle from '../../utils/getstyle/getstyle.js'

/*debug directive*/
const debugDirective = false
function debug () {
    if (!debugDirective) return
    const baseString = `** sticky-directive: `
    for (const x in arguments)
        console.log(typeof arguments[x] === 'string' ? `${baseString}${arguments[x]}` : arguments[x])
}

/*get intersecting rectangle*/
function intersectingRect (r1, r2) {
    var x = Math.max(r1.x, r2.x)
    var y = Math.max(r1.y, r2.y)
    var xx = Math.min(r1.x + r1.width, r2.x + r2.width)
    var yy = Math.min(r1.y + r1.height, r2.y + r2.height)
    return { x: x, y: y, width: xx - x, height: yy - y }
}

/*get affecting styles from node [from] up to node [to]*/
function get_affecting_styles_range (from, to) {
    const props = ['padding', 'border', 'margin']
    const directions = ['top', 'right', 'bottom', 'left']
    let nodes = [from]
    let styles = {
        margin: {
            top: [getStyle(from, 'margin-top')],
            right: [getStyle(from, 'margin-right')],
            bottom: [getStyle(from, 'margin-bottom')],
            left: [getStyle(from, 'margin-left')]
        },
        padding: {
            top: [getStyle(from, 'padding-top')],
            right: [getStyle(from, 'padding-right')],
            bottom: [getStyle(from, 'padding-bottom')],
            left: [getStyle(from, 'padding-left')]
        },
        border: {
            top: [getStyle(from, 'border-top-width')],
            right: [getStyle(from, 'border-right-width')],
            bottom: [getStyle(from, 'border-bottom-width')],
            left: [getStyle(from, 'border-left-width')]
        }
    }

    let current = from.parentNode
    while (current !== null) {
        nodes.push(current)
        for (const x in props) {
            for (const y in directions) {
                debug("--- styles", x, y, props[x], directions[y])
                styles[props[x]][directions[y]].push(getStyle(current, `${props[x]}-${directions[y]}${props[x] === 'border' ? '-width' : ''}`))
            }
        }
        if (current === to) current = null
        else current = current.parentNode
    }
    styles.nodes = nodes
    return styles
}

/*get affecting styles, padding and border*/
function get_affecting_styles (node) {
    let styles = {
        padding: {
            top: getStyle(node, 'padding-top'),
            right: getStyle(node, 'padding-right'),
            bottom: getStyle(node, 'padding-bottom'),
            left: getStyle(node, 'padding-left')
        },
        border: {
            top: getStyle(node, 'border-top-width'),
            right: getStyle(node, 'border-right-width'),
            bottom: getStyle(node, 'border-bottom-width'),
            left: getStyle(node, 'border-left-width')
        }
    }
    return styles
}

/*apply an object of {style: value} to the given node style block*/
const apply_styles = (node, styles, applyNode) => {
    const nodeID = node.id
    const options = stickiedElements[nodeID]
    let stylesParsed = `#${nodeID} { `
    Object.keys(styles).forEach(key => {
        stylesParsed += `${key}: ${styles[key]};`
        if (applyNode === true) node.style[key] = styles[key]
    })
    stylesParsed += '}'
    if (applyNode !== true) options.style.innerHTML = stylesParsed
}

/*list of throttled event calls*/
const useEventThrottle = false
var throttled = {}

/*list of stickied elements, defined by ID as key*/
var stickiedElements = {}

/*list of registered scroll events, it's going to be an object with the key being the ID of the
node to watch, and an array of handlers*/
var scrollEvents = {}

/*recursively change node and children IDs to avoid duplicates, used on cloned element used as placeholder
also disable and delete name from any form controller inside the placeholder, to avoid unwanted data
on the form actions */
function fixNodeIDs (node) {
    if (node.id !== undefined) if (node.id.trim() !== '') node.id += '-clone'
    if (node.disabled !== undefined) node.disabled = true
    if (node.name !== undefined) node.name = ''

    const children = Array.prototype.slice.call(node.childNodes)
    for (const x in children)
        fixNodeIDs(children[x])
}

/*register a new sticky element or update the binding if it's already there*/
function registerStickyElement (node, binding) {
    console.log("REGISTER STICKY BINDING", node, binding)
    if (node === undefined) return
    const nodeID = node.id.trim() === '' ? node.id = _.uniqueId('stickied_') : node.id
    if (stickiedElements[nodeID] === undefined) {
        /*create styles node*/
        const style = document.createElement('style')
        style.type = 'text/css'
        style.id = `${nodeID}-stickied-styles`
        document.getElementsByTagName('head')[0].appendChild(style)

        /*create placeholder node*/
        const placeholder = node.cloneNode(true)
        fixNodeIDs(placeholder)
        node.parentNode.insertBefore(placeholder, node.nextSibling)
        placeholder.classList.add('melon-sticky-placeholder')

        const stickyTarget = node.closest(binding.value.target)
        const scrollParent = scrollparent(stickyTarget)
        const scrollParentID = scrollParent.id.trim() === '' ? scrollParent.id = _.uniqueId('stickied_scrollparent_') : scrollParent.id

        /*listen to scroll parent's scroll event*/
        startListeningScroll(scrollParent, node)

        stickiedElements[nodeID] = {
            placeholder: placeholder,
            binding: binding,
            style: style,
            inPosition: false,
            stickyTarget: stickyTarget,
            scrollParent: scrollParent
        }

        //acá tengo que agregar los eventos de scroll
    }
    else stickiedElements[nodeID].biding = binding
    updateStickyElement(nodeID)
    return node
}

/*unregister stickied element*/
function unregisterStickyElement (node) {
    if (node === undefined) return
    console.log("unregister sticky element", node)
    const nodeID = node.id
    if (stickiedElements[nodeID] === undefined) {
        console.log("no esta registrado el sticky asique retorno sin hacer nada")
        return
    }
    const options = stickiedElements[nodeID]
    const stickyTarget = options.stickyTarget
    const scrollParent = options.scrollParent
    stopListeningScroll(scrollParent, node)

    const removeClass = [
        'melon-sticky',
        'melon-sticky-in-position',
        'melon-sticky-bottom',
        'melon-sticky-in-position-bottom',
    ]
    node.classList.remove.apply(node.classList, removeClass)
    options.placeholder.remove()
    options.style.remove()

    //falta quitar todos los eventos si los hubiera
}

/*append node to the scrollTarget scroll event list, if the list doesn't exist, create it and start listening to the event*/
function startListeningScroll (scrollTarget, node) {
    const scrollTargetID = scrollTarget.id
    if (scrollEvents[scrollTargetID] === undefined) {
        scrollEvents[scrollTargetID] = []
        if (useEventThrottle) {
            throttled[scrollTargetID] = _.throttle(() => updateStickyElement(scrollEvents[scrollTargetID]), 1000, { leading: true })
            scrollTarget.addEventListener('scroll', throttled[scrollTargetID])
            scrollTarget.addEventListener('resize', throttled[scrollTargetID])
            window.addEventListener('resize', throttled[scrollTargetID])
        }
        else {
            scrollTarget.addEventListener('scroll', on_scroll_event)
            scrollTarget.addEventListener('resize', on_scroll_event)
            window.addEventListener('resize', on_scroll_event)
        }
    }

    if (scrollEvents[scrollTarget.id].indexOf(node.id) === -1)
        scrollEvents[scrollTarget.id].push(node.id)
}

/*remove node from the target's scroll event list, if no more nodes are registered, remove the event from the target*/
function stopListeningScroll (scrollTarget, node) {
    const scrollTargetID = scrollTarget.id
    if (scrollEvents[scrollTargetID] === undefined) return
    if (scrollEvents[scrollTargetID].indexOf(node.id) === -1) return
    scrollEvents[scrollTargetID].splice(scrollEvents[scrollTargetID].indexOf(node.id), 1)
    if (!scrollEvents[scrollTargetID].length) {
        if (useEventThrottle) {
            scrollTarget.removeEventListener('scroll', throttled[scrollTargetID])
            scrollTarget.removeEventListener('resize', throttled[scrollTargetID])
            window.removeEventListener('resize', throttled[scrollTargetID])
        }
        else {
            scrollTarget.removeEventListener('scroll', on_scroll_event)
            scrollTarget.removeEventListener('resize', on_scroll_event)
            window.removeEventListener('resize', on_scroll_event)
        }
        delete scrollEvents[scrollTargetID]
        delete throttled[scrollTargetID]
    }
}

/*fire when the scroll parent of the stickied node scrolls*/
function on_scroll_event (scrollEvent) {
    updateStickyElement(scrollEvents[scrollEvent.target.id])
}

/*get clientBoundingRect with some extra info*/
function getBoundingClientRect (node) {
    let rect = node.getBoundingClientRect()
    rect.absoluteX = rect.left + window.scrollX
    rect.absoluteY = rect.top + window.scrollY

    /*const nodeOffset = getNodeOffset(node)
    rect.offsetTop = nodeOffset.top
    rect.offsetLeft = nodeOffset.left*/
    rect.offsetTop = node.offsetTop
    rect.offsetLeft = node.offsetLeft

    return rect
}

/*update state and position of stickied element*/
function updateStickyElement (nodeIDs) {
    if (nodeIDs === undefined) nodeIDs = Object.keys(stickiedElements)
    else if (typeof nodeIDs !== 'object') nodeIDs = [nodeIDs]
    for (const x in nodeIDs) {
        const nodeID = nodeIDs[x]
        const options = stickiedElements[nodeID]
        const node = document.getElementById(nodeID)
        const stickyTarget = options.stickyTarget
        const scrollParent = options.scrollParent
        const placeHolder = options.placeholder

        if (useEventThrottle) throttled[scrollParent.id].cancel()

        if (options === undefined || node === null || !scrollParent || !stickyTarget) {
            debug(`UPDATE [${nodeID}] CON ALGUN VALOR NULO`, options, node, scrollParent, stickyTarget)
            debug("-----------------------------------", `---- FIN [${nodeID}]`)
            continue
        }

        debug(`/*/*/*/* UPDATE [${nodeID}]`, node, "-------------------------------------")

        const nodeRect = getBoundingClientRect(node)
        const scrollParentNodeRect = getBoundingClientRect(scrollParent)
        const stickyTargetNodeRect = getBoundingClientRect(stickyTarget)
        const placeholderRect = getBoundingClientRect(placeHolder)

        //debug("esta fuera por debajo?: ", scrollParentNodeRect.y + scrollParentNodeRect.height < stickyTargetNodeRect.y)
        //debug("esta fuera por encima?: ", stickyTargetNodeRect.y + stickyTargetNodeRect.height < scrollParentNodeRect.y)

        //if (scrollParentNodeRect.height < stickyTargetNodeRect.y) {
        if (scrollParentNodeRect.y + scrollParentNodeRect.height < stickyTargetNodeRect.y || stickyTargetNodeRect.y + stickyTargetNodeRect.height < scrollParentNodeRect.y) {
            /*sticky target is outside of view (in scroll parent)*/
            debug("---- sticky target out of view (in scroll parent)")
            debug("-----------------------------------", `---- END [${nodeID}]`)
            continue
        }

        node.classList.add('melon-sticky')
        if (options.binding.value.bottom === true) node.classList.add('melon-sticky-bottom')

        const targetVisibleFrom = 0
        let targetVisibleTo = scrollParentNodeRect.height - stickyTarget.offsetTop + scrollParent.scrollTop
        if (targetVisibleTo > stickyTargetNodeRect.height) {
            debug("target visible to > a altura")
            targetVisibleTo = stickyTargetNodeRect.height
        }
        const placeHolderOffsetTopReal = Math.abs(stickyTargetNodeRect.top - placeholderRect.top)
        const nodeOffsetTopReal = Math.abs(stickyTargetNodeRect.top - nodeRect.top)
        if (options.inPosition) {
            debug("----------- IN POSITION INITIAL")
            if (nodeOffsetTopReal + nodeRect.height > targetVisibleTo) {
                debug("--- no esta más in position")
                node.classList.remove('melon-sticky-in-position')
                if (options.binding.value.bottom === true) node.classList.remove('melon-sticky-bottom')
                options.inPosition = false
                updateStickyElement(nodeID)
                continue
            }
            else continue
        }

        const stylesToApply = {
            width: `${placeholderRect.width}px  !important`,
            height: `${placeholderRect.height}px  !important`,
        }
        apply_styles(node, stylesToApply)

        /*const affectingStylesTarget = get_affecting_styles(stickyTarget)
        const affectingStylesScroll = get_affecting_styles(scrollParent)

        debug("affecting styles scroll parent", affectingStylesScroll, scrollParent)*/
        const affectingStyles = get_affecting_styles_range(stickyTarget, scrollParent)
        affectingStyles.margin.top.push(getStyle(node, 'margin-top'))
        affectingStyles.margin.right.push(getStyle(node, 'margin-right'))
        affectingStyles.margin.bottom.push(getStyle(node, 'margin-bottom'))
        affectingStyles.margin.left.push(getStyle(node, 'margin-left'))

        //debug("saraza?", targetVisible - placeholderRect.height)
        //debug("saraza2", targetVisible - placeHolder.offsetTop, placeHolder)
        //apply_styles(node, { top: `${scrollNTargetDiff - placeholderRect.height}px`})
        /*debug("scrollparent node rect height", scrollParentNodeRect.height, scrollParent)
        debug("stickytarget offsetTop", stickyTarget.offsetTop + " / " + stickyTargetNodeRect.top, stickyTarget, stickyTargetNodeRect)
        debug("scrollNTargetDiff", scrollNTargetDiff)
        debug("testo", stickyTargetNodeRect.top - stickyTargetNodeRect.height - scrollParent.scrollTop)
        debug("scrolls", scrollParent.scrollTop, stickyTarget.scrollTop)
        debug("testo 2", scrollParentNodeRect.height - scrollParent.scrollTop)*/
        //const targetVisibleHeight = stickyTargetNodeRect.height > scrollNTargetDiff ? scrollNTargetDiff : stickyTargetNodeRect.height
        //debug("target visible", targetVisibleHeight)

        //const saraza = true
        //if (saraza) return

        //const placeholderDiff = stickyTargetNodeRect.height - placeholderRect.y
        const placeholderDiff = stickyTargetNodeRect.height - placeHolder.offsetTop
        debug("TARGET VISIBLE FROM TO", targetVisibleFrom + " / " + targetVisibleTo)

        const extraStylesToApply = {
            //width: `${placeholderRect.width}px !important`,
            //height: `${placeholderRect.height}px !important`,
            //top: `${ scrollParent.scrollTop + scrollParentNodeRect.height - placeholderRect.height } px`
            // bottom: `${ options.placeholder.offsetTop - stickyTargetNodeRect.y } px`,
            //top: `${stickyTargetNodeRect.height - placeholderRect.height - scrollParent.scrollTop}px`,
        }

        const targetParentIntersectRect = intersectingRect(scrollParentNodeRect, stickyTargetNodeRect)
        debug("intersect rect", targetParentIntersectRect)
        /*bottom align*/
        if (options.binding.value.bottom === true) {
            let newTop = 0
            if (placeHolderOffsetTopReal + placeholderRect.height <= targetVisibleTo) {
                debug("IN POSITION", targetVisibleFrom, targetVisibleTo, placeHolderOffsetTopReal, placeholderRect.height, placeHolder)
                node.classList.add('melon-sticky-in-position', 'melon-sticky-in-position-bottom')
                apply_styles(node, {})
                options.inPosition = true
                continue
            }
            else if (targetParentIntersectRect.height < placeholderRect.height) newTop = 0
            else newTop = targetVisibleTo - placeholderRect.height

            debug(`[${nodeID}] NEW TOP: ${newTop}`)

            //extraStylesToApply.top = `calc(${newTop}px - ${affectingStylesTarget.padding.top}  + ${affectingStylesTarget.border.top} - ${affectingStylesScroll.padding.top}  + ${affectingStylesScroll.border.top})`
            extraStylesToApply.top = `calc(${newTop}px - ${affectingStyles.padding.top.join(' - ')} - ${affectingStyles.margin.top.join(' - ')} + ${affectingStyles.border.top.join(' + ')})`
            debug("styles resultantes", extraStylesToApply.top, affectingStyles)
        }


        apply_styles(node, extraStylesToApply)

        debug("nodeRec", nodeRect)
        debug("EL", node)
        debug("scrollparent rect", scrollParentNodeRect)
        debug("EL", scrollParent)
        debug("target rect", stickyTargetNodeRect)
        debug("EL", stickyTarget)
        debug("placeholder rect", placeholderRect)
        debug("applied styles", stylesToApply)

        debug("-----------------------------------", `---- FIN [${nodeID}]`)
    }
}

const PositionStickyDirective = {
    // called before bound element's attributes
    // or event listeners are applied
    created (el, binding, vnode, prevVnode) {
        // see below for details on arguments
        //console.log("--- sticky bottom directive created", el, binding, vnode, prevVnode)
        //console.log("binding value " + binding.value)
    },

    // called right before the element is inserted into the DOM.
    beforeMount (el, binding, vnode, prevVnode) {
    },

    // called when the bound element's parent component
    // and all its children are mounted.
    mounted (el, binding, vnode, prevVnode) {
        registerStickyElement(el, binding)
    },

    // called before the parent component is updated
    beforeUpdate (el, binding, vnode, prevVnode) {
    },

    // called after the parent component and
    // all of its children have updated
    updated (el, binding, vnode, prevVnode) {
    },

    // called before the parent component is unmounted
    beforeUnmount (el, binding, vnode, prevVnode) { },

    // called when the parent component is unmounted
    unmounted (el, binding, vnode, prevVnode) {
        unregisterStickyElement(el)
    }
}

export default PositionStickyDirective

export { registerStickyElement, unregisterStickyElement }
