import {getPositionInText} from '../src/util'

describe('getPositionInText', () => {
    it('out of bounds cases', () => {
        expect(getPositionInText('', 0)).toEqual([0, 0])
        expect(getPositionInText('abc', 4)).toEqual([0, 2])
        expect(getPositionInText('abc', 6)).toEqual([0, 2])
        expect(getPositionInText('a\nb\nc\n', 6)).toEqual([2, 1])
    })
    
    it('single line', () => {
        expect(getPositionInText('a', 0)).toEqual([0, 0])
        expect(getPositionInText('abc', 2)).toEqual([0, 2])
    })

    it('multiple lines', () => {
        expect(getPositionInText('a\nb\nc', 0)).toEqual([0, 0])
        expect(getPositionInText('a\nb\nc', 1)).toEqual([0, 1])
        expect(getPositionInText('a\nb\nc', 2)).toEqual([1, 0])
        expect(getPositionInText('a\nb\nc', 3)).toEqual([1, 1])
        expect(getPositionInText('a\nb\nc', 4)).toEqual([2, 0])

        expect(getPositionInText('abc\n\nabc', 0)).toEqual([0, 0])
        expect(getPositionInText('abc\n\nabc', 1)).toEqual([0, 1])
        expect(getPositionInText('abc\n\nabc', 2)).toEqual([0, 2])
        expect(getPositionInText('abc\n\nabc', 3)).toEqual([0, 3])
        expect(getPositionInText('abc\n\nabc', 4)).toEqual([1, 0])
        expect(getPositionInText('abc\n\nabc', 5)).toEqual([2, 0])
        expect(getPositionInText('abc\n\nabc', 6)).toEqual([2, 1])
        expect(getPositionInText('abc\n\nabc', 7)).toEqual([2, 2])
    })
})