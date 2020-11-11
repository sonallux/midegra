/**
 * @param {string} pattern
 * @param {string} key
 * @returns {boolean} true if key matches pattern
 */
export function amqpRoutingKeyMatch(pattern, key) {
    if (pattern === key) {
        return true
    }

    let regexString = '^'
    pattern.split('.').forEach((part, i) => {
        if (part === '*') {
            if (i !== 0) {
                regexString += '\\.'
            }
            regexString += '([^.]+)'
        } else if (part === '#') {
            if (i !== 0) {
                regexString += '([^.]+)*'
            }
            regexString += '(\\.[^.]+)*'
        } else {
            if (i !== 0) {
                regexString += '\\.'
            }
            regexString += part
        }

    })
    regexString += '$'

    return key.search(regexString) !== -1
}
