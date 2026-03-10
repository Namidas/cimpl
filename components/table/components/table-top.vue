<template>
  <div class="full-width row">
    <div
      class="q-table__control"
      v-if="title"
    >
      <div class="q-table__title">{{title}}</div>
    </div>
    <q-space />
    <CTableTools
      v-if="tools"
      :tools="tools"
      :buttons="toolsNum"
    />
  </div>
  <!--
  h('div', { class: "col-2 q-table__title" }, props.title),
  h(QSpace),
  availableViews.value.length > 1 || availableViewStyles.value.length > 1 ? h(CTableTools, {
  views: availableViews.value,
  viewStyles: availableViewStyles.value,
  currentView: currentView.value,
  currentViewStyle: currentViewStyle.value,
  'onUpdate:view-type': (payload) => {
  if (currentView.value.name === payload.name) return
  currentView.value.handler(self.value, false)
  currentView.value = payload
  currentView.value.handler(self.value, true)
  },
  'onUpdate:view-style': (payload) => {
  if (currentViewStyle.value.name === payload.name) return
  currentViewStyle.value.handler(self.value, false)
  currentViewStyle.value = payload
  currentViewStyle.value.handler(self.value, true)
  }
  }-->
</template>
<script>
import { defineComponent } from 'vue'
import CTableTools from './table-tools.vue'

export default defineComponent({
  name: 'CTableTop',

  props: {
    //the scope you'd recieve from QTable on <template #top="scope" />
    scope: {
      required: false,
      type: Object
    },

    title: {
      required: false,
      type: String
    },

    tools: {
      required: false,
      type: Array,
      default: []
    },

    toolsNum: {
      required: false,
      type: Number,
    },
  },

  components: {
    CTableTools
  }
})
</script>