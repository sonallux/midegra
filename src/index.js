import * as d3 from 'd3'

import {DependencyGraph} from './dependency-graph'
import {GraphVizRenderer} from './graphviz-renderer'
import {Editor} from './editor'
import {toDotString} from './dot-renderer'

import './index.css';

/**
 * @type {import('./dependency-graph').Service[]}
 */
export const SERVICES = [
    {
        id: "service1",
        type: "service",
        uses: ['db', 'broker'],
        produces: ['event.create', 'event.update']
    },
    {
        id: "service2",
        type: "service",
        uses: ['broker'],
        consumes: ['event.*']
    },
    {
        id: "db",
        type: "database"
    },
    {
        id: "frontend",
        type: "service",
        uses: ["service1", "service2"]
    },
    {
        id: "broker",
        type: "msg-broker"
    }
]


let isMouseDown = false
d3.select('#pane-resizer').on('mousedown', () => isMouseDown = true)
d3.select(window).on('mouseup', () => isMouseDown = false)
window.addEventListener('mousemove', onMouseMove)

function onMouseMove(event) {
    if (isMouseDown) {
        event.preventDefault()
        d3.select('.pane-1').style('flex-basis', event.clientX + "px")
    }
}

function updateGraph(text) {
    try {
        const services = JSON.parse(text)
        const newDotGraph = toDotString(new DependencyGraph(services))
        graphVizRenderer.updateGraph(newDotGraph)
    } catch {}
}

const editor = new Editor(d3.select('#editor').node(), JSON.stringify(SERVICES, null, 2));
editor.registerChangeListener(updateGraph)

const dotGraph = toDotString(new DependencyGraph(SERVICES))
const graphVizRenderer = new GraphVizRenderer('.graph-canvas', dotGraph)

const loadFileInput = d3.select('#loadFileInput').node()
loadFileInput.addEventListener('change', event => {
    const file = event.target.files[0]
    console.log(`Start loading file name: ${file.name} type: ${file.type} size: ${file.size} bytes`)
    const fileReader = new FileReader()
    fileReader.onload = function (e) {
        if (e && e.target) {
            const contents = e.target.result
            console.log(`Loaded file name: ${file.name}`)
            editor.setValue(contents)
        }
    };
    fileReader.readAsText(file)
    
})
d3.select('#loadFileButton').on('click', () => loadFileInput.click())

d3.select('#saveFileButton').node().addEventListener('click', event => {
    const content = editor.getValue()
    var textFileAsBlob = new Blob([content], { type: "application/json" })
    var URL = window.URL || window.webkitURL
    if (URL !== null) {
        event.currentTarget.href = window.URL.createObjectURL(textFileAsBlob)
    }
})
