import { addNames, updateEntity, insertAt, insertAtKey } from './'

it('addName adds name to names', () => {
  const names = { 1: 'index', 2: 'app' }
  const nextName = 'hello'
  const expectedId = 3
  const [nextNames, newId] = addNames(names, nextName)

  expect(nextNames).not.toEqual(names)
  expect(expectedId).toEqual(newId)
  expect(nextNames[newId]).toEqual(nextName)
})

it('updateEntity updates entity with value in entities', () => {
  const cats = { 1: {}, 2: {}, 3: {} }

  const betterCats = updateEntity(cats, 2, { legs: 4 })
  // not mutated
  expect(cats).not.toEqual(betterCats)
  // is updated
  expect(betterCats[2].legs).toEqual(4)
})


it('updateEntity updates entity via function in entities', () => {
  const cats = { 1: {}, 2: {}, 3: {} }

  const betterCats = updateEntity(cats, 2, cat => ({ ...cat, legs: 4 }))
  // not mutated
  expect(cats).not.toEqual(betterCats)
  // is updated
  expect(betterCats[2].legs).toEqual(4)
})


it('insertAt inserts element to array', () => {
  const cats = [1, 2, 3, 4, 5]
  const newCat = 'newCat'

  const moreCats = insertAt(cats, 2, newCat)

  // not mutated
  expect(cats).not.toEqual(moreCats)
  // is updated
  expect(moreCats[2]).toEqual(newCat)
  // is correct
  expect(moreCats).toEqual([1, 2, newCat, 3, 4, 5])
})


it('can combine updateEntity with insertAtKey', () => {
  const cats = { 1: {}, 2: { children: [1, 2, 3] } }
  const catGivingBirth = 2
  const insertKittenPosition = 3
  const newKitten = 4

  const givesBirth = cat => insertAtKey(cat, 'children', insertKittenPosition, newKitten)
  const catsAfterCatGivesBirth = updateEntity(cats, catGivingBirth, givesBirth)

  // not mutated
  expect(cats).not.toEqual(catsAfterCatGivesBirth)
  // is updated
  expect(catsAfterCatGivesBirth[catGivingBirth].children[insertKittenPosition]).toEqual(newKitten)
})
