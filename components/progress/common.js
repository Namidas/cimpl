const commonProps = {
    //total time for the progress indicator in milliseconds
    time: {
        required: true,
        type: Number
    },

    //whether to automatically repeat the process every time "time" prop is reached,
    //or a set number of times, or false to don't repeat
    repeat: {
        required: false,
        type: [Boolean, Number],
        default: false
    },

    //tooltip text
    tooltip: {
        required: false,
        type: String
    },

    //speed at which to update/poll the progress of the clock, value or array
    tick: {
        required: false,
        type: Number,
        default: 100
    },

    //decimals to show on current value (passed down to toFixed)
    decimals: {
        required: false,
        type: Number,
        default: 1
    },

    //wether to use or not a set of timeout and an interval per clock, one for the clock trigger
    //itself (the timeout), and one to update visuals (the interval), when set to false
    //only the visuals updater timeout is used and you might get a slight difference
    //(upwards) between the actual expected "time" prop and the actual time, for instance:
    //if you had a prop.time of 10, a prop.tick of 3, and prop.precise set to false the actual
    //trigger would happen at 12ms, that's the tick running 4 times before the sum is >= prop.time
    //also, when the component has no visual representation whatsoever, this option is ignored
    precise: {
        required: false,
        type: Boolean,
        default: false
    },

    //auto start the clock? Boolean or array
    autoStart: {
        required: false,
        type: [Boolean, Array],
        default: true,
    },

    //inherited from QLinearProgress, but can be false to use props.tick
    animationSpeed: {
        required: false,
        type: [Boolean, Number],
        default: false
    }
}

const commonEmits = [
    'clock:start',
    'clock:tick',
    'clock:trigger',
    'clock:stop',
    'clock:pause',
    'clock:play',
    'clock:toggle'
]

export {
    commonProps,
    commonEmits
}