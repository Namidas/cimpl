/* eslint-disable */

import { useDraggable } from '/node_modules/vue-draggable-plus'


import { ref, computed } from 'vue'
import _ from 'lodash'

export default function (draggableWrap, draggableEntries, $emit) {

    //const draggableEntries = ref([])

    const onDraggableStart = function () {
        $emit('draggable:start')
    }

    const onDraggableUpdate = function () {
        //console.log("UPDATE",draggableHandler.toArray(),draggableEntries)
        $emit('draggable:update', draggableEntries)
    }

    var draggableHandler = useDraggable(draggableWrap, draggableEntries, {
        animation: 150,
        handle: '.draggable-handle',
        onStart: onDraggableStart,
        onUpdate: onDraggableUpdate,
    })

    console.log("draggable handler", draggableHandler)

    return {
        /*constants*/
        draggableHandler,
        draggableWrap,

        /*methods*/

        /*events*/
        onDraggableStart,
        onDraggableUpdate

        /*computed*/
    }
}