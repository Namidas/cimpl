<template>
  <!--{{type}}<br />-->
  <div
    class="cell-content-date"
    :class="col.format_direction"
  >
    <span
      v-for="[key,data] in parsedContent"
      :key="key"
      :class="data.css"
    >
      <q-icon
        v-if="data.icon"
        :name="data.icon"
        class="q-pr-xs"
        style="vertical-align: text-top; top: 1px;"
      />
      {{data.value}}
      <q-tooltip v-if="data.tooltip">{{data.tooltip}}</q-tooltip>
    </span>
  </div>
</template>
    
<script>
import { defineComponent, computed } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'CCellContentDate',

  props: ['content', 'type', 'row', 'col'],

  setup (props) {
    //const { tableConfig } = useInjectCTable()

    const getFormatValues = (value, key) => {
      var css = [
        'cell-content-date',
        'items-center',
        `date-format-${key}`
      ]
      var resClass = props.col.format_class ? (typeof props.col.format_class[key] === 'function' ? props.col.format_class[key](props.row, props.col, key) : props.col.format_class[key]) : false
      if (resClass) if (typeof resClass === 'string') css.push(resClass)
      else for (const x in resClass) css.push(resClass[x])
      return {
        icon: props.col.format_icons ? (typeof props.col.format_icons[key] === 'function' ? props.col.format_icons[key](props.row, props.col, key) : props.col.format_icons[key]) : false,
        tooltip: props.col.format_tooltips ? (typeof props.col.format_tooltips[key] === 'function' ? props.col.format_tooltips[key](props.row, props.col, key) : props.col.format_tooltips[key]) : false,
        css,
        value
      }
    }

    const getParsedValue = (value, format) => {
      //console.log("getParsedValue", value, format)
      switch (typeof format) {
        case 'string':
          return date.formatDate(value, format)
          break

        case 'function':
          return format(value)
          break

        //array/object/map
        default:
          const isMap = format instanceof Map
          const iterate = isMap ? Array.from(format) : format
          const res = new Map()
          for (const x in iterate) {
            var tempRes = getParsedValue(value, isMap ? iterate[x][1] : iterate[x])
            res.set(isMap ? iterate[x][0] : x, getFormatValues(tempRes, isMap ? iterate[x][0] : x))
          }
          return res
          break
      }
    }

    const parsedContent = computed(() => {
      console.log("|| CCellContentDate compute parsedContent")
      if (!props.col.format) return (new Map()).set(0, getFormatValues(props.content, 0))
      const resTemp = getParsedValue(props.content, props.col.format)
      if (resTemp instanceof Map) return resTemp
      return (new Map()).set(0, getFormatValues(resTemp, 0))
    })

    return {
      parsedContent
    }
  }
})
</script>
