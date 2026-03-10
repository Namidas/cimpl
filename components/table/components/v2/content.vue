<template>
  <div
    v-if="!noWrap"
    class="cell-content full-width ellipsis"
    ref="contentRef"
  >
    <!--<span
      class="full-width"
      style="background: #666; color: white;padding: 4px;"
    >{{renderValues.innerType !== 'compo' ? `${type} / ${renderValues.innerType}` : renderValues.innerType}}</span><br />
    <span
      class="full-width"
      style="background: #333; color: white;padding: 4px;"
    >{{renderValues.is}}</span><br />-->
    <CCellContentAmount
      :content="Cell.content"
      :col="col"
      :row="row"
      :type="type"
      v-if="renderValues.innerType === 'amount'"
    />
    <CCellContentDate
      :content="Cell.content"
      :col="col"
      :row="row"
      :type="type"
      v-else-if="renderValues.innerType === 'date'"
    />
    <component
      v-else-if="renderValues.innerType === 'compo'"
      :is="type"
      :content="Cell.content"
      :col="col"
      :row="row"
    />
    <component
      v-else
      :is="renderValues.render"
    />
  </div>
  <component
    v-else
    :is="renderValues.render"
    ref="contentRef"
  />
</template>
<script>
//style="border: 1px solid red; padding 5px;"
import { defineComponent, h, computed } from 'vue'
import { useBodyCell } from './../../composables/td-provide'
import isVueComponentDefinition from './../../../../utils/isVueComponentDefinition'

import CCellContentAmount from './content/amount.vue'
import CCellContentDate from './content/date.vue'

export default defineComponent({
  name: 'CCellContent',

  components: {
    CCellContentAmount,
    CCellContentDate
  },

  props: {
    //colName: undefined,
    //colIndex: undefined,
    row: undefined,
    col: undefined,

    type: undefined,
    content: undefined, //content to use
    scope: undefined, //scope to use with content
    noWrap: { //wether to wrap or not content on <div class='cell-content' />
      required: false,
      type: Boolean,
      default: false
    },
    slotFirst: { //change order of preference for content fetching
      required: false,
      type: Boolean,
      default: false
    }
  },

  setup (props, { slots }) {

    const { Cell, contentRef } = useBodyCell()

    //if props.scope is defined, use that, inject Cell.scope otherwise
    const inUseScope = computed(() => props.scope ? props.scope : Cell.value.scope)

    /*render whatever content is first available, in the following order...
    > prop.content (if it's a function it's called with inUseScope)
    > slots.default (calls with inUseScope)
    -------- the order of those first steps are reversed when props.slotFirst === true
    > inherited slot from CTable, called with inUseScope (in the following order of availability...)
        > [rowType]-cell-[columnName]:content
        > [rowType]-cell-[columnType]:content
        > [rowType]-cell:content
    > Inject Cell.content (by default Cell.value, by default  row[colName])

    about those two first steps..."usually" (and originally) it makes more sense to give
    precedence to slots.default...but that is slighlty "more static" than whatever you might
    be passing down through props, using any of these is an edge-case, but using both
    is an extreme edge-case...and in such an "extreme edge-case" I concluded that
    it would make more sense that rendering whatever's on props would come first,
    so you can play programatically with that at your own pace, and leave alone
    whatever you originally passed down as a slot
    */

    const renderValues = computed(() => {

      const isCompoType = isVueComponentDefinition(props.type)
      var innerType = isCompoType ? 'compo' : 'text'
      if (!isCompoType) switch (props.type) {
        case 'date':
          innerType = 'date'
          break

        case 'number':
        case 'float':
        case 'amount':
        case 'amount-int':
          innerType = 'amount'
          break
      }

      const renderOrder = [
        props.slotFirst ? 'slot' : 'prop',
        props.slotFirst ? 'prop' : 'slot',
        'inject-slot',
        'inject-content'
      ]

      var shouldRender = null
      var render = null
      for (const x in renderOrder)
        if (shouldRender !== null) break
        else switch (renderOrder[x]) {
          case 'slot':
            if (slots.default) {
              shouldRender = renderOrder[x]
              render = () => slots.default(inUseScope.value)
            }
            break

          case 'prop':
            if (props.content) {
              shouldRender = renderOrder[x]
              render = () => typeof props.content === 'function' ? props.content(inUseScope.value) : props.content
            }
            break

          case 'inject-slot':
            if (Cell.value.hasSlot) {
              shouldRender = renderOrder[x]
              render = () => Cell.value.slot(inUseScope.value)
            }
            break

          case 'inject-content':
            shouldRender = renderOrder[x]
            render = () => Cell.value.content
            break
        }

      return {
        render,
        is: shouldRender,
        innerType
        //order: renderOrder
      }
    })



    return {
      Cell,
      contentRef,
      renderValues
    }
  }
})
    </script>