<template>
  <!--{{type}}<br />-->
  <span :class="renderValues.mainClass">
    <span
      class="cell-content-amount-unit text-weight-light"
      v-if="renderValues.unit && !col.amount_unit_after"
    >{{renderValues.unit}}</span>
    <span
      class="cell-content-amount-value"
      v-if="!col.amount_style_decimals"
    >
      {{renderValues.value.num}}
    </span>
    <span
      v-else
      class="cell-content-amount-value"
    >
      {{renderValues.value.integerPart}}<span
        :class="renderValues.decimalsClass"
        v-if="renderValues.renderDecimals"
      >.<span>{{renderValues.value.decimalPartStr}}</span></span>
    </span>

    <span
      class="cell-content-amount-unit is-after text-weight-light"
      v-if="renderValues.unit && col.amount_unit_after"
    >{{renderValues.unit}}</span>
  </span>
</template>
    
<script>
import { defineComponent, computed } from 'vue'

//import { useInjectCTable } from './../../../composables/table-provide'

/*function separateDecimal (num) {
  // Integer part
  const integerPart = Math.trunc(num); // or Math.floor(num) for non-negative numbers

  // Decimal part
  // Note: Due to floating-point precision, this may result in very small
  // inaccuracies (e.g., 0.3299999999999983 instead of 0.33).
  const decimalPart = num - integerPart

  return { integerPart, decimalPart }
}*/

function separateDecimalString (num, decimals) {
  const numString = parseFloat(num).toFixed(decimals)
  //const numString = num.toString();
  var [integerPartStr, decimalPartStr] = numString.split('.');

  if (!decimalPartStr && decimals) decimalPartStr = ''.padStart(decimals, '0')

  // Convert back to numbers if needed, or use the string representation
  const integerPart = parseInt(integerPartStr, 10);
  // The decimal part string will not include the leading "0."
  const decimalPart = decimalPartStr ? parseFloat(`0.${decimalPartStr}`) : 0;

  return { integerPartStr, decimalPartStr, integerPart, decimalPart, num };
}

export default defineComponent({
  name: 'CCellContentAmount',

  props: ['content', 'type', 'row', 'col'],

  setup (props) {
    //const { tableConfig } = useInjectCTable()

    const renderValues = computed(() => {
      console.log("|| CCellContentAmount compute renderValues")
      const strings = separateDecimalString(props.content, props.col.amount_decimals && props.type !== 'number' ? props.col.amount_decimals : 0)
      const dashDecimals = !strings.decimalPart && props.col.amount_dash_empty_decimals
      return {
        mainClass: [
          'cell-content-amount',
          props.col.amount_use_flex ? 'flex' : undefined,
          props.col.amount_use_flex ? 'row' : undefined,
        ],
        unit: props.col.amount_unit ? (typeof props.col.amount_unit === 'function' ? props.col.amount_unit(props.row, props.col) : props.col.amount_unit) : undefined,
        renderDecimals: props.type !== 'number' && (props.col.amount_empty_decimals || strings.decimalPart),
        decimalsClass: `cell-content-amount-value-decimals ${dashDecimals ? 'dash-decimals' : ''}`,
        value: strings
      }
    })

    return {
      renderValues
    }
  }
})
</script>
