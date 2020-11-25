import {amqpRoutingKeyMatch} from './amqp-util'

/**
 * @typedef Service
 * @type {object}
 * @property {string} id
 * @property {'service'|'database'|'msg-broker'} type
 * @property {string[]} uses
 * @property {string[]} consumes Events this service consumes
 * @property {string[]} produces Events this service consumes
 */

export class DependencyGraph {

    /**
     * @param {Service[]} services 
     */
    constructor(services) {
        this.services = services
    }

    /**
     * @param {string} serviceId 
     * @returns {Service | undefined}
     */
    getService(serviceId) {
        return this.services.find(s => s.id === serviceId)
    }

    /**
     * @param {string} serviceId 
     * @returns {string[] | undefined}
     */
    getDependencies(serviceId) {
        const service = this.getService(serviceId)
        if (service === undefined) {
            return undefined
        }
        return service.uses ?? []
    }

    /**
     * @param {string} serviceId 
     * @returns {string[] | undefined}
     */
    getAllProducedEvents() {
        return this.services.flatMap(service => service.produces ?? [])
    }

    /**
     * @param {string} event 
     * @returns {Service[]}
     */
    getConsumer(event) {
        return this.services.filter(service => {
            if (service.consumes === undefined) {
                return false
            }
            return service.consumes.some(eventPattern => amqpRoutingKeyMatch(eventPattern, event))
        })
    }

    /**
     * @param {string} event 
     * @returns {Service[]}
     */
    getProducer(eventPattern) {
        return this.services.filter(service => {
            if (service.produces === undefined) {
                return false
            }
            return service.produces.some(event => amqpRoutingKeyMatch(eventPattern, event))
        })
    }
}
