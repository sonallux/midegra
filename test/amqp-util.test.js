import {amqpRoutingKeyMatch} from '../src/amqp-util'

describe('amqpRoutingKeyMatch', () => {
    it('handle direct equality', () => {
        expect(amqpRoutingKeyMatch('key', 'key')).toBeTruthy()
        expect(amqpRoutingKeyMatch('this.key', 'this.key')).toBeTruthy()
    })

    it('handle single word wildcard', () => {
        expect(amqpRoutingKeyMatch('this.*', 'this.key')).toBeTruthy()
        expect(amqpRoutingKeyMatch('this.*', 'this')).toBeFalsy()
        expect(amqpRoutingKeyMatch('this.*', 'other.key')).toBeFalsy()

        expect(amqpRoutingKeyMatch('this.*.key', 'this.new.key')).toBeTruthy();
        expect(amqpRoutingKeyMatch('this.*.key', 'this.key')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.*.key', 'this.key.invalid')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.*.key', 'other.invalid.key')).toBeFalsy();

        expect(amqpRoutingKeyMatch('this.*.*.key', 'this.new.other.key')).toBeTruthy();
        expect(amqpRoutingKeyMatch('this.*.*.key', 'this.key')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.*.*.key', 'this.invalid.key')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.*.*.key', 'this.is.key.invalid')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.*.*.key', 'other.is.invalid.key')).toBeFalsy();
    })

    it('handle zero or multiple word wildcard', () => {
        expect(amqpRoutingKeyMatch('this.#', 'this')).toBeTruthy()
        expect(amqpRoutingKeyMatch('this.#', 'this.key')).toBeTruthy()
        expect(amqpRoutingKeyMatch('this.#', 'this.new.key')).toBeTruthy()
        expect(amqpRoutingKeyMatch('this.#', 'other')).toBeFalsy()
        expect(amqpRoutingKeyMatch('this.#', 'other.this')).toBeFalsy()
        expect(amqpRoutingKeyMatch('this.#', 'other.new.key')).toBeFalsy()

        expect(amqpRoutingKeyMatch('this.#.key', 'this.key')).toBeTruthy();
        expect(amqpRoutingKeyMatch('this.#.key', 'this.new.key')).toBeTruthy();
        expect(amqpRoutingKeyMatch('this.#.key', 'this.new.other.key')).toBeTruthy();
        expect(amqpRoutingKeyMatch('this.#.key', 'this.invalid')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.#.key', 'this.key.invalid')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.#.key', 'other.key')).toBeFalsy();
        expect(amqpRoutingKeyMatch('this.#.key', 'other.invalid.key')).toBeFalsy();

        //expect(amqpRoutingKeyMatch('#.key', 'key')).toBeTruthy();
        //expect(amqpRoutingKeyMatch('#.key', 'new.key')).toBeTruthy();
        //expect(amqpRoutingKeyMatch('#.key', 'new.other.key')).toBeTruthy();
        //expect(amqpRoutingKeyMatch('#.key', 'key.invalid')).toBeFalsy();
        //expect(amqpRoutingKeyMatch('#.key', 'multiple.key.invalid')).toBeFalsy();
    })
})
