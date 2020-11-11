import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/lint/lint'

import Ajv from 'ajv'
import jsonSourceMap from 'json-source-map'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'

import schema from './dependency-graph-schema.json'

function getFriendlyAjvError(error) {
    switch(error.keyword) {
        case 'enum': return `${error.message}: ${error.params.allowedValues.join(', ')}`
        default: return error.message
    }
}

export class Editor {
    constructor(textAreaElement, text) {
        this.ajv = new Ajv({
            allErrors: true,
            jsonPointers: true,
          })
        this.schemaValidate = this.ajv.compile(schema)
        CodeMirror.registerHelper("lint", "json", text => {
            if (!text) {
                return []
            }
            let sourceMap
            try {
                sourceMap = jsonSourceMap.parse(text)
            } catch(e) {
                console.log("Parsing error: ", e.message)
                return []
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
          })

        this.codeMirror = CodeMirror.fromTextArea(textAreaElement, {
            mode: 'application/json',
            lineNumbers: true,
            viewportMargin: Infinity,
            tabSize: 2,
            matchBrackets: true,
            autoCloseBrackets: true,
            lint: true,
        })
        this.codeMirror.setValue(text)
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
