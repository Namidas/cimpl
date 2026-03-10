<template>
  <div
    class="c-table-tool row items-center"
    v-if="renderAs === 'button'"
  >
    <span class="text-caption q-pr-sm">_view: </span>

    <q-btn
      :icon="currentView.icon"
      flat
      padding="xs"
      size="sm"
      v-if="renderViews"
    >
      <q-tooltip>_change view</q-tooltip>
      <ItemsMenu
        :current-item="currentView"
        :items="views"
        :handler="changeView"
      />
    </q-btn>

    <q-separator
      vertical
      class="q-mx-xs"
      v-if="renderViewStyles"
    />

    <q-btn
      :icon="currentViewStyle.icon"
      flat
      padding="xs"
      size="sm"
      v-if="renderViewStyles"
    >
      <q-tooltip>_change view style</q-tooltip>
      <ItemsMenu
        :current-item="currentViewStyle"
        :items="viewStyles"
        :handler="changeViewStyle"
      />
    </q-btn>
  </div>
  <div v-else>
    <q-item
      clickable
      v-if="renderViews"
    >
      <q-item-section avatar>
        <q-icon
          :name="currentView.icon"
          size="xs"
        />
      </q-item-section>
      <q-item-section>_change view</q-item-section>
      <q-item-section side>
        <q-icon name="keyboard_arrow_right" />
      </q-item-section>
      <ItemsMenu
        :current-item="currentView"
        :items="views"
        :handler="changeView"
      />
    </q-item>
    <q-item
      clickable
      v-if="renderViewStyles"
    >
      <q-item-section avatar>
        <q-icon
          :name="currentViewStyle.icon"
          size="xs"
        />
      </q-item-section>
      <q-item-section>_change view style</q-item-section>
      <q-item-section side>
        <q-icon name="keyboard_arrow_right" />
      </q-item-section>
      <ItemsMenu
        :current-item="currentViewStyle"
        :items="viewStyles"
        :handler="changeViewStyle"
      />
    </q-item>
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useCTable } from './../../composables'
import ItemsMenu from './view-menu.vue'

export default defineComponent({
  props: {
    renderAs: undefined,
    def: undefined
  },

  components: {
    ItemsMenu
  },

  setup (props) {
    const CTable = useCTable()
    //console.log("VIEW TOOL", CTable)

    const renderViews = computed(() => CTable.availableViews.value.length > 1)
    const renderViewStyles = computed(() => CTable.availableViewStyles.value.length > 1)

    const changeView = (payload) => {
      CTable.childEmit('update:view-type', payload)
    }

    const changeViewStyle = (payload) => {
      CTable.childEmit('update:view-style', payload)
    }

    return {
      renderViews,
      currentView: CTable.currentView,
      views: CTable.availableViews,
      changeView,

      renderViewStyles,
      currentViewStyle: CTable.currentViewStyle,
      viewStyles: CTable.availableViewStyles,
      changeViewStyle
    }
  },
})
</script>
