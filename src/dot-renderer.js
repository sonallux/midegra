/**
 * @param {import("./dependency-graph").DependencyGraph} dependencyGraph
 * @returns {string} dot string
 */
export function toDotString(dependencyGraph) {
    const nodeString = dependencyGraph.services.map(toDotNodeString).join('\n  ')
    const edgeString = dependencyGraph.services.map(toDotEdgeString).filter(e => e.length > 0).join('\n  ')
    
    return `digraph {\n  ${nodeString}\n  ${edgeString}\n}`
}

function toDotId(id) {
    return id.replace("-", "_")
}

function toDotNodeString(service) {
    switch(service.type) {
        case 'service': return `${toDotId(service.id)} [shape=record,label="${service.id}"]`
        case 'database': return `${toDotId(service.id)} [shape=cylinder,label="${service.id}"]`
        case 'msg-broker': return `${toDotId(service.id)} [shape=diamond,label="${service.id}"]`
        default: `${toDotId(service.id)} [shape=record,label=<${service.id}<br/>(${service.type})>]`
    }
}

function toDotEdgeString(service) {
    let edgeString = ''
    if (!Array.isArray(service.uses)) {
        return edgeString
    }
    for (const depenency of service.uses) {
        edgeString += `\n  ${toDotId(service.id)} -> ${toDotId(depenency)}`
    }
    return edgeString
}

