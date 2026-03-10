# using with Quasar CLI
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