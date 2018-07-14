import {StructureBuilder as S} from '../src'
import {Layout} from '../src/Layout'

const noop = () => {
  /* intentional noop */
}

test('builds document lists with only ID and filter', () => {
  expect(
    S.documentList({id: 'foo', options: {filter: '_type == "book"'}}).serialize()
  ).toMatchSnapshot()
})

test('throws if no id is set', () => {
  expect(() => S.documentList().serialize()).toThrowErrorMatchingSnapshot()
})

test('throws if no filter is set', () => {
  expect(() => S.documentList({id: 'foo'}).serialize()).toThrowErrorMatchingSnapshot()
})

test('builds document lists through setters', () => {
  expect(
    S.documentList()
      .id('books')
      .title('Books')
      .filter('_type == $type')
      .params({type: 'book'})
      .defaultOrdering([{field: 'title', direction: 'asc'}])
      .serialize()
  ).toMatchSnapshot()
})

test('builds document lists through setters (alt order)', () => {
  expect(
    S.documentList()
      .defaultOrdering([{field: 'title', direction: 'desc'}])
      .id('books')
      .title('Books')
      .filter('_type == $type')
      .params({type: 'book'})
      .serialize()
  ).toMatchSnapshot()
})

test('builds document lists through setters (alt order #2)', () => {
  expect(
    S.documentList()
      .params({type: 'book'})
      .defaultOrdering([{field: 'title', direction: 'desc'}])
      .id('books')
      .title('Books')
      .filter('_type == $type')
      .serialize()
  ).toMatchSnapshot()
})

test('default child resolver resolves to editor', () => {
  const list = S.documentList()
    .id('books')
    .title('Books')
    .filter('_type == $type')
    .params({type: 'book'})
    .serialize()

  expect(list.resolveChildForItem('asoiaf-wow', list, {index: 1})).toEqual({
    id: 'editor',
    type: 'document',
    options: {
      id: 'asoiaf-wow',
      type: 'book'
    }
  })
})
