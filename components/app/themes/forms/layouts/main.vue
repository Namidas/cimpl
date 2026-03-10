<template>
  <q-layout view="lHh Lpr lFf">
    <CompoWrapper
      :is="theme.getCacheDef(['components','header'])"
      @toggle-left-drawer="toggleLeftDrawer"
    />

    <CompoWrapper
      :is="theme.getCacheDef(['components','leftDrawer'])"
      :left-drawer-open="leftDrawerOpen"
      :links-list="linksList"
      @update:left-drawer-open="(newValue) => leftDrawerOpen = newValue"
    />

    <q-page-container ref="layoutPageContainer">
      <!--<router-view />-->
      <PageCompo
        name="test-page"
        title="Test page"
        caption="This is the caption for the test page"
      >
        <h1>HOLA</h1>
        <pre>FROM MAIN LAYOUT:
contentPadding: {{contentPadding}}

contentAreaDimensions: {{contentAreaDimensions}}</pre>
      </PageCompo>
    </q-page-container>
  </q-layout>
</template>

<script>
/*eslint-disable*/

import { defineComponent, ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useThemesStore } from './../../../../../stores/themes'
import { useAppInstanceStore } from './../../../../../stores/appInstance'

import PageCompo from './../../../../cimpl-page.vue'
//import DomainPick from 'components/cimpl/bootstrap/domainpick-dialog.vue'
//import CimplApp from 'cimpl/components/cimpl-app.vue'

import useMainLayoutComposables from './../../../composables/mainLayout'

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
    EssentialLink,
    //DomainPick,
    //CimplApp
    PageCompo
  },

  setup () {
    const leftDrawerOpen = ref(false)

    const appInstanceStore = useAppInstanceStore()

    //const app = inject('_cimpl_app_', {})
    const {
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
    } = useMainLayoutComposables(appInstanceStore)

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
      contentAreaDimensions,

      //_cimpl_app_,
      theme: computed(() => useThemesStore().get()),
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      domainPickVisible: ref(true)
    }
  },

  beforeUnmount () {
    this.beforeUnmountListenStyleMutation()
  },

  mounted () {
    this.mountedListenStyleMutation()
  }
})
</script>