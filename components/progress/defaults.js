import { h } from 'vue'
import defaults from './../../utils/defaults'

defaults.preset('cimpl-progress', {
    labels: {
        milliseconds: 'milliseconds',
        millisecond: 'millisecond',
        ms: 'ms',
        m: 'm',
        seconds: 'seconds',
        second: 'second',
        secs: 'secs',
        sec: 'sec',
        minutes: 'minutes',
        minute: 'minute',
        mins: 'mins',
        min: 'min',
        hours: 'hours',
        hour: 'hour',
        hs: 'hs',
        h: 'h'
    },
    strings: {
        default: (tpl, from, to, current, type, decimals, extra) => { return _.template(tpl)({ from, to, current, ...extra }) },
        default_with_unit: (from, to, current, type, decimals, parsed, unit) => {
            const useHTML = true
            const parsedUnit = defaults.get(`cimpl-progress.labels.${unit}${parsed === 1 ? '' : 's'}`)
            const parsedFixed = parsed.toFixed(decimals)
            if (!useHTML) return defaults.get('cimpl-progress.strings.default')('<%- parsed%> <%- unit%>', from, to, current, type, decimals, { parsed: parsedFixed, unit: parsedUnit })
            return [h('span', { class: 'value' }, parsedFixed), h('span', { class: 'unit' }, parsedUnit)]
        },
        default_conversor: (from, to, current, unit, type, decimals) => {
            var rate = 1
            switch (unit) {
                //case 'millisecond':
                //case 'ms':
                //rate = 1
                //break

                case 'second':
                case 'sec':
                    rate = 1000
                    break
                case 'minute':
                case 'min':
                    rate = 1000 * 60
                    break
                case 'hour':
                case 'h':
                    rate = 1000 * 60 * 60
                    break
            }
            if (type === undefined) type = 'add'
            var parsed = current / rate
            if (type !== 'add') parsed += -1 * to / rate
            if (type === 'left') parsed = Math.abs(parsed)
            return defaults.get('cimpl-progress.strings.default_with_unit')(from, to, current, type, decimals, parsed, unit)
        },
        millisecond: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'millisecond', type, decimals),
        m: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'm', type, decimals),
        second: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'second', type, decimals),
        sec: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'sec', type, decimals),
        minute: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'minute', type, decimals),
        min: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'min', type, decimals),
        hour: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'hour', type, decimals),
        h: (from, to, current, type, decimals) => defaults.get('cimpl-progress.strings.default_conversor')(from, to, current, 'h', type, decimals),
    }
})