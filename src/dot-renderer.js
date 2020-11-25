/**
 * @param {import("./dependency-graph").DependencyGraph} dependencyGraph
 * @returns {string} dot string
 */
export function toDotString(dependencyGraph) {
    const nodeStrings = dependencyGraph.services.map(getServiceNode)
    const edgeStrings = dependencyGraph.services.flatMap(getUsesEdges)
    
    const eventStrings = dependencyGraph.getAllProducedEvents().map(getEventNode)
    const producingEdges = dependencyGraph.services.flatMap(getProducingEdges)
    const consumingEdges = dependencyGraph.getAllProducedEvents().flatMap(event => getConsumingEdges(dependencyGraph, event))

    return `digraph {\n  node[shape=record]\n  rankdir=LR\  ${[...nodeStrings, ...edgeStrings, ...eventStrings, ...producingEdges, ...consumingEdges].join('\n  ')}\n}`
}

function toDotId(id) {
    return id.replaceAll('-', '_').replaceAll('.', '__')
}

/**
 * @param {import("./dependency-graph").Service} service
 */
function getServiceNode(service) {
    switch(service.type) {
        case 'service': return `${toDotId(service.id)} [shape=record,label="${service.id}"]`
        case 'database': return `${toDotId(service.id)} [shape=cylinder,label="${service.id}"]`
        case 'msg-broker': return `${toDotId(service.id)} [shape=diamond,label="${service.id}"]`
        default: `${toDotId(service.id)} [shape=record,label=<${service.id}<br/>(${service.type})>]`
    }
}

/**
 * @param {import("./dependency-graph").Service} service
 */
function getUsesEdges(service) {
    if (!Array.isArray(service.uses)) {
        return []
    }
    return service.uses.map(dependency => `${toDotId(service.id)} -> ${toDotId(dependency)}`)
}

/**
 * @param {string} event 
 */
function getEventNode(event) {
    return `${toDotId(event)} [shape=ellipse,label="${event}"]`
}

/**
 * @param {import("./dependency-graph").Service} service
 */
function getProducingEdges(service) {
    if (!Array.isArray(service.produces)) {
        return []
    }
    return service.produces.map(event => `${toDotId(service.id)} -> ${toDotId(event)} [style="dashed"]`)
}

/**
 * @param {import("./dependency-graph").DependencyGraph} dependencyGraph
 * @param {string} event
 */
function getConsumingEdges(dependencyGraph, event) {
    return dependencyGraph.getConsumer(event).map(consumer => `${toDotId(event)} -> ${toDotId(consumer.id)} [style="dashed"]`)
}
