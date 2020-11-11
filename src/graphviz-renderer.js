import * as d3 from 'd3'
import 'd3-graphviz'
import 'd3-zoom'

export class GraphVizRenderer {
    constructor(selector, dotString) {
        this.selector = selector
        this.graphviz = d3.select(this.selector).graphviz({useWorker: false})
            .zoomScaleExtent([0.5, 2])
            .renderDot(dotString)
        d3.select(this.selector).on("click", this._resetZoom.bind(this))
    }

    updateGraph(dotString) {
        this.graphviz.renderDot(dotString)
    }

    _resetZoom() {
        this.graphviz
            .resetZoom(d3.transition().duration(1000))
    }
}
