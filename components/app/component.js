/*eslint-disable*/

import './styles.scss'
import { defineComponent, ref, computed, provide } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useThemesStore } from './../../stores/themes'
import { useAppInstanceStore } from './../../stores/appInstance'


const linksList = [
    {
        title: 'Docs',
        caption: 'quasar.dev',
        icon: 'school',
        link: 'https://quasar.dev',
    },
    {
        title: 'Github',
        caption: 'github.com/quasarframework',
        icon: 'code',
        link: 'https://github.com/quasarframework',
    },
    {
        title: 'Discord Chat Channel',
        caption: 'chat.quasar.dev',
        icon: 'chat',
        link: 'https://chat.quasar.dev',
    },
    {
        title: 'Forum',
        caption: 'forum.quasar.dev',
        icon: 'record_voice_over',
        link: 'https://forum.quasar.dev',
    },
    {
        title: 'Twitter',
        caption: '@quasarframework',
        icon: 'rss_feed',
        link: 'https://twitter.quasar.dev',
    },
    {
        title: 'Facebook',
        caption: '@QuasarFramework',
        icon: 'public',
        link: 'https://facebook.quasar.dev',
    },
    {
        title: 'Quasar Awesome',
        caption: 'Community Quasar projects',
        icon: 'favorite',
        link: 'https://awesome.quasar.dev',
    },
]

export default defineComponent({
    name: 'MainLayout',

    components: {
        EssentialLink
    },

    setup () {

        /*const viewDimensions = ref({})*/
        const injectApp = computed(() => {
            return {
                optics: { ...useAppInstanceStore().optics }
            }
        })
        provide('_cimpl_app_', injectApp)

        const leftDrawerOpen = ref(false)

        return {
            theme: computed(() => useThemesStore().get()),
            //themeCache: computed(() => useThemesStore().themesCache),

            linksList,
            leftDrawerOpen,
            toggleLeftDrawer () {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },

            domainPickVisible: ref(true)
        }
    },
})