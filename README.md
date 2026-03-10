# Common Implementations, or cimpl for short (pun very much intended)
High performant, everything first vue3 framework: components, drivers, utils and even a web kernel for the new age of webapps. It's simple, it's *cimpl*.

## Important note
Currently rewriting and refactoring most of the components, although their legacy versions are still there. Only currently documented components on this readme should be taken into account.

## using with Quasar CLI
To avoid problems injecting Quasar SCSS, you'll need to manually edit package @quasar/vite-plugin/src/plugin.js
Look for ```if (is.style(scssMatcher) === true)``` and just add this code:

```
//console.log(`--- transforming: ${id}`)
if (/^(?!(D:\/apps_src\/cimpl\/vue3\/quasar2\/0\.9)).*\.scss/.test(id)) {
   //console.log(`NON CIMPL: ${id}`)
}
else {
   //console.log("CIMPL FILE IGNORE", id)
   return src
}
```

You'll have to do this everytime you modify your project (yarn add, remove, link, etc)

## Components
Check each component main file for detailed documentation on how the component works, specially available props.
### CTable (requires QTable)
Tables component, hardcore extension of Quasar's QTable.
### CTableDriver (requires QTable)
Driving component for CTable.
### CCircularTimedProgress / CLinearTimedProgress (requires QCircularProgress / QLinearProgress)
Progress indicator components, extends Quasar's circular and linear progress components. 
If you are using Quasar progress indicators to show time values, then you've found yourself coding the clock logic over and over again...well, no more, these components do that for you automatically and then some more.
