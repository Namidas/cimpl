/* eslint-disable */

import './styles.scss'
import { defineComponent, ref, watch, h, provide, inject, normalizeProps } from 'vue'
import getStyle from './../../utils/getstyle/getstyle.js'
import _ from 'lodash'

import { CIMPL_PAGE_parseFooterProp, CIMPL_PAGE_parseLayoutViewProp, CIMPL_PAGE_parseHeaderProp } from './utils.js'
import { getComponentSlots, getClosestParentComponent } from './../../utils/components.js'

import plain_copy from './../../utils/plain_copy'

import CImplPageHeader from './../cimpl-page-header.vue'

import { useAppInstanceStore } from './../../stores/appInstance'

const $_TAB_DEFAULTS = {
    name: 'default-tab-name',
    icon: false,
    // 'keep-alive': true,
    //color: 'black',
    //noCaps: true,
}

const $_CIMPL_PAGE_COMPONENT_PROPS = {
    /*PAGE OPTIONS || PAGE OPTIONS || PAGE OPTIONS*/
    /*PAGE OPTIONS || PAGE OPTIONS || PAGE OPTIONS*/
    /*PAGE OPTIONS || PAGE OPTIONS || PAGE OPTIONS*/
    /*name of the page*/
    name: {
        required: true,
        type: String,
    },

    //wrapping layout is containerized?
    containerized: {
        required: false,
        type: Boolean,
        default: true
    },

    fullHeight: {
        required: false,
        type: Boolean,
        default: true
    },

    /*page title*/
    title: {
        required: false,
        type: String,
    },

    /*page caption*/
    caption: {
        required: false,
        type: String,
    },

    /*page icon*/
    icon: {
        required: false,
        type: String,
    },

    /*background color of the page, in quasar format*/
    background: {
        required: false,
        type: String,
        default: 'white'
    },

    /*q-layout view property*/
    layoutView: {
        required: false,
        default: undefined,
    },

    contentClass: {
        required: false,
        type: [String, Array],
        default: []
    },

    contentStyle: {
        required: false,
        type: [String, Object],
        default: '',
    },


    /*HEADER OPTIONS || HEADER OPTIONS || HEADER OPTIONS*/
    /*HEADER OPTIONS || HEADER OPTIONS || HEADER OPTIONS*/
    /*HEADER OPTIONS || HEADER OPTIONS || HEADER OPTIONS*/
    /*use page header?*/
    header: {
        required: false,
        type: Boolean,
        default: true,
    },

    /*used for the q-header model*/
    headerModel: {
        required: false,
    },

    /*make header stick to the top*/
    headerSticky: {
        required: false,
        type: Boolean,
        default: true,
    },

    /*cimpl-page-header props proxy object*/
    headerProxy: {
        required: false,
        type: Object,
        default: {},
    },


    /*FOOTER OPTIONS || FOOTER OPTIONS || FOOTER OPTIONS*/
    /*FOOTER OPTIONS || FOOTER OPTIONS || FOOTER OPTIONS*/
    /*FOOTER OPTIONS || FOOTER OPTIONS || FOOTER OPTIONS*/
    /*use layout footer ?*/
    footer: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*used for the q-footer model*/
    footerModel: {
        required: false,
    },

    /*make footer stick to the bottom*/
    footerSticky: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*q-footer props proxy object*/
    footerProxy: {
        required: false,
        type: Object,
        default: {},
    },





    /* DRAWER OPTIONS ||  DRAWER OPTIONS ||  DRAWER OPTIONS*/
    /* DRAWER OPTIONS ||  DRAWER OPTIONS ||  DRAWER OPTIONS*/
    /* DRAWER OPTIONS ||  DRAWER OPTIONS ||  DRAWER OPTIONS*/
    leftDrawer: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*used for the q-drawer model*/
    leftDrawerModel: {
        required: false,
    },

    /*q-drawer props proxy object*/
    leftDrawerProxy: {
        required: false,
        type: Object,
        default: {},
    },

    leftDrawerTabs: {
        required: false,
        default: false/*[
            {
                name: 'home',
                icon: 'home',
                label: "saraza label",
            },
            {
                name: 'domain',
                icon: 'call',
            }
        ]*/
    },

    leftDrawerTabsModel: {
        required: false,
        type: String,
        default: 'home'
    },

    leftDrawerTabsProxy: {
        required: false,
        type: Object,
        default: {}
    },

    rightDrawer: {
        required: false,
        type: Boolean,
        default: false,
    },

    /*used for the q-drawer model*/
    rightDrawerModel: {
        required: false,
    },

    /*q-drawer props proxy object*/
    rightDrawerProxy: {
        required: false,
        type: Object,
        default: {},
    },

    rightDrawerTabs: {
        required: false,
        default: false
    },



    debugPage: {
        required: false,
        type: Boolean,
        default: false,
    }
}

const $_PAGE_EMITS = [
    //header events
    'update:headerModel',

    //footer events
    'update:footerModel',

    //drawer events
    'update:leftDrawerModel',
    'update:rightDrawerModel',

    'update:leftDrawerTabsModel',

    'resize:content'
]

const $_COMPONENT = defineComponent({
    name: 'cimpl-page',
    tagname: 'cimpl-page',

    emits: [...$_PAGE_EMITS],

    props: {
        ...$_CIMPL_PAGE_COMPONENT_PROPS
    },

    components: {
        CImplPageHeader
    },

    watch: {
        /*header related watchs*//*header related watchs*/
        /*header related watchs*//*header related watchs*/
        /*header related watchs*//*header related watchs*/
        headerModel (newValue, oldValue) {
            this.innerHeaderModel = newValue
        },


        /*footer related watchs*//*footer related watchs*/
        /*footer related watchs*//*footer related watchs*/
        /*footer related watchs*//*footer related watchs*/
        footerModel (newValue, oldValue) {
            this.innerFooterModel = newValue
        },

        /*drawer related watchs*//*drawer related watchs*/
        /*footer related watchs*//*drawer related watchs*/
        /*footer related watchs*//*drawer related watchs*/
        leftDrawerModel (newValue, oldValue) {
            this.innerLeftDrawerModel = newValue
        },
        rightDrawerModel (newValue, oldValue) {
            this.innerRightDrawerModel = newValue
        },
        leftDrawerTabsModel (newValue, oldValue) {
            this.innerLeftDrawerTabsModel = newValue
        },
    },

    setup ($props) {

        const _cimpl_app_ = inject('_cimpl_app_', {
            optics: {}
        })

        let setupData = {
            _cimpl_app_,

            /*HEADER RELATED SETUP || HEADER RELATED SETUP || HEADER RELATED SETUP*/
            innerHeaderModel: ref($props.headerModel === false ? false : true),
            headerDimensions: ref({ width: 0, height: 0 }),

            /*FOOTER RELATED SETUP || FOOTER RELATED SETUP || FOOTER RELATED SETUP*/
            innerFooterModel: ref($props.footerModel === true ? true : false),
            footerDimensions: ref({ width: 0, height: 0 }),

            contentHeight: ref(undefined),
            visibleContentHeight: ref(undefined),
            contentPadding: ref({
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,

                horizontal: 0,
                vertical: 0
            }),
            styleMutationObserver: ref(null),

            /*DRAWER RELATED SETUP || DRAWER RELATED SETUP || DRAWER RELATED SETUP*/
            leftDrawerTabsHeight: ref(undefined),
            innerLeftDrawerModel: ref($props.leftDrawerModel === true ? true : false),
            innerRightDrawerModel: ref($props.rightDrawerModel === true ? true : false),

            innerLeftDrawerTabsModel: ref($props.leftDrawerTabsModel != undefined ? '' + $props.leftDrawerTabsModel : ''),
            innerLeftDrawerTabsMap: ref(''),
            //headerOptions: ref({}),
            //footerOptions: ref({}),

            pageContainerDimensions: ref({ width: 0, height: 0 })
        }

        return setupData
    },

    data () {
        let dataObject = {
        }
        return dataObject
    },

    computed: {
        /*return self component instance*/
        instance () { return this },



        contentStyleParsed () {
            /*
            const innerLayout = this.$store.getters.mainLayoutInstance
            const viewHeight = typeof innerLayout !== 'string' ? innerLayout.contentAreaDimensions.height : 0
            */
            const viewHeight = _.get(this._cimpl_app_, 'optics.main.dimensions.height', 0)
            var styles = {
                minHeight: this.fullHeight ? `${viewHeight - this.contentPadding.vertical}px` : 'auto',
                //border: '10px solid red'
                //minHeight: '300px',
                //background: 'red'
            }

            if (typeof this.contentStyle === 'object') _.merge(styles, this.contentStyle)
            else {
                const spl = this.contentStyle.split(';')
                for (const x in spl) {
                    const rule = spl[x].split(':')
                    if (rule[0].trim() !== '' && rule[1].trim() !== '')
                        styles[rule[0].trim()] = rule[1].trim()
                }
            }

            return styles
        },

        pageClassess () {
            let result = [
                'flex',
                'fit',
                'cimpl-page',
                `bg-${this.background}`,
                this.header === true ? 'has-header' : undefined,
                this.headerSticky === true ? 'sticky-header' : undefined,
                this.footer === true ? 'has-footer' : undefined,
                this.footerModel ? 'footer-visible' : undefined,
                this.footerSticky === true ? 'sticky-footer' : undefined,
                this.leftDrawerTabs !== false ? 'has-left-drawer-tabs' : undefined,
                this.rightDrawerTabs !== false ? 'has-right-drawer-tabs' : undefined
            ]
            return result
        },

        /*HEADER COMPUTED || HEADER COMPUTED || HEADER COMPUTED*/
        /*HEADER COMPUTED || HEADER COMPUTED || HEADER COMPUTED*/
        /*HEADER COMPUTED || HEADER COMPUTED || HEADER COMPUTED*/
        /*return the final parsed proxy for cimpl-page-header*/
        headerProxyParsed () {
            let proxy = {
                title: this.title,
                caption: this.caption,
                icon: this.icon
            }
            for (const x in this.headerProxy)
                proxy[x] = this.headerProxy[x]
            return proxy
        },

        /*get the list of injected header slots in the format 'header:[slot]'*/
        headerSlots () {
            return getComponentSlots(this.$slots, 'header:')
        },



        /*FOOTER COMPUTED || FOOTER COMPUTED || FOOTER COMPUTED*/
        /*HEADER COMPUTED || FOOTER COMPUTED || FOOTER COMPUTED*/
        /*FOOTER COMPUTED || FOOTER COMPUTED || FOOTER COMPUTED*/
        /*return the final parsed proxy for q-footer*/
        footerProxyParsed () {
            let proxy = {
            }
            for (const x in this.footerProxy)
                proxy[x] = this.footerProxy[x]
            return proxy
        },

        /*get the list of injected footer slots in the format 'header:[slot]'*/
        footerSlots () {
            return getComponentSlots(this.$slots, 'footer:')
        },

        /*DRAWER COMPUTED || DRAWER COMPUTED || DRAWER COMPUTED*/
        /*HEADER COMPUTED || FOOTER COMPUTED || DRAWER COMPUTED*/
        /*DRAWER COMPUTED || DRAWER COMPUTED || DRAWER COMPUTED*/
        /*return the final parsed proxy for q-drawer*/
        leftDrawerProxyParsed () {
            let proxy = {
            }

            if (this.leftDrawerTabs !== false) _.merge(proxy, {
                width: 200,
                class: 'bg-grey-2'
            })

            for (const x in this.leftDrawerProxy)
                proxy[x] = this.leftDrawerProxy[x]

            return proxy
        },

        /*return the final parsed proxy for q-drawer*/
        rightDrawerProxyParsed () {
            let proxy = {
            }
            for (const x in this.rightDrawerProxy)
                proxy[x] = this.rightDrawerProxy[x]
            return proxy
        },


        leftDrawerTabsProxyParsed () {
            let proxy = {
                vertical: true,
            }

            for (const x in this.leftDrawerTabsProxy)
                proxy[x] = this.leftDrawerTabsProxy[x]

            return proxy
        },

        leftDrawerTabsParsed () {
            const tabs = {}
            const referenceTabs = this.leftDrawerTabs
            return this.parseTabs(referenceTabs)
        },












        viewDefinition () {
            /*let view = `h${this.headerOptions.sticky ? 'H' : 'h'}h lpr f${this.footerOptions.sticky ? 'F' : 'f'}f`
            switch (typeof this.layoutView) {
                case 'string':
                    view = this.layoutView
                    break

                case 'object':
                    break
            }
            if (typeof this.layoutView === 'string')

                let top = [
                    'h',
                    this.headerOptions.sticky ? 'H' : 'h',
                    'h'
                ]
            let middle = ['l', 'p', 'r']
            let bottom = ['f', this.footerOptions.sticky ? 'F' : 'f', 'f']*/
            const view = CIMPL_PAGE_parseLayoutViewProp(this.layoutView, undefined, this.headerSticky, this.footerSticky)
            return `${view.top.join('')} ${view.middle.join('')} ${view.bottom.join('')}`
        },

        layoutStyles () {
            //console.log("cimpl-page chequear esta parte de layoutStyles")
            const viewHeight = _.get(this._cimpl_app_, 'optics.main.dimensions.height', 0)
            //console.log("LAYOUT STILES?", viewHeight)
            //console.log(this._cimpl_app_)
            const contHeight = this.pageContainerDimensions.height
            const resultHeight = contHeight < viewHeight ? (this.fullHeight ? viewHeight : contHeight) : viewHeight
            return {
                height: `${resultHeight}px`
            }
            //return { height: '500px' }
        },

        mainScrollAreaStyles () {
            const ctx = this
            const minus = (ctx.innerHeaderModel ? ctx.headerDimensions.height : 0) + (ctx.innerFooterModel ? ctx.footerDimensions.height : 0)
            const view = ctx.$melon.getViewComponentFromSource(ctx)
            var styles = {
                height: view ? `${view.$el.getBoundingClientRect().height - minus}px` : 0
            }
            const innerLayout = this.$store.getters.mainLayoutInstance

            const viewHeight = typeof innerLayout !== 'string' ? innerLayout.contentAreaDimensions.height : 0
            styles = {
                // 'height': this.pageContainerDimensions.height + 'px',
                // height: '100%'
                //height: (this.$store.getters.appInstance.$refs.innerLayout.scrollHeight ) + 'px'
                //height: '100%',
                height: `${viewHeight}px`,
                //minHeight: '100px'
                //height: '100vh'
            }


            return styles
        }
    },

    methods: {

        onPageContainerStyleMutation (mutations) {
            const ctx = this

            setTimeout(() => {
                //console.log("cimpl-page STYLE MUTATION", mutations, ctx.$refs.qPageContainer.$el)
                var paddingTop = parseInt(getStyle(ctx.$refs.qPageContainer.$el, 'paddingTop'))
                var paddingLeft = parseInt(getStyle(ctx.$refs.qPageContainer.$el, 'paddingLeft'))
                var paddingRight = parseInt(getStyle(ctx.$refs.qPageContainer.$el, 'paddingRight'))
                var paddingBottom = parseInt(getStyle(ctx.$refs.qPageContainer.$el, 'paddingBottom'))
                if (isNaN(paddingTop)) paddingTop = 0
                if (isNaN(paddingLeft)) paddingLeft = 0
                if (isNaN(paddingRight)) paddingRight = 0
                if (isNaN(paddingBottom)) paddingBottom = 0

                ctx.contentPadding = {
                    top: paddingTop,
                    right: paddingRight,
                    bottom: paddingBottom,
                    left: paddingLeft,

                    horizontal: paddingLeft + paddingRight,
                    vertical: paddingTop + paddingBottom
                }

                //console.log("-- fin, contentPadding?", ctx.contentPadding)
            }, 100)
        },

        flashRoute () {
            const ret = {
                ...this.$route,
                /*...{
                    component: 'foo'
                }*/
            }
            return ret
        },

        /*HEADER RELATED METHODS || HEADER RELATED METHODS || HEADER RELATED METHODS*/
        /*HEADER RELATED METHODS || HEADER RELATED METHODS || HEADER RELATED METHODS*/
        /*HEADER RELATED METHODS || HEADER RELATED METHODS || HEADER RELATED METHODS*/
        /*toggle true/false the model*/
        toggleHeaderModel (newValue) {
            //console.log("TOGGLE HEADER MODEL")
            if (newValue === undefined) newValue = !(this.headerModel === undefined ? false : this.headerModel)
            this.$emit('update:headerModel', newValue)
        },



        /*FOOTER RELATED METHODS || FOOTER RELATED METHODS || FOOTER RELATED METHODS*/
        /*FOOTER RELATED METHODS || FOOTER RELATED METHODS || FOOTER RELATED METHODS*/
        /*FOOTER RELATED METHODS || FOOTER RELATED METHODS || FOOTER RELATED METHODS*/
        /*toggle true/false the model*/
        toggleFooterModel (newValue) {
            //console.log("TOGGLE FOOTER MODEL")
            if (newValue === undefined) newValue = !(this.footerModel === undefined ? false : this.footerModel)
            this.$emit('update:footerModel', newValue)
        },

        /*DRAWER RELATED METHODS || DRAWER RELATED METHODS || DRAWER RELATED METHODS*/
        /*DRAWER RELATED METHODS || DRAWER RELATED METHODS || DRAWER RELATED METHODS*/
        /*DRAWER RELATED METHODS || DRAWER RELATED METHODS || DRAWER RELATED METHODS*/
        /*toggle true/false the model*/
        toggleLeftDrawerModel (newValue) {
            //console.log("PAGE TOGGLE LEFT DRAWER MODEL", this)
            if (newValue === undefined) newValue = !(this.leftDrawerModel === undefined ? false : this.leftDrawerModel)
            this.$emit('update:leftDrawerModel', newValue)
            //console.log("-- FIN")
        },

        leftDrawerTabsTriggerOverview (map) {
            //console.log("--- TABBED trigger overview",map)
            //console.log("TAB TRIGGER OVERVIEW", map, this.leftDrawerTabsRelated)
            this.$emit('update:leftdrawer:tabs:trigger:overview', map)
            /*const overview = "___overview"
            if (map.trim() === '') this.$emit('update:modelValue', overview)
            else {
                var temp = map.split('.controller.schema')
                temp.pop()
                const entry = _.get(this.entry.schemaEntry.controller.schema, temp.join(".controller.schema"))
                if (entry)
                    this.context.getBindedEntry(entry.entry_uid).then(compo => compo.$refs.component.tabChanged(overview))
            }*/
        },


        toggleRightDrawerModel (newValue) {
            //console.log("TOGGLE RIGHT DRAWER MODEL")
            if (newValue === undefined) newValue = !(this.rightDrawerModel === undefined ? false : this.rightDrawerModel)
            this.$emit('update:rightDrawerModel', newValue)
        },






        /*parseHeaderProps () {
            let headerOptions = {
                sticky: true,
                proxy: {},
            }
         
            switch (typeof this.$props.header) {
                case 'object':
                    headerOptions = _.merge({}, headerOptions, this.$props.header)
                    break
         
                case 'boolean':
                    if (this.$props.header === false) headerOptions = false
                    break
            }
         
            this.headerOptions = headerOptions
            return headerOptions
        },*/

        /*parseHeaderProp () {
            let newOptions = CIMPL_PAGE_parseHeaderProp(this.$props.header)
            this.headerOptions = newOptions
            return newOptions
        },
        
        parseFooterProp () {
            //alert("PAGE PARSE FOOTER PROP")
            let newOptions = CIMPL_PAGE_parseFooterProp(this.$props.footer)
            this.footerOptions = newOptions
            return newOptions
        },*/

        onWindowResize () {
            /*const viewCompo = $melon.getViewComponentFromSource(this)
            const viewHeight = viewCompo.$el.getBoundingClientRect().height
            this.visibleContentHeight = viewHeight
        
            const pageContent = this.$refs.pageContent
            this.contentHeight = pageContent.getBoundingClientRect().height
        
            console.log("ON WINDOW RESIZE PAGE CONTENT HEIGHT")
        
            if (this.$refs.leftDrawerTabsComponent !== undefined) {
                console.log("ESTOS SON LOS TABS")
                const leftTabsNode = this.$refs.leftDrawerTabsComponent.$el
                console.log(leftTabsNode)
                leftTabsNode.style.height = "auto"
                this.leftDrawerTabsHeight = this.$refs.leftDrawerTabsComponent.$el.getBoundingClientRect().height
            }*/
        },



        drawerStyle_FN (drawer) {
            //console.log("SARAZA")
            return {
                //borderLeft: '10px solid red',
                overflow: 'unset',
                //top: 0,
            }
        },

        drawerTabsStyle_FN (drawer) {
            let styles = {}
            const viewCompo = $melon.getViewComponentFromSource(this)
            const viewHeight = viewCompo.$el.getBoundingClientRect().height
            let visibleContentHeight = viewHeight

            const pageContent = this.$refs.pageContent
            //pageContent.style.minHeight = "unset"
            //const contentHeight = pageContent.getBoundingClientRect().height
            //console.log("pageContent height", pageContent.getBoundingClientRect().height)

            //console.log("viewcompo height", viewCompo.$el.getBoundingClientRect().height)
            if (this.$refs.header?.$el) {
                const headerHeight = this.$refs.header.$el.getBoundingClientRect().height
                styles.top = `${headerHeight}px`
                visibleContentHeight -= this.$refs.header.$el.getBoundingClientRect().height
            }

            //styles.minHeight = `${visibleContentHeight}px`
            //styles.maxHeight = `${visibleContentHeight}px`
            styles.height = `${visibleContentHeight}px`

            /*const drawerTabsRef = `${drawer}DrawerTabsComponent`
            if (this.$refs[drawerTabsRef] !== undefined) {
                this.$refs[drawerTabsRef].$el.style.maxHeight = visibleContentHeight
                this.$refs[drawerTabsRef].$el.style.minHeight = visibleContentHeight
            }*/
            //pageContent.style.minHeight = visibleContentHeight
            //console.log("styles?", styles)
            return styles
        },

        pageContentsStyle_FN (drawer) {
            const viewHeight = _.get(this._cimpl_app_, 'optics.main.dimensions.height', 0)
            /*const innerLayout = this.$store.getters.mainLayoutInstance
            //console.log("INNER LAYOUT", innerLayout)
            
            const viewHeight = typeof innerLayout !== 'string' ? innerLayout.contentAreaDimensions.height : 0*/
            var styles = {
                minHeight: `${viewHeight - this.contentPadding.vertical}px`,
            }

            //console.log("-- cimpl-page pageContentsStyle_FN", styles)

            return styles
            /*console.log("cimpl-page chequear esta parte de pageContentsStyle_FN")
            return {
                minHeight: '500px'
            }*/
        },

        __pageContentsStyle_FN (drawer) {
            let styles = {}
            const saraza = true
            if (saraza) return styles
            const viewCompo = $melon.getViewComponentFromSource(this)
            if (!viewCompo) return
            const viewHeight = viewCompo.$el.getBoundingClientRect().height
            let visibleContentHeight = viewHeight

            //console.log("pagecontent styles viewcompo height", viewHeight)
            if (this.$refs.header?.$el) {
                const headerHeight = this.$refs.header.$el.getBoundingClientRect().height
                //console.log("header height", headerHeight)
                visibleContentHeight -= this.$refs.header.$el.getBoundingClientRect().height
            }
            //console.log("visible content height", visibleContentHeight)
            //styles.minHeight = `${visibleContentHeight}px`
            //styles.maxHeight = `${visibleContentHeight}px`
            styles.minHeight = `${visibleContentHeight}px !important`
            //styles.border = "1px solid red"

            /*const drawerTabsRef = `${drawer}DrawerTabsComponent`
            if (this.$refs[drawerTabsRef] !== undefined) {
                this.$refs[drawerTabsRef].$el.style.maxHeight = visibleContentHeight
                this.$refs[drawerTabsRef].$el.style.minHeight = visibleContentHeight
            }*/
            //pageContent.style.minHeight = visibleContentHeight
            //console.log("pageContentsStyle_FN styles?", styles)
            return styles
        },

        drawerTabDataProxy (tabData, tabName) {
        },

        onResizeHeader (dimensions) {
            this.headerDimensions = dimensions
        },

        onResizeFooter (dimensions) {
            this.footerDimensions = dimensions
        },

        onResizePageContainer (dimensions) {
            //console.log("on resize page container")
            this.pageContainerDimensions = dimensions
            this.$emit('resize:content', dimensions)
        },

        scrollTo (position, opts) {
            const el = this.$refs.pageLayout.$el.querySelector('.scroll')
            if (!el) return false

            if (opts === false) opts = { animate: false }

            opts = _.merge({}, {
                animate: true,
                animation_options: {
                    behavior: 'smooth'
                }
            }, opts !== undefined ? opts : {})

            //console.log("SCROLL TO", position, opts)

            if (position === false || position === undefined) position = 0
            if (position === true) position = el.scrollHeight
            if (opts.animate) el.scroll({
                top: position,
                ...opts.animation_options
            })
        },

        parseTabs (sourceTabs) {
            var tabs = {}
            for (const x in sourceTabs) {
                if (sourceTabs[x] === undefined) continue
                let tab = _.merge({}, $_TAB_DEFAULTS, plain_copy(sourceTabs[x]))
                delete tab.children
                tabs[sourceTabs[x].name] = tab
            }
            //console.log("COMPUTED TABS RESULT",tabs)
            return tabs
        }
    },

    mounted () {
        window.addEventListener('resize', this.onWindowResize)
        this.onWindowResize()

        this.styleMutationObserver = new MutationObserver(this.onPageContainerStyleMutation)
        var target = this.$refs.qPageContainer.$el
        this.styleMutationObserver.observe(target, { attributes: true, attributeFilter: ['style'] })

        window.addEventListener("resize", this.onPageContainerStyleMutation)

        this.onPageContainerStyleMutation()
    },

    beforeUnmount () {
        window.removeEventListener('resize', this.onWindowResize)

        window.removeEventListener("resize", this.onPageContainerStyleMutation)
        this.styleMutationObserver.disconnect()
        //alert("BEFORE UNMOUNT DE CIMPL PAGE")
    }

    //beforeMount () {
    /*watch(() => this.$props.header, () => this.parseHeaderProp, { deep: true })
    this.parseHeaderProp()*/

    /*watch(() => this.$props.footer, (newValue) => {
        //alert("FOOTER PROP CHANGED WATCH")
        this.parseFooterProp()
    }, { deep: true })
    this.parseFooterProp()*/
    //}
})

export default $_COMPONENT

export { $_COMPONENT, $_CIMPL_PAGE_COMPONENT_PROPS, $_PAGE_EMITS }
