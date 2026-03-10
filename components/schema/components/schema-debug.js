/*eslint-disable*/
import { defineComponent, h, unref, computed } from 'vue'
import _ from 'lodash'
import { ssrRenderPreloadTag } from 'quasar/wrappers'
//import useDraggableEntries from './composables/draggable.js'
//import CimplSchemaEntry from './entry.js'

const CimplSchemaDebug = defineComponent({

  name: 'cimpl-schema-debug',
  tagname: 'cimpl-schema-debug',

  props: {
    schema: {
      required: true
    }
  },

  render()
  {
    function createChildren(source,target)
    {
      //console.log("create children")
      if(_.get(source,'children',[].length))
        for(const x in source.children)
        {
          const child = source.children[x]
          //console.log("current child",child)
          //let childNodeChildren = [`${child.type}: ${child.name} / ${child.entry_uid}`]
          let childNodeChildren = [h('b',child.type),`: ${child.name} / ${child.entry_uid}`]
          console.log("agrego",`${child.name} / ${child.entry_uid}`)
          if(_.get(child,'children',[].length))
          {
            var subsub = []
            createChildren(child,subsub)
            childNodeChildren.push(h('ul',{class: 'cimpl-schema-debug-list full-width sub'},subsub))
          }
          target.push(h('li',{class: 'cimpl-schema-debug-entry'},childNodeChildren))
        }

      return target
    }
    var children = []
    const base = this.schema
    createChildren(base,children)
    console.log("children final?",children)
    return h('div',{class: 'cimpl-schema-debug full-width'},[
      h('h6',{class:"cimpl-schema-debug-title", style: 'margin: 0;'},'debug schema'),
      h('ul',{class: 'cimpl-schema-debug-list main full-width'},children)
    ])
  }

})

export default CimplSchemaDebug