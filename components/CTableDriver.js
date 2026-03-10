import { defineComponent, reactive, watchEffect, ref, onMounted, h, watch } from 'vue'
import CTable from './CTable.vue'
import defaults from './../utils/defaults'
import { mergeReactive } from './../utils/reactive'
import { scrollToTop } from './../utils/scroll'

import _ from 'lodash'

defaults.preset('CTable.driver', {
    config: {
        endpoint: undefined, //base endpoint, to us with rel endpoints,
        get: {
            endpoint: 'get',
            rel: true, //relatve endpoint? gets concatenated with base endpoint
            method: 'get',
            //params: undefined,
            _exec: function (/*driver, page, pageSize, filters, sorting*/driver) {
                //console.log("_exec", this.get.params, driver.get.params)
                return this.call_handler.call(this, this.get.method, this.get.parsed_endpoint, this.get.params)
            }
        },

        set: {
            endpoint: 'set',
            rel: true, //relatve endpoint? gets concatenated with base endpoint
        },

        /* cosas que tendrían que estar en el default
        :rows-per-page-options="rowsPerPageOptions"
        binary-state-sort
        */


        call_handler: function (method, endpoint, params, options) {
            const handler = typeof this.handler === 'string' ? defaults.get(`CDrivers.requests.${this.handler}`, () => { }) : this.handler
            //console.log("handler?", handler)
            return handler.exec.call(this, method, endpoint, params, options)
        },
    },

    create: (def, handler, page, pageSize, filters, sorting) => {
        //base driver definition
        var driver = reactive({})
        watchEffect(() => {
            mergeReactive(driver, defaults.get('CTable.driver.config'))
            if (def !== undefined) {
                if (typeof def === 'string') return mergeReactive(driver, { endpoint: def })
                else mergeReactive(driver, def)
            }
        })

        //parse get endpoint
        watchEffect(() => {
            driver.get.parsed_endpoint = `${driver.get.rel ? driver.endpoint : ''}${driver.get.endpoint}`
        })

        //parse params
        driver.get.params = reactive({})
        watchEffect(() => { if (driver.get.params.page !== page.value) driver.get.params.page = page.value; })
        watchEffect(() => { if (driver.get.params.pageSize !== pageSize.value) driver.get.params.pageSize = pageSize.value })
        watchEffect(() => {
            if (Object.keys(filters.value).length) {
                driver.get.params.filters = {}
                for (const x in filters.value) {
                    const trimmed = filters.value[x].trim()
                    if (trimmed === '') continue
                    const splitted = trimmed.split(',')
                    _.set(driver.get.params, `filters.${x}`, splitted.length > 1 ? splitted.map((it) => it.trim()) : trimmed)
                }
            }
            else delete driver.get.params.filters
        })

        //wrap exec
        driver.get.exec = function () {
            return driver.get._exec.apply(driver, [driver])
        }

        /*if (prodTable.value) {
            const map = prodTable.value.sortMap()
            //if (map.size) params.sort = new URLSearchParams(map)
            if (map.size) params.sort = Object.fromEntries(map)
        }*/
        //return params

        driver.handler = handler

        return driver
    }
})

export default defineComponent({
    name: 'CTableDriver',

    props: ['def', 'handler'],

    setup (props, { attrs, slots, expose }) {

        const page = ref(1)
        const pageSize = ref(10)
        const totalRows = ref(0)
        const tableFilters = ref({})
        const tableSorting = ref({})
        const loading = ref(false)
        const rows = ref([])

        const driver = defaults.get('CTable.driver.create')(props.def, props.handler, page, pageSize, tableFilters, tableSorting)

        const onRequest = async (request) => {
            console.log("TABLE REQUEST", request)
            loading.value = true
            scrollToTop()
            const doExec = () => {
                driver.get.exec().then((response) => {
                    page.value = response.data.current_page
                    pageSize.value = response.data.per_page
                    totalRows.value = response.data.total
                    loading.value = false

                    tableProps.pagination.page = page.value
                    tableProps.pagination.rowsPerPage = pageSize.value
                    tableProps.pagination.rowsNumber = totalRows.value
                /*if (infinite) {
                    products.value.push.apply(products.value, response.data.data)
                    done()
                }
                else*/ rows.value = response.data.data
                    //tableProps.pagination = response.data
                    //delete tableProps.pagination.data
                }).catch((error) => {
                    console.log("ERROR CARGANDO")
                    console.log(error)
                    loading.value = false
                })/*.finally(() => loading.value = false)*/
            }

            if (request) {
                //console.log(`PRE CAMBIAR PAGE DESDE REQUEST: ${page.value} > ${request.pagination.page}`)
                watch(driver.get.params, () => {
                    console.log("se dispara el watcher para el exec")
                    doExec()
                }, { once: true })
                page.value = request.pagination.page
                pageSize.value = request.pagination.rowsPerPage
                //watchEffect(() => console.log("watch effect del driver", driver.get.params))
            }
            else doExec()
            //loadProductPage(undefined, this.queryParams)
        }

        const onUpdate = () => {

        }

        const tableRef = ref(null)
        const tableProps = reactive({
            ref: tableRef,
            rows: undefined,
            pagination: {
                rowsNumber: 0,
                page: 1,
                rowsPerPage: 10
            },
            //'onUpdate:pagination': (payload) => mergeReactive(tableProps.pagination, payload),
            loading: undefined,
            filters: undefined,
            'onUpdate:filters': (payload) => mergeReactive(tableFilters.value, payload),
            sorting: undefined,
            'onUpdate:sorting': (payload) => mergeReactive(tableSorting.value, payload),
            onRequest: onRequest,
            'onUpdate:cell': onUpdate
        })

        //watchEffect(() => tableProps.pagination.page = page.value)
        //watchEffect(() => tableProps.pagination.rowsPerPage = pageSize.value)
        //watchEffect(() => tableProps.pagination.rowsNumber = totalRows.value)

        //watch for changes on fallthrough attrs
        watchEffect(() => {
            for (const x in attrs)
                if (tableProps[x] !== attrs[x])
                    tableProps[x] = attrs[x]
        })

        //watch for row changes
        watchEffect(() => {
            tableProps.rows = rows.value
        })

        //watch for loading state
        watchEffect(() => {
            console.log("watchEffect loading")
            tableProps.loading = loading.value
        })

        //watch for filters changes
        watchEffect(() => {
            tableProps.filters = tableFilters.value
        })

        //watch for sorting changes
        watchEffect(() => {
            tableProps.sorting = tableSorting.value
        })

        onMounted(onRequest)

        //console.log("TABLE PROPS", tableProps)

        expose({
            setLoading: value => loading.value = value
        })

        const render = () => {
            return h(CTable, tableProps, slots)
        }

        return render
    }
})