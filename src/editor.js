import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/lint/lint'

import Ajv from 'ajv'
import jsonSourceMap from 'json-source-map'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'

import {getPositionInText} from './util'
import schema from './dependency-graph-schema.json'

function getFriendlyAjvError(error) {
    switch(error.keyword) {
        case 'enum': return `${error.message}: ${error.params.allowedValues.join(', ')}`
        default: return error.message
    }
}

function handleJsonParseError(error, text) {
    console.log("Parsing error: ", error.message)
    const syntaxErrorMatchResult = /^(.+ in JSON) at position (\d+)$/.exec(error.message)
    if (syntaxErrorMatchResult !== null) {
        const position = syntaxErrorMatchResult[2]
        const [line, column] = getPositionInText(text, position)
        return [{
            from: CodeMirror.Pos(line, column),
            to: CodeMirror.Pos(line, column + 1),
            message: syntaxErrorMatchResult[1]
        }]
    }
    if (error.message === 'Unexpected end of JSON input') {
        const [line, column] = getPositionInText(text, text.length)
        return [{
            from: CodeMirror.Pos(line, column),
            to: CodeMirror.Pos(line, column + 1),
            message: error.message
        }]
    }
    return []
}

export class Editor {
    constructor(textAreaElement, text) {
        this.ajv = new Ajv({
            allErrors: true,
            jsonPointers: true,
          })
        this.schemaValidate = this.ajv.compile(schema)
        CodeMirror.registerHelper("lint", "json", this._lint.bind(this))

        this.codeMirror = CodeMirror.fromTextArea(textAreaElement, {
            mode: 'application/json',
            lineNumbers: true,
            viewportMargin: Infinity,
            tabSize: 2,
            gutters: ['CodeMirror-lint-markers'],
            matchBrackets: true,
            autoCloseBrackets: true,
            lint: true,
        })
        this.codeMirror.setValue(text)
    }

    _lint(text) {
        if (!text) {
            return []
        }
        let sourceMap
        try {
            sourceMap = jsonSourceMap.parse(text)
        } catch(e) {
            return handleJsonParseError(e, text)
        }
        const valid = this.schemaValidate(sourceMap.data)
        if (valid) {
            return []
        }

        return this.schemaValidate.errors.map(error => {
            let errorPointer = sourceMap.pointers[error.dataPath]
            return {
                from: CodeMirror.Pos(errorPointer.value.line, errorPointer.value.column),
                to: CodeMirror.Pos(errorPointer.valueEnd.line, errorPointer.valueEnd.column),
                message: getFriendlyAjvError(error)
            }
        })
    }

    registerChangeListener(callback) {
        this.codeMirror.on('changes', instance => setTimeout(() => callback(instance.getValue()), 0))
    }

    setValue(text) {
        this.codeMirror.setValue(text)
    }

    getValue() {
        return this.codeMirror.getValue()
    }
}
