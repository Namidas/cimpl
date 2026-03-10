export default function isVueComponentDefinition (obj) {
    return typeof obj === 'object' && obj !== null && (typeof obj.setup === 'function' || typeof obj.render === 'function');
}