/* eslint-disable */

import { ref, computed } from 'vue'
import _ from 'lodash'

export default function () {

    var nestedLVL = 0

    const debug = function()
    {
      if(this.debugEntry)
        for(const x in arguments)
          console.log(arguments[x])
    }

    const debugID = function()
    {
        this.debugGroup('debugging')
        this.debug.apply(this,arguments)
        this.debugGroupEnd()
    }

    const debugGroup = function()
    {
        if(this.debugEntry)
        {
            console.group(`${nestedLVL ? '(self) ' : ''}[${this.schemaEntry.type}: ${this.schemaEntry.name} / ${this.schemaEntry.entry_uid}] ${arguments[0]}`)
            nestedLVL++
            for(var x=1;x<arguments.length;x++)
                this.debug(arguments[x])
        }
    }

    const debugGroupCollapsed = function(label)
    {
        if(this.debugEntry)
        {
            console.groupCollapsed(`${nestedLVL ? '(self) ' : ''}[${this.schemaEntry.type}: ${this.schemaEntry.name} / ${this.schemaEntry.entry_uid}] ${arguments[0]}`)
            nestedLVL++
            for(var x=1;x<arguments.length;x++)
                this.debug(arguments[x])
        }
    }

    const debugGroupEnd = function()
    {
        if(this.debugEntry)
        {
            console.groupEnd()
            nestedLVL--
        }
    }

    return {
        /*constants*/

        /*methods*/
        debug,
        debugID,
        debugGroup,
        debugGroupCollapsed,
        debugGroupEnd

        /*events*/
        
        /*computed*/
    }
}