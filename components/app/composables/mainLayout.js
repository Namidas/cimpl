import { computed, ref } from 'vue'
import getStyle from './../../../utils/getstyle/getstyle.js'

export default function (appInstanceStore) {

    var styleMutationObserver = null

    const layoutPageContainer = ref(null)

    const contentPadding = ref({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        horizontal: 0,
        vertical: 0
    })

    const contentAreaDimensions = computed(() => {
        return {
            width: window.innerWidth - contentPadding.value.horizontal,
            height: window.innerHeight - contentPadding.value.vertical,
            absoluteWidth: window.innerWidth,
            absoluteHeight: window.innerHeight
        }
    })

    function onPageContainerStyleMutation (mutations) {
        setTimeout(() => {
            let paddingTop = parseInt(getStyle(layoutPageContainer.value.$el, 'paddingTop'))
            let paddingLeft = parseInt(getStyle(layoutPageContainer.value.$el, 'paddingLeft'))
            let paddingRight = parseInt(getStyle(layoutPageContainer.value.$el, 'paddingRight'))
            let paddingBottom = parseInt(getStyle(layoutPageContainer.value.$el, 'paddingBottom'))
            if (isNaN(paddingTop)) paddingTop = 0
            if (isNaN(paddingLeft)) paddingLeft = 0
            if (isNaN(paddingRight)) paddingRight = 0
            if (isNaN(paddingBottom)) paddingBottom = 0

            contentPadding.value = {
                top: paddingTop,
                right: paddingRight,
                bottom: paddingBottom,
                left: paddingLeft,

                horizontal: paddingLeft + paddingRight,
                vertical: paddingTop + paddingBottom
            }

            appInstanceStore.optics.main.padding = { ...contentPadding.value }
            appInstanceStore.optics.main.dimensions = { ...contentAreaDimensions.value }
        }, 100)
    }

    function beforeUnmountListenStyleMutation () {
        window.removeEventListener('resize', onPageContainerStyleMutation)
        styleMutationObserver.disconnect()
    }

    function mountedListenStyleMutation () {
        styleMutationObserver = new MutationObserver(onPageContainerStyleMutation)
        const target = layoutPageContainer.value.$el
        styleMutationObserver.observe(target, { attributes: true, attributeFilter: ['style'] })
        window.addEventListener('resize', onPageContainerStyleMutation)
        onPageContainerStyleMutation()
    }

    return {
        /*refs*/
        layoutPageContainer,
        contentPadding,

        /*methods*/
        beforeUnmountListenStyleMutation,
        mountedListenStyleMutation,

        /*events*/
        onPageContainerStyleMutation,

        /*computed*/
        contentAreaDimensions
    }
}