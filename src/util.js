/**
 * Computes the line and column number of the absolute pos in text
 * @param {string} text 
 * @param {number} pos
 * @returns {[number, number]} line and column of pos in text 
 */
export function getPositionInText(text, pos) {
    let line = 0;
    let column = 0;
    for (let curPos = 0; curPos < text.length - 1 && curPos < pos; curPos++) {
        if (text[curPos] === '\n') {
            line++
            column = 0
        } else {
            column++
        }
    }
    return [line, column]
}